#[derive(Debug)]
pub struct Diagnotic(Box<DiagnoticKind>);

#[derive(Debug)]
pub enum DiagnoticKind {}
