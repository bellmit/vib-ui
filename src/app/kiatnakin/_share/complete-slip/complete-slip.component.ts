import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppConstant } from "../../../share/app.constant";
import { DataService } from "../../_service/data.service";
import { BankAccount } from "../../_model/bankAccount";
import { PaymentType, Transaction } from "../../_model/transaction";
import { isNullOrUndefined } from "util";
import { Modal } from "../modal-dialog/modal-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { Utils, Environment } from "../../../share/utils";
import { ToStringNumberPipe } from "../../_pipe/toStringNumber.pipe";
import { DatePipe, NgSwitchCase } from "@angular/common";
import { BahtTextPipe } from "../../_pipe/bahttext.pipe";
import { HardwareService } from "../../_service/hardware.service";
import { UserService } from "../../_service/user.service";
import { TransactionService } from "../../_service/api/transaction.service";
import * as moment from 'moment'
import { Fee_Type } from "../../_model/transfer";
import { Fee } from '../../_model';

@Component({
    selector: 'app-complete-slip',
    templateUrl: './complete-slip.component.html',
    styleUrls: ['./complete-slip.component.sass']
})
export class CompleteSlipComponent implements OnInit {

    @Input() queryParams: Map<string, string>;
    @Output() PrintSlip: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();

    public paymentType = PaymentType;
    public transactionType: string;
    transactionCancel;
    public branchCode_Cheque: string;
    public branchCode: string;
    public fromType: string;
    public toType: string;
    public branchName: string = "";
    public creditDate;
    public debitDate;
    public referenceNo
    public checkSlipInvesment: boolean = false;
    public checkSlipTransfer: boolean = true;

    public creditDateLabel = "";
    public debitDateLabel = "";
    public debitDateisCurrentDate = "";
    public TDRate = "";
    public TDTerm = "";
    public depNoLabel = "";
    public TDTermAndRate = "";
    public TDType = AppConstant.ProdTypeFix;
    // titleCancel = 'กรุณาตรวจสอบรายการยกเลิกทางอีเมลล์ <br>'
    // titlePurchase = 'กรุณาตรวจสอบรายการสั่งซื้อทางอีเมลล์ <br>'

    constructor(public dataService: DataService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private hardwareService: HardwareService,
        public userService: UserService,
        public transactionService: TransactionService) {
        this.hardwareService.connectHardware();
    }

    ngOnInit() {
        this.transactionType = this.queryParams['transactionType'];
        this.transactionCancel = this.queryParams['transactionCancel'];
        this.referenceNo = this.subReferenceNo();
        this.dataService.transaction.transactionDateTime.day = this.dataService.transaction.transactionDateTime.format('DD/MM/YYYY')

        this.checkTransaction();

        this.branchCode = Environment.branchCode;
        this.transactionService.GetConfigList('BRANCH_LIST').subscribe(Data => {
            const DATA = Data.data.filter(value => value.BRANCH_NO === parseInt(this.branchCode, 10));
            this.branchName = DATA[0].BRANCH_ENG_DESC;
        }, error => {

        });

        this.checkTransactionType();

        const toStringNumberPipe = new ToStringNumberPipe();

        this.TDRate = !isNullOrUndefined(this.dataService.transaction.interestRate) ? this.dataService.transaction.interestRate : null;
        this.TDTerm = !isNullOrUndefined(this.dataService.transaction.selectedTDTerm) ? this.dataService.transaction.selectedTDTerm.Term : null;
        this.TDTermAndRate = !isNullOrUndefined(this.TDTerm) && !isNullOrUndefined(this.TDRate) ? `${this.TDTerm} / ${toStringNumberPipe.transform(this.TDRate, 2)}%` : "";

        this.creditDate = !isNullOrUndefined(this.dataService.transaction.CreditDate) ? moment(this.dataService.transaction.CreditDate, "DD/MM/YYYY") : moment();
        this.debitDate = !isNullOrUndefined(this.dataService.transaction.DebitDate) ? moment(this.dataService.transaction.DebitDate, "DD/MM/YYYY") : moment();
        this.debitDateisCurrentDate = this.debitDate.isSame(moment().toISOString(), "day");

        const transferType = this.dataService.transaction.fee.detail.transferType;
        this.debitDateLabel = this.checkDeditDateLabel(transferType);

        this.creditDateLabel = this.creditDate.format("DD/MM/YYYY").toString();
        if (this.dataService.transaction.transactionType === 'TD_CASA' || this.dataService.transaction.transactionType === 'TD_TD') {
            this.depNoLabel = !isNullOrUndefined(this.dataService.transaction.selectedIndexPrincipal) ? "Placement No. " + this.dataService.transaction.selectedIndexPrincipal : "";
        }
    }

