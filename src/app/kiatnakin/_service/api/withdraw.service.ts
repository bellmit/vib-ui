import {Injectable} from '@angular/core';
import {API} from "../../../share/app.constant";
import {Utils} from "../../../share/utils";
import {APIService} from "./api.service";
import {Withdraw} from "../../_model/withdraw";

@Injectable()
export class WithdrawService {

    constructor(private  apiService: APIService) {
    }

    withdrawCheckAvaliableChequeStock(withdraw: Withdraw, branchCode_Cheque: string) {
        const json = {
            "branch_code": branchCode_Cheque,
            "stock_no": withdraw.to.micrResult
        };

        const url = API.CheckAvaliableChequeStock;
        return this.apiService.post(url, json);
    }

    withdrawalCAToCashWithChq(withdraw: Withdraw, branchCode: string) {

        const json = {
            "branch_code": branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "instrument_no": withdraw.from.micrResult,
            "ca_account_no": withdraw.from.accountNumber,
            "codorgbrn": branchCode,
            "fee_gl_account_to": withdraw.fee.fee_gl_account_to,
            "fee_amount": withdraw.fee.amount,
            "orgbrncode": "0016",
        };

        const url = API.withdrawalCAToCashWithChq;
        return this.apiService.post(url, json);
    }

    withdrawalCAToCashWithOutChq(withdraw: Withdraw, branchCode: string) {

        const json = {
            "branch_code": branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "cust_id": withdraw.from.custCif,
            "ca_account_no": withdraw.from.accountNumber,
            "fee_gl_account_to": withdraw.fee.fee_gl_account_to,
            "fee_amount": withdraw.fee.amount,
            "orgbrncode": "0016"
        };

        const url = API.withdrawalCAToCashWithOutChq;
        return this.apiService.post(url, json);
    }

    withdrawSAToCash(withdraw: Withdraw, branchCode: string) {
        const json = {

            "branch_code": branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "cust_id": withdraw.from.custCif,
            "sa_account_no": withdraw.from.accountNumber,
            "fee_amount": withdraw.fee.amount,
            "orgbrncode": "0016",
        };

        const url = API.withdrawSAToCash;
        return this.apiService.post(url, json);
    }

    withdrawTDtoCash(withdraw: Withdraw, branchCode: string) {
        const json = {
            "branch_code": branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "td_account_no": withdraw.from.accountNumber,
            "dep_no": withdraw.selectedIndexPrincipal,
            "penalty_flag": withdraw.isPenaltyFlag(),
            "fee_amount": withdraw.fee.amount,
            "fee_gl_account_to": withdraw.fee.fee_gl_account_to,
            "orgbrncode": "0016",
        };

        const url = API.withdrawTDToCash;
        return this.apiService.post(url, json);
    }

    withdrawalCAToChequeWithChq(withdraw: Withdraw, branchCode: string) {
        const json = {
            "bank_code": withdraw.from.bank.code,
            "branch_code": branchCode,
            "instrument_no": withdraw.from.micrResult,
            "ca_account_no": withdraw.from.accountNumber,
            "amount": Utils.toStringNumber(withdraw.amount),
            "codorgbrn": branchCode,
            "micr_no": withdraw.to.micrResult,
            "stock_serial_no": withdraw.to.stock_serial_no,
            "beneficiary_name": withdraw.to.beneficiary_name,
            "fee_amount": withdraw.fee.amount,
            "orgbrncode": "0016"

        };

        const url = API.withdrawalCAToChequeWithChq;
        return this.apiService.post(url, json);
    }

    withdrawalCAToChequeWithOutChq(withdraw: Withdraw, branchCode: string) {
        const json = {
            "branch_code": branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "cust_id": withdraw.from.custCif,
            "ca_account_no": withdraw.from.accountNumber,
            "fee_gl_account_to": withdraw.fee.fee_gl_account_to,
            "fee_amount": withdraw.fee.amount,
            "orgbrncode": "0016",
        };

        const url = API.withdrawalCAToChequeWithOutChq;
        return this.apiService.post(url, json);
    }

    withdrawSAToCheque(withdraw: Withdraw, branchCode: string) {
        const json = {
            "bank_code": withdraw.to.bank.code,
            "branch_code": branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "cust_id": withdraw.from.custCif,
            "sa_account_no": withdraw.from.accountNumber,
            "micr_no": withdraw.to.micrResult,
            "stock_serial_no": withdraw.to.stock_serial_no,
            "beneficiary_name": withdraw.to.beneficiary_name,
            "fee_gl_account_to": withdraw.fee.fee_gl_account_to,
            "fee_amount": withdraw.fee.amount,
            "orgbrncode": "0016"
        };

        const url = API.withdrawSAToCheque;
        return this.apiService.post(url, json);
    }

