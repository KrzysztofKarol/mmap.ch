import { existsSync, readFileSync, writeFileSync } from "fs";
import nodeFetch from "node-fetch";
import { outFile as inputFile } from "../03-extractRawMusuemData/outFile";
import * as couldNotFindHelper from "./couldNotFindHelper";
import { outFile } from "./outFile";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";

const client = new Client({});

if (!existsSync(outFile)) {
  writeFileSync(outFile, "[]");
}

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

    // if (couldNotFindHelper.exists(id)) {
    //   console.warn(`SKIPPING (COULD NOT FIND): ${id}`);
    //   continue;
    // }

    // const alreadySaved = JSON.parse(data);

    // if (alreadySaved.find((m) => m.id === id)) {
    //   console.warn(`SKIPPING (ALREADY SAVED): ${id}`);
    //   continue;
    // }

    const country =
      canton === "Fürstentum Liechtenstein" ? "Liechtenstein" : "Switzerland";

    const addressJoined = address.join(" ");

    const input = `${name}, ${addressJoined}, ${country}`;

    const res = await client.findPlaceFromText({
      params: {
        input,
        inputtype: PlaceInputType.textQuery,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    console.log(res);

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
