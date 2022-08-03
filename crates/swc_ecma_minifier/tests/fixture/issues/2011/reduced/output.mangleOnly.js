class s {
}
module.exports = class t {
    static MyA = s;
    it() {
        this.bb = new t.MyA();
    }
};
