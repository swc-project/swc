(function() {
    class Foo {
        constructor(){
            var _this = this;
            _define_property(this, "fn", function() {
                return console.log(_this);
            });
        }
    }
    _define_property(Foo, "fn", function() {
        return console.log(Foo);
    });
});
(function() {
    class Bar {
        constructor(){
            var _this = this;
            _define_property(this, "fn", function() {
                return console.log(_this);
            });
        }
    }
    _define_property(Bar, "fn", function() {
        return console.log(Bar);
    });
    return Bar;
});
(function() {
    class Baz {
        constructor(force1){
            var _this = this;
            _define_property(this, "fn", function() {
                return console.log(_this);
            });
            _define_property(this, "force", force);
        }
    }
    _define_property(Baz, "fn", function() {
        return console.log(Baz);
    });
});
var qux = (function() {
    class Qux {
        constructor(){
            var _this = this;
            _define_property(this, "fn", function() {
                return console.log(_this);
            });
        }
    }
    _define_property(Qux, "fn", function() {
        return console.log(Qux);
    });
}).bind(this);
