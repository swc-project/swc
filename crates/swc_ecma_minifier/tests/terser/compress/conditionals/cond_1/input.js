function foo(do_something, some_condition) {
    if (some_condition) {
        do_something(x);
    } else {
        do_something(y);
    }
    if (some_condition) {
        side_effects(x);
    } else {
        side_effects(y);
    }
}
