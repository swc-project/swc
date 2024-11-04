class A {
    foo = 1
    private ["bar"] = 2;

    x = 1
    public ["y"](){}

    z = 1
    public static ["w"](){}
}

class Test {
    x = 1
    public *f() {}
}

class Test2 {
    out = 'out'
    public in
    public name
}

class Test3 {
    out = 'out'
    public in: any
    name;

    x = 'x'
    public instanceof: any
    String: any
}

class Test4 {
    set: any
    a(x) {}
    get: any
    b() {}
    static: any
    c(x) {}
}
