import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
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
