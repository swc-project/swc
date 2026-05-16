var Blocks = {
    Block1: function() {
        return React.createElement(React.Fragment, null, "'Block1xx'");
    },
    Block2: function() {
        return React.createElement(React.Fragment, null, "'Block2xx'");
    },
    Layout1: function() {
        return function(e, t) {
            return t.map(function(t) {
                return e[t];
            });
        }(Blocks, [
            'Block1'
        ]);
    }
};
export function render() {
    return React.createElement(Blocks.Layout1, null);
}
