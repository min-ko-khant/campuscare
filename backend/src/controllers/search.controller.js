const Search = require('../models/search.model');

exports.search = (req, res) => {
  const keyword = req.query.q;

  if (!keyword) {
    return res.status(400).json({
      success: false,

      message: 'Keyword required',
    });
  }

  Search.search(
    keyword,

    (err, data) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,

          message: 'Search error',
        });
      }

      res.json({
        success: true,

        count: data.length,

        data: data,
      });
    }
  );
};
