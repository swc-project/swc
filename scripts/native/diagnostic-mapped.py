from pathlib import Path
p=Path('crates/swc_native_addon/src/format.rs');s=p.read_text()
s=s.replace('pub const COMPRESSION_LEVEL: i32 = 16;', 'pub const COMPRESSION_LEVEL: i32 = -5;')
s += '''
// Diagnostic only: cooperating cache writers publish by rename and the caller
// holds the entry lock. No mapping is allowed across mutation of this inode.
impl Payload<'_> {
    pub unsafe fn diagnostic_verify_mapped(&self, file: &std::fs::File) -> Result<()> {
        use std::os::fd::AsRawFd;
        let len=file.metadata().map_err(|e| Error::io(ErrorKind::Integrity,"inspect mapped image",e))?.len();
        if len != self.header.raw_len { return Err(Error::new(ErrorKind::Integrity,"raw addon length mismatch")); }
        let address=libc::mmap(std::ptr::null_mut(),len as usize,libc::PROT_READ,libc::MAP_PRIVATE,file.as_raw_fd(),0);
        if address == libc::MAP_FAILED {return Err(Error::io(ErrorKind::Integrity,"map cached image",std::io::Error::last_os_error()));}
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
'''
p.write_text(s)
p=Path('crates/swc_native_addon/src/cache.rs');s=p.read_text().replace('payload.verify_image(&mut file)', 'unsafe { payload.diagnostic_verify_mapped(&file) }').replace('payload.verify_image(staged.as_file_mut())?', 'unsafe { payload.diagnostic_verify_mapped(staged.as_file()) }?');p.write_text(s)

import os
if os.environ.get('NATIVE_DIAGNOSTIC_EXPERIMENT') == 'mapped-serial':
    p=Path('crates/swc_native_addon/src/integrity.rs');s=p.read_text().replace('.get().min(4)', '.get().min(1)');p.write_text(s)
