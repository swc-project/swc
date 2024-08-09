class Base {
    a = 1;
    constructor(x        , y         , z         );
    constructor(x        , y         );
    constructor(x        ) { this.a = x; }
}

class Derived extends Base {
    x = 1
    y = 'hello';
}

var r = new Derived(); // error
var r2 = new Derived(1); 
var r3 = new Derived(1, 2);
var r4 = new Derived(1, 2, 3);

class Base2    {
    a   ;
    constructor(x   , y    , z    );
    constructor(x   , y    );
    constructor(x   ) { this.a = x; }
}

class D                 extends Base2    {
    x = 2
    y    = null;
}

var d = new D(); // error
var d2 = new D(new Date()); // ok
var d3 = new D(new Date(), new Date());
var d4 = new D(new Date(), new Date(), new Date());