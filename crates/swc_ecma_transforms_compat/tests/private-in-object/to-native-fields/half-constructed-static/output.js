var _brand_check_x = new WeakSet(), _brand_check_y = new WeakSet(), _tmp, _tmp1;
class F {
    static m() {
        _brand_check_x.has(this);
        _brand_check_y.has(this);
        F === this;
    }
    static #x = (_tmp = 0, _brand_check_x.add(this), _tmp);
    static #y = (_tmp1 = (()=>{
        throw "error";
    })(), _brand_check_y.add(this), _tmp1);
    static  #z() {}
}
