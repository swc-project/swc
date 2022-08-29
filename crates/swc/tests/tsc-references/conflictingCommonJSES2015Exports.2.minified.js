//// [bug24934.js]
export function abc() {
    return 5;
}
module.exports = {
    abc: abc
};
//// [use.js]
import { abc } from "./bug24934";
abc(1, 2, 3);
