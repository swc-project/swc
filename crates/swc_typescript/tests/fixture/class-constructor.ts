// @isolatedDeclarations: true
export class Foo {
    constructor(
        public one?: number,
        protected two?: number,
        private three?: number,
    ) { }
}


export class Bar {
    constructor(
        public a: number,
        public b: number = 1,
        public c?: number,
        public d = 1,
    ) { }
}