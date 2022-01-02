use swc_common::ast_serde;

#[ast_serde]
enum Message {
    #[tag("Request")]
    Request(String),
    #[tag("Response")]
    Response(u8),
}
