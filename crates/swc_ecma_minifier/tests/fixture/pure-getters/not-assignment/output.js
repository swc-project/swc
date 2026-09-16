// Writes are not reads: a setter can run arbitrary code, and the
// assignment is the statement's whole purpose.
a.b = 1;
a.b += 1;
a.b++;
delete a.b;
