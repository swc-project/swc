var r = {
    s: new Object()
};
r.s && r.s.toFixed(); // would blow up at runtime
