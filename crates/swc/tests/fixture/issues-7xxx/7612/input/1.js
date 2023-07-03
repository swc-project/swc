const ModalInner = ({ data }) => {
    return (
        <div className={styles.qcWrapper} ref={wrapperRef} id="qcDataScroll">
            {data.qcDataList.map(qcData => (
                <div className={styles.desc} key={qcData.flawDesc}>
                    <div className={styles.descTitle}>{qcData?.flawDesc}</div>
                    {qcData?.flawImageList?.length === 0 ? (
                        <Empty />
                    ) : (
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
                    )}
                </div>
            ))}
        </div>
    )
}