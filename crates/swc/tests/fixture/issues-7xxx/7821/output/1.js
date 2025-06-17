var Blocks = {
    Block1: function() {
        return /*#__PURE__*/ React.createElement(React.Fragment, null, "'Block1xx'");
    },
    Block2: function() {
        return /*#__PURE__*/ React.createElement(React.Fragment, null, "'Block2xx'");
    },
    Layout1: function() {
        var e;
        return e = Blocks, [
            'Block1'
        ].map(function(t) {
            return e[t];
        });
    }
};
export function render() {
    return /*#__PURE__*/ React.createElement(Blocks.Layout1, null);
}
