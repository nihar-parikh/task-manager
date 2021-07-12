const multer = require("multer");

// const upload = multer({
//   dest: "avatars",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     const fileExt = [".jpg", ".jpeg", ".png"];
//     const isTypeValid = fileExt.some((i) => {
//       file.originalname.endsWith(i);
//     });
//     if (isTypeValid) {
//       return cb(null, true);
//       // } else if (this.limits.fieldSize > 1000000) {
//       //   return callback(new Error("Invalid size!!"));
//     }

//     cb(new Error("Invalid type!!"));
//   },
// });

const upload = multer({
  //dest: "avatars",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    const fileExt = [".png", ".jpg", ".jpeg"];

    const isTypeValid = fileExt.some((i) => file.originalname.endsWith(i));

    if (isTypeValid) {
      return callback(null, true);
    }

    // if (this.limits.fileSize > 1000000) {
    //   return callback(new Error("Please upload file less than 1MB size"));
    // }

    // fileExt.forEach((i) => {
    //   if (file.originalname.endsWith(i)) {
    //     return callback(undefined, true);

    //   }
    // });
    callback(new Error("Please upload images"));
  },
});

module.exports = upload;
