function n() {
    console.log(1);
    return {
        y: function() {
            console.log(2);
            return {
                z: 0
            };
        }
    };
}
n().y().z++;
if (n().y().z) {
    console.log(3);
}
