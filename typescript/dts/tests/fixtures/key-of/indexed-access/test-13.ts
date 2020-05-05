// Repros from #23592

type Example<T extends { [K in keyof T]: { prop: any } }> = { [K in keyof T]: T[K]["prop"] };
type Result = Example<{ a: { prop: string }; b: { prop: number } }>;

type Helper2<T> = { [K in keyof T]: Extract<T[K], { prop: any }> };
type Example2<T> = { [K in keyof Helper2<T>]: Helper2<T>[K]["prop"] };
type Result2 = Example2<{ 1: { prop: string }; 2: { prop: number } }>;
