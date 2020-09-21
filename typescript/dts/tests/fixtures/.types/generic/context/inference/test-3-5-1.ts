const arrayFilter = <E>(f: (x: E) => boolean) => (a: E[]) => a.filter(f);

