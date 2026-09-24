from pathlib import Path
import shutil, os
p=Path('tools/swc-native-addon-pack/src/bin/native-diagnostic-worker.rs');p.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile('scripts/native/diagnostic-worker.rs',p)
p=Path('crates/swc_native_addon/src/format.rs');s=p.read_text().replace('    fn verify_with(', '    pub(crate) fn verify_with(')
if os.environ.get('NATIVE_DIAGNOSTIC_EXPERIMENT','').endswith('-fast'):
    s=s.replace('pub const COMPRESSION_LEVEL: i32 = 16;', 'pub const COMPRESSION_LEVEL: i32 = -5;')
p.write_text(s)
p=Path('crates/swc_native_addon/Cargo.toml');s=p.read_text().replace('cfg(all(target_os = "macos", target_arch = "x86_64"))', 'cfg(target_os = "macos")');p.write_text(s)
p=Path('crates/swc_native_addon/src/integrity.rs');s=p.read_text().replace('all(target_os = "macos", target_arch = "x86_64")', 'target_os = "macos"').replace('.get().min(4)', '.get().min(2)')
s=s.replace('    pub fn encode(&self)', '''    pub fn diagnostic_verify_image(&self, input: &mut (impl Read + Seek)) -> Result<()> {
        let header = Header {
            target: crate::format::NativeTarget::X86_64AppleDarwin,
            compressed_len: u64::from_le_bytes(self.header[16..24].try_into().unwrap()),
            raw_len: u64::from_le_bytes(self.header[24..32].try_into().unwrap()),
            digest: self.header[32..96].try_into().unwrap(),
        };
        if header.raw_len == 0 || header.raw_len > crate::format::MAX_SIZE {
            return Err(Error::new(ErrorKind::Integrity, "invalid raw length"));
        }
        header.verify_with(input, self.verifier(&header)?)
    }

    pub fn encode(&self)''');p.write_text(s)
