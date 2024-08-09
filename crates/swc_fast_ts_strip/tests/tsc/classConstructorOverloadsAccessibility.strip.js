// @declaration: true

class A {
	public constructor(a         ) // error
	protected constructor(a        ) // error
	private constructor(a        )
	private constructor() { 
		
	}
}

class B {
	protected constructor(a        ) // error
	constructor(a        )
	constructor() { 
		
	}
}

class C {
	protected constructor(a        )
	protected constructor(a        )
	protected constructor() { 
		
	}
}

class D {
	constructor(a        )
	constructor(a        )
	public constructor() { 
		
	}
}