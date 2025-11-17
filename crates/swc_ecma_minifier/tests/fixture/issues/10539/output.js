// class def disappears, leaving only `new DoesntWorkClass()` as output
// class def completely disappears
(class DoesntWorkClass {
    static prop = new DoesntWorkClass();
});
// works fine
class WorksClass {
    static prop = new WorksClass();
}
