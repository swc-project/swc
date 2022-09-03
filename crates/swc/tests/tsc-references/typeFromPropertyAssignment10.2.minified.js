//// [module.js]
var Outer = Outer || {};
Outer.app = Outer.app || {};
//// [someview.js]
Outer.app.SomeView = function() {}, Outer.app.Inner = class {
    constructor(){
        this.y = 12;
    }
};
var example = new Outer.app.Inner();
example.y, Outer.app.statische = function(k) {
    return Math.pow(k, k);
};
//// [application.js]
Outer.app.Application = function() {
    var me = this;
    me.view = new Outer.app.SomeView();
};
//// [main.js]
var x, app = new Outer.app.Application(), inner = new Outer.app.Inner();
inner.y, x.y, Outer.app.statische(101);
