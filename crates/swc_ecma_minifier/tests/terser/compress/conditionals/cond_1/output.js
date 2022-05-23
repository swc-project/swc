function foo(do_something, some_condition) {
    do_something(some_condition ? x : y);
    some_condition ? side_effects(x) : side_effects(y);
}
