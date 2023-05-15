var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  // Vérifie que les champs soient correctement remplies
  if (!checkBody(req.body, ["pseudo", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Vérifie si l utilisateur est deja inscrit, s'il ne l'est pas, crée un nouvel utilisateur
  User.findOne({ pseudo: req.body.pseudo }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        pseudo: req.body.pseudo,
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
  });
});

// Vérifie que les champs soient correctement remplies
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Vérifie si l'email et le mot de passe correspondent a des données dans la BDD
  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, prenom: data.prenom });
    } else {
      // Soit l utilisateur n'existe pas, soit le mot de passe est faux, renvoie un message d erreur
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

router.get("/delete", (req, res) => {
  User.deleteMany().then(() => console.log("database clear"));
});
module.exports = router;
