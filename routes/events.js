var express = require("express");
var router = express.Router();

require("../models/connections");
const Event = require("../models/events");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");

// router.post("/addEvent", (req, res) => {
//   // Vérifie que les champs soient correctement remplies
//   if (!checkBody(req.body, ["pseudo", "email", "password"])) {
//     res.json({ result: false, error: "Missing or empty fields" });
//     return;
//   }

//   // Vérifie si l utilisateur est deja inscrit, s'il ne l'est pas, crée un nouvel utilisateur
//   Event.findOne({ name: { $regex: new RegExp(req.body.name, "i") } }).then(
//     (data) => {
//       if (data === null) {
//         const newUser = new User({
//           pseudo: req.body.pseudo,
//           email: req.body.email,
//           token: uid2(32),
//           password: hash,
//           avatar: "",
//           ville: "",
//           styles_musicaux: "",
//           tickets: [],
//           like: [],
//         });

//         newUser.save().then((newUser) => {
//           res.json({ result: true, token: newUser.token });
//         });
//       } else {
//         // L'utilisateur existe déja dans la BDD
//         res.json({ result: false, error: "User already exists" });
//       }
//     }
//   );
// });

module.exports = router;
