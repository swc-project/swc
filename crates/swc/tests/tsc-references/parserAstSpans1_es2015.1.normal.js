/** i1 is interface with properties*/ class c1 {
    i1_f1() {}
    i1_nc_f1() {}
    /** c1_f1*/ f1() {}
    /** c1_nc_f1*/ nc_f1() {}
}
var i1_i;
i1_i.i1_f1();
i1_i.i1_nc_f1();
i1_i.f1();
i1_i.nc_f1();
i1_i.i1_l1();
i1_i.i1_nc_l1();
i1_i.l1();
i1_i.nc_l1();
var c1_i = new c1();
c1_i.i1_f1();
c1_i.i1_nc_f1();
c1_i.f1();
c1_i.nc_f1();
c1_i.i1_l1();
c1_i.i1_nc_l1();
c1_i.l1();
c1_i.nc_l1();
// assign to interface
i1_i = c1_i;
i1_i.i1_f1();
i1_i.i1_nc_f1();
i1_i.f1();
i1_i.nc_f1();
i1_i.i1_l1();
i1_i.i1_nc_l1();
i1_i.l1();
i1_i.nc_l1();
class c2 {
    /** c2 c2_f1*/ c2_f1() {}
    /** c2 c2_prop*/ get c2_prop() {
        return 10;
    }
    c2_nc_f1() {}
    get c2_nc_prop() {
        return 10;
    }
    /** c2 f1*/ f1() {}
    /** c2 prop*/ get prop() {
        return 10;
    }
    nc_f1() {}
    get nc_prop() {
        return 10;
    }
    /** c2 constructor*/ constructor(a){
        this.c2_p1 = a;
    }
}
class c3 extends c2 {
    /** c3 f1*/ f1() {}
    /** c3 prop*/ get prop() {
        return 10;
    }
    nc_f1() {}
    get nc_prop() {
        return 10;
    }
    constructor(){
        super(10);
        this.p1 = super.c2_p1;
    }
}
var c2_i = new c2(10);
var c3_i = new c3();
c2_i.c2_f1();
c2_i.c2_nc_f1();
c2_i.f1();
c2_i.nc_f1();
c3_i.c2_f1();
c3_i.c2_nc_f1();
c3_i.f1();
c3_i.nc_f1();
// assign
c2_i = c3_i;
c2_i.c2_f1();
c2_i.c2_nc_f1();
c2_i.f1();
c2_i.nc_f1();
class c4 extends c2 {
}
var c4_i = new c4(10);
var i2_i;
var i3_i;
i2_i.i2_f1();
i2_i.i2_nc_f1();
i2_i.f1();
i2_i.nc_f1();
i2_i.i2_l1();
i2_i.i2_nc_l1();
i2_i.l1();
i2_i.nc_l1();
i3_i.i2_f1();
i3_i.i2_nc_f1();
i3_i.f1();
i3_i.nc_f1();
i3_i.i2_l1();
i3_i.i2_nc_l1();
i3_i.l1();
i3_i.nc_l1();
// assign to interface
i2_i = i3_i;
i2_i.i2_f1();
i2_i.i2_nc_f1();
i2_i.f1();
i2_i.nc_f1();
i2_i.i2_l1();
i2_i.i2_nc_l1();
i2_i.l1();
i2_i.nc_l1();
/**c5 class*/ class c5 {
}
class c6 extends c5 {
    constructor(){
        super();
        this.d = super.b;
    }
}
