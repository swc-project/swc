(async function () {
    return {
        then(resolve) {
            console.log("async-function");
            resolve();
        },
    };
})();

(async () => ({
    then(resolve) {
        console.log("async-arrow");
        resolve();
    },
}))();

(function () {
    return {
        then() {
            console.log("sync-function");
        },
    };
})();

(() => ({
    then() {
        console.log("sync-arrow");
    },
}))();
