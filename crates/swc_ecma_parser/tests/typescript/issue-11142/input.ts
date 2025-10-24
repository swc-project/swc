// Test case for issue #11142: Non-null assertion in destructuring assignment

// Original issue case: array element swapping with non-null assertions
let arrayCopy = [1, 2, 3];
let currentIndex = 0;
let randomIndex = 1;
[arrayCopy[currentIndex]!, arrayCopy[randomIndex]!] = [arrayCopy[randomIndex]!, arrayCopy[currentIndex]!];

// Simple non-null assertion in array destructuring
let a: number | null = 1;
let b: number | null = 2;
[a!, b!] = [b!, a!];

// Non-null assertion with member expressions
let obj: { x?: number; y?: number } = { x: 1, y: 2 };
[obj.x!, obj.y!] = [obj.y!, obj.x!];

// Non-null assertion in object destructuring
({ x: obj.x! } = { x: 5 });

// Complex nested case
let arr: (number | null)[][] = [[1, 2], [3, 4]];
[arr[0]![0]!, arr[1]![1]!] = [arr[1]![1]!, arr[0]![0]!];
