interface Foo {
    (x: 'a'): number;
    (x: string): any;

    new (x: 'a'): any;
    new (x: string): Object;
}

var f: Foo;
var r = f('a');
var r2 = f('A');
var r3 = new f('a');
var r4 = new f('A');
