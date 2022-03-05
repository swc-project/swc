import * as swcHelpers from "@swc/helpers";
swcHelpers.asyncToGenerator(function*(i) {
    return yield someOtherFunction(i);
}), swcHelpers.asyncToGenerator(function*(i) {
    return yield someOtherFunction(i);
});
