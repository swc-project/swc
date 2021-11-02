// good
all(...ns);
weird(...ns);
weird(...mixed);
weird(...tuple);
prefix("a", ...ns);
rest("d", ...ns);
// extra arguments
normal("g", ...ns);
thunk(...ns);
// bad
all(...mixed);
all(...tuple);
prefix("b", ...mixed);
prefix("c", ...tuple);
rest("e", ...mixed);
rest("f", ...tuple);
prefix(...ns) // required parameters are required
;
prefix(...mixed);
prefix(...tuple);
prefix2("g", ...ns);
