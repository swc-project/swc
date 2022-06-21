use inflector::Inflector;

macro_rules! test_exec {
    (ignore, $syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        fn $test_name() {
            println!("{}", stringify!($test_name))
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr) => {
        #[test]
        fn $test_name() {
            println!("{}", stringify!($test_name))
        }
    };
}

macro_rules! test {
    (ignore, $syntax:expr, $tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            println!("{}", stringify!($test_name))
        }
    };

    ($syntax:expr, $tr:expr, $test_name:ident, $input:expr, $expected:expr) => {
        #[test]
        fn $test_name() {
            let dir = format!(
                "/Users/akari/Github/swc/crates/swc_ecma_transforms_module/tests/m/{}/",
                stringify!($test_name).to_kebab_case()
            );

            let path = format!(
                "/Users/akari/Github/swc/crates/swc_ecma_transforms_module/tests/m/{}/input.js",
                stringify!($test_name).to_kebab_case()
            );

            std::fs::create_dir_all(dir).expect("Unable to create dir");

            let data = $input;
            std::fs::write(path, data).expect("Unable to write file");
        }
    };
}
