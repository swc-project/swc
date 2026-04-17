/* @flow */ export var tasks = function tasks(config) {
    return {
        assemble: function assemble() {
            for(var _len = arguments.length, gradleArgs = new Array(_len), _key = 0; _key < _len; _key++){
                gradleArgs[_key] = arguments[_key];
            }
            return {
                run: 1
            };
        }
    };
};
