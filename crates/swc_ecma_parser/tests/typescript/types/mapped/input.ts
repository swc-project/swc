let map: { [P in string]: number; };
let map: { readonly [P in string]?: number; };
let map: { +readonly [P in string]+?: number; };
let map: { -readonly [P in string]-?: number };
let map: { [P in string as string]: number };
