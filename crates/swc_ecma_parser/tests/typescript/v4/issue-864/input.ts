type Strings = [string, string];
type Numbers = [number, number];

// [string, string, number, number]
type StrStrNumNum = [...Strings, ...Numbers]; // works now