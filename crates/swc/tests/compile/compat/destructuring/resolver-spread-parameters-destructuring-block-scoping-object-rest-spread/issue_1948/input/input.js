
    const fn2 = (arg1, {opt1, opt2}, arg2, {opt3, opt4}, ...arg3) => {
        console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
    };

    function fn3(arg1, {opt1, opt2}, arg2, {opt3, opt4}, ...arg3) {
        console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
    };

    class cls {
        fn4(arg1, {opt1, opt2}, arg2, {opt3, opt4}, ...arg3) {
            console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
        }

        fn5(arg1, arg2) {
            console.log(arg1, arg2);
        }
    }