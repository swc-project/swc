pub use self::exponentation::exponentation;

mod exponentation;

pub fn es2016() -> impl Fold {
    exponentation()
}
