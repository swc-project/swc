class A {
    constructor(options){
        console.log(options);
    }
}
export class B extends A {
    constructor(options){
        let { a } = options, b = [
            a = a || "test"
        ];
        super({
            a,
            b
        });
    }
}
new B({});
