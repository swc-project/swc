use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::duplicate_keys;
use swc_ecma_transforms_testing::test;

fn syntax() -> Syntax {
    Default::default()
}

test!(
    syntax(),
    |_| duplicate_keys(),
    issue_203,
    include_str!("inline-inputs/es2015_duplicated_keys/issue_203/input.js")
);

test!(
    ignore,
    syntax(),
    |_| duplicate_keys(),
    combination_dupes,
    include_str!("inline-inputs/es2015_duplicated_keys/combination_dupes/input.js")
);

test!(
    syntax(),
    |_| duplicate_keys(),
    combination_no_dupes,
    include_str!("inline-inputs/es2015_duplicated_keys/combination_no_dupes/input.js")
);

test!(
    syntax(),
    |_| duplicate_keys(),
    dup_keys_both_quoted,
    include_str!("inline-inputs/es2015_duplicated_keys/dup_keys_both_quoted/input.js")
);

test!(
    syntax(),
    |_| duplicate_keys(),
    dup_keys_dupes,
    include_str!("inline-inputs/es2015_duplicated_keys/dup_keys_dupes/input.js")
);

test!(
    syntax(),
    |_| duplicate_keys(),
    dup_keys_getter,
    include_str!("inline-inputs/es2015_duplicated_keys/dup_keys_getter/input.js")
);

test!(
    syntax(),
    |_| duplicate_keys(),
    dup_keys_getter_and_setter,
    include_str!("inline-inputs/es2015_duplicated_keys/dup_keys_getter_and_setter/input.js")
);

test!(
    syntax(),
    |_| duplicate_keys(),
    dup_keys_one_quoted,
    include_str!("inline-inputs/es2015_duplicated_keys/dup_keys_one_quoted/input.js")
);

// duplicate_keys_getter
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_getter,
    include_str!("inline-inputs/es2015_duplicated_keys/duplicate_keys_getter/input.js")
);

// duplicate_keys_dupes
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_dupes,
    include_str!("inline-inputs/es2015_duplicated_keys/duplicate_keys_dupes/input.js")
);

// duplicate_keys_both_quoted
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_both_quoted,
    include_str!("inline-inputs/es2015_duplicated_keys/duplicate_keys_both_quoted/input.js")
);

// duplicate_keys_no_dupes
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_no_dupes,
    include_str!("inline-inputs/es2015_duplicated_keys/duplicate_keys_no_dupes/input.js")
);

// duplicate_keys_getters_and_setters
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_getters_and_setters,
    include_str!(
        "inline-inputs/es2015_duplicated_keys/duplicate_keys_getters_and_setters/input.js"
    )
);

// duplicate_keys_one_quoted
test!(
    syntax(),
    |_| duplicate_keys(),
    duplicate_keys_one_quoted,
    include_str!("inline-inputs/es2015_duplicated_keys/duplicate_keys_one_quoted/input.js")
);
