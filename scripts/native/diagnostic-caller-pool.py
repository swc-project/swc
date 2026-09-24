from pathlib import Path
import os
p=Path('crates/swc_native_addon/src/format.rs');s=p.read_text().replace('pub const COMPRESSION_LEVEL: i32 = 16;', 'pub const COMPRESSION_LEVEL: i32 = -40;');p.write_text(s)
p=Path('crates/swc_native_addon/src/integrity.rs');s=p.read_text()
s=s.replace('        Ok(Verifier::Blake3(Box::default(), self.digest))', '''        #[cfg(all(target_os = "macos", target_arch = "x86_64"))]
        if header.raw_len >= 1024 * 1024 { let _ = verification_pool(); }
        Ok(Verifier::Blake3(Box::default(), self.digest))''')
start=s.index('fn verification_pool()')
s=s[:start]+'''fn verification_pool() -> Option<&'static rayon_core::ThreadPool> {
    type OwnerPool = (std::thread::ThreadId, rayon_core::ThreadPool);
    static POOL: std::sync::OnceLock<Option<OwnerPool>> = std::sync::OnceLock::new();
    let (owner, pool) = POOL.get_or_init(|| {
        let threads=std::thread::available_parallelism().ok()?.get().min(4);
        if threads < 2 {return None;}
        let owner=std::thread::current().id();
        rayon_core::ThreadPoolBuilder::new().num_threads(threads).use_current_thread()
            .thread_name(|index| format!("swc-native-verify-{index}"))
            .build().ok().map(|pool| (owner,pool))
    }).as_ref()?;
    // A foreign caller must not depend on the creating thread remaining alive.
    // The native carrier has its own private Rayon copy, with no Rust exports.
    (*owner == std::thread::current().id()).then_some(pool)
}
''';p.write_text(s)
if os.environ.get('NATIVE_DIAGNOSTIC_EXPERIMENT','').endswith('-mapped'):
    p=Path('crates/swc_native_addon/src/format.rs');s=p.read_text();s+='''
impl Payload<'_> {
    // Diagnostic only. Cooperating cache writers publish by rename, never by
    // truncating an inode, and the caller holds the entry lock while mapping.
    pub unsafe fn diagnostic_verify_mapped(&self, file: &mut std::fs::File) -> Result<()> {
        use std::os::fd::AsRawFd;
        if self.header.raw_len > 32 * 1024 * 1024 {return self.verify_image(file);}
        let len=file.metadata().map_err(|e| Error::io(ErrorKind::Integrity,"inspect mapped image",e))?.len();
        if len != self.header.raw_len { return Err(Error::new(ErrorKind::Integrity,"raw addon length mismatch")); }
        let address=libc::mmap(std::ptr::null_mut(),len as usize,libc::PROT_READ,libc::MAP_PRIVATE,file.as_raw_fd(),0);
        if address == libc::MAP_FAILED {return self.verify_image(file);}
        struct Mapping(*mut std::ffi::c_void, usize);
        impl Drop for Mapping {fn drop(&mut self){unsafe {libc::munmap(self.0,self.1);}}}
        let mapping=Mapping(address,len as usize);
        let bytes=std::slice::from_raw_parts(mapping.0.cast::<u8>(),mapping.1);
        native_kind(&mut Cursor::new(bytes),len)?;
        let mut hash=self.verifier()?;
        hash.update(bytes);
        hash.finish()
    }
}
''';p.write_text(s)
    p=Path('crates/swc_native_addon/src/cache.rs');s=p.read_text().replace('payload.verify_image(&mut file)', 'unsafe { payload.diagnostic_verify_mapped(&mut file) }').replace('payload.verify_image(staged.as_file_mut())?', 'unsafe { payload.diagnostic_verify_mapped(staged.as_file_mut()) }?');p.write_text(s)
