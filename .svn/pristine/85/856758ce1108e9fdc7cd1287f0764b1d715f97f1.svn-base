import { Injectable } from '@angular/core';
import { API, AppConstant, JSONKey } from "../../../share/app.constant";
import { APIService } from "./api.service";
import { Fee } from "../../_model/fee";
import { Utils, Environment } from "../../../share/utils";
import { Transfer, Fee_Type } from "../../_model/transfer";
import { ValidateTransfer } from 'app/kiatnakin/_model/validateTransfer';
import { TransferTDtoTDFund } from 'app/kiatnakin/_model/TransferTDtoTDFund';
import { TransferTDtoCASAFund } from 'app/kiatnakin/_model/TransferTDtoCASAFund';
import { TransferCASAtoTDFund } from 'app/kiatnakin/_model/TransferCASAtoTDFund';

@Injectable()
export class TransferService {
    constructor(private apiService: APIService) {
    }

    checkTargetFee(transfer: Transfer) {
        const json = {
            [JSONKey.AccountNoFrom]: transfer.from.accountNumber,
            [JSONKey.AccountNoReceiving]: transfer.to.accountNumber,
            [JSONKey.TransferAmount]: Utils.toStringNumber(transfer.amount),
            [JSONKey.EffectiveDate]: transfer.effectiveDate,
            [JSONKey.PayType]: transfer.paymentTypeFee,
            [JSONKey.ReceivingType]: transfer.receiveType,
            [JSONKey.ReceivingBankCode]: transfer.to.bank.code,
            [JSONKey.TransferType]: transfer.feeType === Fee_Type.SMARTNEXTDAY ? transfer.feeType : null,
        };

        const header = {
            [JSONKey.TransferType]: transfer.transactionType
        };

        const url = API.CheckTargetFee;
        return this.apiService.postVIBWithHeader(url, json).map(jsonData => new Fee(jsonData.data));
    }

    transferCASAtoTDFund(transfer: TransferCASAtoTDFund) {

        const json = {
            "benefit_account": transfer.benefit_account, // บัญชีรับดอกเบี้ย
            "casa_account_number": transfer.casa_account_number, // บัญชีต้นทาง
            "int_term": transfer.int_term, // ความถี่
            "int_term_code": transfer.int_term_code, // code ของ ความถี่
            "placement_amount": Utils.replaceAll(transfer.placement_amount, ',', ''), // ยอดเงิน
            "product_code": transfer.product_code, // product code td
            "td_group_number": transfer.td_group_number, // เลขบัญชี td
            "teller_id": transfer.teller_id, // ไม่ส่ง
            "term": transfer.term,  // ระยะเวลาในการฝาก
            "term_code": transfer.term_code // code ระยะเวลาในการฝาก
          }

        const url = API.TransferCASAtoTDFund;
        return this.apiService.postVIBWithHeader(url, json);
    }

    transferTDtoCASAFund(transfer: TransferTDtoCASAFund) {

        const json = {
            "accrued_int": transfer.accrued_int, // ไม่ส่ง
            "casa_account": transfer.casa_account, // บัญชีปลายทาง
            "fee_amount": transfer.fee_amount, // 0 เสมอ
            "penalty_amount": Utils.replaceAll(transfer.penalty_amount, ',', ''), // this.dataService.transaction.penaltyForEarlyRedeem
            "placement_number": transfer.placement_number, // placement_number
            "redemption_flag": transfer.redemption_flag, // F
            "settle_amount": Utils.replaceAll(transfer.settle_amount, ',', ''), // this.dataService.transaction.amount
            "teller_id": transfer.teller_id, // ไม่ส่ง
            "txn_amount": Utils.replaceAll(transfer.txn_amount, ',', ''), // this.dataService.transaction.amount
            "withholding_amount": Utils.replaceAll(transfer.withholding_tax_amount, ',', '') // this.dataService.transaction.witholdingTax
          }

        const url = API.TransferTDtoCASAFund;
        return this.apiService.postVIBWithHeader(url, json);
    }

    transferTDtoTDFund(transfer: TransferTDtoTDFund) {

        const json = {
            "benefit_account": transfer.benefit_account, // casa
            "int_term": transfer.int_term, // to
            "int_term_code": transfer.int_term_code, // to
            "penalty_amount":  Utils.replaceAll(transfer.penalty_amount, ',', ''), // from
            "placement_amount": Utils.replaceAll(transfer.placement_amount, ',', ''), // from
            "placement_number": transfer.placement_number, // from
            "product_code": transfer.product_code, // to
            "td_group_number": transfer.td_group_number, // to
            "teller_id": transfer.teller_id,
            "term": transfer.term, // to
            "term_code": transfer.term_code, // to
            "withholding_tax_amount": Utils.replaceAll(transfer.withholding_tax_amount, ',' , '') // from
          }

        const url = API.TransferTDtoTDFund;
        return this.apiService.postVIBWithHeader(url, json);
    }

    validateTransfer(model: ValidateTransfer) {
        const json = {
            "txn_type": model.txn_type, // ตามที่เราส่ง
            "account_from": model.account_from,
            "account_to": model.account_to,
            "txn_amount": Utils.replaceAll(model.txn_amount, ',', ''),
            "td_prod_code": model.td_prod_code, // td -> to,
            "benefit_account": Utils.checkEmptyValue(model.benefit_account)
          }

        const url = API.ValidateTransfer;
        return this.apiService.postVIBWithHeader(url, json);
    }

    getdatenow() {
        const json = {}
        const url = API.getdatenow;
        return this.apiService.post(url, json);
    }

    resendMachineOtt() {
        const json = {}
        const url = API.ResendMachineOtt;
        return this.apiService.postVIBWithHeader(url, json);
    }
}
