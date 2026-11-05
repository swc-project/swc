enum Strings { A = "x", B = A, C = Strings.B }
const enum Constants { A = "x", B = A, C = Constants.B }
enum Numbers { A = 1, B = A + 1, C }
enum Merged { A = "merged" }
enum Merged { B = A }
enum Forward { A = B, B = "later" }
enum Cycle { A = B, B = A }
console.log(Strings, Constants.C, Numbers, Merged, Forward, Cycle);
