const multer = require("multer");
const {v4: uuidv4} = require("uuid");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, `public/assets/images/users`);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + uuidv4();
//     const extension = file.mimetype.split("/")[1];
//     cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
//   },
// });

// const upload = multer({storage: storage});

class MulterUpload {
  #publicPath = `public/assets/images`;
  #multerClientUpload;

  constructor(modelType) {
    this.init(modelType);
  }

  init(modelType) {
    const imagePath = `${this.#publicPath}/${modelType}`;
    this.#multerClientUpload = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, imagePath);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + uuidv4();
        const extension = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
      },
    });
  }
  upload() {
    return multer({storage: this.#multerClientUpload});
  }
}

module.exports = MulterUpload;
