// The class is unused. Only the side effects of its static auto-accessor
// initializer and computed key must be kept.
bar(), foo();
// The initializer refers to the class, so the class must be kept.
class D {
    static accessor cache = D.value = foo();
}
