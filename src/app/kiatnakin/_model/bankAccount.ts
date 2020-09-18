import {isNullOrUndefined, isArray} from "util";
import {Bank} from "./bank";
import {json} from "ng2-validation/dist/json";
import {PaymentType} from "./transaction";
import {DataService} from "../_service/data.service";
import {Utils} from "../../share/utils";
import {Cheque} from "./cheque";
import { TransactionPassbook } from "./transactionPassbook";
import { AppConstant } from "app/share/app.constant";
import { TransactionPassbookTD } from "./transactionPassbookTD";

/**
 * Created by SyndereN on 12/30/2016.
 */
export class BankAccount {
    bank: Bank;
    cheque: Cheque;
    custCif: string;
    idType: string;
    accountName: string = '';
    accountNumber: string = '';
    micrResult: string = '';
    micr_no: string = '';
    accountType: string;
    productCode: string;
    ProductDesc: string;
    branchCode: string;
    branchName: string;
    accountStatusCode: string;
    accountStatusDesc: string;
    accountOpenDate: string;
    principalBalance: number;
    holdAmt: string;
    odAmt: string;
    availBalance: number;
    balance: number;
    unclearAmt: string;
    accruIntAmt: string;
    lastTxAmount: string;
    lastTxType: string;
    lastTxDate: string;
    lastTransaction: any;
    enable: boolean = true;
    phoneNumber: string = '';
    depositDetail: any;
    chequeType: string = '';
    bank_code: string;
    stock_serial_no: string;
    cheque_no: string;
    branch_no_org: string;
    trName: string = '';
    beneficiary_name: string;
    user_id: string = '';
    narrative: string;
    citizenID: string;
    transactionPassbook: TransactionPassbook[];
    transactionPassbookTD: TransactionPassbookTD[];
    ///////////////////////////
    isSearchByNumber: boolean = false;
    apiResponseMessage: string;
    apiResponseCode: string;

    public static parseJSONArray(data: any, idCardNo: string = null) {
        let inquiryAccountList = data.data.inquiryAccountList.inquiryAccount;
        //3769900167170
        const list = new Array();
        if (!isArray(inquiryAccountList)) {
            inquiryAccountList = [inquiryAccountList];
        }

        for (const InquiryAccount of inquiryAccountList) {
            list.push(new BankAccount(InquiryAccount, idCardNo));
        }
        return list;
    }

    static getCashAccount() {
        return '101110002';
    }

    static getAccountTypeCash() {
        const bankAccount = new BankAccount();
        bankAccount.accountType = PaymentType.Cash;
        bankAccount.bank.bg_image = './assets/kiatnakin/image/bg_money.png';
        bankAccount.bank.font_color = '#000000';
        bankAccount.bank.image = './assets/kiatnakin/image/cash.png';

        return bankAccount;
    }

    static getAccountTypeCheque() {
        const bankAccount = new BankAccount();
        bankAccount.accountType = PaymentType.Cheque;
        bankAccount.bank.bg_image = './assets/kiatnakin/image/cheque_bg.png';
        bankAccount.accountName = bankAccount.bank.name;
        return bankAccount;
    }

    static getAccountTypeCACheque() {
        const bankAccount = new BankAccount();
        bankAccount.accountType = PaymentType.Cheque;
        bankAccount.bank.bg_image = './assets/kiatnakin/image/KK_Cheque_card.png';
        bankAccount.accountName = bankAccount.bank.name;
        return bankAccount;
    }

    static getBgCACheque() {
        return './assets/kiatnakin/image/KK_Cheque_card.png';
    }

    static getAccountPatara() {
        const bankAccount = new BankAccount();
        bankAccount.accountType = PaymentType.Investment;
        bankAccount.bank.font_color = '#FFFFFF';
        bankAccount.bank.bg_color = '#7270B3';
        bankAccount.bank.image = './assets/kiatnakin/image/investment/patara_white.png';
        return bankAccount;
    }

    constructor(jsonData?: any, idCardNo = null) {

        this.bank = new Bank(null);
        this.cheque = new Cheque();

        this.bank.image = "./assets/kiatnakin/image/icon_transfer_default.png";
        this.bank.font_color = "#FFF";

        if (!isNullOrUndefined(jsonData)) {
            this.custCif = jsonData.custCif;
            this.idType = jsonData.idType;
            this.accountName = jsonData.accountName;
            this.accountNumber = jsonData.accountNo;
            this.accountType = jsonData.accountType;
            this.ProductDesc = jsonData.ProductDesc;
            this.productCode = jsonData.productCode;
            this.branchCode = jsonData.branchCode;
            this.branchName = jsonData.branchName;
            this.accountStatusCode = jsonData.accountStatusCode;
            this.accountStatusDesc = jsonData.accountStatusDesc;
            this.accountOpenDate = jsonData.accountOpenDate;
            this.principalBalance = jsonData.principalBalance;
            this.holdAmt = jsonData.holdAmt;
            this.odAmt = jsonData.odAmt;
            this.availBalance = jsonData.availBalance;
            this.balance = jsonData.availBalanceNet;
            this.unclearAmt = jsonData.unclearAmt;
            this.accruIntAmt = jsonData.accruIntAmt;
            this.lastTxAmount = jsonData.lastTxAmount;
            this.lastTxType = jsonData.lastTxType;
            this.lastTxDate = jsonData.lastTxDate;
            this.lastTransaction = jsonData.lastTransaction;
            this.micrResult = jsonData.micrResult;
            this.phoneNumber = jsonData.phoneNumber;
            this.apiResponseMessage = Utils.checkEmptyValue(jsonData.responseMessage);
            this.apiResponseCode = Utils.checkEmptyValue(jsonData.responseCode);

            if (jsonData.hasOwnProperty("citizenID")) {
                this.citizenID = jsonData.citizenID
            } else {
                this.citizenID = idCardNo
            }
            // this.isSearchByNumber = this.checkIsSearchByNumber(jsonData.accountType);
            this.setKKBank();

            if (jsonData.hasOwnProperty("depositDetailList")) {
                const depositDetail = jsonData.depositDetailList.depositDetail;
                if (!isNullOrUndefined(depositDetail) &&
                    depositDetail.constructor === Array) {
                    this.depositDetail = depositDetail;
                }
            }
        }
    }

    setKKBank() {
        this.bank = Bank.paymentChannel()[1];
    }

    checkIsSearchByNumber(accountType) {
        return (accountType === AppConstant.ProdTypeFix || AppConstant.ProdTypeCurrent) ? true : false;
    }

    isStatusOpen() {
        console.log('After check bankCode', this.bank.code);
        if (this.bank.code === "069") {
            // accountStatusCode(1) = "Active", accountStatusCode(4) = "New Today"
            return this.accountStatusCode === AppConstant.AccountStatusCodeActive || this.accountStatusCode === AppConstant.AccountStatusCodeOpenToday;
        }
        return true;
    }

    getProductCode() {
        let productCode = "";
        if (!isNullOrUndefined(this.accountNumber)) {
            productCode = this.accountNumber.substring(4, 7);
        }
        return productCode;
    }

    getBankCode() {

        if (!isNullOrUndefined(this.branchCode)) {
            return Utils.setPadZero(this.branchCode, 4);
        }
        return '';

    }

}
