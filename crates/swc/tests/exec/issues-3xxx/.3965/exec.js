const store = {
    address: "101 Main Street",
    what: function () {
        return this.address;
    },
    arrow: () => {
        return this.address;
    },
};
console.log(store.what()); // '101 Main Street'
console.log(store.arrow()); // undefined
