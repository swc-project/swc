type X1<T extends any[]> =
    T extends [infer U extends string] ? ["string", U] :
    T extends [infer U extends number] ? ["number", U] :
    never;

type X2<T extends (...args: any[]) => void> =
    T extends (a: infer U extends string) => void ? ["string", U] :
    T extends (a: infer U extends number) => void ? ["number", U] :
    never;

type X3<T extends (...args: any[]) => any> =
    T extends (...args: any[]) => (infer U extends string) ? ["string", U] :
    T extends (...args: any[]) => (infer U extends number) ? ["number", U] :
    never;

type X4<T extends new (...args: any[]) => any> =
    T extends new (...args: any[]) => (infer U extends { a: string }) ? ["string", U] :
    T extends new (...args: any[]) => (infer U extends { a: number }) ? ["number", U] :
    never;

type X5<T> =
    T extends Promise<infer U extends string> ? ["string", U] :
    T extends Promise<infer U extends number> ? ["number", U] :
    never;

type X6<T> =
    T extends { a: infer U extends string } ? ["string", U] :
    T extends { a: infer U extends number } ? ["number", U] :
    never;
