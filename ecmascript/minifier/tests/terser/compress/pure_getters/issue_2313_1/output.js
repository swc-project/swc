function x() {
    return (
        console.log(1),
        {
            y: function () {
                return console.log(2), { z: 0 };
            },
        }
    );
}
x().y().z++, x().y().z && console.log(3);
