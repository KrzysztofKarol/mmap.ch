import { copyFileSync } from "fs";
import { outFile as inputFile } from "../04-OLD-downloadLatLong/outFile";
import { outFile } from "./outFile";

copyFileSync(inputFile, outFile);
