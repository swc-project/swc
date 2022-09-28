function e() {
    var e = document.getElementById("fname");
    if (e.files[0].size > 12345) {
        alert("alert");
        e.focus();
        return false;
    }
}
