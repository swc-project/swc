function Trivia(items: Item[], visible: boolean) @{
    <main>
        contact@if.example
        @ if /* condition */ (visible) { <Visible /> }
        @ for /**/ (const item of items) { <Row item={item} /> }
        @ /* block */ { <Fallback /> }
        "unterminated-looking JSX text /* literal */
    </main>
}
