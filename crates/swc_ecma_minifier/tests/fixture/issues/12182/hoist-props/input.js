const logger = {
    info: () => {},
    log: (value) => console.log(value),
    warn: (value) => console.log(value),
    plain: function (value) {
        console.log(value);
    },
};

logger.info("ignored");
logger.log("hoisted");
logger["warn"]("computed");
logger.plain("plain function");
