// This should parse successfully in TypeScript mode.
// TS1102 is a semantic error that should be handled by the type checker,
// not the parser.
delete a;
