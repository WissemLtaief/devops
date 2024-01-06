const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const TownModel = require("./models/TownSuggestion");
const Service = require("./models/ServiceSuggestion");
const Business = require("./models/business");

app.use(express.json());
app.use(cors());
mongoose.connect(
  "mongodb+srv://boudhraad:Password12345@lespagejaunes.wihi6be.mongodb.net/pageJaune?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get("/towns/save", async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.geonames.org/tn/administrative-division-tunisia.html"
    );
    const $ = cheerio.load(response.data);
    const townNames = $("table")
      .eq(1)
      .find("tr > td:nth-child(7)")
      .map((i, el) => $(el).text().trim())
      .get();

    const Model = await Promise.all(
      townNames.map((name) => new TownModel({ name }).save())
    );
    res.json({ message: `${townNames.length} towns saved to the database` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/services/save", async (req, res) => {
  try {
    const serviceNames = [
      "Médecin",
      "Dentiste",
      "Électricien",
      "Plombier",
      "Menuisier",
      "Peintre",
      "Avocat",
      "Comptable",
      "Architecte",
      "Boulanger",
      "Coiffeur",
      "Cuisinier",
      "Employé",
      "Entraîneur",
      "Entrepreneur",
      "Designer",
      "Docteur",
      "Chauffeur",
      "Ingénieur",
      "Conseiller financier",
      "Instructeur de fitness",
      "Jardinier",
      "Coiffeur",
      "Homme à tout faire",
      "Femme de ménage",
      "Spécialiste en informatique",
      "Journaliste",
      "Paysagiste",
      "Massothérapeute",
      "Mécanicien",
      "Musicien",
      "Infirmier",
      "Optométriste",
      "Entraîneur personnel",
      "Photographe",
      "Physiothérapeute",
      "Pilote",
      "Plâtrier",
      "Agent immobilier",
      "Courtier immobilier",
      "Agent de sécurité",
      "Enseignant",
      "Tuteur",
      "Vétérinaire",
      "Écrivain",
      "Instructeur de yoga",
    ]; // Example data in French

    const services = await Service.insertMany(
      serviceNames.map((name) => ({ name }))
    );
    res.json({ message: `${services.length} services saved to the database` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/towns", async (req, res) => {
  try {
    const towns = await TownModel.find();
    res.json(towns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/search", async (req, res) => {
  const service = req.query.service;
  const town = req.query.town;
  if (!service || !town)
    return res.status(400).json({ msg: "Please enter all fields" });
  try {
    const businesses = await Business.find({
      $and: [
        { service: { $regex: service, $options: "i" } },
        { town: { $regex: town, $options: "i" } },
      ],
    }).limit(10);
    res.json(businesses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/create-fake-service", async (req, res) => {
  try {
    const businesses = [
      {
        name: "Médecin 1",
        email: "business1@example.com",
        service: "Médecin",
        phone: "11111111",
        location: "Location 1",
        town: "Sousse",
        gmapLat: 35.8328389235004,
        gmapLen: 10.615991102643807,
      },
      {
        name: "Dentiste 2",
        email: "business2@example.com",
        service: "Dentiste",
        phone: "22222222",
        location: "Location 2",
        town: "Sousse",
        gmapLat: 35.83647995756054,
        gmapLen: 10.605370097681702,
      },
      {
        name: "Électricien 3",
        email: "business3@example.com",
        service: "Électricien",
        phone: "33333333",
        location: "Électricien 3",
        town: "Sousse",
        gmapLat: 35.83264210608849,
        gmapLen: 10.612653072512861,
      },
      {
        name: "Plombier 4",
        email: "business4@example.com",
        service: "Plombier",
        phone: "44444444",
        location: "Location 4",
        town: "Sousse",
        gmapLat: 35.828879,
        gmapLen: 10.630994,
      },
      {
        name: "Business 5",
        email: "business5@example.com",
        service: "Avocat",
        phone: "55555555",
        location: "Location 5",
        town: "Sousse",
        gmapLat: 35.84622136213595,
        gmapLen: 10.601910684636904,
      },
      {
        name: "Business 6",
        email: "business6@example.com",
        service: "Coiffeur",
        phone: "66666666",
        location: "Location 6",
        town: "Sousse",
        gmapLat: 35.82002 + Math.random() * 0.03,
        gmapLen: 10.63699 + Math.random() * 0.03,
      },
    ];

    await Business.insertMany(businesses);

    res.send("Dummy businesses created successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/save-data", async (req, res) => {
  console.log(req.body);
  const { name, email, phone, town, service, location, gmapLat, gmapLen } =
    req.body;
  const row = new Business({
    name,
    email,
    phone,
    service,
    town,
    location,
    gmapLat,
    gmapLen,
  });

  try {
    const savedService = await row.save();
    res.status(201).json({ success: true, data: savedService });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});

module.exports = app;
