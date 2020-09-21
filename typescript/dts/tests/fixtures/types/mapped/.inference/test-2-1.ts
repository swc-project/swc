// Repro from #29765

function getProps<T, K extends keyof T>(obj: T, list: K[]): Pick<T, K> {
    return {} as any;
}