const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const RefreshToken = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const LoginLog = require('../models/loginLog.model');
const StudentRecord = require('../models/studentRecord.model');
const { sendOTPEmail } = require('../services/mail.service');

// ==========================
// REGISTER
// ==========================

exports.register = async (req, res) => {
  try {
    const { student_id, faculty, name, department, year, email, password } =
      req.body;

    if (
      !student_id ||
      !faculty ||
      !name ||
      !department ||
      !year ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // 1. Verify student against university records
    StudentRecord.findMatchingStudent(
      {
        student_id,
        faculty,
        name,
        department,
        year,
      },
      async (err, studentRecords) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        if (studentRecords.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Student information does not match university records',
          });
        }

        // 2. Duplicate email check
        User.findByEmail(email, async (err, emailResult) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          if (emailResult.length > 0) {
            return res.status(400).json({
              success: false,
              message: 'Email already exists',
            });
          }

          // 3. Duplicate student ID check
          User.findByStudentId(student_id, async (err, studentResult) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            if (studentResult.length > 0) {
              return res.status(400).json({
                success: false,
                message: 'This student already has an account',
              });
            }

            // 4. Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // 5. Create pending user
            User.create(
              {
                student_id,
                name,
                email,
                password: hashedPassword,
                role: 'student',
              },
              (err, result) => {
                if (err) {
                  return res.status(500).json({
                    success: false,
                    message: err.message,
                  });
                }

                const userId = result.insertId;

                // 6. Generate 6-digit OTP
                const otp = crypto.randomInt(100000, 1000000).toString();

                // 2 minutes
                const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

                // 7. Save OTP
                OTP.create(
                  {
                    user_id: userId,
                    otp_code: otp,
                    expires_at: expiresAt,
                  },
                  async (err) => {
                    if (err) {
                      return res.status(500).json({
                        success: false,
                        message: err.message,
                      });
                    }

                    try {
                      await sendOTPEmail(email, otp);

                      return res.status(201).json({
                        success: true,
                        message: 'Student verified. OTP sent to email.',
                        user_id: userId,
                      });
                    } catch (mailError) {
                      console.error('OTP email error:', mailError);

                      return res.status(500).json({
                        success: false,
                        message:
                          'Registration created, but OTP email could not be sent',
                      });
                    }
                  }
                );
              }
            );
          });
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// VERIFY OTP
// ==========================

exports.verifyOTP = (req, res) => {
  const { user_id, otp_code } = req.body;

  OTP.findValid(
    user_id,
    otp_code,

    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP',
        });
      }

      const db = require('../config/db');

      OTP.markVerified(
        result[0].id,

        () => {
          const sql = `
                    UPDATE users
                    SET
                    status='active',
                    email_verified=1
                    WHERE id=?
                    `;

          db.query(
            sql,
            [user_id],

            () => {
              res.json({
                success: true,

                message: 'OTP verified. Account activated.',
              });
            }
          );
        }
      );
    }
  );
};

// ==========================
// RESEND OTP
// ==========================

exports.resendOTP = (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message: 'User ID required',
    });
  }

  // Check user exists
  User.findById(user_id, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = result[0];

    // Already activated account
    if (user.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Account already activated',
      });
    }

    // Check latest OTP for cooldown
    OTP.findLatest(user_id, (err, otpResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (otpResult.length > 0) {
        const latestOTP = otpResult[0];

        const createdAt = new Date(latestOTP.created_at);
        const now = new Date();

        const secondsPassed = Math.floor(
          (now.getTime() - createdAt.getTime()) / 1000
        );

        if (secondsPassed < 60) {
          const remainingSeconds = 60 - secondsPassed;

          return res.status(429).json({
            success: false,
            message: `Please wait ${remainingSeconds} seconds before requesting another OTP`,
            retry_after: remainingSeconds,
          });
        }
      }

      // Invalidate previous OTPs
      OTP.invalidateOld(user_id, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        // Generate new 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Expire after 2 minutes
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        OTP.create(
          {
            user_id,
            otp_code: otp,
            expires_at: expiresAt,
          },
          (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            return res.json({
              success: true,
              message: 'New OTP sent successfully',

              // Development testing only
              otp: otp,
            });
          }
        );
      });
    });
  });
};

