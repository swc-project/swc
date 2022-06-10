class a {
}
module.exports = class b {
    static MyA = a;
    it() {
        this.bb = new b.MyA();
    }
};
