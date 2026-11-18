// The class is unused. Only the side effects of its static auto-accessor
// initializer and computed key must be kept.
class C {
    static set(x) {
        C.value = x;
    }
    static accessor cache = foo();
    accessor [bar()] = 1;
}

// The initializer refers to the class, so the class must be kept.
class D {
    static accessor cache = (D.value = foo());
}
