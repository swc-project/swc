// 1.
if (a) {
    {
        {
            {
            }
        }
    }
    if (b) {
        c();
    }
    {
        {
        }
    }
} else {
    d();
}
// 2.
if (a) {
    for(var e = 1; e < 2; ++e)if (b) c();
} else {
    d();
}
