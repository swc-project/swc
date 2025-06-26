// class def completely disappears
var DisappearsCompletely = class DisappearsCompletelyClass { };

// class def disappears, leaving only `new DoesntWorkClass()` as output
var DoesntWork = class DoesntWorkClass {
    static prop = new DoesntWorkClass();
};

// Extra test case

(class ClassExpr {
    static prop = new ClassExpr();
});


// works fine
class WorksClass {
    static prop = new WorksClass();
};
