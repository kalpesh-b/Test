// jshint esversion:6
var multer = require('multer');
var _ = require('lodash');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
var fs = require('fs');
var uploadDest = process.env.TT_UPLOAD_DEST || 'Image_Uploads';

if (!fs.existsSync(uploadDest)) {
  fs.mkdirSync(uploadDest);
}

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDest);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.fieldname + '-' + file.originalname);
  }
});

var upload = multer({
  storage: storage
});

function compressImages(req, res, next) {
  var destination, files = [];
  _.forEach(req.files, function(fileArray) {
    fileArray.forEach(file => files.push(file.path));
  });
  storage.getDestination(null, null, (err, dest) => destination = dest);

  imagemin(files, destination + '/min', {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: '90'
      })
    ]
  }).then(files => {
    // console.log('files', files);
    //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
    next();
    // res.send(files.length + " images compressed sussfully");
  });
}
exports.multer = upload;
exports.compressImages = compressImages;
