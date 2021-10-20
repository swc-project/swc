function fn() {
    try {
    } catch (e) {
    }
    try {
    } catch (e1) {
        try {
        } catch (e) {
            try {
            } catch (e) {
            }
        }
        try {
        } catch (e2) {
        }
    }
    try {
    } catch (x) {
        var x;
    }
    try {
    } finally{
    }
    try {
    } catch (e3) {
    } finally{
    }
    try {
    } catch (z) {
    } finally{
    }
}
