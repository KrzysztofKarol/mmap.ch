import { existsSync, readFileSync, writeFileSync } from "fs";
import { outFile as inputFile } from "../03-extractRawMusuemData/outFile";
import { outFile } from "./outFile";
import { Client, PlaceInputType } from "@googlemaps/google-maps-services-js";

const client = new Client({});

if (!existsSync(outFile)) {
  writeFileSync(outFile, "[]");
}

(async () => {
  const museums = (await import(inputFile)).default;
  const overrides = (await import("./overrides.json")).default;

  for (const museum of museums) {
    const data = readFileSync(outFile, {
      encoding: "utf8",
      flag: "r",
    });

    const { id, name, address, canton } = museum;

    console.log(`START: ${id}`);

    const alreadySaved = JSON.parse(data);

    if (alreadySaved.find((m) => m.id === id)) {
      console.warn(`SKIPPING (ALREADY SAVED): ${id}`);
      continue;
    }

    const country =
      canton === "Fürstentum Liechtenstein" ? "Liechtenstein" : "Switzerland";

    const addressJoined = address.join(" ");

    const overrider = overrides.find((m) => m.id === id);
    const { name: nameOver, addressStr: addressOver } = overrider ?? {};

    const input = `${nameOver ?? name}, ${
      addressOver ?? addressJoined
    }, ${country}`;

    const res = await client.findPlaceFromText({
      params: {
        input,
        inputtype: PlaceInputType.textQuery,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const { candidates } = res.data;

    if (candidates.length === 0) {
      console.warn(`Nothing was found for id: \`${id}\`, input: \`${input}\``);
      continue;
      // throw new Error("Nothing was found");
    }

    const { place_id } = candidates[0];

    const newMuseum = {
      ...museum,
      placeId: place_id,
    };

    const all = [...alreadySaved, newMuseum];

    writeFileSync(outFile, JSON.stringify(all, null, 2));
  }
})();
