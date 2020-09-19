#[macro_use]
mod grass_macros;

test!(
    scoping_var_decl_inner_ruleset,
    "a {\n  $color: red;\n  b {\n    $color: blue;\n  }\n  color: $color;\n}\n",
    "a {\n  color: blue;\n}\n"
);
test!(
    basic_global,
    "a {\n  $color: red !global;\n}\n\nb {\n  color: $color;\n}\n",
    "b {\n  color: red;\n}\n"
);
test!(
    global_inserted_into_local_and_global_scopes,
    "$foo: 42;\n\n.foo {\n  content: $foo;\n  $foo: 1337 !global;\n  content: $foo;\n}\n\n.bar \
     {\n  content: $foo;\n}\n",
    ".foo {\n  content: 42;\n  content: 1337;\n}\n\n.bar {\n  content: 1337;\n}\n"
);
test!(
    global_in_mixin,
    "$y: a;\n@mixin foo {\n  $y: b !global;\n}\na {\n  @include foo;\n  color: $y;\n}\n",
    "a {\n  color: b;\n}\n"
);
test!(
    local_variable_exists_in_fn_mixin_scope,
    "@function exists-fn($name) {
        @return variable-exists($name);
    }

    @mixin exists-mixin($name) {
        color: variable-exists($name);
    }

    a {
        $x: foo;
        @include exists-mixin(x);
        color: exists-fn(x);
    }",
    "a {\n  color: false;\n  color: false;\n}\n"
);
test!(
    variable_redeclarations_propagate_to_outer_scopes,
    "
    a {
        $a: red;
        b {
            $a: blue;
            c {
                d {
                    $a: orange;
                    color: $a;
                }
                color: $a;
            }
            color: $a;
        }
        color: $a;
    }
    ",
    "a {\n  color: orange;\n}\na b {\n  color: orange;\n}\na b c {\n  color: orange;\n}\na b c d \
     {\n  color: orange;\n}\n"
);
test!(
    local_variable_exists_in_inner_fn_mixin_scope,
    "a {
        $x: foo;
    
        a {
            @function exists-fn-inner($name) {
                @return variable-exists($name);
            }
    
            @mixin exists-mixin-inner($name) {
                color: variable-exists($name);
            }
    
            color: exists-fn-inner(x);
            @include exists-mixin-inner(x);
        }
    }",
    "a a {\n  color: true;\n  color: true;\n}\n"
);
