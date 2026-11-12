({
    get count () {
        return console.log("getter"), 1;
    }
}).count += 1;