    withdrawTDToCheque(withdraw: Withdraw, branchCode: string) {
        const json = {
            "bank_code": withdraw.to.bank.code,
            "branch_code": branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "td_account_no": withdraw.from.accountNumber,
            "dep_no": withdraw.selectedIndexPrincipal,
            "penalty_flag": withdraw.isPenaltyFlag(),
            "stock_no": withdraw.to.micrResult,
            "stock_serial_no": withdraw.to.stock_serial_no,
            "beneficiary_name": withdraw.to.beneficiary_name,
            "fee_gl_account_to": withdraw.fee.fee_gl_account_to,
            "fee_amount": withdraw.fee.amount,
            "orgbrncode": "0016"
        };

        const url = API.withdrawTDToCheque;
        return this.apiService.post(url, json);
    }

    //================ V2 ================
    //CASH
    withdrawalCAToCashWithChq2(withdraw: Withdraw, branchCode: string) {
        const json = {
            "org_brn_code": withdraw.from.branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "instrument_no": withdraw.from.micrResult,
            "ca_account_no": withdraw.from.accountNumber,
            "gl_brn_code": branchCode,
        };

        const url = API.withdrawalCAToCashWithChq2;
        return this.apiService.post(url, json);
    }

    withdrawalCAToCashWithOutChq2(withdraw: Withdraw, branchCode: string) {
        const json = {
            "org_brn_code": withdraw.from.branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "cust_id": withdraw.from.custCif,
            "ca_account_no": withdraw.from.accountNumber,
            "gl_brn_code": branchCode,
        };

        const url = API.withdrawalCAToCashWithOutChq2;
        return this.apiService.post(url, json);
    }

    withdrawSAToCash2(withdraw: Withdraw, branchCode: string) {
        const json = {
            "org_brn_code": withdraw.from.branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "cust_id": withdraw.from.custCif,
            "sa_account_no": withdraw.from.accountNumber,
            "gl_brn_code": branchCode
        };

        const url = API.withdrawSAToCash2;
        return this.apiService.post(url, json);
    }

    withdrawTDtoCash2(withdraw: Withdraw, branchCode: string) {
        const json = {
            "gl_brn_code": withdraw.from.branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "td_account_no": withdraw.from.accountNumber,
            "dep_no": withdraw.selectedIndexPrincipal,
            "penalty_flag": withdraw.isPenaltyFlag()
        };

        const url = API.withdrawTDToCash2;
        return this.apiService.post(url, json);
    }

    //CHEQUE

    withdrawalCAToChequeWithChq2(withdraw: Withdraw, branchCode: string) {
        const json = {
            "org_brn_code": withdraw.from.branchCode,
            "instrument_no": withdraw.from.micrResult,
            "ca_account_no": withdraw.from.accountNumber,
            "amount": Utils.toStringNumber(withdraw.amount),
            "to_brn_code": branchCode,
            "gl_brn_code": branchCode,
            "micr_no": withdraw.to.micrResult,
            "stock_serial_no": withdraw.to.stock_serial_no,
            "beneficiary_name": withdraw.to.beneficiary_name,
        };

        const url = API.withdrawalCAToChequeWithChq2;
        return this.apiService.post(url, json);
    }

    withdrawalCAToChequeWithOutChq2(withdraw: Withdraw, branchCode: string) {
        const json = {
            "org_brn_code": withdraw.from.branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "cust_id": withdraw.from.custCif,
            "ca_account_no": withdraw.from.accountNumber,
            "gl_brn_code": branchCode,
        };

        const url = API.withdrawalCAToChequeWithOutChq2;
        return this.apiService.post(url, json);
    }

    withdrawSAToCheque2(withdraw: Withdraw, branchCode: string) {
        const json = {
            "org_brn_code": withdraw.from.branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "cust_id": withdraw.from.custCif,
            "sa_account_no": withdraw.from.accountNumber,
            "to_brn_code": branchCode,
            "micr_no": withdraw.to.micrResult,
            "gl_brn_code": branchCode,
            "stock_serial_no": withdraw.to.stock_serial_no,
            "beneficiary_name": withdraw.to.beneficiary_name
        };

        const url = API.withdrawSAToCheque2;
        return this.apiService.post(url, json);
    }

    withdrawTDToCheque2(withdraw: Withdraw, branchCode: string) {
        const json = {
            "to_brn_code": branchCode,
            "amount": Utils.toStringNumber(withdraw.amount),
            "td_account_no": withdraw.from.accountNumber,
            "dep_no": withdraw.selectedIndexPrincipal,
            "penalty_flag": withdraw.isPenaltyFlag(),
            "gl_brn_code": withdraw.from.branchCode,
            "stock_no": withdraw.to.micrResult,
            "stock_serial_no": withdraw.to.stock_serial_no,
            "beneficiary_name": withdraw.to.beneficiary_name
        };

        const url = API.withdrawTDToCheque2;
        return this.apiService.post(url, json);
    }

}