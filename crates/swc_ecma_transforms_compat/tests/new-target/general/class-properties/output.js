class Foo {
    constructor(){
        _define_property(this, "test", function _target() {
            this instanceof _target ? this.constructor : void 0;
        });
        _define_property(this, "test2", function() {
            void 0;
        });
        var _class;
        this.Bar = (_class = class {
            constructor(){
                _define_property(this, "q", void 0) // should not replace
                ;
            }
        }, _define_property(_class, "p", void 0), _define_property(_class, "p1", class {
            constructor(){
                this.constructor;
            }
        }) // should not replace
        , _define_property(_class, "p2", new function _target() {
            this instanceof _target ? this.constructor : void 0;
        }()) // should not replace
        , _define_property(_class, "p3", function() {
            void 0;
        }) // should replace
        , _define_property(_class, "p4", function _target() {
            this instanceof _target ? this.constructor : void 0;
        }) // should not replace
        , _class);
    }
}
