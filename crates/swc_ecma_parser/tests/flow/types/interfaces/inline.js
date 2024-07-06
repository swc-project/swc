type A = interface { p: string }
type B = interface extends A { q: number }

function f(o: interface) {}
