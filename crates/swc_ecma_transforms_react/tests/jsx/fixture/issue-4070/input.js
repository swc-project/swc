const ChildrenFail = (props) => {
    return array.map((label) => (
        <WrapperWhereMagicHappens {...props} key={label}>
            <h2>{label}</h2>
            {/*<div>{console.log(props.children) || props.children}</div>*/}
        </WrapperWhereMagicHappens>
    ));
};
