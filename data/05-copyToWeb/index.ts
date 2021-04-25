import { copyFileSync } from "fs";
import { outFile as inputFile } from "../04-downloadLatLong/outFile";
import { outFile } from "./outFile";

copyFileSync(inputFile, outFile);
