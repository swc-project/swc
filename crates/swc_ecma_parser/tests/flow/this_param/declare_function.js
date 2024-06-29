declare function foo1(this: string): void

declare function foo2(this: string, bar: number): void

declare function foo3(this: string, bar: number, ...rest: Array<boolean>): void

declare function foo4(this: string, ...rest: Array<boolean>): void
