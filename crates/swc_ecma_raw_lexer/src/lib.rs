use logos::Logos;

#[derive(Logos, Debug, PartialEq)]
enum RawToken {
    #[regex(r"\P{ID_Start}\P{ID_Continue}*")]
    Ident,
}
