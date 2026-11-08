//// [module.js]
var Outer = Outer || {};
Outer.app = Outer.app || {};
//// [someview.js]
Outer.app.SomeView = function() {}, Outer.app.Inner = class {
    constructor(){
        this.y = 12;
    }
}, new Outer.app.Inner().y, Outer.app.statische = function(k) {
    return Math.pow(k, k);
};
//// [application.js]
Outer.app.Application = function() {
    this.view = new Outer.app.SomeView();
};
//// [main.js]
new Outer.app.Application(), new Outer.app.Inner().y, (void 0).y, Outer.app.statische(101);