    private checkTransaction() {
        if (isNullOrUndefined(this.dataService.transaction)) {
            this.dataService.transaction = new Transaction();
            Modal.showConfirm("data not found", () => {
                this.redirectToNextPage();
            }, () => {
                this.redirectToNextPage();
            });
            return;

        }
    }

    private checkTransactionType() {
        if (this.transactionType === 'Purchase' || this.transactionType === 'REDEEM' || this.transactionCancel || this.transactionType === 'SWITCH') {
            this.checkSlipInvesment = true;
            this.checkSlipTransfer = false;
        } else if (this.transactionType === 'Transfer') {
            this.checkSlipInvesment = false;
            this.checkSlipTransfer = true;

            if (this.dataService.transaction.transactionType !== "request") {
                this.transactionType = this.queryParams['transactionType'];
                this.dataService.transaction.amount = Utils.toStringNumber(this.dataService.transaction.amount);
            }

            if (isNullOrUndefined(this.transactionType) &&
                !isNullOrUndefined(this.dataService.transaction)) {
                this.transactionType = this.dataService.transaction.data.transactionType;
            }
        }
    }

    private checkDeditDateLabel(transferType) {
        // return transferType === Fee_Type.KK || transferType === Fee_Type.ORFT || transferType === Fee_Type.ANYID_ONUS || transferType === Fee_Type.ANYID_OFFUS ? "โอนเงินทันที" : moment(this.debitDate).format("DD/MM/YYYY");
        return transferType === AppConstant.TrasferType.SMARTNEXTDAY || transferType === AppConstant.TrasferType.SMARTSAMEDAY ? moment(this.debitDate).format("DD/MM/YYYY") : "โอนเงินทันที";
    }

    public subReferenceNo() {
        let referenceNo = '';
        if (this.dataService.transaction.referenceNo !== null) {
            if (this.dataService.transaction.referenceNo.length >= 34) {
                referenceNo = this.dataService.transaction.referenceNo.substring(17)
            } else {
                referenceNo = this.dataService.transaction.referenceNo;
            }
        }
        return referenceNo;
    }

    public onClickPrintSlip(isPrint: any) {
        if (this.userService.isLoggedin()) {
            const that = this;
            Modal.showConfirmLogout(Modal.title.continue, "ทำรายการต่อ", "ออกจากระบบ", this.userService, () => {
                that.redirectToNextPage();
            }, function () {
                that.userService.logout();
            });
        }
        else {
            setTimeout(() => {
                this.redirectToNextPage();
            }, 1500);
        }
        if (isPrint) {
            setTimeout(() => {
                this.onRequestPrintThermal();
            }, 1000);
        }
    }

