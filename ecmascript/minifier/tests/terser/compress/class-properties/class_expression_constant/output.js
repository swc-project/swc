const obj = {
    Class1: class {
        static foo = "constant";
    },
};
obj.Class2 = class extends Obj.Class1 {};
new obj.Class2();
