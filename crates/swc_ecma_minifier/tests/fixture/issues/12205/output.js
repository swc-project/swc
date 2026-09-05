!async function() {
    return {
        then (resolve) {
            console.log("async-function"), resolve();
        }
    };
}(), (async ()=>({
        then (resolve) {
            console.log("async-arrow"), resolve();
        }
    }))();
