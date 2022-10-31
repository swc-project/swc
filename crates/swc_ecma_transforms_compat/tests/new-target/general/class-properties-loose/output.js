class Foo {
    constructor(){
        this.test = function _target() {
            this instanceof _target ? this.constructor : void 0;
        };
        this.test2 = function() {
            void 0;
        };
        var _class;
        this.Bar = (_class = class {
            constructor(){
                this.q = void 0 // should not replace
                ;
            }
        }, _class.p = void 0, _class.p1 = class {
            constructor(){
                this.constructor;
            }
        } // should not replace
        , _class.p2 = new function _target() {
            this instanceof _target ? this.constructor : void 0;
        }() // should not replace
        , _class.p3 = function() {
            void 0;
        } // should replace
        , _class.p4 = function _target() {
            this instanceof _target ? this.constructor : void 0;
        } // should not replace
        , _class);
    }
}
