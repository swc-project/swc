const config = {
    error: (function() {}).bind()
};
config.error("boom");
(function(handler) {
    handler("also safe");
})((function() {}).bind());
const source = (function() {}).toString();
process.stdout.write(typeof config.error + ":" + typeof source + "\n");
