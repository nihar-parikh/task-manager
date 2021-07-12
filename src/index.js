const express = require("express");
require("./db/mongoose");
// const users = require("./models/users");
// const tasks = require("./models/tasks");
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT;

// const loggerMiddleware = (req, res, next) => {
//   console.log("new request to: " + req.method + " " + req.path);
//   next();
// };

// app.use(loggerMiddleware);

const multer = require("multer");

const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    const fileExt = [".doc", ".docx"];

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
    callback(new Error("Please upload doc or docx file"));
  },
});

app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// const myFunction = async () => {
//   const password = "krishna512";
//   const hashedPassword = await bcrypt.hash(password, 8);
//   console.log(password);
//   console.log(hashedPassword);

//   const isMatch = await bcrypt.compare(password, hashedPassword);
//   console.log(isMatch);
// };

// myFunction();

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// const token = jwt.sign({ _id: "abc123" }, "shrikrishna", {
//   expiresIn: "7 days",
// });
// console.log(token);

// const data = jwt.verify(token, "shrikrishna");
// console.log(data);

// const tasks = require("./models/tasks");
// const users = require("./models/users");

// const main = async () => {
//   const task = await tasks.findById("60df254114688c424caae61f");
//   await task.populate("user").execPopulate();
//   console.log(task);
//   console.log(task.user);
// };

// main();

// const main2 = async () => {
//   const user = await users.findById("60df24fa14688c424caae61d");
//   await user.populate("userTasks").execPopulate();
//   console.log(user);
//   console.log(user.userTasks);
// };

// main2();

// const object = {};

// const cars = [];

// object[cars[1]] = "14";
// console.log(object[cars[1]]);
