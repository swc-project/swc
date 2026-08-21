/*! pipeline API fixture */
export const render = (value: number): JSX.Element => (
    <section data-value={value as number}>{value ?? 0}</section>
);
