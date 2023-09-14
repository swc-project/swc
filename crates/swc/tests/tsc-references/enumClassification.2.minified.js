//// [enumClassification.ts]
// An enum type where each member has no initializer or an initializer that specififes
// a numeric literal, a string literal, or a single identifier naming another member in
// the enum type is classified as a literal enum type. An enum type that doesn't adhere
// to this pattern is classified as a numeric enum type.
// Examples of literal enum types
var E01, E02, E03, E04, E05, E06, E07, E08, E10, E11, E12, E20, E011, E021, E041, E051, E061, E071, E081, E111, E121, E201;
(E011 = E01 || (E01 = {}))[E011.A = 0] = "A", (E021 = E02 || (E02 = {}))[E021.A = 123] = "A", (E03 || (E03 = {})).A = "hello", (E041 = E04 || (E04 = {}))[E041.A = 0] = "A", E041[E041.B = 1] = "B", E041[E041.C = 2] = "C", (E051 = E05 || (E05 = {}))[E051.A = 0] = "A", E051[E051.B = 10] = "B", E051[E051.C = 11] = "C", (E061 = E06 || (E06 = {})).A = "one", E061.B = "two", E061.C = "three", (E071 = E07 || (E07 = {}))[E071.A = 0] = "A", E071[E071.B = 1] = "B", E071.C = "hi", E071[E071.D = 10] = "D", E071[E071.E = 11] = "E", E071.F = "bye", (E081 = E08 || (E08 = {}))[E081.A = 10] = "A", E081.B = "hello", E081[E081.C = 10] = "C", E081.D = "hello", E081[E081.E = 10] = "E", E10 || (E10 = {}), (E111 = E11 || (E11 = {}))[E111.A = 0] = "A", E111[E111.B = 1] = "B", E111[E111.C = 2] = "C", (E121 = E12 || (E12 = {}))[E121.A = 1] = "A", E121[E121.B = 2] = "B", E121[E121.C = 4] = "C", (E201 = E20 || (E20 = {}))[E201.A = 3] = "A", E201[E201.B = E201.A + 1] = "B", E201[E201.C = 123] = "C", E201[E201.D = 0.8414709848078965] = "D";
