import {isNullOrUndefined} from "util";
import * as moment from "moment";
/**
 * Created by imac on 6/14/2017 AD.
 */

export class TermDepositListBK {

    depNo: string;
    principalBalance: string;
    accrIntBalance: string;
    netAmount: string;
    depStatusCode: string;
    maturityDate;
    public static parseJSONArray(data: any) {

        const termDepositList = data.termDepositList;
        const list = new Array();
        for (const term of termDepositList) {
            list.push(new TermDepositListBK(term));
        }
        return list;
    }

    constructor(jsonData: any) {

        if (!isNullOrUndefined(jsonData)) {
            this.depNo = jsonData.depNo;
            this.principalBalance = jsonData.principalBalance;
            this.accrIntBalance = jsonData.accrIntBalance;
            this.netAmount = jsonData.netAmount;
            this.depStatusCode = jsonData.depStatusCode;
            this.maturityDate = moment(jsonData.dateMaturity);
        }
    }

    isStatusOpen() {
        return this.depStatusCode === "8";
    }
}