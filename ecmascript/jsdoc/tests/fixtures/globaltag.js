/**
    @global
    @constructor
 */
window.Bar = new Function('', a, b, c);

(function() {

    /** @global */
    var foo;

    foo = 'hello foo';

    this.foo = foo;

}).apply(window);