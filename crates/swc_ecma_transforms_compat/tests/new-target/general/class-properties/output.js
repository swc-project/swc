class Foo {
    constructor(){
        _defineProperty(this, "test", function _target() {
            this.constructor;
        });
        _defineProperty(this, "test2", function() {
            void 0;
        });
        var _class;
        this.Bar = (_class = class {
            constructor(){
                _defineProperty(this, "q", void 0) // should not replace
                ;
            }
        }, _defineProperty(_class, "p", void 0), _defineProperty(_class, "p1", class {
            constructor(){
                new.target;
            }
        }) // should not replace
        , _defineProperty(_class, "p2", new function _target() {
            this.constructor;
        }()) // should not replace
        , _defineProperty(_class, "p3", function() {
            void 0;
        }) // should replace
        , _defineProperty(_class, "p4", function _target() {
            this.constructor;
        }) // should not replace
        , _class);
    }
}