    public onRequestPrintThermal() {

        let toAccountName = "";
        if (this.dataService.transaction.from.custCif === this.dataService.transaction.to.custCif) {
            toAccountName = "";
        }
        else {
            toAccountName = !isNullOrUndefined(this.dataService.transaction.to.accountName) ? this.dataService.transaction.to.accountName : "";
            if (toAccountName.length > 15) {
                toAccountName = toAccountName.substring(0, 15)
            }
        }

        const toStringNumberPipe = new ToStringNumberPipe();

        let slipType = this.dataService.transaction.transactionType.indexOf(AppConstant.ProdTypeFix) >= 0 ? "THERMAL_TRANFER_SLIP_TD" : "THERMAL_TRANFER_SLIP"
        slipType = this.dataService.transaction.from.accountType === AppConstant.ProdTypeFix ? "THERMAL_TRANFER_SLIP_TD_NO_BALANCE" : slipType;

        const data = {
            "cmd": "printerSendQuery",
            "params": {
                "doc": slipType,
                "data": {
                    "docDate": this.dataService.transaction.transactionDateTime.day,
                    "docTime": this.dataService.transaction.transactionDateTime.time,
                    "branchName": this.branchName,
                    "seqNo": this.referenceNo,
                    "transactionType": this.transactionType,
                    "transferType": this.dataService.transaction.transactionType,
                    "fromAccountNo": Utils.markAccountNumber(this.dataService.transaction.from.accountNumber) || this.fromType,
                    "toAccountNo": Utils.markAccountNumber(this.dataService.transaction.to.accountNumber) || this.toType,
                    "toAccountName": toAccountName,
                    "amount": toStringNumberPipe.transform(this.dataService.transaction.amount, 2),
                    "fee": toStringNumberPipe.transform(this.dataService.transaction.fee.amount, 2),
                    "ledgerBalance": toStringNumberPipe.transform(this.dataService.transaction.accountDetailAvailBalanceNet, 2),
                    "availableBalance": toStringNumberPipe.transform(this.dataService.transaction.balanceAvailable, 2),
                    "termAndNetRate": this.TDTermAndRate,
                    "depNo": this.depNoLabel,
                    "debitDate": this.debitDateLabel,
                    "creditDate": this.creditDateLabel
                }
            }
        };

        const json = JSON.stringify(data);
        console.log("json print ", data);
        this.hardwareService.requestPrintSlipWithThermal(json);
    }

    private redirectToNextPage() {
        const objectParams = this.activatedRoute.snapshot.queryParams;
        const returnUrl = !isNullOrUndefined(objectParams) ? objectParams.returnUrl : null;

        if (isNullOrUndefined(returnUrl)) {
            this.router.navigate(["/kk"]);
        } else {
            this.router.navigate(["/kk", returnUrl]);
        }

    }

    printSlipInvesment(isPrint: any) {
        if (this.userService.isLoggedin()) {
            const that = this;
            let titleName = this.transactionType === 'Purchase Cancel' ? 'กรุณาตรวจสอบรายการยกเลิกทางอีเมลล์ <br>' : 'กรุณาตรวจสอบรายการสั่งซื้อทางอีเมลล์ <br>';
            Modal.showConfirmLogout(titleName + '<h1><b>' + Modal.title.continue + '</b></h1>', "ต้องการ", "ไม่ต้องการ", this.userService, () => {
                that.redirectToNextPage();
            }, function () {
                that.userService.logout();
            });
        } else {
            setTimeout(() => {
                this.redirectToNextPage();
            }, 1500);
        }
        if (isPrint) {
            setTimeout(() => {
                this.reqPrintThermalPurchaseFund();
            }, 1000);
        }
    }

