export const Foo = (props) => {
    return originalMessage ? <Bar>
        <Baz>
            {() => null}
        </Baz>
    </Bar> : null;
};