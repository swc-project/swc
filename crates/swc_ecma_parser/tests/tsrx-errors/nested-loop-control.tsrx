function Rows(items: Item[]) @{
    @for (const item of items) {
        @if (!item) { continue; } @else { <Row item={item} /> }
    }
}
