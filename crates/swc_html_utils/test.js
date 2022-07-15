"use strict";

const fs = require("fs");
const path = require("path");

let rawdata = fs.readFileSync(
    path.resolve(__dirname, "./src/svg_elements_and_attributes.json")
);
let elements = JSON.parse(rawdata);

for (const element_name of Object.keys(elements)) {
    const _extends = elements[element_name]["_extends"];

    if (_extends) {
        for (const extend of _extends) {
            const attributes = elements["*"][extend];

            if (!attributes) {
                console.log(element_name);
                process.exit(1);
            }

            elements[element_name] = Object.assign(
                {},
                attributes,
                elements[element_name]
            );

            delete elements[element_name]["_extends"];
        }
    }
}

fs.writeFileSync(
    path.resolve(__dirname, "./src/svg_elements_and_attributes-new.json"),
    JSON.stringify(elements, null, 2)
);
