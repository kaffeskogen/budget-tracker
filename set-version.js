console.log('Requiering fs');
const fs = require("fs");
console.log('Requiering child_process');
const execSync = require("child_process").execSync;

console.log('Loading package.json');
const version = require("./package.json").version;

console.log('Running git command');
const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

console.log('Getting current date');
const buildDate = new Date().toISOString();

console.log('Setting content');
const content = `export const version = '${version}';
export const buildDate = '${buildDate}';
export const commitHash = '${commitHash}';`;

console.log('Updating file');
fs.writeFileSync("./src/environments/app-version.ts", content);

console.log("Updated version!", { version, commitHash, buildDate });
