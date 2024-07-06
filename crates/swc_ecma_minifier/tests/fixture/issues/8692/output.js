const props = {
    neededProp: 1,
    nestedProp: {
        getProps: ()=>props,
        getProp () {
            return this.getProps().neededProp;
        }
    }
};
console.log(props.nestedProp.getProp()); // should log: 1
