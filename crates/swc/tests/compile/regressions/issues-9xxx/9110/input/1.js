const createFragment = (key: { name: string }): JSX.Element => (
    <>Key Name: {key.name ?? "None"}</>
);