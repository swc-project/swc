function deferred() {
    enum Later { A = seed, B }
    return Later.B;
}
enum Before { A = seed, B }
const seed = 42;
enum After { A = seed, B }
function sameRegion() {
    enum BeforeLocal { A = local, B }
    const local = 7;
    enum AfterLocal { A = local, B }
    return [BeforeLocal.A, AfterLocal.B];
}
(() => { enum Immediate { A = later, B } return Immediate.B; })();
const later = 5;
const first = second;
const second = 10;
enum Chain { A = first, B }
