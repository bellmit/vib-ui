import {isNullOrUndefined} from "util";
import * as moment from "moment";
/**
 * Created by imac on 6/14/2017 AD.
 */

export class TermDepositList {

    tdSequence: string;
    accountStatusCode: string;
    accountStatusDesc: string;
    dateMaturity;
    ledgerBalance: string;
    originalAmount: string;
    tdPlacementNumber: string;
    public static parseJSONArray(data: any) {

        const termDepositList = data.termDepositList;
        const list = new Array();
        for (const term of termDepositList) {
            list.push(new TermDepositList(term));
        }
        return list;
    }

    constructor(jsonData: any) {

        if (!isNullOrUndefined(jsonData)) {
            this.tdSequence = jsonData.tdSequence;
            this.accountStatusCode = jsonData.accountStatusCode;
            this.accountStatusDesc = jsonData.accountStatusDesc;
            this.dateMaturity = moment(jsonData.dateMaturity);
            this.ledgerBalance = jsonData.ledgerBalance;
            this.originalAmount = jsonData.originalAmount;
            this.tdPlacementNumber = jsonData.tdPlacementNumber;
        }
    }
}