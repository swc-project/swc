import React from "react";

export function demoBug(): any {
    return (
        <div
            onAttach={(node) => {
                if (node) {
                    add(2, 3);
                }
                function add(a: number, b: number): void {}
            }}
        ></div>
    );
}
