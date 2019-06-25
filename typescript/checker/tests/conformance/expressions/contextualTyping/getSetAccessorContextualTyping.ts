﻿// @target: es5
// In the body of a get accessor with no return type annotation,
// if a matching set accessor exists and that set accessor has a parameter type annotation,
// return expressions are contextually typed by the type given in the set accessor's parameter type annotation.

class C {
    set X(x: number) { }
    get X() {
        return "string";  // Error; get contextual type by set accessor parameter type annotation
    }

    set Y(y) { }
    get Y() {
        return true;
    }

    set W(w) { }
    get W(): boolean {
        return true;
    }

    set Z(z: number) { }
    get Z() {
        return 1;
    }
}