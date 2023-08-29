export const loopError = () => {
    const stack: number[] = [1];
    while (stack.shift() !== undefined) {
        const object = 1;
        [].map((): number => object);
    }
    const kind = 0;
    switch (kind) {
        case 0:
            break;
    }
};