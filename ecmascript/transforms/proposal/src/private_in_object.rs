#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    #[testing::fixture("tests/private-in-object/**/input.js")]
    fn fixture(input: PathBuf) {}

    #[testing::fixture("tests/private-in-object/**/exec.js")]
    fn exec(input: PathBuf) {}
}
