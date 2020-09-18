
export class ServiceCategory {

    id: string;
    code: string;
    name_th: string;
    name_en: string;
    remark: string;
    imageName: string;

    public static parseJSONArray(data: any) {

        const list = new Array();
        for (const object of data.data) {
            list.push(new ServiceCategory(object));
        }

        return list;
    }

    constructor(jsonData: any) {

        this.id = jsonData.SYSID;
        this.code = jsonData.CATEGORY_CODE;
        this.name_th = jsonData.CATEGORY_NAME_TH;
        this.name_en = jsonData.CATEGORY_NAME_EN;
        this.remark = jsonData.REMARK;
    }


}