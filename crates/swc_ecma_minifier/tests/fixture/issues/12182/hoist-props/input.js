const logger = {
    info: () => {},
    log: (value) => console.log(value),
    warn: (value) => console.log(value),
};

logger.info("ignored");
logger.log("hoisted");
