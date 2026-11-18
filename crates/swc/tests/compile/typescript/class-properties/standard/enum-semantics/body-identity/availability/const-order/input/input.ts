const first = "a", second = first + "b";
enum Chain { A = second, B = A + first }
function prime() { enum Deferred { A = later } return Deferred; }
function forward() { enum Before { A = local } const local = "local"; return Before; }
function cycle() { const a = b, b = a; enum Cycle { A = a } return Cycle; }
function self() { const a = a; enum Self { A = a } return Self; }
function typed() { enum Before { A = local } const local: string = "typed"; return Before; }
const later = "later";
enum After { A = later }
namespace N { export const a = "namespace"; }
namespace N { export const b = a + "!"; export enum E { A = b } }
