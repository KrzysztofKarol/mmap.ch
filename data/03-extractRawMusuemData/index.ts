import { writeFileSync } from "fs";
import * as path from "path";
import { JsonNode } from "./types";
import { outFile as inputFile } from "../02-convertSearchResultsToJson/outFile";
import { outFile } from "./outFile";

const json: JsonNode = require(inputFile);

// .result_pages
const resultsParent = json.child[0].child[3].child[3].child[7];

const results = resultsParent.child
  .filter((child) => child.attr?.class == "result_pages")
  .flatMap((result) => result.child);

let cleanedResults = results.map((result) => {
  clean(result);

  return result;
});

const r = cleanedResults.filter((node) => node.child).map(extract);

writeFileSync(outFile, JSON.stringify(r, null, 2));

function clean(node: JsonNode): void {
  if (!node.child) {
    return;
  }

  node.child.forEach((currentChild) => {
    if (currentChild.text?.trim() === "") {
      node.child = node.child.filter((c) => c !== currentChild);
    }
  });

  node.child.forEach((node) => clean(node));
}

function extract(node: JsonNode) {
  const [col1, col2, col3] = node.child;
  const a = col1.child[0];
  const href = a.attr.href;
  const url = Array.isArray(href) ? href.join(" ") : href;
  const id = url.replace("https://www.museums.ch/org/en/", "");
  const name = a.child[0].child[0].text;
  const address = a.child[1].child
    .filter((child) => child.text)
    .map((child) => child.text.trim());
  const zipCode = address.join(" ").match(/\d{4}/)[0];
  const openingTime = a.child[2].child[0].text
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean);
  const city = col2.child[0].text;
  const canton = col3.child[0].text;

  return {
    id,
    url,
    name,
    address,
    openingTime,
    zipCode,
    city,
    canton,
  };
}
