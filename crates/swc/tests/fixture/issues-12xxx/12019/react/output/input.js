let count = 0;
(/*#__PURE__*/ ({
    createElement: ()=>({
            run () {
                count++;
            }
        })
}).createElement("div", null)).run(), console.log(count);
