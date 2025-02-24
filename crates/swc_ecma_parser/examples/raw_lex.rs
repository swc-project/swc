use swc_ecma_parser::{raw_lexer::RawLexer, Syntax};

fn main() {
    let source = "hello #!aslk";

    let mut lexer = RawLexer::new(source, Syntax::Es(Default::default()));

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
