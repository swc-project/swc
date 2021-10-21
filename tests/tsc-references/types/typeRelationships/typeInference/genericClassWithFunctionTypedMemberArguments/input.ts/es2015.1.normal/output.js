// Generic functions used as arguments for function typed parameters are not used to make inferences from
// Using function arguments, no errors expected
var ImmediatelyFix;
(function(ImmediatelyFix) {
    class C {
        foo(x1) {
            return x1(null);
        }
    }
    var c = new C();
    var r = c.foo((x)=>''
    ); // {}
    var r2 = c.foo((x)=>''
    ); // string 
    var r3 = c.foo((x)=>''
    ); // {}
    class C2 {
        foo(x2) {
            return x2(null);
        }
    }
    var c2 = new C2();
    var ra = c2.foo((x)=>1
    ); // number
    var r3a = c2.foo((x)=>1
    ); // number
})(ImmediatelyFix || (ImmediatelyFix = {
}));
var WithCandidates;
(function(WithCandidates) {
    class C {
        foo2(x5, cb) {
            return cb(x5);
        }
    }
    var c;
    var r4 = c.foo2(1, function(a) {
        return '';
    }); // string, contextual signature instantiation is applied to generic functions
    var r5 = c.foo2(1, (a)=>''
    ); // string
    var r6 = c.foo2('', (a)=>1
    ); // number
    class C2 {
        foo3(x3, cb1, y) {
            return cb1(x3);
        }
    }
    var c2;
    var r7 = c2.foo3(1, (a)=>''
    , ''); // string
    var r8 = c2.foo3(1, function(a) {
        return '';
    }, ''); // string
    class C3 {
        foo3(x4, cb2, y1) {
            return cb2(x4);
        }
    }
    var c3;
    function other(t, u) {
        var r10 = c.foo2(1, (x)=>''
        ); // error
        var r10 = c.foo2(1, (x)=>''
        ); // string
        var r11 = c3.foo3(1, (x)=>''
        , ''); // error
        var r11b = c3.foo3(1, (x)=>''
        , 1); // error
        var r12 = c3.foo3(1, function(a) {
            return '';
        }, 1); // error
    }
})(WithCandidates || (WithCandidates = {
}));
