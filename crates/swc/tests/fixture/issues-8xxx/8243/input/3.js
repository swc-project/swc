export const Foo = (props) => {
    return originalMessage ? (<Bar>
        <Baz>
            {(): unknown => null}
        </Baz>
    </Bar>) : null;
};