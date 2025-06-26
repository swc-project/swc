const G = {
    setPackageName ({ packageName }) {
        return "string" == typeof packageName && (this.packageName = packageName), this;
    }
};
G.setPackageName({
    packageName: "@clerk/clerk-react"
}), console.log(G.packageName);
