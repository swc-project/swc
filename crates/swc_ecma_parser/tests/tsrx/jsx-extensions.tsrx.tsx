function Extensions({ Tag, value, css }: Props) {
    return <section value={value}>
        {(()=>{
        const _TsrxTag = Tag;
        return <_TsrxTag data-value={value}></_TsrxTag>;
    })()}
        {(()=>{
        const _TsrxTag1 = Tag.Member;
        return <_TsrxTag1/>;
    })()}
        {(()=>{
        const _TsrxTag2 = 'article';
        return <_TsrxTag2>{value}</_TsrxTag2>;
    })()}
        <style>{'.root > button:hover { color: red; content: "@if"; }'}</style>
        {(()=>{
        const nested = value;
        return <strong>{nested}</strong>;
    })()}
    </section>;
}
