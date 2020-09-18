import {PaymentType, Transaction} from "./transaction";
import {InterestRate} from "./interestRate";
import {FrequencyTerm} from "./frequencyTerm";
import {isNullOrUndefined} from "util";
import { AppConstant } from "../../share/app.constant";

export let DepositType = {
    CASH_CASA: "Cash_CASA",
    CASH_TD: "Cash_TD",
    CASH_InterBank: "Cash_InterBank",
    CHEQUE_CASA: "BankerChq_CASA",
    CHEQUE_TD: "BankerChq_TD",
    CHEQUE_InterBank: "BankerChq_InterBank",
    OTHERBANKCHEQUE_InterBank: "OtherBankChq_InterBank",
    OTHERBANKCHEQUE_CASA: "OtherBankChq_CASA",
    OTHERBANKCHEQUE_TD: "OtherBankChq_TD"
};

export let BuyChqType = {
    Buy_ChqBook: "Buy_ChqBook",
    CASH_BankChq: "Cash_BankerChq",
    CASA_BankChq: "CASA_BankerChq",
    TD_BankChq: "TD_BankerChq"
};

export class Deposit extends Transaction {

    referenceNo: string;
    amount: string = null;
    totalAmount: number;
    selectedTDTerm?: any;
    selectedTDTermTitle?: string;
    selectedFrequency?: FrequencyTerm;
    interestRate?: InterestRate;

    public updateDepositType() {

        const sourceType = this.from.accountType;
        const destinationType = this.to.accountType;

        console.log(sourceType + "   " + destinationType);

        const CASA = [AppConstant.ProdTypeCurrent, AppConstant.ProdTypeSaving];
        const TD = [AppConstant.ProdTypeFix];
        const INTER = ["INTER"];

        this.checkPaymentTypeCashCASA(sourceType, destinationType, CASA);
        this.checkPaymentTypeCashInterbank(sourceType, destinationType, INTER);
        this.checkPaymentTypeCashTD(sourceType, destinationType, TD);
        this.checkPaymentTypeChequeCASA(sourceType, destinationType, CASA);
        this.checkPaymentTypeChequeInterbank(sourceType, destinationType, INTER);
        this.checkPaymentTypeChequeTD(sourceType, destinationType, TD);

        return;
    }

    public checkPaymentTypeCashCASA(sourceType, destinationType, CASA) {
        if (PaymentType.Cash === sourceType && CASA.indexOf(destinationType)) {
            if (this.to.isSearchByNumber && !this.to.bank.isKiatnakinBank()) {
                this.transactionType = DepositType.CASH_InterBank;
            } else {
           this.transactionType = DepositType.CASH_CASA;
            }
        }
    }

    public checkPaymentTypeCashInterbank(sourceType, destinationType, INTER) {
        if (PaymentType.Cash === sourceType && INTER.indexOf(destinationType) !== -1) {
            this.transactionType = DepositType.CASH_InterBank;
        }
    }

    public checkPaymentTypeCashTD(sourceType, destinationType, TD) {
        if (PaymentType.Cash === sourceType && TD.indexOf(destinationType) !== -1) {
            this.transactionType = DepositType.CASH_TD;
        }
    }

    public checkPaymentTypeChequeCASA(sourceType, destinationType, CASA) {
        if (PaymentType.Cheque === sourceType && CASA.indexOf(destinationType) !== -1) {
            if (this.from.bank.isKiatnakinBank()) {
                this.transactionType = DepositType.CHEQUE_CASA;
            }
            else {
                this.transactionType = DepositType.OTHERBANKCHEQUE_CASA;
            }
        }
    }

    public checkPaymentTypeChequeInterbank(sourceType, destinationType, INTER) {
        if (PaymentType.Cheque === sourceType && INTER.indexOf(destinationType) !== -1) {
            if (this.from.bank.code === '069') {
                this.transactionType = DepositType.CHEQUE_InterBank;
            } else {
                this.transactionType = DepositType.OTHERBANKCHEQUE_InterBank;
            }

        }
    }

    public checkPaymentTypeChequeTD(sourceType, destinationType, TD) {
        if (PaymentType.Cheque === sourceType && TD.indexOf(destinationType) !== -1) {
            if (this.from.bank.isKiatnakinBank()) {
                this.transactionType = DepositType.CHEQUE_TD;
            }
            else {
                this.transactionType = DepositType.OTHERBANKCHEQUE_TD;
            }
        }
    }

    public updateChqType() {

        const sourceType = this.from.accountType;
        const destinationType = this.to.accountType;

        console.log(sourceType + "   " + destinationType);

        const CASA = [AppConstant.ProdTypeCurrent, AppConstant.ProdTypeSaving];
        const TD = [AppConstant.ProdTypeFix];

        if (isNullOrUndefined(sourceType) && CASA.indexOf(destinationType) !== -1) {
            this.transactionType = BuyChqType.Buy_ChqBook;
        }

        if (PaymentType.Cash === sourceType && PaymentType.Cheque === destinationType) {
            this.transactionType = BuyChqType.CASH_BankChq;
        }

        if (CASA.indexOf(sourceType) !== -1 && PaymentType.Cheque === destinationType) {
            this.transactionType = BuyChqType.CASA_BankChq;
        }

        if (TD.indexOf(sourceType) !== -1 && PaymentType.Cheque === destinationType) {
            this.transactionType = BuyChqType.TD_BankChq;
        }
        return
    }
}
