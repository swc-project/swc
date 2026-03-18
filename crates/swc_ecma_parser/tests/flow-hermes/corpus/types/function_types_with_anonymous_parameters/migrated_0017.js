// Anonymous function types are disallowed as arrow function return types
// So the `=>` clearly belongs to the arrow function
var f = (): string | number => 123;
