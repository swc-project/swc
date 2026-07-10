fn main() {
    if let Err(error) = swc_test262::cli::run() {
        eprintln!("error: {error:#}");
        std::process::exit(1);
    }
}
