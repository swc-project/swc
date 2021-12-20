import "./cjs4";
import "./cjs3";
import "./cjs2";
import "./cjs";
import "./bol";
import "./ban";
import "./bat";
import "./baz";
import "./bar";
import "./bar2";
export class Foo {
}
export function func() {
}
export * from "./cls";
export * from "./func";
export * from "./cls";
export { Foo };
export default ns;
export { ns };
export { ns as classContainer };
const ns = require("./cls");
module.exports = {
    ns
};
const ns = require("./cls");
module.exports = ns;
const ns = require("./cls");
module.exports.ns = ns;
const ns = require("./cls");
module.exports.names = ns;
