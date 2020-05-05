const arrayFilter = <T>(f: (x: T) => boolean) => (a: T[]) => a.filter(f);

const f30: (a: string[]) => string[] = arrayFilter(x => x.length > 10);
