if (foo) {
    {
        {
            {
            }
        }
    }
    if (bar) {
        baz();
    }
    {
        {
        }
    }
} else {
    stuff();
}
if (foo) {
    for (var i = 0; i < 5; ++i) if (bar) baz();
} else {
    stuff();
}
