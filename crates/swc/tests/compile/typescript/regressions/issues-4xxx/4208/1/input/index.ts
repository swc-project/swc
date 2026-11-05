export class CompanyBgStore {
    public corpName = 123;

    public getBusinessInfo = async (corpName = this.corpName) => {
        console.log(corpName);
    };
}
