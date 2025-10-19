// Expected output - for now, this is the same as input
// Once the optimization is implemented, this should show:
// function complex(foo) {
//     const fn = undefined;
//     return fn?.(foo);
// }
// complex(1);
// complex(2);
// complex(3);

function complex(foo, fn) {
    return fn?.(foo);
}

complex(1, undefined);
complex(2, undefined);
complex(3, undefined);
