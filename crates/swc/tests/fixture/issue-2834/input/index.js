[(a)] = arr;
[((a.b))] = arr;
[...(a.b)] = arr;
({ a: (b) } = obj);
({ a: (b.c) } = obj);
({ ...((a["b"])) } = obj);
for ([(a)] of arr) {}
for ([{ a: ((b)) }] of arr) {}
for ([{ ...((a.b)) }] of arr) {}
