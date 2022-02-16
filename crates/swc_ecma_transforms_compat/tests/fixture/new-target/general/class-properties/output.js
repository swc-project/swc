class Foo {
    constructor(){
        _defineProperty(this, "test", function _target() {
            this.constructor;
        });
        _defineProperty(this, "test2", function() {
            void 0;
        });
        this.Bar = (function _target() {
            class _class {
                constructor(){
                    _defineProperty(this, "q", void 0);
                }
            }
            _defineProperty(_class, "p", void 0);
            _defineProperty(_class, "p1", class _class {
                constructor(){
                    this.constructor;
                }
            });
            _defineProperty(_class, "p2", new function _target() {
                this.constructor;
            });
            _defineProperty(_class, "p3", function() {
                void 0;
            });
            _defineProperty(_class, "p4", function _target() {
                this.constructor;
            });
            return _class;
        })();
    }
}
