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
var Y;
(function(Y1) {
    class A {
    }
    Y1.A = A;
    class AA {
    }
    Y1.AA = AA;
    class B extends AA {
    }
    Y1.B = B;
    class BB extends A {
    }
    Y1.BB = BB;
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
    Y1.x = 12;
    function F(s) {
        return 2;
    }
    Y1.F = F;
    Y1.array = null;
    Y1.fn = (s)=>{
        return 'hello ' + s;
    };
    Y1.ol = {
        s: 'hello',
        id: 2,
        isvalid: true
    };
})(Y || (Y = {
}));
