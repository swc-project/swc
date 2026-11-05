({
    log: (value) => console.log(value),
}).log("direct");

({
    log: function (value) {
        console.log(value);
    },
}).log("direct function");
