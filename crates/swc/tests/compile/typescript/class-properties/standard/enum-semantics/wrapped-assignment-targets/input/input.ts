enum WrappedTargets {
    A = 1,
    Grouped = ((A) = 3),
    Typed = ((A as any) = 5),
    Compound = (((A as any)) += 2),
    Destructured = (() => {
        [(A)] = [11];
        ({ value: (A as any) } = { value: 13 });
        return Reflect.get(WrappedTargets, "A");
    })(),
}

enum ReceiverReads {
    Index = 0,
    Result = (() => {
        const values = [{ value: 1 }];
        (values[Index].value) = 8;
        ((values[Index].value) as number) += 2;
        return values[0].value;
    })(),
}
