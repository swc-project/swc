// @target: es2022
// @noEmitHelpers: true
// @noTypesAndSymbols: true

class A {}
class B extends A {
	public constructor() {
		'inject';
		super();
		const a = 1;
		const b = 1;
	}

	@foo
	       m()       {}
}

function foo(method     , _context     )      {
	return function (         ) {
		method.call(this);
	};
}

new B();

// https://github.com/microsoft/TypeScript/issues/53448
class C {
	public constructor() {
		this.val;
	}

	@foo
	       get val()         { return 3; }
}
class D extends A {
	public constructor() {
		super();
		this.val;
	}

	@foo
	       get val()         { return 3; }
}
