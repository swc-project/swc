export const AnElement = ({prop1, prop2, prop3, num, data}) => {
    return (
        <>
            <SomeElement
                prop1={prop1}
                prop2
                /* istanbul ignore if */
                style={num > 0 ? data.name : undefined}
            />
            {
                // istanbul ignore next
                !(num > 0) && data.name && (
                    <>"Hello"</>
                )
            }
        </>
    );
};