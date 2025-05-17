const G = {
    setPackageName({ packageName }) {
        if ("string" == typeof packageName) this.packageName = packageName;
        return this;
    }
};
var packageName;
packageName = "@clerk/clerk-react", G.setPackageName({
    packageName
}), console.log(G.packageName);