import {isNullOrUndefined} from "util";
/**
 * Created by imac on 6/7/2017 AD.
 */

export class DepositTerm {

    nameTH: string;
    nameEN: string;
    month: string;
    day: string;
    termType: string;
    minAmount: string;
    maxAmount: string;
    freqIntPay: string;
    freqIntPayDescTH: string;
    freqIntPayDescEN: string;
    promotionId: string;


    public static parseJSONArray(data: any) {
        const tdTermList = data.getTDTermList.getTDTerm;
        const list = new Array();

        for (const InquiryAccount of tdTermList) {
            list.push(new DepositTerm(InquiryAccount));
        }

        return list;

    }

    constructor(jsonData: any) {

        if (!isNullOrUndefined(jsonData)) {

            this.promotionId = isNullOrUndefined(jsonData.promotionID) ? null : jsonData.promotionID;
            this.nameTH = jsonData.termNameTha;
            this.nameEN = jsonData.termNameEng;
            this.month = jsonData.termMonth;
            this.day = jsonData.termDay;
            this.termType = jsonData.termType;
            this.minAmount = jsonData.minAmount;
            this.maxAmount = jsonData.maxAmount;
            this.freqIntPay = jsonData.freqIntPay;
            this.freqIntPayDescTH = jsonData.freqIntPayDescTha;
            this.freqIntPayDescEN = jsonData.freqIntPayDescEng;

        }
    }
}