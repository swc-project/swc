require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
async function a() {
    await Promise.resolve();
}
console.log(typeof a);
