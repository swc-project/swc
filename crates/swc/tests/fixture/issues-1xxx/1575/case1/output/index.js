import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
Vue.component("test", {
    methods: {
        onSend: function onSend() {
            return _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    if (this.msg === "") {}
                    return [
                        2
                    ];
                });
            }).apply(this);
        }
    }
});
