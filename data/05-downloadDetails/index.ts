import { existsSync, readFileSync, writeFileSync } from "fs";
import { outFile as inputFile } from "../04-downloadPlaceId/outFile";
import { outFile } from "./outFile";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

if (!existsSync(outFile)) {
  writeFileSync(outFile, "[]");
}

(async () => {
  const museums = (await import(inputFile)).default;

  for (const museum of museums) {
    const data = readFileSync(outFile, {
      encoding: "utf8",
      flag: "r",
    });

    const { id, placeId } = museum;

    console.log(`START: ${id}`);

    const alreadySaved = JSON.parse(data);

    if (alreadySaved.find((m) => m.id === id)) {
      console.warn(`SKIPPING (ALREADY SAVED): ${id}`);
      continue;
    }

    const res = await client.placeDetails({
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const newMuseum = {
      ...museum,
      data: res.data.result,
    };

    const all = [...alreadySaved, newMuseum];

    writeFileSync(outFile, JSON.stringify(all, null, 2));
  }
})();
