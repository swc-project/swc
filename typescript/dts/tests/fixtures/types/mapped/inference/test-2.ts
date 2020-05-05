// Repro from #29765

function getProps<T, K extends keyof T>(obj: T, list: K[]): Pick<T, K> {
    return {} as any;
}

const myAny: any = {};

const o1 = getProps(myAny, ['foo', 'bar']);

const o2: { foo: any; bar: any } = getProps(myAny, ['foo', 'bar']);
