var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
Vue.component("test", {
    methods: {
        onSend: function onSend() {
            return _async_to_generator._(function() {
                return _ts_generator._(this, function(_state) {
                    if (this.msg === "") {}
                    return [
                        2
                    ];
                });
            }).apply(this);
        }
    }
});
