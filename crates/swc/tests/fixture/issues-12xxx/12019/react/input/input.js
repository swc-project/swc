let count = 0;
const React = {
    createElement() {
        return {
            run() {
                count++;
            }
        };
    }
};
const value = <div />;
value.run();
console.log(count);
