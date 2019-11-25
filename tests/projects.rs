use swc::{config::Options, Compiler};
use testing::{StdErr, Tester};
use walkdir::WalkDir;

fn project(dir: &str) -> Result<(), StdErr> {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone(), handler);

            for entry in WalkDir::new(dir) {
                let entry = entry.unwrap();
                if entry.metadata().unwrap().is_dir() {
                    continue;
                }
                if !entry.file_name().to_string_lossy().ends_with(".ts")
                    && !entry.file_name().to_string_lossy().ends_with(".js")
                    && !entry.file_name().to_string_lossy().ends_with(".tsx")
                {
                    continue;
                }

                let fm = cm.load_file(entry.path()).expect("failed to load file");
                c.process_js_file(
                    fm,
                    Options {
                        swcrc: true,
                        ..Default::default()
                    },
                )
                .expect("failed to process js file");
            }

            Ok(())
        })
        .map(|_| ())
}

#[test]
fn issue_467() {
    project("tests/projects/issue-467").unwrap();
}

#[test]
fn angular_core() {
    project("tests/projects/angular-core").unwrap();
}
