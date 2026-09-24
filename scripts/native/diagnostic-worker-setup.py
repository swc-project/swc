from pathlib import Path
import shutil
p=Path('tools/swc-native-addon-pack/src/bin/native-diagnostic-worker.rs');p.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile('scripts/native/diagnostic-worker.rs',p)
p=Path('crates/swc_native_addon/src/integrity.rs');s=p.read_text();s=s.replace('    pub fn encode(&self)', '''    pub fn diagnostic_verify_image(&self, input: &mut (impl Read + Seek)) -> Result<()> {
        let raw_len = u64::from_le_bytes(self.header[24..32].try_into().unwrap());
        if raw_len == 0 || raw_len > crate::format::MAX_SIZE {
            return Err(Error::new(ErrorKind::Integrity, "invalid raw length"));
        }
        crate::format::native_kind(input, raw_len)?;
        input.rewind().map_err(|e| Error::io(ErrorKind::Integrity, "rewind", e))?;
        let mut hash = blake3::Hasher::new();
        let mut count = 0;
        let mut buffer = [0; 64 * 1024];
        loop {
            let n = input.read(&mut buffer).map_err(|e| Error::io(ErrorKind::Integrity, "read", e))?;
            if n == 0 { break; }
            count += n as u64;
            if count > raw_len { return Err(Error::new(ErrorKind::Integrity, "file grew")); }
            hash.update(&buffer[..n]);
        }
        if count != raw_len || hash.finalize().as_bytes() != &self.digest {
            return Err(Error::new(ErrorKind::Integrity, "invalid image"));
        }
        Ok(())
    }

    pub fn encode(&self)''');p.write_text(s)
