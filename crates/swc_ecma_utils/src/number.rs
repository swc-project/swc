/// <https://tc39.es/ecma262/#sec-numeric-types-number-tostring>
pub trait ToJsString {
    fn to_js_string(&self) -> String;
}

impl ToJsString for f64 {
    fn to_js_string(&self) -> String {
        let mut buffer = ryu_js::Buffer::new();
        buffer.format(*self).to_string()
    }
}
