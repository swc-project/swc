from pathlib import Path
import os, sys, subprocess, json
if sys.argv[1] == 'prepare':
    p=Path('crates/swc_native_addon/src/format.rs');s=p.read_text().replace('pub const COMPRESSION_LEVEL: i32 = 16;', 'pub const COMPRESSION_LEVEL: i32 = -5;');p.write_text(s)
    parallel='parallel' in os.environ.get('NATIVE_DIAGNOSTIC_EXPERIMENT','')
    if parallel:
        p=Path('crates/swc_native_addon/Cargo.toml');s=p.read_text().replace('cfg(all(target_os = "macos", target_arch = "x86_64"))', 'cfg(target_os = "macos")');p.write_text(s)
    p=Path('crates/swc_native_addon/src/integrity.rs');s=p.read_text()
    if parallel:
        s=s.replace('all(target_os = "macos", target_arch = "x86_64")', 'target_os = "macos"').replace('.get().min(4)', '.get().min(2)')
    if 'current' in os.environ.get('NATIVE_DIAGNOSTIC_EXPERIMENT',''):
        s=s.replace('        rayon_core::ThreadPoolBuilder::new()\n            .num_threads(threads)\n            .thread_name', '        let builder = rayon_core::ThreadPoolBuilder::new().num_threads(threads);\n        #[cfg(target_arch = "aarch64")]\n        let builder = builder.use_current_thread();\n        builder.thread_name')
    methods='''
    pub fn diagnostic_digest(bytes: &[u8]) -> [u8; 32] { *blake3::hash(bytes).as_bytes() }
    pub fn diagnostic_verify_mapped(&self, file: &std::fs::File) -> Result<()> {
        use std::os::fd::AsRawFd;
        let len=file.metadata().map_err(|e| Error::io(ErrorKind::Integrity,"inspect mapped image",e))?.len();
        if len == 0 || len != u64::from_le_bytes(self.header[24..32].try_into().unwrap()) {
            return Err(Error::new(ErrorKind::Integrity,"raw addon length mismatch"));
        }
        let address=unsafe {libc::mmap(std::ptr::null_mut(),len as usize,libc::PROT_READ,libc::MAP_PRIVATE,file.as_raw_fd(),0)};
        if address == libc::MAP_FAILED {return Err(Error::io(ErrorKind::Integrity,"map cached image",std::io::Error::last_os_error()));}
        struct Mapping(*mut std::ffi::c_void, usize);
        impl Drop for Mapping {fn drop(&mut self){unsafe {libc::munmap(self.0,self.1);}}}
        let mapping=Mapping(address,len as usize);
        // This experiment runs mapping in a disposable process. Truncation
        // faults cannot reach the Node process, which rejects unsuccessful exits.
        let bytes=unsafe {std::slice::from_raw_parts(mapping.0.cast::<u8>(),mapping.1)};
        crate::format::native_kind(&mut std::io::Cursor::new(bytes),len)?;
        let mut hash=Verifier::Blake3(Box::default(),self.digest);
        hash.update(bytes);
        hash.finish()
    }
'''
    s=s.replace('    pub fn encode(&self)', methods+'\n    pub fn encode(&self)');p.write_text(s)
    qos=''
    if os.environ.get('NATIVE_DIAGNOSTIC_EXPERIMENT','').endswith('-qos'):
        qos='extern "C" {fn pthread_set_qos_class_self_np(class: u32, priority: i32) -> i32;} unsafe {pthread_set_qos_class_self_np(0x19,0);}'
    worker='''
use std::{env, io::{self, Read}};
use swc_native_addon::{format::Payload, integrity::{RuntimeIntegrity, INTEGRITY_LEN}, platform};
fn run() -> Result<(), Box<dyn std::error::Error>> {
    let mut args=env::args_os().skip(1);
    let operation=args.next().ok_or("operation")?;
    let path=args.next().ok_or("path")?;
    if operation=="digest" {
        println!("{:?}", RuntimeIntegrity::diagnostic_digest(&std::fs::read(path)?));return Ok(());
    }
    QOS
    let mut bytes=Vec::new();
    io::stdin().lock().take(2 * 1024 * 1024 * 1024 + 1024).read_to_end(&mut bytes)?;
    if bytes.len() < INTEGRITY_LEN { return Err("metadata missing".into()); }
    let integrity=RuntimeIntegrity::parse(&bytes[..INTEGRITY_LEN])?;
    let mut file=platform::open_regular(std::path::Path::new(&path), operation=="decode", false)?;
    if operation=="decode" {
        let payload=Payload::parse(&bytes[INTEGRITY_LEN..])?.with_integrity(integrity.clone())?;
        file.set_len(0)?;payload.decode_into(&mut file)?;
    } else if operation=="verify" {
        if bytes.len()!=INTEGRITY_LEN {return Err("unexpected verification data".into());}
    } else {return Err("invalid operation".into());}
    integrity.diagnostic_verify_mapped(&file)?;
    Ok(())
}
fn main(){if let Err(error)=run(){eprintln!("native diagnostic worker: {error}");std::process::exit(1);}}
'''.replace('QOS',qos)
    p=Path('tools/swc-native-addon-pack/src/bin/native-diagnostic-worker.rs');p.parent.mkdir(parents=True,exist_ok=True);p.write_text(worker)
else:
    helper=str(Path('target/release/native-diagnostic-worker').resolve())
    digest=subprocess.check_output([helper,'digest',helper],text=True).strip()
    p=Path('crates/swc_native_addon/src/format.rs');s=p.read_text()
    s+='''
impl Payload<'_> {
    pub fn diagnostic_assist(&self, path: &std::path::Path, decode: bool) -> Result<()> {
        use std::{io::Write, process::{Command, Stdio}};
        let helper=HELPER;
        let installed=std::fs::read(helper).map_err(|e| Error::io(ErrorKind::Integrity,"read worker",e))?;
        if blake3::hash(&installed).as_bytes() != &DIGEST {
            return Err(Error::new(ErrorKind::Integrity,"worker mismatch"));
        }
        let mut child=Command::new(helper).arg(if decode {"decode"}else{"verify"}).arg(path)
            .stdin(Stdio::piped()).stdout(Stdio::null()).stderr(Stdio::piped()).spawn()
            .map_err(|e| Error::io(ErrorKind::Integrity,"spawn worker",e))?;
        let mut input=child.stdin.take().unwrap();
        input.write_all(&self.integrity.as_ref().unwrap().encode()).unwrap();
        if decode {input.write_all(&self.header.encode()).unwrap();input.write_all(self.compressed).unwrap();}
        drop(input);
        let result=child.wait_with_output().map_err(|e| Error::io(ErrorKind::Integrity,"wait worker",e))?;
        if !result.status.success() {return Err(Error::new(ErrorKind::Integrity,String::from_utf8_lossy(&result.stderr).into_owned()));}
        Ok(())
    }
}
'''.replace('HELPER',json.dumps(helper)).replace('DIGEST',digest)
    p.write_text(s)
    p=Path('crates/swc_native_addon/src/cache.rs');s=p.read_text().replace('payload.verify_image(&mut file)', 'payload.diagnostic_assist(&path, false)').replace('payload.decode_into(staged.as_file_mut())?', 'payload.diagnostic_assist(staged.path(), true)?').replace('payload.verify_image(staged.as_file_mut())?', '()');p.write_text(s)
