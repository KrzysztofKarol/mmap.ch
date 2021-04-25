import { existsSync, readFileSync, writeFileSync } from "fs";
import nodeFetch from "node-fetch";
import * as NodeGeocoder from "node-geocoder";
import { outFile as inputFile } from "../03-extractRawMusuemData/outFile";
import * as couldNotFindHelper from "./couldNotFindHelper";
import { outFile } from "./outFile";

if (!existsSync(outFile)) {
  writeFileSync(outFile, "[]");
}

const geocoder = NodeGeocoder({
  provider: "openstreetmap",
  // @ts-ignore
  fetch: function fetch(url, options) {
    return nodeFetch(url, {
      ...options,
      headers: {
        referer: "https://mmap.ch",
        "user-agent": "mmap.ch <contact@mmap.ch>",
      },
    });
  },
});

const museums = require(inputFile);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  for (const museum of museums) {
    const data = readFileSync(outFile, {
      encoding: "utf8",
      flag: "r",
    });

    const { id, name, address, canton } = museum;

    console.log(`START: ${id}`);

    if (couldNotFindHelper.exists(id)) {
      console.warn(`SKIPPING (COULD NOT FIND): ${id}`);
      continue;
    }

    const alreadySaved = JSON.parse(data);

    if (alreadySaved.find((m) => m.id === id)) {
      console.warn(`SKIPPING (ALREADY SAVED): ${id}`);
      continue;
    }

    const country =
      canton === "Fürstentum Liechtenstein" ? "Liechtenstein" : "Switzerland";

    let res = await geocoder.geocode(
      `${name}, ${address.join(", ")}, ${country}`
    );

    let notice = "";

    if (res[0] === undefined) {
      if (res[0] === undefined && address.length > 1) {
        delay(1000);

        res = await geocoder.geocode(`${name}, ${country}`);

        if (res[0] !== undefined) {
          notice = "MUSEUM FOUND ONLY BY NAME";
        }
      }

      if (res[0] === undefined && address.length > 1) {
        delay(1000);

        const [firstLine, ...rest] = address;

        const withoutHouseNumber = firstLine.replace(/\d/g, "");

        const newAddress = [withoutHouseNumber, ...rest];

        res = await geocoder.geocode(`${newAddress.join(", ")}, ${country}`);

        if (res[0] !== undefined) {
          notice = "LOCATION TAKEN WITHOUT HOUSE NUMBER";
        }
      }

      if (res[0] === undefined) {
        delay(1000);
        const [_firstLine, ...rest] = address;

        res = await geocoder.geocode(`${[...rest].join(", ")}, ${country}`);

        if (res[0] !== undefined) {
          notice =
            "LOCATION TAKEN WITHOUT FIRST ADDRESS LINE (ONLY BY ZIP CODE AND CITY)";
        }
      }

      if (res[0] === undefined) {
        couldNotFindHelper.add(id);
        console.warn(`SKIPPING (NEW COULD NOT FIND): ${id}`);
        await delay(1000);
        continue;
      }
    }

    const { latitude, longitude } = res[0];

    const newMuseum = {
      ...museum,
      ...(notice ? { notice } : undefined),
      latitude,
      longitude,
      notice,
    };

    const all = [...alreadySaved, newMuseum];

    writeFileSync(outFile, JSON.stringify(all, null, 2));

    await delay(1000);
  }
})();
