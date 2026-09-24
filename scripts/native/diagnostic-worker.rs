use std::{env, io::{self, Read}};
use swc_native_addon::{format::Payload, integrity::{RuntimeIntegrity, INTEGRITY_LEN}, platform};
fn run() -> Result<(), Box<dyn std::error::Error>> {
    let mut args=env::args_os().skip(1);
    let operation=args.next().ok_or("operation")?;
    let path=args.next().ok_or("path")?;
    let mut bytes=Vec::new();
    io::stdin().lock().take(2 * 1024 * 1024 * 1024 + 1024).read_to_end(&mut bytes)?;
    if bytes.len() < INTEGRITY_LEN { return Err("metadata missing".into()); }
    let integrity=RuntimeIntegrity::parse(&bytes[..INTEGRITY_LEN])?;
    let mut file=platform::open_regular(std::path::Path::new(&path), operation=="decode", false)?;
    if operation=="decode" {
        let payload=Payload::parse(&bytes[INTEGRITY_LEN..])?.with_integrity(integrity)?;
        file.set_len(0)?;payload.decode_into(&mut file)?;payload.verify_image(&mut file)?;
    } else if operation=="verify" {
        if bytes.len()!=INTEGRITY_LEN {return Err("unexpected verification data".into());}
        integrity.diagnostic_verify_image(&mut file)?;
    } else {return Err("invalid operation".into());}
    Ok(())
}
fn main(){if let Err(error)=run(){eprintln!("native diagnostic worker: {error}");std::process::exit(1);}}
