import { jsx as r, Fragment as n } from "react/jsx-runtime";
var Blocks = {
    Block1: function() {
        return r(n, {
            children: "'Block1xx'"
        });
    },
    Block2: function() {
        return r(n, {
            children: "'Block2xx'"
        });
    },
    Layout1: function() {
        var r;
        return r = Blocks, [
            'Block1'
        ].map(function(n) {
            return r[n];
        });
    }
};
export function render() {
    return r(Blocks.Layout1, {});
}
