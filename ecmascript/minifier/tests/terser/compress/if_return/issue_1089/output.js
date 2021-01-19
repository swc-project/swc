function x() {
    var f = document.getElementById("fname");
    if (f.files[0].size > 12345) return alert("alert"), f.focus(), !1;
}
