import {Injectable} from '@angular/core';
import {API, JSONKey} from "../../../share/app.constant";
import {Utils} from "../../../share/utils";
import {APIService} from "./api.service";


@Injectable()
export class ChequeService {

    constructor(private  apiService: APIService) {
    }


    checkAvailableChq(bankCode: string, accountNo: string,
                      chequeNo: string, branchCode: string) {

        const json = {
            "bank_code": bankCode,
            "account_no": accountNo,
            "cheque_no": chequeNo,
            "branch_code": branchCode
        };

        const url = API.CheckAvailableChqs;
        return this.apiService.postVIBWithHeader(url, json);

    }

    checkAvaliableChequeStock(cheque, branchCode: string) {
        const json = {
            "branch_code": branchCode,
            "stock_no": cheque
        };

        const url = API.CheckAvaliableChequeStock;
        return this.apiService.postVIBWithHeader(url, json);
    }

    checkcastatus(accountNo: string, chequeNo: string) {

        const json = {
            "account_no": accountNo,
            "ref_cheque_no": chequeNo,
        };

        const url = API.CheckCaStatus;
        return this.apiService.postVIBWithHeader(url, json);
    }

    checkreceivingotherbankstatus(branchCode: string) {
        const json = {
            'branch_code': branchCode
        };

        const url = API.CheckReceivingotherbankstatus;
        return this.apiService.postVIBWithHeader(url, json);
    }
}