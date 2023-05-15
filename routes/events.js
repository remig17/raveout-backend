var express = require("express");
var router = express.Router();

require("../models/connections");
const Event = require("../models/events");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");

router.post("/addEvent", (req, res) => {
  // Vérifie que les champs soient correctement remplies
  if (
    !checkBody(req.body, [
      "name",
      "lieu",
      "date_debut",
      "date_fin",
      "photo",
      "organisateur",
      "tags",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Vérifie si l utilisateur est deja inscrit, s'il ne l'est pas, crée un nouvel utilisateur
  Event.findOne({ name: { $regex: new RegExp(req.body.name, "i") } }).then(
    (data) => {
      if (data === null) {
        const newEvent = new Event({
          name: req.body.name,
          token: uid2(32),
          lieu: req.body.lieu,
          date_debut: req.body.date_debut,
          date_fin: req.body.date_fin,
          photo: req.body.photo,
          organisateur: req.body.organisateur,
          Longitude: "",
          Latitude: "",
          tags: [req.body.tags],
          tickets: [],
        });

        newEvent.save().then((newEvent) => {
          res.json({ result: true, token: newEvent.token });
        });
      } else {
        // L'utilisateur existe déja dans la BDD
        res.json({ result: false, error: "Event already exists" });
      }
    }
  );
});

module.exports = router;
