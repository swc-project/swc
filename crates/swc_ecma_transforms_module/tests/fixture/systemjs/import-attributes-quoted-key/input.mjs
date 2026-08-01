import data from "./data.json" with {
    "resolution-mode": "import",
    type: "json",
};
import load from "./load.js";
import proto from "./proto.json" with { __proto__: "x" };

export { data, load, proto };
