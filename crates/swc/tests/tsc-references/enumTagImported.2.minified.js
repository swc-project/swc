//// [type.js]
//// [value.js]
import { TestEnum } from "./mod1";
TestEnum.ADD;
//// [mod1.js]
export var TestEnum = {
    ADD: 'add',
    REMOVE: 'remove'
};
