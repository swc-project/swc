function a() {
    try {
        x();
    } catch (a) {
        console.log(a.message);
    }
}
