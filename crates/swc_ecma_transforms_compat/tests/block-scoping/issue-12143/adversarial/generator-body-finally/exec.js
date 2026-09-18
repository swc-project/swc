function* g() {
  var reads = [];
  for (let i = 0, init = () => i; i < 3; i++) {
    reads.push(() => i);
    try { yield i; continue; } finally { i += 1; }
  }
  return reads.map(f => f()).join();
}
var x = g();
console.log(JSON.stringify(x.next()), JSON.stringify(x.next()), JSON.stringify(x.next()));
