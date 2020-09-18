import { Injectable } from '@angular/core';
import { API, AppConstant, JSONKey } from "../../../share/app.constant";
import { Utils, Environment } from "../../../share/utils";
import { APIService } from "./api.service";
import { Transaction } from "../../_model/transaction";
import { DepositTerm } from "../../_model/depositTerm";
import { PromotionTerm } from "../../_model/promotionTerm";
import { FrequencyTerm } from "../../_model/frequencyTerm";
import { InterestRate } from "../../_model/interestRate";
import { Fee } from "../../_model/fee";
import { TdRate } from 'app/kiatnakin/_model/TdRate';

@Injectable()
export class TransactionService {
    constructor(private apiService: APIService) {
    }

    // Fee

    getTargetFee(transaction: Transaction) {
        const json = {
            ["fee_type"]: transaction.transactionType,
            ["amount"]: Utils.toStringNumber(transaction.amount),
            ["account_no_from"]: transaction.from.accountNumber,
            ["account_no_to"]: transaction.to.accountNumber,
            ["org_bank_code"]: AppConstant.bankCode,
            ["org_brn_code"]: Environment.branchCode,
            ["from_bank_code"]: transaction.from.bank.code || AppConstant.bankCode,
            ["from_brn_code"]: transaction.from.branchCode || Environment.branchCode,
        }

        const header = {
            [JSONKey.TransferType]: transaction.transactionType
        };

        const url = API.GetTargetFee;
        return this.apiService.post(url, json, header).map(jsonData => new Fee(jsonData.data));
    }

    PayFeesFromCASA(transaction: Transaction) {

        const json = {
            ["fees"]: transaction.fee.FeeList,
            ["org_brn_code"]: Environment.branchCode || "",
            ["cust_id"]: transaction.from.custCif,
            ["casa_account_from"]: transaction.from.accountNumber,
            ["gl_brn_code"]: Environment.branchCode || "",
        };

        const url = API.PayFeesFromCASA;
        return this.apiService.post(url, json);
    }

    PayFees(transaction: Transaction) {
        const json = {
            ["fees"]: transaction.fee.FeeList,
            "from_brn_code": transaction.from.branchCode || Environment.branchCode,
            "org_brn_code": Environment.branchCode,
            "to_brn_code": Environment.branchCode || transaction.to.branch_no_org,
        };

        const url = API.PayFees;
        return this.apiService.post(url, json);
    }

    // Transaction
    getTDTerm(accountNumber: string, transactionAmount: string, transactionDate: string) {
        const json = {
            "td_group_number" : accountNumber,
            "transaction_amount": Utils.replaceAll(transactionAmount, ',', ''),
            "transaction_date": transactionDate
        }

        const url = API.GetTDTerm;
        //return this.apiService.postVIBWithHeader(url, json).map(jsonData => DepositTerm.parseJSONArray(jsonData.data));
        return this.apiService.postVIBWithHeader(url, json);
    }

    getTDTermByDepNO(accountNumber: string, depNO: string) {

        if (depNO === '') {

            const json = {
                [JSONKey.Account_No]: accountNumber
            };

            const url = API.GetTDTermByDepNo;
            return this.apiService.postVIBWithHeader(url, json);

        } else {

            const json = {
                [JSONKey.Account_No]: accountNumber,
                [JSONKey.DepNO]: depNO
            };

            const url = API.GetTDTermByDepNo;
            return this.apiService.postVIBWithHeader(url, json);
        }
    }

    getPromotionList(accountNumber: string, customerType: string, branchCode: string,
        promotionDate: string, cifNo: string, productCode: string) {

        const json = {
            [JSONKey.Account_No]: accountNumber,
            [JSONKey.CustomerType]: customerType,
            [JSONKey.BranchCode]: branchCode,
            [JSONKey.PromotionDate]: promotionDate,
            [JSONKey.ProductCode]: productCode,
            [JSONKey.CIF_NO]: cifNo,
            ["bundle_flag"]: "N"
        };

        const url = API.GetPromotionList;
        return this.apiService.post(url, json).map(jsonData => PromotionTerm.parseJSONArray(jsonData.data));
    }

