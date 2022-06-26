var A;
(function(A) {
    class A1 {
    }
    class AA {
    }
    class B extends AA {
    }
    class BB extends A1 {
    }
    let Module;
    (function(Module) {
        class A {
        }
    })(Module || (Module = {}));
    let Color;
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color || (Color = {}));
    var x = 12;
    function F(s) {
        return 2;
    }
    var array = null;
    var fn = (s)=>{
        return 'hello ' + s;
    };
    var ol = {
        s: 'hello',
        id: 2,
        isvalid: true
    };
})(A || (A = {}));
var Y;
(function(Y) {
    class A {
    }
    Y.A = A;
    class AA {
    }
    Y.AA = AA;
    class B extends AA {
    }
    Y.B = B;
    class BB extends A {
    }
    Y.BB = BB;
    let Module;
    (function(Module) {
        class A {
        }
    })(Module = Y.Module || (Y.Module = {}));
    let Color;
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color = Y.Color || (Y.Color = {}));
    var x = Y.x = 12;
    function F(s) {
        return 2;
    }
    Y.F = F;
    var array = Y.array = null;
    var fn = Y.fn = (s)=>{
        return 'hello ' + s;
    };
    var ol = Y.ol = {
        s: 'hello',
        id: 2,
        isvalid: true
    };
})(Y || (Y = {}));
