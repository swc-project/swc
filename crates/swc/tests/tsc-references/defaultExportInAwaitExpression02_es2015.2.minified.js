import * as swcHelpers from "@swc/helpers";
const x = new Promise((resolve, reject)=>{
    resolve({});
});
export default x;
swcHelpers.asyncToGenerator(function*() {
    yield x;
})();
