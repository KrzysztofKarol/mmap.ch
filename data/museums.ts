import fetch from "node-fetch";
import { writeFile } from "fs";
import { promisify } from "util";

const writeFilePromise = promisify(writeFile);

const outputPath = "searchResults.html";

fetch("https://www.museums.ch/en/museums/museum-finder/search-results.html", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body:
    "bleibleer=&museensearch%5Bart%5D=museum&museensearch%5Bname%5D=&museensearch%5Bplz%5D=&museensearch%5Bort%5D=&museensearch%5Bschwerpunkt%5D=&museensearch%5Bkanton%5D=&museensearch%5Bstichwort%5D=&submitbtn=Museum+search&museensearch%5Bpass%5D=on&museensearch%5Border%5D=org_name&museensearch%5Bsort%5D=ASC",
})
  .then((x) => x.arrayBuffer())
  .then((x) => writeFilePromise(outputPath, Buffer.from(x)));
