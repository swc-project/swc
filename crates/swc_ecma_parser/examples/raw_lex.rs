use swc_ecma_parser::raw_lexer::RawLexer;

fn main() {
    let source = "hello #!aslk";

    let mut lexer = RawLexer::new(source);

    loop {
        match lexer.read_next_token() {
            Ok(token) => {
                if token.kind.is_eof() {
                    break;
                } else {
                    println!("token: {:?}", token);
                }
            }
            Err(e) => {
                println!("e {:?}", e);
                break;
            }
        }
    }
}
