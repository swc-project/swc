"use strict";
async function a() {
    return true && (await b)();
}
