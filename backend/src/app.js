const express = require('express');
const cors = require('cors');

const app = express();

const newsRoutes = require('./routes/news.routes');
const announcementRoutes = require('./routes/announcement.routes');
const eventRoutes = require('./routes/event.routes');
const activityRoutes = require('./routes/activity.routes');
const examNoticeRoutes = require('./routes/examNotice.routes');
const emergencyRoutes = require('./routes/emergency.routes');
const activityMediaRoutes = require('./routes/activityMedia.routes');
const contactRoutes = require('./routes/contact.routes');
const searchRoutes = require('./routes/search.routes');
const authRoutes = require('./routes/auth.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CampusCare API Running...',
  });
});

app.use('/api/news', newsRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/exam-notices', examNoticeRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/activities', activityMediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
