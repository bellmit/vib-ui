import { isNullOrUndefined } from "util";
import { JSONKey } from "../../share/app.constant";
import { json } from "ng2-validation/dist/json";

export class Fee {

    detail = {
        sequence: "",
        feeCode: "",
        feeDetails: "",
        transfereeFee: "",
        tax: "",
        transferType: "",
    };

    amount: number = 0;
    FeeList = new Array();
    fee_gl_account_to: string = '';
    refExt: string;
    ReceivingAccountDisplayName: string;
    feeDetailList;

    constructor(jsonData?: any) {
        const List = [];
        if (!isNullOrUndefined(jsonData)) {
            if (jsonData.hasOwnProperty("arr_result")) {
                const data = jsonData.arr_result;
                this.FeeList = data.filter(value => value.sc_amount > 0)
                this.amount = jsonData.sum_amount;
            }
            else {
                this.feeDetailList = new FeeDetailList(jsonData.transferList);
                this.ReceivingAccountDisplayName = jsonData.receiving.receivingAccountName;
                this.setFeeDetail(this.feeDetailList[0]);
            }
        }
    }

    setFeeDetail(detail) {

        if (!isNullOrUndefined(detail)) {

            this.detail.transferType = detail.transferType;

            let feeAmount = 0;
            let taxAmount = 0;
            const feeDetailObject = detail.FeeDetailList.FeeDetail[0];

            detail.FeeDetailList.FeeDetail.forEach((value, key, map) => {
                feeAmount += value.feeAmount;
                taxAmount += value.tax;
            });

            this.detail.sequence = feeDetailObject.sequence;
            this.detail.feeCode = feeDetailObject.feeCode;
            this.detail.feeDetails = feeDetailObject.feeDetails;
            this.detail.transfereeFee = feeDetailObject.transfereeFee;
            this.detail.tax = taxAmount.toString();
            this.amount = feeAmount;
            this.refExt = detail.referenceExt;

        }
    }

    getSubmitFeeParameter(): any {
        const selectedFee = this.feeDetailList.filter(feeData => feeData.transferType === this.detail.transferType)[0];
        const fee = new Array();

        selectedFee.feeDetailList.forEach(data => {
            const obj = {
                [JSONKey.Sequence]: data.sequence,
                [JSONKey.FeeCode]: data.feeCode,
                [JSONKey.FeeDetails]: data.feeDetails,
                [JSONKey.TransfereeFee]: data.transfereeFee,
                [JSONKey.FeeAmount]: data.feeAmount,
                [JSONKey.Tax]: data.tax,
                [JSONKey.Vat]: data.vat
            };
            fee.push(obj);
        });

        return fee;
    }
}

class FeeDetailList {

    FeeDetailList;

    constructor(detailList: any) {

        if (detailList.constructor !== Array) {
            this.FeeDetailList = [detailList];
        } else {
            this.FeeDetailList = detailList;
        }

        this.FeeDetailList.forEach((data, index, _) => {

            data.FeeDetailList = new FeeDetail(data.feeDetailList);

        });

        //Get first Sequence of fee detail
        // this.data.map(data => {
        //     if (data.FeeDetailList.FeeDetail.constructor === Array) {
        //         data.FeeDetailList.FeeDetail = data.FeeDetailList.FeeDetail.filter(detail => detail.Sequence === 1)[0]
        //     }
        // });

        return this.FeeDetailList;
    }


}

class FeeDetail {
    FeeDetail = new Array();

    constructor(details: any) {
        if (details.constructor === Array) {
            details.forEach(data => {
                this.FeeDetail.push(data);
            });
        }
        else {
            this.FeeDetail.push(details);
        }

    }

    totalFeeAmount() {
        let feeAmount = 0;

        this.FeeDetail.forEach((value, key, map) => {
            feeAmount += value.feeAmount;
        });

        return feeAmount;
    }

    getDetail() {
        return this.FeeDetail[0].FeeDetails;
    }
}