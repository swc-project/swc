for (
    var x = 1,
        t = (o) => {
            var i = +o;
            return console.log(i + i) && 0;
        };
    x--;
    t(2)
);
