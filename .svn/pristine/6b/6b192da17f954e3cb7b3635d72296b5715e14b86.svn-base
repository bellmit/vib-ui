import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { ProgressDialogComponent } from "../../../_share/progress-dialog/progress-dialog.component";
import { KeyboardService } from "../../../_service/keyboard.service";
import { DataService } from "../../../_service/data.service";
import { isNullOrUndefined } from "util";
import { ToStringNumberPipe } from "../../../_pipe/toStringNumber.pipe";
import { Utils, Environment } from "../../../../share/utils";
import { Router, ActivatedRoute } from "@angular/router";
import { Modal } from "../../../_share/modal-dialog/modal-dialog.component";
import { TransactionService } from "app/kiatnakin/_service/api/transaction.service";
import { PaymentType, SelectType } from "../../../_model/transaction";
import { UserService } from "../../../_service/user.service";
import { BankAccount } from "../../../_model/bankAccount";
import { Fee } from "../../../_model/fee";
import { Deposit, BuyChqType } from "../../../_model/deposit";
import { DepositService } from "../../../_service/api/deposit.service";
import { HardwareService } from "app/kiatnakin/_service";
import { BahtTextPipe } from "../../../_pipe/bahttext.pipe";
import { DatePipe } from "@angular/common";
import { AppConstant } from "../../../../share/app.constant";
import { ChequeService } from "../../../_service/api/cheque.service";
import { WithdrawService } from "../../../_service/api/withdraw.service";


@Component({
    selector: 'app-cheques-buy',
    templateUrl: './cashier-cheque-buy.component.html',
    styleUrls: ['./cashier-cheque-buy.component.sass']
})
export class CashierChequeBuyComponent implements OnInit, AfterContentInit {

    @ViewChild('progress') progress: ProgressDialogComponent;
    public chequeType = BuyChqType;
    public paymentType = PaymentType;
    public selectType = SelectType;
    public status;
    public isSelectAccount: boolean = false;
    public isScanCheque: boolean = false;
    public isSelectType: boolean = false;
    public isSelectFrom: boolean = false;
    public isSelectTo: boolean = false;
    public ref_id: string;
    public container: boolean = false;
    public progressIsShow: boolean;

    constructor(public dataService: DataService,
        public userService: UserService,
        private activatedRoute: ActivatedRoute,
        private transactionService: TransactionService,
        private hardwareService: HardwareService,
        private depositService: DepositService,
        private withdrawService: WithdrawService,
        private chequeService: ChequeService,
        private router: Router) {

        if (isNullOrUndefined(dataService.transaction)) {
            dataService.transaction = new Deposit();
        }
        this.status = dataService.transaction.status;
    }

    ngOnInit() {
        this.initObject();
        // this.onClickSelectToAccount();
    }

    ngAfterContentInit() {

        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 100);

        const isSelectAccount = this.activatedRoute.snapshot.queryParams["selectAccount"];
        if (isSelectAccount && this.userService.isLoggedin()) {
            this.isSelectAccount = true;
            return;
        }
        else if (!isNullOrUndefined(isSelectAccount)) {
            //reload page for remove all fragment
            this.router.navigate(["kk", "cashierChqBuy"]);
            return;
        }

