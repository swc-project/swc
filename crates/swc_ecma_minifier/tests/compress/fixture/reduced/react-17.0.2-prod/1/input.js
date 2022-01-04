var kb = {
    html: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    svg: "http://www.w3.org/2000/svg"
};

var nb, ob = function (a) {
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function (b, c, d, e) {
        MSApp.execUnsafeLocalFunction(function () {
            return a(b, c, d, e)
        })
    } : a
}(function (a, b) {
    if (a.namespaceURI !== kb.svg || "innerHTML" in a) a.innerHTML = b;
    else {
        nb = nb || document.createElement("div");
        nb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
        for (b = nb.firstChild; a.firstChild;) a.removeChild(a.firstChild);
        for (; b.firstChild;) a.appendChild(b.firstChild)
    }
});

export default ob;