import * as swcHelpers from "@swc/helpers";
class X {
    constructor(){
        swcHelpers.classStaticPrivateMethodGet(X, X, m).call(X);
    }
}
function m() {
    return swcHelpers.classStaticPrivateMethodGet({}, X, m).call(X), 1;
}
swcHelpers.classStaticPrivateMethodGet(X, X, m).call(X);
