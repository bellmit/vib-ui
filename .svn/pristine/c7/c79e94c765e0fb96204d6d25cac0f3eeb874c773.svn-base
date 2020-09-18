import * as moment from "moment";
import { BankAccount } from "./bankAccount";
import { Fee } from "./fee";
import { TransferType } from "./transfer";
import { TermDepositList } from "./termDepositList";
import { isNullOrUndefined } from "util";
import { Product } from "./Product";

export let ReceiveType = {
    BankAC: "BANKAC",
    NationID: "NATID",
    MobileID: "MSISDN",
    EWalletID: "EWALLETID"
};

export let PaymentType = {
    FundTransfer: "01",
    Cash: "02",
    Cheque: "03",
    Bookbank: "04",
    Investment: "05"
};

export let InvestType = {
    LTF: "L",
    RMF: "R"
}

export let ChequeType = {
    CurrentChq: "01",
    CashierChq: "02"
}

export let SelectType = {
    CHEQUE_CASH: "CHEQUE_CASH",
    CHEQUE_BookBank: "CHEQUE_BookBank",
    BookBank_CASH: "BookBank_CASH",
    CABookBank_ScanChq: "CABookBank_ScanChq",
    LTF_RMF: "LTF_RMF"
}

export let TransactionStatus = {
    selectType: "S1",
    inputData: "S2",
    confirmation: "S3",
    complete: "S4",
    Cashto: "S5",
    waitCash: "waitCash",
    ScanCheque: "S6",
    scan_wait: "scan_wait",
    scan_success: "S7",
    scan_false: "S8",
    inputCheque: "S9",
    close: "S10",
    AddCheque: 'S11',
    Chequeto: "S12",
    Addbarcode: "S13",
    generateOtp: "generateOtp",
    favorite: "favorite",
    dataList: "dataList",
    detail: "detail",
    postTransaction: "postTransaction",
    inputCard: "inputCard"
};

export class Transaction {

    public status = TransactionStatus;

    from: BankAccount;
    to: BankAccount;
    temp: BankAccount;
    fee: Fee;
    product: Product;
    fromFix: boolean = false;
    toFix: boolean = false;
    referenceNo: string;
    fee_gl_account_to: string = null;
    amount: string = null;
    barcode_no: string = null;
    totalAmount: number = 0;
    effectiveDate;
    transactionDateTime;
    currentStatus: string;
    receiveType: string = ReceiveType.BankAC;
    paymentType: string = PaymentType.FundTransfer;
    paymentTypeFee: string = PaymentType.FundTransfer;
    selectedIndexPrincipal = null;
    selectedTermDepositList?: TermDepositList;
    selectedUnitHolder;
    selectedFund;
    loginfrom: string = null;
    ignoreAccountNO: string;
    Inputfrom: string;
    channel_type: boolean = false;
    balanceAvailable;
    transactionType: string = '';
    chequeObject;
    stock_serial_no: string;
    investType: string;
    investGroupType: string;
    bank_code_org: string;
    feeType;
    isActiveData: string;
    isTellerApproved: boolean = false;
    /////STATE////
    isCheque: boolean = false;
    FeeList: any[];
    CreditDate: string;
    DebitDate: string;
    FeeTransferType: string;
    ottValue: string;

    //////////////
    constructor() {

        this.effectiveDate = moment();
        this.transactionDateTime = moment();
        this.from = new BankAccount();
        this.to = new BankAccount();
        this.temp = new BankAccount();
        this.fee = new Fee();
    }

    isPenaltyFlag() {

        if (isNullOrUndefined(this.selectedTermDepositList)) {
            return 'N';
        }

        const today = this.transactionDateTime;
        const maturityDate = this.selectedTermDepositList.dateMaturity;
        const days = maturityDate.diff(today, 'days', true);
        return days < 0 ? "Y" : "N";
    }

    isShowFeePicker() {

        if (!isNullOrUndefined(this.fee.feeDetailList)) {
            if (this.transactionType === TransferType.CASA_InterBank &&
                !this.to.bank.isKiatnakinBank() && !this.to.bank.isPromptPay()) {
                return true
            }
        }

        return false;

    }
}