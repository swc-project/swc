import * as swcHelpers from "@swc/helpers";
const obj = {
    // A comment
    foo () {
        return swcHelpers.asyncToGenerator(function*() {
            console.log("Should work");
        })();
    }
};
