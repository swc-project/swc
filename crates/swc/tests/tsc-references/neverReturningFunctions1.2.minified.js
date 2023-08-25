//// [neverReturningFunctions1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
registerComponent("test-component", {
    schema: {
        myProperty: {
            default: [],
            parse: function() {
                return [
                    !0
                ];
            }
        },
        string: {
            type: "string"
        },
        num: 0
    },
    init: function() {
        this.data.num = 0, this.el.setAttribute("custom-attribute", "custom-value");
    },
    update: function() {},
    tick: function() {},
    remove: function() {},
    pause: function() {},
    play: function() {},
    multiply: function(f) {
        // Reference to system because both were registered with the same name.
        return f * this.data.num * this.system.data.counter;
    }
});
