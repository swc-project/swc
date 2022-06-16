function fn() {
    try {} catch (e) {}
    try {} catch (e1) {
        try {} catch (e2) {
            try {} catch (e3) {}
        }
        try {} catch (e4) {}
    }
    try {} catch (x) {
        var x;
    }
    try {} finally{}
    try {} catch (e5) {} finally{}
    try {} catch (z) {} finally{}
}
