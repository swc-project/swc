class A {
}
class B {
}
class C {
}
class D {
}
function namedClasses(x) {
    if ("a" in x) {
        x.a = "1";
    } else {
        x.b = 1;
    }
}
function multipleClasses(x) {
    if ("a" in x) {
        let y = x.a;
    } else {
        let z = x.b;
    }
}
function anonymousClasses(x) {
    if ("a" in x) {
        let y = x.a;
    } else {
        let z = x.b;
    }
}
class AWithOptionalProp {
}
class BWithOptionalProp {
}
function positiveTestClassesWithOptionalProperties(x) {
    if ("a" in x) {
        x.a = "1";
    } else {
        const y = x instanceof AWithOptionalProp ? x.a : x.b;
    }
}
function inParenthesizedExpression(x) {
    if ("a" in x) {
        let y = x.a;
    } else {
        let z = x.b;
    }
}
class ClassWithUnionProp {
}
function inProperty(x) {
    if ("a" in x.prop) {
        let y = x.prop.a;
    } else {
        let z = x.prop.b;
    }
}
class NestedClassWithProp {
}
function innestedProperty(x) {
    if ("a" in x.outer.prop) {
        let y = x.outer.prop.a;
    } else {
        let z = x.outer.prop.b;
    }
}
class InMemberOfClass {
    inThis() {
        if ("a" in this.prop) {
            let y = this.prop.a;
        } else {
            let z = this.prop.b;
        }
    }
}
// added for completeness
class SelfAssert {
    inThis() {
        if ("a" in this) {
            let y = this.a;
        } else {
        }
    }
}
function f(i) {
    if ("a" in i) {
        return i.a;
    } else if ("b" in i) {
        return i.b;
    }
    return "c" in i && i.c;
}
