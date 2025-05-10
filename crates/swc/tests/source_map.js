const { explore } = require("source-map-explorer");

const jsFile = process.argv[1];
const mapFile = process.argv[2];

explore([
    {
        code: jsFile,
        map: mapFile
    }
]).catch(({ errors }) => {
    if (errors.length) {
        const { code, message } = errors[0];
        console.error(`${code} Error: ${message}`);
        process.exit(1);
    }
});
