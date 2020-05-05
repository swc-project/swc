// Repro from #13285

function updateIds<T extends Record<K, string>, K extends string>(
    obj: T,
    idFields: K[],
    idMapping: Partial<Record<T[K], T[K]>>
): Record<K, string> {
    for (const idField of idFields) {
        const newId: T[K] | undefined = idMapping[obj[idField]];
        if (newId) {
            obj[idField] = newId;
        }
    }
    return obj;
}
