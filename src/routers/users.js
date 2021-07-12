const express = require("express");
const users = require("../models/users");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const { sendWelcomeEmail, sendDeleteEmail } = require("../emails/account");

const upload = require("../middleware/avatar");

router.post("/users", async (req, res) => {
  try {
    const user = new users(req.body);
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }

  // user1
  //   .save()
  //   .then((user1) => {
  //     res.status(201).send(user1);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await users.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//error handling using call-back function:
// router.post(
//   "/users/me/avatar",
//   upload.single("avatar"),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

//error handling using try catch block:
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // console.log(req.file);
      // console.log(req.file.buffer);
      // console.log(req.user.avatar);

      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      console.log(buffer);
      req.user.avatar = buffer;
      await req.user.save();
      res.send();
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

// error handling using call-back:
// router.post(
//   "/users/me/avatar",
//   upload.single("avatar"),
//   (error, req, res, next) => {
//     if (error) {
//       res.status(400).send({ error: error.message });
//     } else {
//       res.send();
//     }
//   }
// );

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((i) => {
      return i.token !== req.token;
    });

    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.status(201).send(req.user);
});

// router.get("/users/:id/avatar", async (req, res) => {
//   try {
//     const user = await users.findById(req.params.id);

//     if (!user || !user.avatar) {
//       throw new Error();
//     }

//     res.set("Content-Type", "image/png");
//     res.send(user.avatar);
//   } catch (e) {
//     res.status(404).send();
//   }
// });

router.get("/users/me/avatar", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(req.user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get("/users", async (req, res) => {
  try {
    const findUsers = await users.find({});
    res.status(201).send(findUsers);
  } catch (e) {
    res.status(500).send(e);
  }

  // users
  //   .find({})
  //   .then((users) => {
  //     res.status(200).send(users);
  //   })
  //   .catch((error) => {
  //     res.status(500).send(error);
  //   });
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await users.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(201).send(user);
  } catch (e) {
    res.status(500).send(e);
  }

  // users
  //   .findById(_id)
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).send(user);
  //     }
  //     res.status(200).send(user);
  //   })
  //   .catch((error) => {
  //     res.status(500).send(error);
  //   });
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "age", "email", "password"];
  const isValidOperation = updates.every((update) => {
    allowUpdates.includes(update);
  });
  if (isValidOperation) {
    return res.status(400).send({ error: "invalid Updates!!" });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.status(201).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// router.patch("/users/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowUpdates = ["name", "age", "email", "password"];
//   const isValidOperation = updates.every((update) => {
//     allowUpdates.includes(update);
//   });

//   if (isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!!!" });
//   }
//   const _id = req.params.id;
//   try {
//     // const user = await users.findByIdAndUpdate(_id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });
//     const user = await users.findById(_id);
//     updates.forEach((update) => {
//       user[update] = req.body[update];
//     });
//     await user.save();

//     if (!user) {
//       return res.status(404).send();
//     }
//     res.status(201).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// router.delete("/users/:id", async (req, res) => {
//   try {
//     const user = await users.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.status(201).send(user);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendDeleteEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user.avatar);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