    getMaturityDate(branchCode: string, termMonth: string, termDay: string, effectiveDate: string) {
        const json = {
            ["branchCode"]: branchCode,
            [JSONKey.TermMonth]: termMonth,
            [JSONKey.TermDay]: termDay,
            ["effectiveDate"]: effectiveDate
        };

        const url = API.GetMaturityDate;
        return this.apiService.post(url, json);
    }

    getTDPayoutFrequency(promotionId: string, productCode: string, termMonth: string,
        termDay: string, effectiveDate: string, amount: string) {
        const json = {
            ["promotion_id"]: promotionId,
            ["product_code"]: productCode,
            ["term_dep"]: termMonth,
            ["term_day"]: termDay,
            ["effective_date"]: effectiveDate,
            [JSONKey.Amount]: amount
        };

        const url = API.GetTDPayoutFrequency;
        return this.apiService.post(url, json).map(jsonData => FrequencyTerm.parseJSONArray(jsonData.data));
    }

    getTDRateOld(accountNumber: string, amount: string,
        effectiveDate: string, depositTerm: DepositTerm,
        custCifNO: string, productCode: string, maturityDate: string,
        transactionDate: string) {

        const json = {
            "productCode": productCode,
            "cifNo": custCifNO,
            "principalAmt": amount,
            "termMonth": depositTerm.month,
            "effectiveDate": effectiveDate,
            "depVariance": "0",
            "flagCustomerType": "L",
            "sopFixedDepositBal": "0",
            "adjustAmt": "0",
            "calDate": transactionDate,
            "sopBEDepositBal": "0",
            "maturityDate": maturityDate,
            "termDay": depositTerm.day,
            "accountNo": accountNumber,
            "freqInterestPay": "0"
        };

        const url = API.GetTDInterestRate;
        return this.apiService.postVIBWithHeader(url, json).map(jsonData => new InterestRate(jsonData.data));
    }

    getTDRate(tdRate: TdRate) {
        const json = {
            "issueDate": tdRate.issueDate,
            "productCode": tdRate.productCode,
            "tdGroupNumber": tdRate.tdGroupNumber,
            "term": tdRate.term,
            "termCode": tdRate.termCode,
            "txnAmount": Utils.replaceAll(tdRate.txnAmount, ',', '')
          }

        const url = API.GetTDInterestRate;
        return this.apiService.postVIBWithHeader(url, json);
    }

    getPromotionRate(cifNo: string, accountNo: string, productCode: string,
        principleAmount: string, promotionTerm: PromotionTerm,
        effectiveDate: string, maturityDate: string) {

        const json = {
            "flagCustomerType": "L",
            "cifNo": cifNo,
            "promotionID": promotionTerm.promotionId,
            "depositDetails": {
                "accountNo": accountNo,
                "principalAmt": principleAmount,
                "termMonth": promotionTerm.month,
                "effectiveDate": effectiveDate,
                "maturityDate": maturityDate,
                "termDay": promotionTerm.day,
                "freqInterestPay": "0",
            }
        }

        const url = API.GetPromotionRate;
        return this.apiService.post(url, json).map(jsonData => new InterestRate(jsonData.data.depositRateDetails));
    }

