//// [typeGuardsWithInstanceOfByConstructorSignature.ts]
var obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, obj10, obj11, obj12, obj13, obj14, obj15, obj16, obj17, obj18;
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
if (_instanceof(obj1, A)) {
    obj1.foo;
    obj1.bar;
}
if (_instanceof(obj2, A)) {
    obj2.foo;
    obj2.bar;
}
if (_instanceof(obj3, B)) {
    obj3.foo = 1;
    obj3.foo = "str";
    obj3.bar = "str";
}
if (_instanceof(obj4, B)) {
    obj4.foo = "str";
    obj4.foo = 1;
    obj4.bar = "str";
}
if (_instanceof(obj5, C)) {
    obj5.foo;
    obj5.c;
    obj5.bar1;
    obj5.bar2;
}
if (_instanceof(obj6, C)) {
    obj6.foo;
    obj6.bar1;
    obj6.bar2;
}
if (_instanceof(obj7, D)) {
    obj7.foo;
    obj7.bar;
}
if (_instanceof(obj8, D)) {
    obj8.foo;
    obj8.bar;
}
if (_instanceof(obj9, E)) {
    obj9.foo;
    obj9.bar1;
    obj9.bar2;
}
if (_instanceof(obj10, E)) {
    obj10.foo;
    obj10.bar1;
    obj10.bar2;
}
if (_instanceof(obj11, F)) {
    obj11.foo;
    obj11.bar;
}
if (_instanceof(obj12, F)) {
    obj12.foo;
    obj12.bar;
}
if (_instanceof(obj13, G)) {
    obj13.foo1;
    obj13.foo2;
}
if (_instanceof(obj14, G)) {
    obj14.foo1;
    obj14.foo2;
}
if (_instanceof(obj15, H)) {
    obj15.foo;
    obj15.bar;
}
if (_instanceof(obj16, H)) {
    obj16.foo1;
    obj16.foo2;
}
if (_instanceof(obj17, Object)) {
    obj17.foo1;
    obj17.foo2;
}
if (_instanceof(obj18, Function)) {
    obj18.foo1;
    obj18.foo2;
}
