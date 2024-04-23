//// [noInfer.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
foo1('foo', 'foo'), foo1('foo', 'bar'), foo2('foo', [
    'bar'
]), foo3('foo', [
    'bar'
]), foo4('foo', {
    x: 'bar'
}), foo5('foo', {
    x: 'bar'
}), doSomething(new Animal(), function() {
    return new Animal();
}), doSomething(new Animal(), function() {
    return new Dog();
}), doSomething(new Dog(), function() {
    return new Animal();
}), assertEqual({
    x: 1
}, {
    x: 3
}), assertEqual({
    x: 3,
    y: 2
}, {
    x: 3
}), invoke(test, {
    x: 1,
    y: 2
}), test({
    x: 1,
    y: 2
}), doWork(comp, {
    foo: 42
}), doWork(comp, {}), mutate(function(a, b) {
    return b;
});
