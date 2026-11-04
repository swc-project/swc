import React from "react";

interface ListProps {
    callback: () => void;
}

const SomeList = ({ callback }: ListProps) => {
    callback();

    return <div />;
};

const list = [0];

const MyComponent = (): JSX.Element => {
    return (
        <div>
            {list.map(() =>
                true ? (
                    <SomeList
                        callback={(): void => console.log("do something")}
                    />
                ) : (
                    <div />
                )
            )}
        </div>
    );
};
