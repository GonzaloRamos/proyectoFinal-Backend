const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/assets/images/users`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + uuidv4();
    const extension = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  },
});

const upload = multer({storage: storage});
module.exports = upload;
