// @target: es5
// In the body of a get accessor with no return type annotation,
// if a matching set accessor exists and that set accessor has a parameter type annotation,
// return expressions are contextually typed by the type given in the set accessor's parameter type annotation.
class C {
    set X(x) {
    }
    get X() {
        return "string"; // Error; get contextual type by set accessor parameter type annotation
    }
    set Y(y) {
    }
    get Y() {
        return true;
    }
    set W(w) {
    }
    get W() {
        return true;
    }
    set Z(z) {
    }
    get Z() {
        return 1;
    }
}
