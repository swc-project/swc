class C {
    f(): void {}
    g(): this is {} { return true; }
    h(): asserts this is {} { throw ""; }
    i(): asserts this { throw ""; }
}
