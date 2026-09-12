var calls = 0;
function* run() {
  with ({ set _loop_init_0_(value) { calls++; throw "scratch"; } }) {
    for (let i = yield 0, read = () => i;;) {
      console.log(read());
      break;
    }
  }
}
var it = run();
try { console.log(JSON.stringify(it.next()), JSON.stringify(it.next(7))); }
catch (error) { console.log(error); }
console.log(calls);
