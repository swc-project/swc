class ClassA {}

module.exports = class ClassB {
    static MyA = ClassA;

    it() {
        this.bb = new ClassB.MyA();
    }
};
