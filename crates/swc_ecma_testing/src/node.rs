use std::{
    io,
    process::{Command, Output},
};
#[cfg(any(windows, test))]
use std::{io::Write, process::Stdio};

use crate::JsExecOptions;

fn command(opts: &JsExecOptions) -> Command {
    let mut command = Command::new("node");
    command.arg(if opts.module {
        "--input-type=module"
    } else {
        "--input-type=commonjs"
    });
    command
}

pub(super) fn exec(js_code: &str, opts: &JsExecOptions) -> io::Result<Output> {
    let output = command(opts)
        .arg("-e")
        .arg(js_code)
        .args(&opts.args)
        .output();

    #[cfg(windows)]
    if let Err(error) = &output {
        // Windows reports an oversized command line as
        // ERROR_FILENAME_EXCED_RANGE (206). ES5 output with inline source maps
        // can exceed that limit even when the input fixture is small.
        if error.raw_os_error() == Some(206) {
            return exec_with_stdin(js_code, opts);
        }
    }

    output
}

/// Execute oversized Windows scripts without putting their source in argv.
#[cfg(any(windows, test))]
pub(super) fn exec_with_stdin(js_code: &str, opts: &JsExecOptions) -> io::Result<Output> {
    let mut child = command(opts)
        // Normalize argv before module dependencies execute. Using a preload
        // also keeps the original source intact, including inline source maps.
        // Node adds a stdin marker that -e does not include in user arguments.
        .arg("--import=data:text/javascript,process.argv.splice(1,1)")
        .arg("-")
        .args(&opts.args)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    let written = {
        let mut stdin = child.stdin.take().unwrap();
        stdin.write_all(js_code.as_bytes())
    };

    // Close stdin before waiting so Node can evaluate the complete script.
    // Always reap the child, including when writing its input fails.
    let output = child.wait_with_output()?;
    if output.status.success() {
        written?;
    }
    Ok(output)
}
