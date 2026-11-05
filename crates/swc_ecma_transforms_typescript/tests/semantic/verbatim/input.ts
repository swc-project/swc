export {};
const enum E { A = 2, B }
import A = E;
const value = (A)[("B")];
namespace N { const enum E { A = 3 } }
