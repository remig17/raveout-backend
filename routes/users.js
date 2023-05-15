var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  // Vérifie que les champs soient correctement remplies
  if (!checkBody(req.body, ["prenom", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Vérifie si l utilisateur est deja inscrit, s'il ne l'est pas, crée un nouvel utilisateur
  User.findOne({ prenom: { $regex: new RegExp(req.body.prenom, "i") } }).then(
    (data) => {
      if (data === null) {
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          prenom: req.body.prenom,
          email: req.body.email,
          token: uid2(32),
          password: hash,
          avatar: "",
          ville: "",
          styles_musicaux: "",
          tickets: [],
          like: [],
        });

        newUser.save().then((newUser) => {
          res.json({ result: true, token: newUser.token });
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
        res.json({ result: true, token: data.token, prenom: data.prenom });
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
    { $push: { styles_musicaux: req.body.styles_musicaux } }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

//Cette route permet de modifier la photo de profile de l'utilisateur via son token
router.put("/avatarUpdate", (req, res) => {
  User.updateOne(
    { token: req.body.token },
    { $set: { avatar: req.body.avatar } }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

router.get("/delete", (req, res) => {
  User.deleteMany().then(() => console.log("database clear"));
});
module.exports = router;
