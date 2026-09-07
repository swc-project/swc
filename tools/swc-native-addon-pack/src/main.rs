//! Host-only packer. The input is read-only, and its sibling CLI is never
//! opened.

use std::{
    env, fs,
    io::{Cursor, Write},
    path::PathBuf,
};

use swc_native_addon::{
    format::{pack, Payload, MAX_SIZE},
    platform,
};

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let mut args = env::args_os().skip(1);
    let mut input = None;
    let mut output = None;
    while let Some(arg) = args.next() {
        if arg == "--input" && input.is_none() {
            input = args.next().map(PathBuf::from);
        } else if arg == "--output" && output.is_none() {
            output = args.next().map(PathBuf::from);
        } else {
            return Err(
                "usage: swc-native-addon-pack --input <final-stripped.node> --output \
                 <payload.swcn>"
                    .into(),
            );
        }
    }
    let input = input.ok_or("--input is required")?;
    let output = output.ok_or("--output is required")?;
    let input = fs::canonicalize(input)?;
    let parent = output
        .parent()
        .filter(|p| !p.as_os_str().is_empty())
        .unwrap_or_else(|| std::path::Path::new("."));
    let parent = fs::canonicalize(parent)?;
    let output = parent.join(output.file_name().ok_or("output must name a file")?);
    if fs::canonicalize(&output).ok().as_ref() == Some(&input) {
        return Err("output must not overwrite the raw addon".into());
    }
    // Requiring a distinct payload suffix also prevents accidentally replacing
    // a sibling `swc` executable or treating the payload as a loadable carrier.
    if output.extension().and_then(|s| s.to_str()) != Some("swcn") {
        return Err("output must have the .swcn payload extension".into());
    }
    if fs::metadata(&input)?.len() > MAX_SIZE {
        return Err("raw addon exceeds 2 GiB".into());
    }
    let raw = fs::read(&input)?;
    let bytes = pack(&raw)?;
    let payload = Payload::parse(&bytes)?;
    let mut decoded = Cursor::new(Vec::new());
    payload.decode_into(&mut decoded)?;
    if decoded.get_ref() != &raw {
        return Err("packer verification did not reproduce the raw addon".into());
    }
    let mut staged = tempfile::Builder::new()
        .prefix(".swc-payload-")
        .tempfile_in(&parent)?;
    staged.write_all(&bytes)?;
    staged.as_file().sync_all()?;
    let staged = staged.into_temp_path();
    fs::rename(&staged, &output)?;
    platform::sync_directory(&parent)?;
    println!(
        "raw={} payload={} sha512={}",
        raw.len(),
        bytes.len(),
        payload.header.cache_key()
    );
    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("swc-native-addon-pack: {error}");
        std::process::exit(1);
    }
}
