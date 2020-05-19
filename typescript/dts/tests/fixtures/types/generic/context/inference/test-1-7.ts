type Box<T> = { value: T };

declare function map<T, U>(a: T[], f: (x: T) => U): U[];
