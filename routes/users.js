var express = require("express");
var router = express.Router();

require("../models/connections");

const User = require("../models/users");
const Event = require("../models/events");

const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const cloudinary = require("cloudinary").v2;
const uniqid = require("uniqid");
const fs = require("fs");

router.post("/signup", (req, res) => {
  // Vérifie que les champs soient correctement remplies
  if (!checkBody(req.body, ["pseudo", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Vérifie si l utilisateur est deja inscrit, s'il ne l'est pas, crée un nouvel utilisateur
  User.findOne({ pseudo: { $regex: new RegExp(req.body.pseudo, "i") } }).then(
    (data) => {
      if (data === null) {
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          pseudo: req.body.pseudo,
          email: req.body.email,
          token: uid2(32),
          password: hash,
          avatar:
            "https://img.freepik.com/icones-gratuites/utilisateur_318-159711.jpg",
          ville: "",
          description: "",
          tags: [],
          tickets: [],
          like: [],
        });

        newUser.save().then((newUser) => {
          res.json({
            result: true,
            token: newUser.token,
            avatar: newUser.avatar,
          });
        });
      } else {
        // L'utilisateur existe déja dans la BDD
        res.json({ result: false, error: "User already exists" });
      }
    }
  );
});

// Vérifie que les champs soient correctement remplies
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Vérifie si l'email et le mot de passe correspondent a des données dans la BDD
  User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } }).then(
    (data) => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, token: data.token, pseudo: data.pseudo });
      } else {
        // Soit l utilisateur n'existe pas, soit le mot de passe est faux, renvoie un message d erreur
        res.json({ result: false, error: "User not found or wrong password" });
      }
    }
  );
});

//Cette route permet de mettre à jour la ville via le token du user qui n'était pas encore ajoutée lors de la création du compte

router.put("/cityUpdate", (req, res) => {
  User.updateOne(
    { token: req.body.token },
    { $set: { ville: req.body.ville } }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

//Cette route permet de mettre à jour les musiques favorites de l'utilise via son token qui n'était pas encore ajouté lors de la création du compte

router.put("/musicUpdate", (req, res) => {
  User.updateOne(
    { token: req.body.token },
    { $push: { tags: req.body.tags } }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

//Cette route permet de modifier la photo de profil de l'utilisateur via son token

// router.put("/avatarUpdate", (req, res) => {
//   User.updateOne(
//     { token: req.body.token },
//     { $set: { avatar: req.body.avatar } }
//   ).then((data) => {
//     res.json({ result: true, data: data });
//   });
// });

router.post("/avatarUpdate", async (req, res) => {
  const photoPath2 = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.avatarImage.mv(photoPath2);
  console.log("req.file.avatarImage", req.files.avatarImage);
  console.log("result move", resultMove);
  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath2);
    res.json({ result: true, url: resultCloudinary.secure_url });
    console.log(resultCloudinary.secure_url);
  } else {
    res.json({ result: false, error: resultMove });
  }
  fs.unlinkSync(photoPath2);
});

router.put("/modifyProfile", (req, res) => {
  User.updateOne(
    { token: req.body.token },
    {
      $set: {
        pseudo: req.body.pseudo,
        description: req.body.description,
        email: req.body.email,
      },
    }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

router.put("/like", (req, res) => {
  if (!checkBody(req.body, ["token", "eventId"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }

    Event.findById(req.body.eventId).then((event) => {
      console.log(event);
      if (event === null) {
        res.json({ result: false, error: "Event not found" });
        return;
      }

      if (user.like.includes(event._id)) {
        // User already liked the Event
        User.updateOne({ _id: user._id }, { $pull: { like: event._id } }) // Remove event ID from likes
          .then(() => {
            res.json({ result: false });
          });
      } else {
        // User has not liked the Event
        User.updateOne({ _id: user._id }, { $push: { like: event._id } }) // Add event ID to likes
          .then(() => {
            res.json({ result: true });
          });
      }
    });
  });
});

router.get("/showLike/:token", (req, res) => {
  User.findOne({ token: { $regex: new RegExp(req.params.token, "i") } })
    .populate("like")
    .then((like) => {
      console.log("like", like);
      if (like.like.length > 0) {
        res.json({ result: true, like: like.like });
      } else {
        res.json({ result: false, error: "No liked events found" });
      }
    });
});

router.get("/userdata/:token", (req, res) => {
  User.findOne({ token: { $regex: new RegExp(req.params.token, "i") } }).then(
    (data) => {
      res.json({ result: true, user: data });
    }
  );
});

router.get("/delete", (req, res) => {
  User.deleteMany().then(() => console.log("database clear"));
});
module.exports = router;
