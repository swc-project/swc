#[macro_use]
mod grass_macros;

test!(
    length_of_empty_arglist,
    "@mixin foo($a...) {\n    color: length($list: $a);\n}\na {\n    @include foo;\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    length_of_arglist_in_mixin,
    "@mixin foo($a...) {\n    color: length($list: $a);\n}\na {\n    @include foo(a, 2, c);\n}\n",
    "a {\n  color: 3;\n}\n"
);
test!(
    arglist_in_at_each,
    "@function sum($numbers...) {
        $sum: 0;
    
        @each $number in $numbers {
            $sum: $sum + $number;
        }
        @return $sum;
    }
    
    a {
        width: sum(50px, 30px, 100px);
    }",
    "a {\n  width: 180px;\n}\n"
);
error!(
    emit_empty_arglist,
    "@function foo($a...) {
        @return $a;
    }
    
    a {
        color: foo();
    }",
    "Error: () isn't a valid CSS value."
);
test!(
    inspect_empty_arglist,
    "@function foo($a...) {
        @return inspect($a);
    }
    
    a {
        color: foo();
    }",
    "a {\n  color: ();\n}\n"
);
test!(
    empty_arglist_is_allowed_in_map_functions,
    "@function foo($a...) {
        @return map-get($map: $a, $key: foo);
    }

    a {
        color: inspect(foo());
    }",
    "a {\n  color: null;\n}\n"
);
test!(
    inspect_arglist_with_one_arg,
    "@function foo($a...) {
        @return inspect($a);
    }
    
    a {
        color: inspect(foo(1));
    }",
    "a {\n  color: (1,);\n}\n"
);
error!(
    empty_arglist_is_error,
    "@function foo($a...) {
        @return $a;
    }

    a {
        color: foo();
    }",
    "Error: () isn't a valid CSS value."
);
test!(
    arglist_of_only_null_is_null,
    "@function foo($a...) {
        @return $a;
    }
    a {
        color: foo(null, null);
    }",
    ""
);
