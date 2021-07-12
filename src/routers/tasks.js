const express = require("express");
const tasks = require("../models/tasks");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    //const task = new tasks(req.body);
    const task = new tasks({
      ...req.body,
      user: req.user,
    });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }

  // task1
  //   .save()
  //   .then((task1) => {
  //     res.status(201).send(task1);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  //   });
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  //const sort = {};

  // if (req.query.completed === "true") {
  //   match.completed = true;
  // } else if (req.query.completed === "false") {
  //   match.completed = false;
  // }

  // if (req.query.sortBy) {
  //   const parts = req.query.sortBy.split(":");
  //   sort[parts[[0]]] = parts[[1]] === "asc" ? 1 : -1;
  // }

  // try {
  //   const findTasks = await tasks.find(
  //     {
  //       user: req.user._id,
  //       ...match,
  //     },
  //     null,
  //     // { limit: parseInt(req.query.limit), skip: parseInt(req.query.skip) }
  //     {
  //       limit: parseInt(req.query.limit),
  //       skip: parseInt(req.query.limit) * (parseInt(req.query.page) - 1),
  //       ...sort,
  //     }
  //   );

  //   // options: {
  //   //   limit: parseInt(req.query.limit),
  //   //   skip: parseInt(req.query.skip),
  //   //},

  //   console.log(findTasks);
  //   res.send(findTasks);
  //   // const tasks = await Task.find(match).limit(1).skip(1);
  //   // const match = {};

  //   // if (req.query.completed === "true") {
  //   //   match.completed = req.query.completed === "true";
  //   // } else if (req.query.completed === "false") {
  //   //   match.completed = req.query.completed === "false";
  //   // }
  //   // try {
  //   //   const findTasks = await req.user
  //   //     .populate({
  //   //       path: "userTasks",
  //   //       match,
  //   //       options: {
  //   //         limit: Number(req.query.limit),
  //   //         skip: Number(req.query.skip),
  //   //       },
  //   //     })
  //   //     .execPopulate();

  //   //   res.status(201).send(findTasks.userTasks);
  // }

  const sort = {};

  if (req.query.completed === "true") {
    match.completed = true;
  } else if (req.query.completed === "false") {
    match.completed = false;
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
  }

  try {
    const findTasks = await tasks
      .find({
        user: req.user._id,
        ...match,
      })
      .limit(parseInt(req.query.limit))
      .skip(parseInt(req.query.skip))
      .sort(sort);
    res.send(findTasks);
  } catch (e) {
    res.status(500).send(e);
  }

  // tasks
  //   .find({})
  //   .then((tasks) => {
  //     res.status(200).send(tasks);
  //   })
  //   .catch((error) => {
  //     res.status(500).send(error);
  //   });
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await tasks.findOne({ _id, user: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
  // tasks
  //   .findById(_id)
  //   .then((task) => {
  //     if (!task) {
  //       return res.status(404).send(task);
  //     }
  //     res.status(200).send(task);
  //   })
  //   .catch((error) => {
  //     res.status(500).send(error);
  //   });
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowUpdates = ["completed", "description"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((i) => {
    allowUpdates.includes(i);
  });
  if (isValidOperation) {
    return res.status(400).send({ error: "invalid updates!!" });
  }

  try {
    const _id = req.params.id;
    // const task = await tasks.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const task = await tasks.findOne({ _id, user: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await tasks.findOneAndDelete({ _id, user: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
