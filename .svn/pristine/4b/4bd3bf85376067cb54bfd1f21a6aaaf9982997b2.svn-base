import {isNullOrUndefined} from "util";
/**
 * Created by imac on 6/28/2017 AD.
 */

export class PromotionTerm {

    productCode: string;
    accountName: string;
    accountNo: string;
    productName: string;
    promotionId: string;
    nameTH: string;
    promotionType: string;
    day: string;
    month: string;

    public static parseJSONArray(jsonData: any) {
        const dataList = jsonData.promotionData;
        const list = new Array();

        if (!isNullOrUndefined(dataList)) {
            for (const data of dataList) {
                list.push(new PromotionTerm(data));
            }
        }

        return list;

    }

    constructor(jsonData: any) {

        if (!isNullOrUndefined(jsonData)) {

            this.promotionId = isNullOrUndefined(jsonData.promotionID) ? null : jsonData.promotionID;
            this.productCode = jsonData.productCode;

            this.accountName = jsonData.accountName;
            this.accountNo = jsonData.accountNo;
            this.productName = jsonData.productName;
            this.promotionId = jsonData.promotionID;
            this.nameTH = jsonData.promotionName;
            this.promotionType = jsonData.promotionType;
            this.day = jsonData.termDay;
            this.month = jsonData.termMonth;
        }
    }

}