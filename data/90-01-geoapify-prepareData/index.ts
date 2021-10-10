import { existsSync, readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";
import * as NodeGeocoder from "node-geocoder";
import { outFile as inputFile } from "../03-extractRawMusuemData/outFile";

import { outFile } from "./outFile";
