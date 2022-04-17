import * as swcHelpers from "@swc/helpers";
let x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
swcHelpers.asyncToGenerator(function*() {
    yield x;
})();
