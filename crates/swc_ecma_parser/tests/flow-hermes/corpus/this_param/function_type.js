type foo1 = (this: string) => void;

type foo2 = (this: string, bar: number) => void;

type foo3 = (this: string, bar: number, ...rest: Array<boolean>) => void;

type foo4 = (this: string, ...rest: Array<boolean>) => void;
