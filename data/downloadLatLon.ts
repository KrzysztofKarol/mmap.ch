const fs = require("fs");
const NodeGeocoder = require("node-geocoder");

// Set specific http request headers:
const nodeFetch = require("node-fetch");

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  fetch: function fetch(url, options) {
    return nodeFetch(url, {
      ...options,
      headers: {
        "user-agent": "mmap.ch <contact@mmap.ch>",
      },
    });
  },
});

const museums = require("./out.json");
const outFileName = "museumsWithLatLng.json";

const notFoundIds = [
  "Archives-de-la-construction-moderne",
  "Caferama",
  "Fondazione-Ernesto-Conrad",
  "Castelgrande---Museo-storico-archeologico",
  "Centre-D--rrenmat",
  "Ch--teau-d-Aigle",
  "ClassicCarMuseum-5745",
  "EcomuseduremuagedeColombire-3963",
  "Ch--teau-de-La-Sarraz---Mus--e-Romand",
  "Fort-d-artillerie-A-46",
  "Fort-de-Vallorbe",
  "Mus--e-Arche-de-No--",
  "Grindelwald-Museum",
  "Heimatmuseum7260",
  "Heimatmuseum-Safien",
  "Kunsthaus-Zug",
  "Mus--e-des-Glaciers",
  "Mus--e-d-ethnographie",
  "Museum-Cristallina",
  "Mus--e-d-histoire--Sion---Geschichtsmuseum--Sitten",
  "Mus--e-de-l-Aviation-Militaire-de-Payerne",
  "Mus--e-de-la-vigne-et-du-vin-1860",
  "Mus--e-de-la-vigne-et-du-vin",
  "Mus--e-de-Saint-Imier",
  "Mus--e-des-Ormonts",
  "Mus--e-du-cheval",
  "Musee du fer",
  "Mus--e-du-papier-peint",
  "Mus--e-Gutenberg--Mus--e-suisse-des-arts-graphiques-et-de-la-communication-",
  "Mus--e-H-R--Giger",
  "Mus--e-Jean-Jacques-Rousseau",
  "Mus--e-national-suisse---Ch--teau-de-Prangins",
  "Mus--e-Rath",
  "Mus--e-rural-jurassien",
  "Mus--e-suisse-de-l-orgue",
  "Museo-dei-fossili",
  "Museo-del-Malcantone",
  "Museo-di-Val-Verzasca",
  "Museo-di-Valmaggia",
  "Museo-Poschiavino",
  "Museo-regionale-delle-Centovalli-e-del-Pedemonte",
  "Villa-dei-Cedri---Museo",
  "Museo-Wilhelm-Schmid",
  "Museum-der-Landschaft-Saanen",
  "Museum-f--r-Lebensgeschichten",
  "Museum-f--r-Uhren-und-mechanische-Musikinstrumente",
  "Museum-im-Kornhaus",
  "Heimatmuseum-Nutli-H--schi",
  "Schloss-Kyburg",
  "Museum-Schmelzra-S-charl",
  "Ortsmuseum7078",
  "Nationalparkzentrum",
  "Wildnispark-Zuerich-Sihlwald",
  "Mus--e-Neuhaus",
  "Pegasus-Small-World",
  "Pinacoteca-cantonale-Giovanni-Z--st",
  "Pinacoteca-comunale",
  "Pro-Natura-Zentrum-Aletsch",
  "Rebbaumuseum-am-Bielersee---Mus--e-de-la-vigne-au-lac-de-Bienne",
  "Sammlung-Rosengart",
  "sasso-sangottardo",
  "Schweizerisches-Agrarmuseum-Burgrain",
  "Site-arch--ologique-de-la-Cath--drale-St-Pierre",
  "Spielzeugmuseum-3665",
  "Thun-Panorama",
  "Urner-Mineralien-Museum",
  "Moulins-de-la-Tine",
  "Vitromus--e-Romont",
  "Grubenmann-Sammlung",
  "Z--rcher-Spielzeugmuseum---Sammlung-Franz-Carl-Weber",
];

(async () => {
  for (const museum of museums) {
    const data = fs.readFileSync(outFileName, {
      encoding: "utf8",
      flag: "r",
    });

    const { id, address, zipCode, city, canton } = museum;

    if (notFoundIds.includes(id)) {
      continue;
    }

    const alreadySaved = JSON.parse(data);

    if (alreadySaved.find((m) => m.id === id)) {
      continue;
    }

    // if (id !== "Gebert-Stiftung-f--r-Kultur" && id !== "Aargauer-Kunsthaus") {
    //   continue;
    // }

    //console.log("Processing:", id);

    const country =
      canton === "Fürstentum Liechtenstein" ? "Liechtenstein" : "Switzerland";

    const res = await geocoder.geocode(
      `${address.join(", ")}, ${country}`
      //`${address[0]}, ${zipCode} ${city}, ${country}`
    );

    if (res[0] === undefined) {
      console.warn(id);
      await delay(2000);
      continue;
    }

    const { latitude, longitude } = res[0];

    const newMuseum = {
      ...museum,
      latitude,
      longitude,
    };

    const all = [...alreadySaved, newMuseum];

    fs.writeFileSync(outFileName, JSON.stringify(all, null, 2));

    await delay(2000);
  }
})();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
