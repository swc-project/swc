function getFirstElement<T>(array: T[]): T | null {
    return array.length > 0 ? array[0] : null;
}

let myFunction = getFirstElement<number> as any;
