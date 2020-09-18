import {isNullOrUndefined} from "util";
export class InterestRate {

    TDDepositRate: string;
    accountRate: string;
    interestAmt: string;
    rateTermDay: string;
    rateTermMonth: string;
    termAddDay: string;
    termAddFlag: string;
    termAddMonth: string;

    constructor(jsonData: any) {

        if (!isNullOrUndefined(jsonData)) {

            this.TDDepositRate = jsonData.TDDepositRate;
            this.accountRate = jsonData.accountRate;
            this.interestAmt = jsonData.interestAmt;
            this.rateTermDay = jsonData.rateTermDay;
            this.rateTermMonth = jsonData.rateTermMonth;
            this.termAddDay = jsonData.termAddDay;
            this.termAddFlag = jsonData.termAddFlag;
            this.termAddMonth = jsonData.termAddMonth;

        }
    }
}