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
    for(var a = 0; a < 5; ++a)if (bar) baz();
} else {
    stuff();
}