    public reqPrintThermalPurchaseFund() {
        let AMOUNT = '';
        let TRANSACTION_FROM = '';
        let TRANSACTION_TO = '';
        let toStringNumberPipe = new ToStringNumberPipe();
        switch (this.transactionType) {
            case 'Purchase':
                AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.amountFund, 2) + ' บาท';
                this.dataService.transaction.fee.amountFund = this.dataService.transaction.fee.amountFund;
                TRANSACTION_FROM = Utils.markAccountNumber(this.dataService.transaction.from.accountNumber) || this.fromType
                TRANSACTION_TO = this.dataService.transaction.fundCode
                break;
            case 'REDEEM':
                if (this.dataService.transaction.amountRedeem) {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.amountRedeem, 2) + ' บาท';
                }
                if (this.dataService.transaction.unitRedeem) {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.unitRedeem, 4) + ' หน่วย';
                }
                this.dataService.transaction.fee.amountFund = this.dataService.transaction.fee.amountRedeem;
                TRANSACTION_FROM = this.dataService.transaction.fundCode
                TRANSACTION_TO = Utils.markAccountNumber(this.dataService.transaction.to.accountNumber) || this.fromType
                break;
            case 'SWITCH':
                if (this.dataService.transaction.amountSwich) {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.amountSwich, 2) + ' บาท';
                }
                if (this.dataService.transaction.unitSwich) {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.unitSwich, 4) + ' หน่วย';
                }
                this.dataService.transaction.fee.amountFund = this.dataService.transaction.fee.amountSwich;
                TRANSACTION_FROM = this.dataService.transaction.from.fundCode;
                TRANSACTION_TO = this.dataService.transaction.to.fundCode;
                break;
            case 'Purchase Cancel':
                if (this.dataService.transaction.amountFund > '0') {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.amountFund, 2) + ' บาท';
                }
                if (this.dataService.transaction.unitFund > '0') {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.unitFund, 4) + ' หน่วย';
                }
                this.dataService.transaction.fee.amountFund = this.dataService.transaction.fee.amountFund;
                TRANSACTION_FROM = Utils.markAccountNumber(this.dataService.transaction.from.accountNumber) || this.fromType;
                TRANSACTION_TO = this.dataService.transaction.fundCode;
                break;
            case 'Redeem Cancel':
                if (this.dataService.transaction.amountFund > '0') {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.amountFund, 2) + ' บาท';
                }
                if (this.dataService.transaction.unitFund > '0') {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.unitFund, 4) + ' หน่วย';
                }
                this.dataService.transaction.fee.amountFund = this.dataService.transaction.fee.amountFund;
                TRANSACTION_FROM = this.dataService.transaction.fundCode;
                TRANSACTION_TO = Utils.markAccountNumber(this.dataService.transaction.from.accountNumber) || this.fromType;
                break;
            case 'Switch Cancel':
                if (this.dataService.transaction.amountFund > '0') {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.amountFund, 2) + ' บาท';
                }
                if (this.dataService.transaction.unitFund > '0') {
                    AMOUNT = toStringNumberPipe.transform(this.dataService.transaction.unitFund, 4) + ' หน่วย';
                }
                this.dataService.transaction.fee.amountFund = this.dataService.transaction.fee.amountFund;
                TRANSACTION_FROM = this.dataService.transaction.fundCode;
                TRANSACTION_TO = this.dataService.transaction.toFundCode;
                break;
        }

        let subUnitHolderName = !isNullOrUndefined(this.dataService.transaction.unitHolder.unitHolderName) ? this.dataService.transaction.unitHolder.unitHolderName : "";
        const data = {
            "cmd": "printerSendQuery",
            "params": {
                "doc": "THERMAL_TRANFER_FUND_SLIP",
                "data": {
                    "docDate": this.dataService.transaction.transactionDateTime.day,
                    "docTime": this.dataService.transaction.transactionDateTime.time,
                    "branchName": this.branchName,
                    "refNo": this.referenceNo,
                    "transactionType": this.transactionType,
                    "unitHolderId": this.dataService.transaction.unitHolder.unitHolderId,
                    "unitHolderName": subUnitHolderName.length > 15 ? subUnitHolderName.substring(0, 15) : subUnitHolderName,
                    "amount": AMOUNT,
                    "fee": toStringNumberPipe.transform(this.dataService.transaction.fee.amountFund, 2),
                    // FROM
                    "accountNo": TRANSACTION_FROM,
                    // TO
                    "fundCode": TRANSACTION_TO,
                    "effectiveDate": this.dataService.transaction.effectiveDate,
                    "status": 'สำเร็จ',


                }
            }
        };
        const json = JSON.stringify(data);
        console.log("json print ", data);
        this.hardwareService.requestPrintSlipWithThermal(json);
    }
}
