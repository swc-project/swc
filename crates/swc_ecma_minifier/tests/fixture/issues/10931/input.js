// Test case from issue #10931
// Function parameter inlining optimization

function complex(foo, fn) {
    return fn?.(foo);
}

complex(1, undefined);
complex(2, undefined);
complex(3, undefined);
