(function(A) {
    class A1 {
    }
    class AA {
    }
    class B extends AA {
    }
    class BB extends A1 {
    }
    var Module;
    (function(Module) {
        class A {
        }
    })(Module || (Module = {
    }));
    var Color1;
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color1 || (Color1 = {
    }));
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
})(A || (A = {
}));
var Y1;
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
    (function(Module) {
        class A {
        }
    })(Module || (Module = {
    }));
    (function(Color) {
        Color[Color["Blue"] = 0] = "Blue";
        Color[Color["Red"] = 1] = "Red";
    })(Color || (Color = {
    }));
    Y.x = 12;
    function F(s) {
        return 2;
    }
    Y.F = F;
    Y.array = null;
    Y.fn = (s)=>{
        return 'hello ' + s;
    };
    Y.ol = {
        s: 'hello',
        id: 2,
        isvalid: true
    };
})(Y1 || (Y1 = {
}));
