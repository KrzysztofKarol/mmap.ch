import { html2json } from "html2json";
import { readFileSync, writeFileSync } from "fs";

const html = readFileSync("searchResults.html", "utf8");
const json = html2json(html);

writeFileSync("searchResults.json", JSON.stringify(json, null, 2));