        if (!isNullOrUndefined(this.dataService.selectedAccount)) {
            this.dataService.transaction.from = this.dataService.selectedAccount;
        }
    }

    public initObject() {
        setTimeout(() => {
            let lastedStatus = this.dataService.transaction.currentStatus ? this.dataService.transaction.currentStatus : this.dataService.transaction.status.inputData;

            if (lastedStatus > this.dataService.transaction.status.inputData && !this.dataService.isAuthenticated) {
                lastedStatus = this.dataService.transaction.status.inputData;
            }

            this.onMoveStep(lastedStatus);

        }, 500);
    }

    public onMoveStep(step) {

        KeyboardService.initKeyboardInputText();
        this.dataService.transaction.currentStatus = step;

        if (!isNullOrUndefined(this.dataService.transaction.amount)) {
            this.dataService.transaction.amount = new ToStringNumberPipe().transform(
                this.dataService.transaction.amount, Utils.getCountDigit(this.dataService.transaction.ƒ));
        }

        const status = this.dataService.transaction.status;
        switch (step) {
            case status.inputData:

                if (isNullOrUndefined(this.dataService.transaction.from.accountType)) {
                    setTimeout(() => {
                        Utils.animate("#div-select-account-from", "pulse")
                    }, 100);
                }
                break;
            case this.paymentType.Cash:
                this.dataService.transaction.paymentType = step;
                this.dataService.transaction.Inputfrom = this.paymentType.Cash;
                this.dataService.transaction.paymentTypeFee = this.paymentType.Cash;
                this.onMoveStep(status.inputData);
                break;
            case this.paymentType.Cheque:
                this.dataService.transaction.from = BankAccount.getAccountTypeCheque();
                this.onMoveStep(status.inputData);
                break;
            case status.confirmation:
                this.updateDepositType();
                this.onGetTransactionFee();
                break;
            case status.Cashto:
                // this.onSendApproveTransaction();
                this.onSendApproveTransaction2();
                break;
            case status.complete:
                this.container = true;
                break;
            case status.postTransaction:
                this.onCheckavaliablechequestock();
                // this.onDeposit();
                break;
            default:
                break
        }
    }


    public onClickSelectFromAccount() {
        this.dataService.transaction.titleSelectBankAccount = "เลือกวิธีการชำระเงิน";
        this.dataService.transaction.selectType = this.selectType.BookBank_CASH;
        this.isSelectAccount = true;
        this.isSelectFrom = true;
        this.isSelectTo = false;
        this.isSelectType = true;
        this.isScanCheque = false;
    }

    public onClickSelectToAccount() {
        this.isSelectAccount = true;
        this.isSelectFrom = false;
        this.isSelectTo = true;
        this.isSelectType = false;
        this.isScanCheque = true;
    }

    public onSelectedType($selectedBankAccount: any) {

        if ($selectedBankAccount === this.paymentType.Cash) {

            this.dataService.transaction.from = BankAccount.getAccountTypeCash();
            this.dataService.transaction.from.accountNumber = BankAccount.getCashAccount();
            this.onMoveStep(this.paymentType.Cash);
            this.isSelectAccount = false;
            this.isSelectFrom = true;

        }

        if ($selectedBankAccount === this.paymentType.Bookbank) {
            this.isSelectType = false;
        }

        if ($selectedBankAccount === 'closeCheque') {

            this.isSelectAccount = false;
            this.dataService.transaction.isCheque = false;
            this.dataService.transaction.to.accountType = this.paymentType.Cheque;

            if (isNullOrUndefined(this.dataService.transaction.from.accountType)) {
                setTimeout(() => {
                    Utils.animate("#div-select-account-from", "pulse")
                }, 100);

            }
        }

        if (isNullOrUndefined(this.dataService.transaction.to.accountType)) {
            setTimeout(() => {
                Utils.animate("#div-select-account-to", "pulse")
            }, 100);

        }

        KeyboardService.initKeyboardInputText();
    }

    public onGetTransactionFee() {

        this.dataService.transaction.totalAmount = 0;
        this.dataService.transaction.amount = Utils.toStringNumber(this.dataService.transaction.amount);
        this.progress.showProgressTransaction();

        this.transactionService
            .getTargetFee(this.dataService.transaction)
            .subscribe(
                (fee: Fee) => {
                    this.dataService.transaction.fee = fee;
                    this.dataService.transaction.referenceNo = Utils.getReferenceNo();
                    // this.dataService.transaction.from.accountName = fee.ReceivingAccountDisplayName;
                    this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount)
                        + this.dataService.transaction.fee.amount;

                    this.progress.hide();
                    setTimeout(() => {
                        $("#slip_withdraw").addClass("animated fadeInUp"); // slideInDown
                        KeyboardService.initKeyboardInputText();
                    }, 50);
                },
                error => {
                    this.onMoveStep(this.status.inputData);

                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    setTimeout(() => {
                        this.progress.hide();
                    }, 2500);

                    return;
                }
            );

    }

    public onSendApproveTransaction() {

        if (this.dataService.transaction.Inputfrom !== this.paymentType.Cash) {
            if (!this.userService.checkAuthenticationFactor2Transaction(this.dataService.isAuthenticated, "cashierChqBuy")) {
                return;
            }
        }

        this.hardwareService.sendApproveTransaction("BuyCashierChq", this.dataService.transaction)
            .subscribe(
                (data: any) => {
                    switch (data.status) {
                        case "Approve":
                        case "Approved":
                        case "approve":
                        case "approved":
                            this.progress.showSuccessWithMessage(data.status);
                            this.dataService.transaction.to.stock_serial_no = data.data.STOCK_SERIES_NO.trim();
                            this.dataService.transaction.to.micrResult = data.data.STOCK_NO.toString().trim();
                            setTimeout(() => {
                                this.progress.hide();
                                this.onMoveStep(this.status.postTransaction);
                            }, 2500);
                            break;

                        case "Reject":
                        case "Rejected":
                        case "reject":
                        case "rejected":

                            this.progress.showErrorWithMessage(data.status);
                            break;
                    }
                },
                error => {
                    this.progress.showErrorWithMessage("");
                    setTimeout(() => {
                        this.progress.hide();
                        this.onMoveStep(this.status.inputData);
                    }, 2500);

                }
            );
    }

    public onSendApproveTransaction2() {

        if (this.dataService.transaction.Inputfrom !== this.paymentType.Cash) {
            if (!this.userService.checkAuthenticationFactor2Transaction(this.dataService.isAuthenticated, "cashierChqBuy")) {
                return;
            }
        }

        this.onMoveStep(this.status.postTransaction);
    }

    public onDeposit() {

        switch (this.dataService.transaction.transactionType) {
            case BuyChqType.CASH_BankChq:
                this.onBuyCashtoBankChq()
                break;
            case BuyChqType.CASA_BankChq:

                if (this.dataService.transaction.from.accountType === 'CA') {
                    this.onBuyCAtoCheque();
                } else if (this.dataService.transaction.from.accountType === 'SA') {
                    this.onBuySAToCheque();
                }
                break;
            case BuyChqType.TD_BankChq:
                this.onBuyTDtoCheque();
                break;
        }
    }

    public onBuyCashtoBankChq() {

        this.progress.showProgressTransaction();
        this.depositService.Buycashierchqbycash(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {
                    this.onPostFee();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    public onBuySAToCheque() {
        this.progress.showProgressTransaction();
        this.withdrawService.withdrawSAToCheque2(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {
                    this.onPostFee();
                },
                error => {

                    this.onMoveStep(this.status.inputData);
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    setTimeout(() => {
                        this.progress.hide();
                    }, 2500);
                }
            );
    }

    public onBuyCAtoCheque() {
        this.progress.showProgressTransaction();
        this.withdrawService.withdrawalCAToChequeWithOutChq2(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {
                    this.onPostFee();
                },
                error => {

                    this.onMoveStep(this.status.inputData);
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    setTimeout(() => {
                        this.progress.hide();
                    }, 2500);
                }
            );
    }

    public onBuyTDtoCheque() {
        this.progress.showProgressTransaction();
        this.withdrawService.withdrawTDToCheque2(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {
                    this.onPostFee();
                },
                error => {

                    this.onMoveStep(this.status.inputData);
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    setTimeout(() => {
                        this.progress.hide();
                    }, 2500);
                }
            );
    }

    public onCheckavaliablechequestock() {
        this.chequeService.checkAvaliableChequeStock(
            this.dataService.transaction.to.micrResult,
            Environment.branchCode).subscribe(
                data => {
                    this.dataService.transaction.to.stock_serial_no = data.data.STOCK_SERIES_NO.trim();
                    this.dataService.transaction.to.micrResult = data.data.STOCK_NO.toString().trim();
                    this.onDeposit();
                }
            );
    }

    public showPrinter() {
        setTimeout(() => {
            this.progress.hide();
            this.onMoveStep(this.status.complete);
        }, 2500);
    }

    public updateDepositType() {

        (<Deposit>this.dataService.transaction).updateChqType();
        KeyboardService.initKeyboardInputText();

    }

    public onClickSubmit() {
        this.onMoveStep(this.status.confirmation);
    }

    public isInputAmount(value) {

        if (isNullOrUndefined(value)) {
            return false;
        }

        value = value.split(',').join('');
        const isNumber = !isNaN(value);
        if (isNumber) {

            const number = Number(value);
            return number >= 0.25;
        }

        return false;
    }

    public onSelectedAccount($selectedBankAccount) {
        this.isSelectAccount = false;
        if (isNullOrUndefined($selectedBankAccount)) {
            if (!isNullOrUndefined(this.dataService.transaction.amount)) {
                this.dataService.transaction.amount = new ToStringNumberPipe().transform(
                    this.dataService.transaction.amount, Utils.getCountDigit(this.dataService.transaction.amount));
            }
            KeyboardService.initKeyboardInputText();
            return;
        }

        if (this.dataService.transaction.from.accountType === "TD" && $selectedBankAccount.accountType !== 'TD') {
            this.dataService.transaction.amount = null;
        }
        this.dataService.transaction.from = $selectedBankAccount;

        if (this.dataService.transaction.from.accountType === "TD") {
            if (this.userService.isLoggedin()) {
                this.router.navigate(["kk", "selectTDPrincipal"], { queryParams: { returnUrl: "cashierChqBuy" } });
            }
            else {
                this.router.navigate(["kk", "selectTDPrincipalByIndex"], { queryParams: { returnUrl: "cashierChqBuy" } });
            }
        }

        this.onMoveStep(this.dataService.transaction.status.inputData);
        if (this.dataService.transaction.from.accountType === '') {
            setTimeout(() => {
                Utils.animate("#div-select-account-from", "pulse")
            }, 100);

        }

        this.updateDepositType();
    }

    public onClickPrintSlip(isPrint: boolean) {

        if (isPrint) {
            this.onRequestPrint();
            // this.progress.showProgressWithMessage("กำลังปริ้นใบเสร็จ");
            setTimeout(() => {
                this.progress.showSuccessWithMessage("");
                this.onClickClose();
            }, 3000);
            return
        }

        this.onClickClose();
    }

    public onRequestPrint() {

        const currentTimestamp = (new Date()).getTime();
        const datePipe = new DatePipe('en');
        const bahtTextPipe = new BahtTextPipe();

        const data = {
            "cmd": "printerSendQuery",
            "params": {
                "doc": "TRANSFER_SLIP",
                "data": {
                    "branch": $("#label-branch").text(),
                    "doc_date": datePipe.transform(currentTimestamp, 'dd/MM/') + (Number(datePipe.transform(currentTimestamp, 'yyyy')) + 543),
                    "doc_time": datePipe.transform(currentTimestamp, 'HH:mm:ss'),
                    "acc_no_from": this.dataService.transaction.from.accountNumber,
                    "acc_no_to": this.dataService.transaction.to.accountNumber,
                    "acc_name_from": this.dataService.transaction.from.accountName,
                    "acc_name_to": this.dataService.transaction.to.accountName,
                    "amount": this.dataService.transaction.amount,
                    "fee": this.dataService.transaction.fee.amount,
                    "total_amount": this.dataService.transaction.totalAmount,
                    "total_amount_str": bahtTextPipe.transform(this.dataService.transaction.totalAmount)
                }
            }
        };
        const json = JSON.stringify(data);
        // console.log("json print ", data);
        this.hardwareService.requestPrintSlip(json);

    }

    public onClickBack() {

        return this.checkProgressShowing();

        const that = this;
        if (this.isSelectAccount) {
            this.onSelectedAccount(null);

            if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.ScanCheque) {
                this.isSelectAccount = false;
                this.isSelectFrom = false;
                this.isSelectTo = false;
                this.isScanCheque = false;
                this.onMoveStep(this.dataService.transaction.status.inputData)
            }
        } else if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.inputData ||
            this.dataService.transaction.currentStatus === this.dataService.transaction.status.complete) {

            this.dataService.resetInterLogin();
            if (this.dataService.transaction.toFix) {
                this.router.navigate(["/kk/", "transactionBank"], { replaceUrl: true });
                this.dataService.resetTransactionData();
            }
            else {
                Modal.showConfirmWithButtonText(Modal.title.exit, "ใช่", "ไม่ใช่", function () {
                    that.redirectToMain();
                    that.dataService.transaction.currentStatus = null;
                }, null);
            }
        }

        else {

            if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.selectType ||
                this.dataService.transaction.currentStatus === this.dataService.transaction.status.inputCheque) {

                this.onMoveStep(this.dataService.transaction.status.inputData)
            }
            else if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.confirmation) {
                this.onMoveStep(this.dataService.transaction.status.inputData)
            }
        }
    }

    public checkProgressShowing() {
        if (this.progress && this.progress.isShowing()) {
            this.progress.hide();
            this.onMoveStep(this.status.inputData);
            return;
        }
    }

    public onClickClose() {

        if (this.userService.isLoggedin()) {
            const that = this;
            Modal.showConfirmWithButtonText(Modal.title.continue, "ต้องการ", "ไม่ต้องการ", () => {
                that.redirectToMain();
            }, function () {
                that.userService.logout();
            });
        }
        else {
            this.router.navigate(["/kk"]);
            // this.redirectToMain();
        }
    }

    public redirectToMain() {

        const that = this;
        if (this.dataService.transaction.currentStatus === this.status.inputData) {
            Utils.animate("#container_form_cheques", "bounceOutRight")
                .then(() => {
                    that.router.navigate(["/kk"]);
                });
        }

        if (this.dataService.transaction.currentStatus === this.status.complete) {

            // Utils.animate("#bg_slip", "slideOutDown")
            //     .then(() => {
            that.router.navigate(["/kk"]);
            // });
        }
    }

    public onConfirmPaymentTypeFee(step) {

        this.dataService.transaction.paymentTypeFee = step;
        this.onMoveStep(this.status.Cashto);
    }

    public onPostFee() {
        if (this.dataService.transaction.fee.amount > 0) {
            if (this.dataService.transaction.paymentTypeFee === this.paymentType.FundTransfer) {
                this.onPayFeesFromCASA();
            } else if (this.dataService.transaction.paymentTypeFee === this.paymentType.Cash) {
                this.onPayFees();
            }
        } else if (this.dataService.transaction.fee.amount === 0) {
            this.showPrinter();
        }
    }

    public onPayFeesFromCASA() {
        this.transactionService.PayFeesFromCASA(this.dataService.transaction)
            .subscribe(
                data => {
                    this.showPrinter();
                },
                error => {
                    this.onMoveStep(this.status.inputData);
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    setTimeout(() => {
                        this.progress.hide();
                    }, 2500);
                }
            );
    }

    public onPayFees() {
        this.transactionService.PayFees(this.dataService.transaction)
            .subscribe(
                data => {
                    this.showPrinter();
                },
                error => {
                    this.onMoveStep(this.status.inputData);
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                    setTimeout(() => {
                        this.progress.hide();
                    }, 2500);
                }
            );
    }

}
