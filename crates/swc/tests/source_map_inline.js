const validate = require("sourcemap-validator");
const fs = require("fs");

const jsFile = process.argv[1];

const jsContent = fs.readFileSync(jsFile, "utf-8");

validate(jsContent);

// sourcemap-validator uses Buffer.form(..., "base64") that accept both standard and url-safe charset,
// so we add an extra check.
const re =
    /\s*\/\/[@#] sourceMappingURL=data:application\/json;(?:charset=utf-?8;)?base64,(\S*)$/m;
Buffer.from(re.exec(jsContent)[1]);
