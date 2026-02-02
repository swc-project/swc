declare const obj: Record<string, number>;
declare function foo(val?: string): number;
declare let x: number;

enum Getter {
	f = obj.prop,
}

enum Call {
	f = foo(),
}

enum Incr {
	f = x++,
}

enum Arithmetics {
	f = x + 1,
}

enum Combined {
	a = obj.prop,
	b = foo(),
	c = x++,
	d = x + 1,
}

enum WithPure {
	a = 1,
	f = foo(),
}
