const f = (...characters: Array<string>): number => characters.length;

const g = (str: string): number => f(...str);

g("meow");
