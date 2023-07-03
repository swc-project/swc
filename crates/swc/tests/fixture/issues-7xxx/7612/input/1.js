const ModalInner = ({ data }) => {
    return (
        <Album
            data={(qcData?.flawImageList || [])?.map(src => ({
                url: src,
                describe: qcData?.flawDesc
            }))}
            showIndicators
            useSafeAreaBottom
            showDescription
            current={current}
        >
            test
        </Album>
    )
}