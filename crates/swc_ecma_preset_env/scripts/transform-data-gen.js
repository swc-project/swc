const fs = require("fs");
const path = require("path");
const data = require("@babel/compat-data/plugins");

const transform_data_json = path.join(
    __dirname,
    "..",
    "src",
    "transform_data.json"
);

fs.writeFileSync(transform_data_json, JSON.stringify(data, null, 4) + "\n");
