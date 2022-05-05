var _brand_check_F = new WeakSet(), _brand_check_x = new WeakSet(), _brand_check_y = new WeakSet(), _tmp, _tmp1;
class F {
    m() {
        _brand_check_F.has(this);
        _brand_check_x.has(this);
        _brand_check_y.has(this);
        _brand_check_F.has(this);
    }
    get #w() {}
    #x = (_tmp = 0, _brand_check_x.add(this), _tmp);
    #y = (_tmp1 = (()=>{
        throw "error";
    })(), _brand_check_y.add(this), _tmp1);
     #z() {}
    constructor(){
        _brand_check_F.add(this);
    }
}
