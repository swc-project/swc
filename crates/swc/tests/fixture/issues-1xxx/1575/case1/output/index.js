import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import regeneratorRuntime from "regenerator-runtime";
Vue.component("test", {
    methods: {
        onSend: function onSend() {
            return _async_to_generator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_ctx) {
                    while(1)switch(_ctx.prev = _ctx.next){
                        case 0:
                            if (this.msg === "") {}
                        case 1:
                        case "end":
                            return _ctx.stop();
                    }
                }, _callee, this);
            })).apply(this);
        }
    }
});
