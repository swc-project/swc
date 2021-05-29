"use strict";
const id = (x) => x;
leak(
    {
        leak: leak,
    }.leak
);
