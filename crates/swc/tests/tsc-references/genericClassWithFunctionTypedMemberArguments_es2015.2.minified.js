var ImmediatelyFix, WithCandidates;
!function(ImmediatelyFix) {
    var c = new class {
        foo(x) {
            return x(null);
        }
    }();
    c.foo((x)=>''), c.foo((x)=>''), c.foo((x)=>'');
    var c2 = new class {
        foo(x) {
            return x(null);
        }
    }();
    c2.foo((x)=>1), c2.foo((x)=>1);
}(ImmediatelyFix || (ImmediatelyFix = {})), function(WithCandidates) {
    var c, c2;
    c.foo2(1, function(a) {
        return '';
    }), c.foo2(1, (a)=>''), c.foo2('', (a)=>1), c2.foo3(1, (a)=>'', ''), c2.foo3(1, function(a) {
        return '';
    }, '');
}(WithCandidates || (WithCandidates = {}));
