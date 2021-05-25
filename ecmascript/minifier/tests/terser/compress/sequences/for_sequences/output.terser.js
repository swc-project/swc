for (foo(), bar(); false; );
for (foo(), bar(), x = 5; false; );
x = foo in bar;
for (; false; );
x = foo in bar;
for (y = 5; false; );
for (
    x = function () {
        (foo in bar);
    },
        y = 5;
    false;

);
