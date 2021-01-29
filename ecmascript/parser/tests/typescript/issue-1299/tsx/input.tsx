export const iteratorMapGenerator = function*<T, R>(
    values: IterableIterator<T>,
    execute: IteratorExecution<T, R>,
): IterableIterator<R> {
}