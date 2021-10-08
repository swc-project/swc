var _brand_check_x = new WeakSet(), _brand_check_A = new WeakSet();
class A {
    #x = void _brand_check_x.add(this);
     #m() {
    }
    test() {
        _brand_check_x.has(this);
        _brand_check_A.has(this);
        _brand_check_x.has(this);
        _brand_check_A.has(this);
    }
    constructor(){
        _brand_check_A.add(this);
    }
}
