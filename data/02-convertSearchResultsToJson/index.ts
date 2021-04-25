import { readFileSync, writeFileSync } from "fs";
import { html2json } from "html2json";
import { outFile as inputFile } from "../01-downloadSearchResults/outFile";
import { outFile } from "./outFile";

const html = readFileSync(inputFile, "utf8");
const json = html2json(html);

writeFileSync(outFile, JSON.stringify(json, null, 2));
