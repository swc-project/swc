use swc_common::*;

#[derive(Fold)]
pub struct Struct {}

#[derive(FromVariant, Fold)]
pub enum Enum {}
