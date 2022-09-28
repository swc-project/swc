const s = {};
s.Class1 = class {
    static foo = "constant";
};
s.Class2 = class extends Obj.Class1 {
};
new s.Class2();
