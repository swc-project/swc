interface Props {
    foo: string;
}

function Page(props: Props) {
    props.foo;
}

// @ts-expect-error
Page();