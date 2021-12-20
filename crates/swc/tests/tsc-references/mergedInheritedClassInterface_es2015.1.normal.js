class BaseClass {
    baseMethod() {
    }
}
class Child extends BaseClass {
    method() {
    }
}
class ChildNoBaseClass {
    method2() {
    }
}
class Grandchild extends ChildNoBaseClass {
}
// checks if properties actually were merged
var child;
child.required;
child.optional;
child.additional;
child.baseNumber;
child.classNumber;
child.baseMethod();
child.method();
var grandchild;
grandchild.required;
grandchild.optional;
grandchild.additional2;
grandchild.classString;
grandchild.method2();
