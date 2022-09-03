//// [type.js]
var test = "add", tost = "remove";
//// [value.js]
import { TestEnum } from "./mod1";
var tist = TestEnum.ADD;
//// [mod1.js]
export var TestEnum = {
    ADD: "add",
    REMOVE: "remove"
};
