i1_i.i1_f1(), i1_i.i1_nc_f1(), i1_i.f1(), i1_i.nc_f1(), i1_i.i1_l1(), i1_i.i1_nc_l1(), i1_i.l1(), i1_i.nc_l1();
var i1_i, i2_i, i3_i, c1_i = new class {
    i1_f1() {
    }
    i1_nc_f1() {
    }
    f1() {
    }
    nc_f1() {
    }
}();
c1_i.i1_f1(), c1_i.i1_nc_f1(), c1_i.f1(), c1_i.nc_f1(), c1_i.i1_l1(), c1_i.i1_nc_l1(), c1_i.l1(), c1_i.nc_l1(), (i1_i = c1_i).i1_f1(), i1_i.i1_nc_f1(), i1_i.f1(), i1_i.nc_f1(), i1_i.i1_l1(), i1_i.i1_nc_l1(), i1_i.l1(), i1_i.nc_l1();
class c2 {
    c2_f1() {
    }
    get c2_prop() {
        return 10;
    }
    c2_nc_f1() {
    }
    get c2_nc_prop() {
        return 10;
    }
    f1() {
    }
    get prop() {
        return 10;
    }
    nc_f1() {
    }
    get nc_prop() {
        return 10;
    }
    constructor(a){
        this.c2_p1 = a;
    }
}
var c2_i = new c2(10), c3_i = new class extends c2 {
    f1() {
    }
    get prop() {
        return 10;
    }
    nc_f1() {
    }
    get nc_prop() {
        return 10;
    }
    constructor(){
        super(10), this.p1 = super.c2_p1;
    }
}();
c2_i.c2_f1(), c2_i.c2_nc_f1(), c2_i.f1(), c2_i.nc_f1(), c3_i.c2_f1(), c3_i.c2_nc_f1(), c3_i.f1(), c3_i.nc_f1(), (c2_i = c3_i).c2_f1(), c2_i.c2_nc_f1(), c2_i.f1(), c2_i.nc_f1(), new class extends c2 {
}(10), i2_i.i2_f1(), i2_i.i2_nc_f1(), i2_i.f1(), i2_i.nc_f1(), i2_i.i2_l1(), i2_i.i2_nc_l1(), i2_i.l1(), i2_i.nc_l1(), i3_i.i2_f1(), i3_i.i2_nc_f1(), i3_i.f1(), i3_i.nc_f1(), i3_i.i2_l1(), i3_i.i2_nc_l1(), i3_i.l1(), i3_i.nc_l1(), (i2_i = i3_i).i2_f1(), i2_i.i2_nc_f1(), i2_i.f1(), i2_i.nc_f1(), i2_i.i2_l1(), i2_i.i2_nc_l1(), i2_i.l1(), i2_i.nc_l1();