// ==========================
// LOGIN
// ==========================

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password required',
    });
  }

  User.findByEmail(email, async (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    // Email မရှိ
    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result[0];

    // Account inactive
    if (user.status !== 'active') {
      LoginLog.create(
        {
          user_id: user.id,
          ip_address: req.ip,
          user_agent: req.headers['user-agent'],
          login_status: 'failed',
        },
        (logErr) => {
          if (logErr) {
            console.error('Login log error:', logErr);
          }
        }
      );

      return res.status(403).json({
        success: false,
        message: 'Account not activated',
      });
    }

    // Password check
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      LoginLog.create(
        {
          user_id: user.id,
          ip_address: req.ip,
          user_agent: req.headers['user-agent'],
          login_status: 'failed',
        },
        (logErr) => {
          if (logErr) {
            console.error('Login log error:', logErr);
          }
        }
      );

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Access Token
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    // Refresh Token
    const refreshToken = crypto.randomBytes(64).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    RefreshToken.create(
      {
        user_id: user.id,
        token: refreshToken,
        expires_at: expiresAt,
      },
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Refresh token error',
          });
        }

        // Successful login log
        LoginLog.create(
          {
            user_id: user.id,
            ip_address: req.ip,
            user_agent: req.headers['user-agent'],
            login_status: 'success',
          },
          (logErr) => {
            if (logErr) {
              console.error('Login log error:', logErr);
            }

            return res.json({
              success: true,
              message: 'Login successful',

              accessToken,
              refreshToken,

              user: {
                id: user.id,
                name: user.name,
                role: user.role,
              },
            });
          }
        );
      }
    );
  });
};

// ==========================
// RESET PASSWORD
// ==========================

exports.resetPassword = (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: 'Token and password required',
    });
  }

  PasswordResetToken.findValid(
    token,

    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token',
        });
      }

      const resetData = result[0];

      const hashedPassword = await bcrypt.hash(password, 10);

      const db = require('../config/db');

      const sql = `
                UPDATE users
                SET password=?
                WHERE id=?
            `;

      db.query(
        sql,
        [hashedPassword, resetData.user_id],

        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          PasswordResetToken.markUsed(
            resetData.id,

            (err) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err.message,
                });
              }

              res.json({
                success: true,
                message: 'Password reset successful',
              });
            }
          );
        }
      );
    }
  );
};

// ==========================
// REFRESH TOKEN
// ==========================

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token required',
    });
  }

  RefreshToken.find(
    refreshToken,

    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
      }

      const tokenData = result[0];

      const newAccessToken = jwt.sign(
        {
          id: tokenData.user_id,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: '1h',
        }
      );

      res.json({
        success: true,

        accessToken: newAccessToken,
      });
    }
  );
};
// ==========================
// LOGOUT
// ==========================

exports.logout = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,

      message: 'Refresh token required',
    });
  }

  RefreshToken.delete(
    refreshToken,

    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,

          message: err.message,
        });
      }

      res.json({
        success: true,

        message: 'Logout successful',
      });
    }
  );
};

// ==========================
// FORGOT PASSWORD
// ==========================

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email required',
    });
  }

  User.findByEmail(
    email,

    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Email not found',
        });
      }

      const user = result[0];

      const token = crypto.randomBytes(32).toString('hex');

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      PasswordResetToken.create(
        {
          user_id: user.id,
          token,
          expires_at: expiresAt,
        },

        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          res.json({
            success: true,

            message: 'Password reset token created',

            token,
          });
        }
      );
    }
  );
};
