import {PaymentType, Transaction} from "./transaction";
import {isNullOrUndefined} from "util";
import {Cheque} from "./cheque";
import {TransferType} from "./transfer";
import { AppConstant } from "../../share/app.constant";

/**
 * Created by imac on 6/14/2017 AD.
 */

export let WithdrawType = {
    CASA_CASH: "CASA_Cash",
    TD_CASH: "TD_Cash",
    CASA_CHEQUE: "CASA_BankerChq",
    TD_CHEQUE: "TD_BankerChq",
    BankerChq_CASH: "BankerChq_CASH"
};

export class Withdraw extends Transaction {

    referenceNo: string;
    totalAmount: number;

    public imagelogo() {
        return "./assets/kiatnakin/image/icon_type_withdraw.png";
    }

    public updateWithdrawType() {

        const sourceType = this.from.accountType;
        const destinationType = this.to.accountType;

        const CASA = [AppConstant.ProdTypeCurrent, AppConstant.ProdTypeSaving];
        const TD = [AppConstant.ProdTypeFix];

        this.checkWithdrawTypeCASACash(sourceType, destinationType, CASA);
        this.checkWithdrawTypeTDCash(sourceType, destinationType, TD);
        this.checkWithdrawTypeCASACheque(sourceType, destinationType, CASA);
        this.checkWithdrawTypeTDCheque(sourceType, destinationType, TD);
        this.checkWithdrawTypeBankerCheque(sourceType, destinationType);
        return;
    }

    private checkWithdrawTypeCASACash(sourceType, destinationType, CASA) {
        if (CASA.indexOf(sourceType) !== -1 && PaymentType.Cash === destinationType || sourceType === PaymentType.Cheque || destinationType === PaymentType.Cheque) {
            this.transactionType = WithdrawType.CASA_CASH;
            if (this.to.isSearchByNumber) {
                this.transactionType = WithdrawType.CASA_CASH;
            }
        }
    }

    private checkWithdrawTypeTDCash(sourceType, destinationType, TD) {
        if (TD.indexOf(sourceType) !== -1 && PaymentType.Cash === destinationType) {
            this.transactionType = WithdrawType.TD_CASH;
        }
    }

    private checkWithdrawTypeCASACheque(sourceType, destinationType, CASA) {
        if (CASA.indexOf(sourceType) !== -1 && PaymentType.Cheque === destinationType || sourceType === PaymentType.Cheque && destinationType === PaymentType.Cheque) {
            this.transactionType = WithdrawType.CASA_CHEQUE;
            if (this.to.isSearchByNumber) {
                this.transactionType = WithdrawType.CASA_CHEQUE;
            }
        }
    }

    private checkWithdrawTypeTDCheque(sourceType, destinationType, TD) {
        if (TD.indexOf(sourceType) !== -1 && PaymentType.Cheque === destinationType) {
            this.transactionType = WithdrawType.TD_CHEQUE;
        }
    }

    private checkWithdrawTypeBankerCheque(sourceType, destinationType) {
        if (PaymentType.Cheque === sourceType && PaymentType.Cash === destinationType) {
            this.transactionType = WithdrawType.BankerChq_CASH;
        }
    }
}

