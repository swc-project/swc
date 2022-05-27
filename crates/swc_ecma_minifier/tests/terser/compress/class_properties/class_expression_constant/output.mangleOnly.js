const a = {};
a.Class1 = class {
    static foo = "constant";
};
a.Class2 = class extends Obj.Class1 {
};
new a.Class2();
