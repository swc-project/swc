// class def completely disappears
var DisappearsCompletely = class DisappearsCompletelyClass { };

// class def disappears, leaving only `new DoesntWorkClass()` as output
var DoesntWork = class DoesntWorkClass {
    static prop = new DoesntWorkClass();
}

// works fine
class WorksClass {
    static prop = new WorksClass();
};
