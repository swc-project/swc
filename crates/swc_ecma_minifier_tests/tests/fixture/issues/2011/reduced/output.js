module.exports = class ClassB {
    static MyA = class {
    };
    it() {
        this.bb = new ClassB.MyA();
    }
};
