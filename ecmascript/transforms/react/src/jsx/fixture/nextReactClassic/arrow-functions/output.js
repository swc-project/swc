var foo = function() {
    return (function() {
        return React.createElement(this, null);
    }).bind(this);
};
var bar = function() {
    return (function() {
        return React.createElement(this.foo, null);
    }).bind(this);
};
