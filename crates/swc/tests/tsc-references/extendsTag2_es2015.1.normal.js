// @allowJs: true
// @checkJs: true
// @target: esnext
// @outDir: out
// @Filename: foo.js
/**
 * @constructor
 */ class A {
    constructor(){}
}
/**
 * @constructor
 */ /**
 * @extends {A}
 */ /**
 * @constructor
 */ class B extends A {
    constructor(){
        super();
    }
}
