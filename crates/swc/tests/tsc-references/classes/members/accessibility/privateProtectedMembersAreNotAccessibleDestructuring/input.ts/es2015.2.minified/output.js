class K {
    privateMethod() {
    }
    m() {
        let { priv: a , prot: b  } = this, { priv , prot  } = new K();
    }
}
let k = new K(), { priv  } = k, { prot  } = k, { privateMethod  } = k, { priv: a , prot: b , privateMethod: pm  } = k;
