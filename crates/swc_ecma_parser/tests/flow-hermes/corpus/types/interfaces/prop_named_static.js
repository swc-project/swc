// OK: static is a valid identifier name
interface A { static: number }
interface B { static?: number }
interface C { static(): void } // method named static
interface D { static<X>(x: X): X } // poly method named static
