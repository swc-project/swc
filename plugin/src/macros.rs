#[macro_export]
macro_rules! define_js_processor {
    ($fn_name:path) => {
        #[no_mangle]
        pub extern "C" fn process_js(
            config_ptr: *const u8,
            config_len: u32,
            ast_ptr: *const u8,
            ast_len: u32,
        ) -> *mut u8 {
            todo!()
        }
    };
}
