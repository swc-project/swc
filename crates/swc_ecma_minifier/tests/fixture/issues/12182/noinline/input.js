const logger = {
    log: (value) => console.log(value),
};

/*#__NOINLINE__*/ logger.log("variable noinline");

const directResult = /*#__NOINLINE__*/ {
    log: (value) => console.log(value),
}.log("direct noinline");
