
interface ObjectConstructor {
    fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k in PropertyKey]: T };
    fromEntries(entries: Iterable<readonly any[]>): any;
}
