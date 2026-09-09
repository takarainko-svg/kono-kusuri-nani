import fs from "node:fs";

const data = JSON.parse(fs.readFileSync(new URL("../drugs.json", import.meta.url), "utf8"));
const errors = [];

const isString = value => typeof value === "string" && value.trim().length > 0;
const isDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || "");
const normalize = value => String(value || "").toLowerCase().replace(/[ 　\-ー]/g, "");

if (data.schemaVersion !== 2) errors.push("schemaVersion must be 2");
if (!/^\d+\.\d+\.\d+$/.test(data.appVersion || "")) errors.push("appVersion must be semver");
if (!Array.isArray(data.drugs)) errors.push("drugs must be an array");

const ids = new Set();
const searchTermOwners = new Map();

for (const [index, drug] of (data.drugs || []).entries()) {
  const label = `drugs[${index}]`;
  for (const key of ["id","name","generic","className","what"]) {
    if (!isString(drug[key])) errors.push(`${label}.${key} is required`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(drug.id || "")) errors.push(`${label}.id has invalid format`);
  if (ids.has(drug.id)) errors.push(`duplicate id: ${drug.id}`);
  ids.add(drug.id);

  for (const key of ["brands","aliases"]) {
    if (!Array.isArray(drug[key])) errors.push(`${label}.${key} must be an array`);
    else if (new Set(drug[key]).size !== drug[key].length) errors.push(`${label}.${key} contains duplicates`);
  }
  for (const key of ["use","common","serious","caution","care"]) {
    if (!Array.isArray(drug[key]) || drug[key].length === 0 || drug[key].some(v => !isString(v))) {
      errors.push(`${label}.${key} must be a non-empty string array`);
    }
  }

  if (!drug.source || drug.source.type !== "PMDA") errors.push(`${label}.source.type must be PMDA`);
  if (!isString(drug.source?.url) || !drug.source.url.startsWith("https://www.pmda.go.jp/")) errors.push(`${label}.source.url must be a PMDA URL`);
  if (!isString(drug.source?.revision)) errors.push(`${label}.source.revision is required`);
  if (!isDate(drug.source?.checkedAt)) errors.push(`${label}.source.checkedAt must be YYYY-MM-DD`);

  if (!isDate(drug.record?.createdAt)) errors.push(`${label}.record.createdAt must be YYYY-MM-DD`);
  if (!isDate(drug.record?.updatedAt)) errors.push(`${label}.record.updatedAt must be YYYY-MM-DD`);
  if (!Number.isInteger(drug.record?.version) || drug.record.version < 1) errors.push(`${label}.record.version must be an integer >= 1`);

  const terms = [drug.name, drug.generic, ...(drug.brands || []), ...(drug.aliases || [])].filter(isString);
  for (const term of terms) {
    const key = normalize(term);
    if (!key) continue;
    if (!searchTermOwners.has(key)) searchTermOwners.set(key, new Set());
    searchTermOwners.get(key).add(drug.id);
  }
}

for (const [term, owners] of searchTermOwners) {
  if (owners.size > 1) errors.push(`ambiguous search term "${term}" belongs to: ${[...owners].join(", ")}`);
}

if (errors.length) {
  console.error("Drug data validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Drug data validation passed: ${data.drugs.length} drugs, schema v${data.schemaVersion}, app ${data.appVersion}`);
