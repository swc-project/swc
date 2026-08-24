function Extensions({ Tag, value, css }: Props) @{
    <section {value}>
        <{Tag} data-value={value}></{Tag}>
        <{Tag.Member} />
        <{'article'}>{value}</{'article'}>
        <style>.root > button:hover { color: red; content: "@if"; }</style>
        @{ const nested = value; <strong>{nested}</strong> }
    </section>
}
