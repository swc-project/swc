function a() {
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
a().y().z++;
if (a().y().z) {
    console.log(3);
}