    transferfund(transaction: Transaction) {

        const effectiveDate = Utils.convertDate(transaction.CreditDate, "DD/MM/YYYY", "YYYY-MM-DD");
        // effectiveDate = Utils.convertDateToAPI(effectiveDate, 'YYYY-MM-DD');
        const json = {
            [JSONKey.EffectiveDate]: effectiveDate,
            [JSONKey.ReferenceNo]: transaction.referenceNo,
            [JSONKey.ReferenceExt]: transaction.fee.refExt,
            [JSONKey.TransferAmount]: Utils.toStringNumber(transaction.amount),
            [JSONKey.TransferType]: transaction.fee.detail.transferType,
            [JSONKey.PayType]: transaction.paymentType,
            [JSONKey.PayTypeOfFee]: transaction.paymentTypeFee,
            [JSONKey.AccountNoFrom]: transaction.from.accountNumber,
            [JSONKey.AccountNameFrom]: transaction.from.accountName,
            [JSONKey.AccountEngNameFrom]: transaction.from.accountName,
            [JSONKey.ReceivingType]: transaction.receiveType,
            [JSONKey.BankCode]: transaction.to.bank.code,
            [JSONKey.AccountNoReceiving]: transaction.to.accountNumber,
            [JSONKey.AccountNameReceiving]: transaction.to.accountName,
            [JSONKey.AccountEngNameReceiving]: transaction.to.accountName,
            [JSONKey.OttValue]: transaction.ottValue
        };
        json[JSONKey.FeeInfo] = transaction.fee.getSubmitFeeParameter();

        const url = API.FundTransferAnyIDs;
        return this.apiService.postVIBWithHeader(url, json);

    }

    checkTransferAmount(transaction: Transaction) {

        const json = {

            "from_account_no": transaction.from.accountNumber,
            "to_account_no": transaction.to.accountNumber,
            "amount": Utils.toStringNumber(transaction.amount),
        };

        const header = {
            [JSONKey.TransferType]: transaction.transactionType
        };

        const url = API.CheckTransferAmount;
        return this.apiService.post(url, json, header);
    }

    CheckTransactionAuthentication(transctionType: string,
        isSameCIF: boolean,
        amount: string,
        authenFactor1: string
    ) {

        const json = {
            "txn_type": transctionType,
            "same_cif": isSameCIF ? "Y" : "N",
            "amount": Utils.toStringNumber(amount),
            "authen_factor_1": authenFactor1 ? authenFactor1 : ""
        };

        const url = API.CheckTransactionAuthentication;
        return this.apiService.postVIBWithHeader(url, json);
    }
    GetConfigList(ref_name: string) {
        const json = {
            "ref_name": ref_name.toUpperCase()
        };

        const url = API.GetConfigList;
        return this.apiService.postVIBWithHeader(url, json, false);
    }

    GetCustAddressListByValue(search_value: string, sub_search_value: string, ref_name: string) {
        const json = {
            "search_value": search_value,
            "sub_search_value": sub_search_value,
            "ref_name": ref_name
        }
        const url = API.GetCustAddressListByValue;
        return this.apiService.postVIBWithHeader(url, json, false);
    }

    getBiller(categoryCode: string) {
        const json = {
            "category_code": categoryCode
        };

        const url = API.GetConfigList;
        return this.apiService.postVIBWithHeader(url, json);
    }

    getPassbook(account_no, account_type, date_from, date_to) {
        const json = {
            ["account_no"]: account_no,
            ["account_type"]: account_type,
            ["date_from"]: (date_from + " 00:00:00"),
            ["date_to"]: (date_to + " 23:59:59")
        };

        const url = API.GetPassbook;
        return this.apiService.postVIBWithHeader(url, json, false);
    }

    getTDPassbook(td_group_no: string) {
        const json = {
            ["td_group_no"]: td_group_no
        }

        const url = API.GetTDPassbook;
        return this.apiService.postVIBWithHeader(url, json);
    }

    CheckEAccount(account_no) {
        const json = {
            ["account_no"]: account_no
        }
        const url = API.CheckEAccount;
        return this.apiService.postVIBWithHeader(url, json);
    }

    getstatementbyfunding(id_no, id_type, account_no, account_type, start_date, date_to) {
        // start_date = '2017-09-01';
        // date_to = '2017-12-31';
        const json = {
            ["account_no"]: account_no,
            ["account_type"]: account_type,
            ["date_from"]: start_date + " 00:00:00",
            ["date_to"]: date_to + " 23:59:59",
            ["id_no"]: id_no,
            ["id_type"]: id_type,
            ["page_index"]: "1",
            ["page_num"]: "9999"
        };

        const url = API.getstatementbyfunding;
        return this.apiService.postVIBWithHeader(url, json);
    }

}