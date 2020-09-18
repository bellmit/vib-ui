import {Injectable} from '@angular/core';
import {API, JSONKey, AppConstant} from "../../../share/app.constant";
import {Utils} from "../../../share/utils";
import {Fee} from "../../_model/fee";
import {APIService} from "./api.service";
import {Deposit} from "../../_model/deposit";

@Injectable()
export class DepositService {

    constructor(private  apiService: APIService) {
    }

    checkReceivingOtherBankStatus(branchCode: string, clearingType: string) {

        const json = {
            "branch_code": branchCode,
            "clearing_type": clearingType
        };

        const url = API.CheckReceivingOtherBankStatus;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositChqtoCASA(deposit: Deposit, branchCode_Cheque: string) {

        const json = {
            "bank_code": deposit.from.bank.code,
            "branch_code": branchCode_Cheque,
            "bc_serial_no": deposit.stock_serial_no,
            "micr_no": deposit.from.micrResult,
            "instrumentamt": Utils.toStringNumber(deposit.amount),
            "amount": Utils.toStringNumber(deposit.amount),
            "casa_account_no": deposit.to.accountNumber,
            "fee_amount": deposit.fee.amount,
            "orgbrncode": "0016"
        };

        const url = API.DepositChqtoCASA;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositChqtoTD(deposit: Deposit, branchCode_Cheque: string) {

        const json = {
            "bank_code": deposit.from.bank.code,
            "branch_code": branchCode_Cheque,
            "bc_serial_no": deposit.stock_serial_no,
            "micr_no": deposit.from.micrResult,
            "amount": Utils.toStringNumber(deposit.amount),
            "td_account_no": deposit.to.accountNumber,
            "term_month": deposit.selectedTDTerm.month,
            "freq_int_pay": deposit.selectedTDTerm.freqIntPay,
            "fee_amount": deposit.fee.amount,
            "orgbrncode": "0016",
        };

        const url = API.DepositChqtoTD;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositCashToCASA(deposit: Deposit, branchCode: string) {

        const json = {
            "branch_code": branchCode,
            "amount": Utils.toStringNumber(deposit.amount),
            "casa_account_no": deposit.to.accountNumber,
            "fee_amount": deposit.fee.amount,
            "orgbrncode": "0016",
        };

        const url = API.DepositCashtoCASA;
        return this.apiService.postVIBWithHeader(url, json);
    }

    //================ V2 ================
    //CASH
    depositCashToCASA2(deposit: Deposit, branchCode: string) {

        const json = {
            "gl_brn_code": branchCode,
            "amount": Utils.toStringNumber(deposit.amount),
            "casa_account_no": deposit.to.accountNumber
        };

        const url = API.DepositCashtoCASA2;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositCashToTD(deposit: Deposit, branchCode: string) {

        const json = {
            "gl_brn_code": branchCode,
            "amount": Utils.toStringNumber(deposit.amount),
            "td_account_no": deposit.to.accountNumber,
            "term_month": deposit.selectedTDTerm.month,
            "freq_int_pay": deposit.selectedTDTerm.freqIntPay || 0
        };

        const url = API.DepositCashtoTD;
        return this.apiService.postVIBWithHeader(url, json);
    }

    //CHEQUE
    depositCashierChqtoCASA(deposit: Deposit, branchCode: string) {

        const json = {
            "gl_brn_code": branchCode,
            "from_brn_code": deposit.from.branchCode,
            "bc_serial_no": deposit.stock_serial_no,
            "micr_no": deposit.from.micrResult,
            "amount": Utils.toStringNumber(deposit.amount),
            "casa_account_no": deposit.to.accountNumber
        };

        const url = API.DepositCashierChqtoCASA;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositCashierChqtoTD(deposit: Deposit, branchCode: string) {

        const json = {
            "from_brn_code": deposit.from.branchCode,
            "gl_brn_code": branchCode,
            "bc_serial_no": deposit.stock_serial_no,
            "micr_no": deposit.from.micrResult,
            "amount": Utils.toStringNumber(deposit.amount),
            "td_account_no": deposit.to.accountNumber,
            "term_month": deposit.selectedTDTerm.month,
            "freq_int_pay": deposit.selectedTDTerm.freqIntPay || 0
        };

        const url = API.DepositCashiercChqtoTD;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositCurrentChqtoCASA(deposit: Deposit, branchCode: string) {

        const json = {
            "instrument_no": deposit.from.micrResult,
            "ca_account_no": deposit.from.accountNumber,
            "amount": Utils.toStringNumber(deposit.amount),
            "gl_brn_code": branchCode,
            "org_brn_code": deposit.from.branchCode,
            "casa_account_no": deposit.to.accountNumber
        };

        const url = API.DepositCurrentChqtoCASA;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositCurrentChqtoTD(deposit: Deposit, branchCode: string) {

        const json = {
            "instrument_no": deposit.from.micrResult,
            "ca_account_no": deposit.from.accountNumber,
            "amount": Utils.toStringNumber(deposit.amount),
            "gl_brn_code": branchCode,
            "org_brn_code": branchCode || "",
            "td_account_no": deposit.to.accountNumber,
            "term_month": deposit.selectedTDTerm.month,
            "freq_int_pay": deposit.selectedTDTerm.freqIntPay
        };

        const url = API.DepositCurrentChqtoTD;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositOtherBankChqtoCASA(deposit: Deposit, branchCode_Cheque: string) {

        const json = {
            "from_bank_code": deposit.from.bank.code,
            "from_brn_code": deposit.from.branch_no_org,
            "instrument_no": deposit.from.micrResult,
            "clearing_type": "",
            "amount": Utils.toStringNumber(deposit.amount),
            "casa_account_no": deposit.to.accountNumber,
            "drawer_account_no": "",
            "org_brn_code": deposit.from.branch_no_org
        };

        const url = API.DepositCashiercChqtoTD;
        return this.apiService.postVIBWithHeader(url, json);
    }

    depositOtherBankChqtoTD(deposit: Deposit, branchCode_Cheque: string) {

        const json = {
            "from_bank_code": deposit.from.bank.code,
            "from_brn_code": deposit.from.branch_no_org,
            "amount": Utils.toStringNumber(deposit.amount),
            "org_brn_code": deposit.from.branch_no_org,
            "instrument_no": deposit.from.micrResult,
            "drawer_account_no": "",
            "clearing_type": "",
            "gl_brn_code": branchCode_Cheque,
            "td_account_no": deposit.to.accountNumber,
            "term_month": deposit.selectedTDTerm.month,
            "freq_int_pay": deposit.selectedTDTerm.freqIntPay
        };

        const url = API.DepositCashiercChqtoTD;
        return this.apiService.postVIBWithHeader(url, json);
    }

    Buycashierchqbycash(deposit: Deposit, branchCode: string) {
        const json = {
            "to_brn_code": branchCode,
            "amount": Utils.toStringNumber(deposit.amount),
            "micr_no": deposit.to.micrResult,
            "gl_brn_code": branchCode,
            "stock_serial_no": deposit.to.stock_serial_no,
            "beneficiary_name": deposit.to.beneficiary_name,
        };

        const url = API.BuyCashierChqByCash;
        return this.apiService.postVIBWithHeader(url, json);
    }
}