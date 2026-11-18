export async function defaultParam({
    value = {},
}: {
    value?: Record<string, unknown>;
}): Promise<void> {
    void value;
}
