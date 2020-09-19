#![allow(dead_code)]

use swc_common::FileName;

#[macro_export]
macro_rules! grass_test {
    ($( #[$attr:meta] ),*$func:ident, $input:expr) => {
        $(#[$attr])*
        #[test]
        #[allow(non_snake_case)]
        fn $func() {
            crate::grass_macros::test(stringify!($func), $input);
        }
    };
    ($( #[$attr:meta] ),*$func:ident, $input:expr, $output:expr) => {
        $(#[$attr])*
        #[test]
        #[allow(non_snake_case)]
        fn $func() {
            crate::grass_macros::test(stringify!($func), $output);
        }
    };
}

pub fn test(name: &str, s: &str) {
    println!(
        "===== ===== ===== ===== =====\n{}\n===== ===== ===== ===== =====",
        s
    );

    ::testing::run_test2(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Real(name.to_string().into()), s.to_string());

        let res = swc_css_parser::parse(fm.start_pos, &fm.src);
        res.unwrap();

        // TODO: Print ast to file

        Ok(())
    })
    .unwrap();
}

pub fn error(name: &str, s: &str) {
    println!(
        "===== ===== ===== ===== =====\n{}\n===== ===== ===== ===== =====",
        s
    );

    ::testing::run_test2(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Real(name.to_string().into()), s.to_string());

        let res = swc_css_parser::parse(fm.start_pos, &fm.src);
        res.unwrap_err();

        // TODO: Print error message to file

        Ok(())
    })
    .unwrap();
}

/// Verify the error *message*
/// Span and scope information are not yet tested
#[macro_export]
macro_rules! grass_error {
    ($( #[$attr:meta] ),*$func:ident, $input:expr, $err:expr) => {
        $(#[$attr])*
        #[test]
        #[allow(non_snake_case)]
        fn $func() {
            crate::grass_macros::error(stringify!($func), $input);
        }
    };
}

#[macro_export]
macro_rules! assert_err {
    ($err:literal, $input:expr) => {
        match grass::from_string($input.to_string(), &grass::Options::default()) {
            Ok(..) => panic!("did not fail"),
            Err(e) => assert_eq!(
                $err,
                e.to_string()
                    .chars()
                    .take_while(|c| *c != '\n')
                    .collect::<String>()
                    .as_str()
            ),
        }
    };
}
