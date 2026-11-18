import { plain } from "./data.js";
import { alsoPlain } from "./data.js";
import withJson from "./data.js" with { type: "json" };
import { withNamed } from "./data.js" with { type: "json" };
import withOther from "./data.js" with { type: "custom" };
import { noWith } from "./empty.js";
import { emptyWith } from "./empty.js" with {};

export { plain, alsoPlain, withJson, withNamed, withOther, noWith, emptyWith };
