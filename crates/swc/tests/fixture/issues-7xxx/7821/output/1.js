function render() {
    return React.createElement(Blocks.Layout1, null);
}
var Blocks = {
    Block1: function() {
        return React.createElement(React.Fragment, null, "'Block1xx'");
    },
    Block2: function() {
        return React.createElement(React.Fragment, null, "'Block2xx'");
    },
    Layout1: function() {
        return [
            'Block1'
        ].map(function(e) {
            return Blocks[e];
        });
    }
};
export { render };
