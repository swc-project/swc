type Bare = (T) => void;
type Qualified = (NS.T) => void;
type GenericNamed = <T>(x: T) => void;
type GenericAnon = <T>(Array<T>) => void;
type Named = (x: T) => void;
type NamedQualified = (x: number, y: NS.T) => void;
type Optional = (x: number, y?: T) => void;
type GenericOptional = <T>(x?: T) => void;
type NamedRest = (x: number, ...rest: Array<T>) => void;
type GenericNamedRest = <T>(...rest: T[]) => void;
type KeywordNamed = <T>(string: T, type: T) => void;
function f(T) {}
