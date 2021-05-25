function a(a) {
    console.log(a.async + " " + a.await);
}
var n = "Async",
    c = "Await";
a({ async: n });
a({ await: c });
a({ async: n, await: c });
a({ await: c, async: n });
a({ async: n });
a({ await: c });
a({ async: n, await: c });
a({ await: c, async: n });
