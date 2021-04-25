import { writeFileSync } from "fs";
import fetch from "node-fetch";
import { outFile } from "./outFile";

(async () => {
  const formParams = {
    bleibleer: "",
    "museensearch[art]": "museum",
    submitbtn: "Museum+search",
    "museensearch[pass]": "on",
  };

  const body = Object.entries(formParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${value}`)
    .join("&");

  const res = await fetch(
    "https://www.museums.ch/en/museums/museum-finder/search-results.html",
    {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
    }
  );

  writeFileSync(outFile, await res.text());
})();
