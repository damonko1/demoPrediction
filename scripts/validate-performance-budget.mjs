import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const outputDirectory = join(root, "out");

if (!existsSync(outputDirectory)) {
  throw new Error("Performance budget requires a completed static build in out/.");
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

const files = listFiles(outputDirectory);

function totalRawSize(selectedFiles) {
  return selectedFiles.reduce((total, file) => total + statSync(file).size, 0);
}

function totalGzipSize(selectedFiles) {
  return selectedFiles.reduce(
    (total, file) => total + gzipSync(readFileSync(file)).length,
    0,
  );
}

function filesWithExtension(extension) {
  return files.filter((file) => extname(file) === extension);
}

function assertBudget(label, actual, maximum) {
  if (actual > maximum) {
    throw new Error(`${label} exceeded: ${actual} bytes > ${maximum} bytes`);
  }
}

const javascriptFiles = filesWithExtension(".js");
const stylesheetFiles = filesWithExtension(".css");
const dataFiles = filesWithExtension(".json");
const largestDataFile = dataFiles.reduce(
  (largest, file) => (statSync(file).size > statSync(largest).size ? file : largest),
  dataFiles[0],
);

const measurements = {
  totalStaticBytes: totalRawSize(files),
  javascriptGzipBytes: totalGzipSize(javascriptFiles),
  stylesheetGzipBytes: totalGzipSize(stylesheetFiles),
  largestDataBytes: largestDataFile ? statSync(largestDataFile).size : 0,
};

assertBudget("Static export", measurements.totalStaticBytes, 3_000_000);
assertBudget("Gzipped JavaScript", measurements.javascriptGzipBytes, 350_000);
assertBudget("Gzipped CSS", measurements.stylesheetGzipBytes, 30_000);
assertBudget("Largest JSON asset", measurements.largestDataBytes, 550_000);

console.log("Performance budget validated.", {
  ...measurements,
  largestDataFile: largestDataFile
    ? relative(outputDirectory, largestDataFile)
    : "none",
});
