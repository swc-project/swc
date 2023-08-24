var Blocks = {
    Block1: function() {
        return /*#__PURE__*/ React.createElement(React.Fragment, null, "'Block1xx'");
    },
    Block2: function() {
        return /*#__PURE__*/ React.createElement(React.Fragment, null, "'Block2xx'");
    },
    Layout1: function() {
        // In the final code, Blocks does not have a 'Block1' key
        return [
            "Block1"
        ].map(function(e) {
            return Blocks[e];
        });
    }
};
export function render() {
    return /*#__PURE__*/ React.createElement(Blocks.Layout1, null);
}
