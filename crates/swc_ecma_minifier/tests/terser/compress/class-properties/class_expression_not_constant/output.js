const obj = {};
leak();
obj.Class1 = class {
    static foo = leak();
};
obj.Class2 = class extends Obj.Class1 {};
new obj.Class2();
