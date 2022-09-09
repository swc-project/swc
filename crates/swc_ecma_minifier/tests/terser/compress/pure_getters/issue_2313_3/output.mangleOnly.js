function o() {
    console.log(1);
    return {
        y: function () {
            console.log(2);
            return { z: 0 };
        },
    };
}
o().y().z++;
if (o().y().z) {
    console.log(3);
}
