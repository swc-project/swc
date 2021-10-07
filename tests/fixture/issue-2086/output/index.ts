class Test{#a;constructor(a){this.#a=a} #b(){setTimeout(()=>{this.#a.textContent="TESTED"},1000)}run(){this.#b()}}export{Test as default}
