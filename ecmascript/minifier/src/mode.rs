pub trait Mode {}

pub struct Minification;

impl Mode for Minification {}

pub struct Eval;

impl Mode for Eval {}
