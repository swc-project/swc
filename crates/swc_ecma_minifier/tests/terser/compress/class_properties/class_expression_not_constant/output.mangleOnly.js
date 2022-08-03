const s = {};
leak();
s.Class1 = class {
    static foo = leak();
};
s.Class2 = class extends Obj.Class1 {
};
new s.Class2();
