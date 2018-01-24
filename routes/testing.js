

var upload = require('../config/multerUploads');
module.exports = function(api) {


  api.get('/test', function(req, res, next) {
    // res.json({
    //   json: 'yes'
    // });
    var ttdata = {
      testdata: 'hello world'
    };
    response({
      view: 'test',
      data: {
        ttdata: ttdata
      }
    }, req, res);
  });

  api.post('/test', upload.multer.single(), function(req, res, next) {

    console.log('req.body data:', req.body);
    req.query.j = 1;
    response({
      view: 'blank',
      data: {
        ttdata: req.body
      }
    }, req, res);
    // res.json(req.body);
  },
  function(req, res, next) {

  });

  function response(options, req, res, next) {
    if (req.query.j) {
      return res.json(options.data);
    }
    return res.render(options.view, options.data);
  }

  api.get('/multer', function(req, res) {
    res.render('multer');
  });
  var cpUpload = upload.multer.fields([{
    name: 'photos',
    maxCount: 8
  }]);
  api.post('/multer', cpUpload, upload.compressImages, function(req, res, next) {
    console.log('inside multerb : req.body :', req.body);
    // if (!err) {
    res.json(req.body);

  });

  api.get('/session', function(req, res, next) {
    res.json({
      'req-session': req.session
    });
  });
};
