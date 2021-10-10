import { existsSync, readFileSync, writeFileSync } from "fs";
import * as path from "path";

const jsonFile = path.join(__dirname, "couldNotFind.json");

if (!existsSync(jsonFile)) {
  writeFileSync(jsonFile, "[]");
}

export const exists = (id: string): boolean => {
  const couldNotFindArr: string[] = JSON.parse(readFileSync(jsonFile, "utf-8"));

  return couldNotFindArr.includes(id);
};

export const add = (id: string): void => {
  const couldNotFindArr: string[] = JSON.parse(readFileSync(jsonFile, "utf-8"));

  writeFileSync(jsonFile, JSON.stringify([...couldNotFindArr, id], null, 2));
};
