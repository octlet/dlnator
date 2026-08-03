import fs from "fs";
import path from "path";

export function getLibraryRoot() {
  const libraryRoot = path.join(
    /* turbopackIgnore: true */ process.cwd(),
    "data",
    "library",
  );

  if (!fs.existsSync(libraryRoot)) {
    fs.mkdirSync(libraryRoot, { recursive: true });
  }

  return libraryRoot;
}

export function getOutputTemplate() {
  return path.join(getLibraryRoot(), "%(title)s [%(id)s].%(ext)s");
}
