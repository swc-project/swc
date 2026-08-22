const config = { error: console.error.bind(console) };
config.error("boom");

(function (handler) {
    handler("also safe");
})(console.error.bind(console));

const source = console.log.toString();
process.stdout.write(typeof config.error + ":" + typeof source + "\n");
