import {isNullOrUndefined} from "util";
import {InterestRate} from "./interestRate";
import {Transaction} from "./transaction";
import * as moment from "moment";
import {FrequencyTerm} from "./frequencyTerm";
import { AppConstant } from "../../share/app.constant";

export let TransferType = {
    CASA_CASA: "CASA_CASA", // 1
    CASA_TD: "CASA_TD", // 2
    TD_CASA: "TD_CASA", // 3
    TD_TD: "TD_TD", // 4
    CASA_InterBank: "CASA_Interbank", // 5
    TD_InterBank: "TD_Interbank", // 6
    TD_none: "TD_None", // 7
    CASH_CASA: "CASH_CASA"
}

export let Fee_Type = {
    KK: "01", //kk
    BAHTNET: "02",
    SMARTSAMEDAY: "03",
    SMARTNEXTDAY: "04",
    ORFT: "15", // interbank
    ANYID_OFFUS_IN: "21",
    ANYID_ONUS: "22",
    ANYID_OFFUS: "23" //interbank : promtpay
};

/* CASA: Current Account, Saving Account
 * TD: Term Deposit */

export class Transfer extends Transaction {


    feeType;
    maturityDate?;
    selectedTDTerm?: any;
    selectedTDTermTitle?: string;
    selectedFrequency?: FrequencyTerm;
    interestRate?: InterestRate;

    updateTransferType() {

        const sourceType = this.from.accountType;
        const destinationType = this.to.accountType;
        const CASA = [AppConstant.ProdTypeCurrent, AppConstant.ProdTypeSaving];
        const TD = [AppConstant.ProdTypeFix];

        this.checkTransferTypeTDNone(sourceType, destinationType);
        this.checkTransferTypeInterbank(sourceType, destinationType, CASA);
        this.checkTransferTypeCASAtoCASA(sourceType, destinationType, CASA);
        this.checkTransferTypeCASAtoTD(sourceType, destinationType, CASA, TD);
        this.checkTransferTypeTDtoCASA(sourceType, destinationType, TD, CASA);
        this.checkTransferTypeTDtoTD(sourceType, destinationType, TD);

        this.checkFeeSmartNextDay(this.transactionType);
        return;
    }

    private checkTransferTypeTDNone(sourceType, destinationType) {
        if (sourceType === "TD" && destinationType === null) {
            this.transactionType = TransferType.TD_none;
        } else {
            this.transactionType = TransferType.CASA_CASA;
            this.feeType = Fee_Type.KK;
            if (isNullOrUndefined(sourceType) || isNullOrUndefined(destinationType)) {
                return;
            }
        }
    }

    private checkTransferTypeInterbank(sourceType, destinationType, CASA) {
        if (destinationType === "INTER") {
            if (CASA.indexOf(sourceType) !== -1) {
                this.transactionType = TransferType.CASA_InterBank;

                if (this.to.bank.code === '099') { //promtpay
                    this.feeType = Fee_Type.ANYID_OFFUS;
                } else {
                    this.feeType = Fee_Type.ORFT;
                }
            }
            else {
                return;
            }
        }
    }

    private checkTransferTypeCASAtoCASA(sourceType, destinationType, CASA) {
        if (CASA.indexOf(sourceType) !== -1 && CASA.indexOf(destinationType) !== -1) {
            this.transactionType = TransferType.CASA_CASA;
            this.feeType = Fee_Type.KK;

            if (this.to.isSearchByNumber && !this.to.bank.isKiatnakinBank()) {
                this.transactionType = TransferType.CASA_InterBank;
                this.feeType = Fee_Type.ANYID_OFFUS
            }
        }
    }

    private checkTransferTypeCASAtoTD(sourceType, destinationType, CASA, TD) {
        if (CASA.indexOf(sourceType) !== -1 && TD.indexOf(destinationType) !== -1) {
            this.transactionType = TransferType.CASA_TD;
            this.feeType = Fee_Type.KK;

            if (this.to.isSearchByNumber && !this.to.bank.isKiatnakinBank()) {
                this.transactionType = TransferType.CASA_InterBank;
            }
        }
    }

    private checkTransferTypeTDtoCASA(sourceType, destinationType, TD, CASA) {
        if (TD.indexOf(sourceType) !== -1 && CASA.indexOf(destinationType) !== -1) {
            this.transactionType = TransferType.TD_CASA;
            this.feeType = Fee_Type.KK;

            if (this.to.isSearchByNumber && !this.to.bank.isKiatnakinBank()) {
                this.transactionType = TransferType.TD_InterBank;
                this.feeType = Fee_Type.ANYID_OFFUS;
            }
        }
    }

    private checkTransferTypeTDtoTD(sourceType, destinationType, TD) {
        if (TD.indexOf(sourceType) !== -1 && TD.indexOf(destinationType) !== -1) {
            this.transactionType = TransferType.TD_TD;
            this.feeType = Fee_Type.KK;

            if (this.to.isSearchByNumber && !this.to.bank.isKiatnakinBank()) {
                this.transactionType = TransferType.TD_InterBank;
                this.feeType = Fee_Type.ANYID_OFFUS;
            }
        }
    }

    private checkFeeSmartNextDay(transactionType) {
        if (transactionType === TransferType.TD_InterBank ||
            transactionType === TransferType.CASA_InterBank) {

            const today = moment();
            if (today.diff(this.effectiveDate, "days", true) < 0) {
                this.feeType = Fee_Type.SMARTNEXTDAY;
            }
        }
    }
}
