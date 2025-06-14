//// [neverReturningFunctions1.ts]
import "@swc/helpers/_/_call_super";
import "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_get";
import "@swc/helpers/_/_get_prototype_of";
import "@swc/helpers/_/_inherits";
registerComponent('test-component', {
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
            type: 'string'
        },
        num: 0
    },
    init: function() {
        this.data.num = 0, this.el.setAttribute('custom-attribute', 'custom-value');
    },
    update: function() {},
    tick: function() {},
    remove: function() {},
    pause: function() {},
    play: function() {},
    multiply: function(f) {
        return f * this.data.num * this.system.data.counter;
    }
});
