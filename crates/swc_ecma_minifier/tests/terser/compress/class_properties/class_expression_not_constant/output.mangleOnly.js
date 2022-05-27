const a = {};
leak();
a.Class1 = class {
    static foo = leak();
};
a.Class2 = class extends Obj.Class1 {
};
new a.Class2();
