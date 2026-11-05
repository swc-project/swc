class A {
    constructor() {}
    static "constructor"() {}
}

(class { static *constructor() { yield 42; } });
(class { static async constructor() { return 42; } });
(class { static async *constructor() { yield 42; } });
(class {
    static get constructor() { return 42; }
    static set constructor(value) {}
});
(class { static ["constructor"]() {} });
