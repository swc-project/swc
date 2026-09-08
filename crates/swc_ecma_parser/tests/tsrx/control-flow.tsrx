"use client";

function ControlFlow(items: Item[], record: Record<string, Item>, stream: AsyncIterable<Item>) @{
    const visible = items.length > 0;
    <main>
        @if (visible) { <Visible /> } @else if (items.length === 0) {
            const reason = "empty";
            <Hidden reason={reason} />
        } @else { <Unknown /> }

        @for (let i = 0; i < items.length; i++) {
            if (!items[i]) continue;
            if (i > 20) break;
            <ClassicRow item={items[i]} />
        } @empty { <NoClassicRows /> }

        @for (const name in record) {
            <NamedRow name={name} />
        } @empty { <NoNames /> }

        @for (const item of items; index index; key item.id) {
            const label = `${index}:${item.name}`;
            <Row item={item} label={label} />
        } @empty { <Empty /> }

        @for (const item of items; key item.id) {
            <Row key="source-key" item={item} />
        }

        @for (const item of items; key item.id) {
            <><Row item={item} /></>
        }

        @for await (const item of stream) {
            <AsyncRow item={item} />
        } @empty { <NoAsyncRows /> }

        @switch (items.length) {
            @case 0: {
                const message = "fall through";
            }
            @case 1: { <One /> }
            @default: { break; }
        }
    </main>
}
