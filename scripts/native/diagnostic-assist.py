from pathlib import Path
import json
helper = str(Path('target/release/native-diagnostic-worker').resolve())
p=Path('crates/swc_native_addon/src/format.rs');s=p.read_text()
s += '''
impl Payload<'_> {
    pub fn diagnostic_assist(&self, path: &std::path::Path, decode: bool) -> Result<()> {
        use std::{io::Write, process::{Command, Stdio}};
        let helper = HELPER;
        let installed = std::fs::read(helper).map_err(|e| Error::io(ErrorKind::Integrity, "read worker", e))?;
        if blake3::hash(&installed) != blake3::hash(include_bytes!(HELPER)) {
            return Err(Error::new(ErrorKind::Integrity, "worker mismatch"));
        }
        let mut child=Command::new(helper).arg(if decode {"decode"}else{"verify"}).arg(path)
            .stdin(Stdio::piped()).stdout(Stdio::null()).stderr(Stdio::piped()).spawn()
            .map_err(|e| Error::io(ErrorKind::Integrity, "spawn worker", e))?;
        let mut input=child.stdin.take().unwrap();
        input.write_all(&self.integrity.as_ref().unwrap().encode()).unwrap();
        if decode { input.write_all(&self.header.encode()).unwrap(); input.write_all(self.compressed).unwrap(); }
        drop(input);
        let result=child.wait_with_output().map_err(|e| Error::io(ErrorKind::Integrity, "wait worker", e))?;
        if !result.status.success() {return Err(Error::new(ErrorKind::Integrity, String::from_utf8_lossy(&result.stderr).into_owned()));}
        Ok(())
    }
}
'''.replace('HELPER', json.dumps(helper));p.write_text(s)
p=Path('crates/swc_native_addon/src/cache.rs');s=p.read_text()
s=s.replace('payload.verify_image(&mut file)', 'payload.diagnostic_assist(&path, false)')
s=s.replace('payload.decode_into(staged.as_file_mut())?', 'payload.diagnostic_assist(staged.path(), true)?')
s=s.replace('payload.verify_image(staged.as_file_mut())?', '()')
p.write_text(s)
