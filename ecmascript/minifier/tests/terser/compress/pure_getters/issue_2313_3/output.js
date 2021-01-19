function x() {
    console.log(1);
    return {
        y: function () {
            console.log(2);
            return { z: 0 };
        },
    };
}
x().y().z++;
x().y().z && console.log(3);
