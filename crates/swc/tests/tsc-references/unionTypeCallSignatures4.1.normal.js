//// [unionTypeCallSignatures4.ts]
var f12;
f12("a");
f12("a", "b");
f12("a", "b", "c"); // ok
var f34;
f34("a");
f34("a", "b");
f34("a", "b", "c");
var f1234;
f1234("a");
f1234("a", "b");
f1234("a", "b", "c"); // ok
var f12345;
f12345("a"); // error
f12345("a", "b");
f12345("a", "b", "c"); // error
