/// Type of the visitor.

#[derive(Debug, Clone, Copy)]
pub enum Mode {
    Fold,
    VisitMut,
}

impl Mode {
    pub fn prefix(self) -> &'static str {
        match self {
            Mode::Fold => "fold",
            Mode::VisitMut => "visit_mut",
        }
    }
}
