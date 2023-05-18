var express = require("express");
var router = express.Router();

var moment = require("moment");
require("../models/connections");

const Event = require("../models/events");

const { checkBody } = require("../modules/checkBody");

router.post("/addEvent", (req, res) => {
  // Vérifie que les champs soient correctement remplies
  if (
    !checkBody(req.body, [
      "name",
      "lieu",
      "photo",
      "organisateur",
      "tags",
      "longitude",
      "latitude",
      "adresse",
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
          lieu: req.body.lieu,
          date_debut: moment().toDate(req.body.date_debut),
          date_fin: moment().toDate(req.body.date_fin),
          photo: req.body.photo,
          organisateur: req.body.organisateur,
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          adresse: req.body.adresse,
          tags: [req.body.tags],
          tickets: [],
        });

        newEvent.save().then((newEvent) => {
          res.json({ result: true, name: newEvent.name });
        });
      } else {
        // L'utilisateur existe déja dans la BDD
        res.json({ result: false, error: "Event already exists" });
      }
    }
  );
});

router.get("/showEventByDate/:date_debut/:date_fin", (req, res) => {
  const { date_debut, date_fin } = req.params;

  Event.find({
    date_debut: {
      $gte: moment(date_debut).startOf("date"),
      $lte: moment(date_fin).endOf("date"),
    },
  }).then((event) => {
    if (event.length > 0) {
      res.json({ result: true, event: event });
    } else {
      res.json({
        result: false,
        error: "Il n'y a pas d'evenement à cette date",
      });
    }
  });
});

router.get("/showAllEvent", (req, res) => {
  Event.find().then((event) => {
    res.json({ event: event });
  });
});

router.get("/showEventById/:eventId", (req, res) => {
  Event.findById(req.params.eventId).then((event) => {
    console.log(event);
    if (event === null) {
      res.json({ result: false, error: "Event not found" });
      return;
    } else {
      res.json({ result: true, event: event });
    }
  });
});

module.exports = router;
