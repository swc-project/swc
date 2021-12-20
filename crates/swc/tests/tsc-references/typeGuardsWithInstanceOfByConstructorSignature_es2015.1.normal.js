var obj1;
if (obj1 instanceof A) {
    obj1.foo;
    obj1.bar;
}
var obj2;
if (obj2 instanceof A) {
    obj2.foo;
    obj2.bar;
}
var obj3;
if (obj3 instanceof B) {
    obj3.foo = 1;
    obj3.foo = "str";
    obj3.bar = "str";
}
var obj4;
if (obj4 instanceof B) {
    obj4.foo = "str";
    obj4.foo = 1;
    obj4.bar = "str";
}
var obj5;
if (obj5 instanceof C) {
    obj5.foo;
    obj5.c;
    obj5.bar1;
    obj5.bar2;
}
var obj6;
if (obj6 instanceof C) {
    obj6.foo;
    obj6.bar1;
    obj6.bar2;
}
var obj7;
if (obj7 instanceof D) {
    obj7.foo;
    obj7.bar;
}
var obj8;
if (obj8 instanceof D) {
    obj8.foo;
    obj8.bar;
}
var obj9;
if (obj9 instanceof E) {
    obj9.foo;
    obj9.bar1;
    obj9.bar2;
}
var obj10;
if (obj10 instanceof E) {
    obj10.foo;
    obj10.bar1;
    obj10.bar2;
}
var obj11;
if (obj11 instanceof F) {
    obj11.foo;
    obj11.bar;
}
var obj12;
if (obj12 instanceof F) {
    obj12.foo;
    obj12.bar;
}
var obj13;
if (obj13 instanceof G) {
    obj13.foo1;
    obj13.foo2;
}
var obj14;
if (obj14 instanceof G) {
    obj14.foo1;
    obj14.foo2;
}
var obj15;
if (obj15 instanceof H) {
    obj15.foo;
    obj15.bar;
}
var obj16;
if (obj16 instanceof H) {
    obj16.foo1;
    obj16.foo2;
}
var obj17;
if (obj17 instanceof Object) {
    obj17.foo1;
    obj17.foo2;
}
var obj18;
if (obj18 instanceof Function) {
    obj18.foo1;
    obj18.foo2;
}
