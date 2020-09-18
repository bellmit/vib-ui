export class RePay {

    id: string;
    code: string;
    name_th: string;
    name_en: string;
    remark: string;
    imageName: string;

    public static parseJSONArray(data: any) {

        const list = new Array();
        for (const object of data.data) {
            list.push(new RePay(object));
        }

        return list;
    }

    constructor(jsonData: any) {

        this.id = jsonData.PRODUCT_ID;
        this.code = jsonData.PRODUCT_CODE;
        this.name_th = jsonData.PRODUCT_NAME_TH;
        this.name_en = jsonData.PRODUCT_NAME_EN;
        this.remark = jsonData.REMARK;
    }

}