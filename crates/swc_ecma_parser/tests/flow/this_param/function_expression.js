(function foo1(this: string) {});

(function foo2(this: string, bar: number) {});

(function foo3(this: string, bar: number, ...rest: Array<boolean>) {});

(function foo4(this: string, ...rest: Array<boolean>) {});
