function* run() {
  var out = [];
  for (var n = 0; n < 2; n++) {
    for (let i = n, read = () => i;;) { out.push(read); yield n; break; }
  }
  return out.map(f => f()).join();
}
var it = run();
console.log(JSON.stringify(it.next()), JSON.stringify(it.next()), JSON.stringify(it.next()));
