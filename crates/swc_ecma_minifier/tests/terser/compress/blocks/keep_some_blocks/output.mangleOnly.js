if (foo) {
    {
        {
            {}
        }
    }
    if (bar) {
        baz();
    }
    {
        {}
    }
} else {
    stuff();
}
if (foo) {
    for(var f = 0; f < 5; ++f)if (bar) baz();
} else {
    stuff();
}
