import { access } from "node:fs/promises";
import { constants } from "node:fs";

export async function CheckFileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
