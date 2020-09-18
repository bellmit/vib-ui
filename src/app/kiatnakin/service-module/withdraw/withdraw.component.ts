import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";

import { Fee } from "../../_model/fee";
import { PaymentType, SelectType, ChequeType } from "../../_model/transaction";
import { Withdraw } from "../../_model/withdraw";
import { BankAccount } from "../../_model/bankAccount";

import { DataService } from "../../_service/data.service";
import { UserService } from "../../_service/user.service";
import { KeyboardService } from "../../_service/keyboard.service";
import { HardwareService } from "../../_service/hardware.service";
import { TransferService } from "../../_service/api/transfer.service";
import { WithdrawService } from "../../_service/api/withdraw.service";
import { TransactionService } from "../../_service/api/transaction.service"
import { MasterDataService } from "../../_service/api/master-data.service";
import { ChequeService } from "../../_service/api/cheque.service";
import { isNullOrUndefined } from "util";
import { Utils, Environment } from "../../../share/utils";

import { BahtTextPipe } from "../../_pipe/bahttext.pipe";
import { ToStringNumberPipe } from "../../_pipe/toStringNumber.pipe";

import { ProgressDialogComponent } from "../../_share/progress-dialog/progress-dialog.component";
import { AppConstant } from "../../../share/app.constant";
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";

@Component({
    selector: 'app-withdraw',
    templateUrl: './withdraw.component.html',
    styleUrls: ['./withdraw.component.sass']
})
export class WithdrawComponent implements OnInit, AfterContentInit {

    @ViewChild('progress') progress: ProgressDialogComponent;
    public paymentType = PaymentType;
    public selectType = SelectType;
    public chequeType = ChequeType;
    public isSelectFrom = true;
    public isSelectTo = false;
    public isSelectAccount = false;
    public isSelectAppChannel = false;
    public isShowInterBankMenu = false;
    public isScanCheque = false;
    public ignoreAccountNO: string;
    public hide = false;
    public status;
    public imageName: string;
    public bankName: string;
    public activeIndex: any = 1;
    public titleSelectBankAccount: string;
    public bankList: any[];
    public ChqShow: boolean = true;
    public progressIsShow: boolean;
    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        public dataService: DataService,
        private hardwareService: HardwareService,
        public userService: UserService,
        private chequeService: ChequeService,
        private transactionService: TransactionService,
        private transferService: TransferService,
        private masterData: MasterDataService,
        private withdrawService: WithdrawService) {


        if (isNullOrUndefined(dataService.transaction)) {
            dataService.transaction = new Withdraw();
            this.dataService.transaction.to.bank.image = (<Withdraw>this.dataService.transaction).imagelogo();

        }
        this.status = dataService.transaction.status;
        this.hardwareService.connectTellerApprove();
    }

    ngOnInit() {

        this.initObject();
        this.dataService.dataFrom = null;
        this.activatedRoute.queryParams.subscribe(params => {

            if (!isNullOrUndefined(params.mode)) {
                this.router.navigate(["kk", "withdraw"]);
            } else if (!isNullOrUndefined(params.inputData)) {
                this.dataService.transaction.from = this.dataService.transaction.temp;
                this.dataService.transaction.temp = null;
                this.hardwareService.connectTellerApprove();
                this.isScanCheque = false;
                this.isSelectAccount = false;
                this.isSelectFrom = false;
                this.router.navigate(["kk", "withdraw"]);
            }
        });
    }

    ngAfterContentInit() {

        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 100);

        const isSelectAccount = this.activatedRoute.snapshot.queryParams["selectAccount"];
        if (isSelectAccount && this.userService.isLoggedin()) {
            this.isSelectAccount = true;
            this.isSelectAppChannel = false;
            return;
        }
        else if (!isNullOrUndefined(isSelectAccount)) {
            //reload page for remove all fragment
            this.router.navigate(["kk", "withdraw"]);
            return;
        }

        if (!isNullOrUndefined(this.dataService.selectedAccount)) {
            this.dataService.transaction.from = this.dataService.selectedAccount;
            this.dataService.transaction.fromFix = true;
            if (this.dataService.transaction.from.accountType === "TD"
                && isNullOrUndefined(this.dataService.transaction.selectedIndexPrincipal)) {
                this.router.navigate(["kk", "selectTDPrincipal"], { queryParams: { returnUrl: "withdraw" } });
            }
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
            case this.dataService.transaction.status.inputData:
                this.AnimationFrom();
                break;
            case status.confirmation:
                if (!isNullOrUndefined(this.dataService.transaction.from.micrResult)) {
                    this.ChqShow = true;
                } else {
                    this.ChqShow = false;
                }

                if (this.checkAcountType()) {
                    this.onGetTransactionFee();
                } else {
                    this.onCheckTransactionAmount();
                }
                this.updateWithdrawType();
                break;
            case status.Cashto:
                this.onSendApproveTransaction();
                break;
            case status.complete:
                break;
            case this.paymentType.Cash:
                this.dataService.transaction.paymentType = step;
                this.dataService.transaction.to = BankAccount.getAccountTypeCash();
                this.dataService.transaction.to.accountType = this.paymentType.Cash;
                this.onMoveStep(status.inputData);
                break;
            case this.paymentType.Cheque:
                this.dataService.transaction.from = BankAccount.getAccountTypeCheque();
                this.onMoveStep(status.inputData);
                break;
            default:
                break
        }
    }

    public checkAcountType() {
        return this.dataService.transaction.from.accountType === PaymentType.Cheque && this.dataService.transaction.to.accountType === PaymentType.Cash;
    }

    public AnimationFrom() {
        if (isNullOrUndefined(this.dataService.transaction.from.accountType)) {
            setTimeout(() => {
                Utils.animate("#div-select-account-from", "pulse")
            }, 100);
        }
    }

    public AnimationTo() {
        if (isNullOrUndefined(this.dataService.transaction.to.accountType)) {
            setTimeout(() => {
                Utils.animate("#div-select-account-to", "pulse")
            }, 100);
        }
    }

    public onCheckTransactionAmount() {
        this.progress.showProgressTransaction();

        this.transactionService
            .checkTransferAmount(this.dataService.transaction)
            .subscribe(
                data => {
                    this.onGetTransactionFee();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                    return;
                }
            );
    }

    public frame() {
        console.log('frame');
        const that = this;
        const options = {
            horizontal: true,

            //Item base navigation
            itemNav: 'forceCentered', // 'basic','centered','forceCentered'
            smart: true,
            activateOn: 'click',
            activateMiddle: true,

            //Scrolling
            scrollBy: 0,
            speed: 1200,
            easing: 'easeOutExpo',

            //Dragging
            mouseDragging: true,
            touchDragging: true,
            releaseSwing: true,
            elasticBounds: false,
            dragHandle: true,
            dynamicHandle: true,
            clickBar: false
        };

        const $frame = $('#frame');
        $frame.sly(options);
        $frame.sly("activate", this.activeIndex, false);
        $frame.sly('on', 'active', function (e, index) {
            that.activeIndex = index;
            that.imageName = that.bankList[index].image;
            that.bankName = that.bankList[index].name;
        });
    }

    public onSendApproveTransaction() {

        if (isNullOrUndefined(this.dataService.transaction.from.micrResult && this.dataService.transaction.accountType === this.paymentType.Cheque)) {
            if (!this.userService.checkAuthenticationFactor2Transaction(this.dataService.isAuthenticated, "withdraw")) {
                return;
            }
        }
        this.hardwareService.sendApproveTransaction("withdraw", this.dataService.transaction)
            .subscribe(
                (data: any) => {
                    switch (data.status) {
                        case "Approve":
                        case "Approved":
                        case "approve":
                        case "approved":
                            this.progress.showSuccessWithMessage('ทำรายการสำเร็จ');
                            // this.dataService.transaction = data.data;
                            this.dataService.transaction.to.micrResult = data.data.to.micrResult;
                            this.dataService.transaction.to.stock_serial_no = data.data.to.stock_serial_no;
                            this.onWithdraw();
                            break;
                        case "Reject":
                        case "Rejected":
                        case "reject":
                        case "rejected":
                            this.progress.showSuccessWithMessage('ยกเลิกการทำรายการ');
                            setTimeout(() => {
                                this.progress.hide();
                                this.onMoveStep(this.status.inputData);
                            }, 2500);
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

    public onWithdraw() {
        const fromType = this.dataService.transaction.from.accountType;
        const toType = this.dataService.transaction.to.accountType;

        if (this.checkCAToCash(fromType, toType)) {
            if (this.checkAuthentication()) {
                this.withdrawalCAToCashWithOutChq();
            } else if (!this.dataService.isAuthenticated) {
                this.withdrawalCAToCashWithChq();
            }
        } else if (this.checkSAToCash(fromType, toType)) {
            this.onWithdrawSAToCash();
        } else if (this.checkTDToCash(fromType, toType)) {
            this.onWithdrawTDToCash();
        } else if (this.checkCAToCheque(fromType, toType)) {
            this.withdrawalCAToChequeWithOutChq();
        } else if (this.checkChequeToCheque(fromType, toType)) {
            this.withdrawalCAToChequeWithChq();
        } else if (this.checkSAToCheque(fromType, toType)) {
            this.onWithdrawSAToCheque();
        } else if (this.checkTDToCheque(fromType, toType)) {
            this.onWithdrawTDToCheque();
        }
    }

    public checkAuthentication() {
        return this.dataService.isAuthenticated || this.userService.getUser() !== null;
    }

    public checkCAToCash(fromType, toType) {
        return fromType === 'CA' && toType === this.paymentType.Cash || fromType === this.paymentType.Cheque && toType === this.paymentType.Cash;
    }

    public checkSAToCash(fromType, toType) {
        return fromType === 'SA' && toType === this.paymentType.Cash;
    }

    public checkTDToCash(fromType, toType) {
        return fromType === 'TD' && toType === this.paymentType.Cash;
    }

    public checkCAToCheque(fromType, toType) {
        return fromType === 'CA' && toType === this.paymentType.Cheque && toType === this.paymentType.Cheque;
    }

    public checkChequeToCheque(fromType, toType) {
        return fromType === this.paymentType.Cheque && toType === this.paymentType.Cheque;
    }

    public checkSAToCheque(fromType, toType) {
        return fromType === 'SA' && toType === this.paymentType.Cheque;
    }

    public checkTDToCheque(fromType, toType) {
        return fromType === 'TD' && toType === this.paymentType.Cheque;
    }

    public withdrawalCAToCashWithOutChq() {
        this.progress.showProgressTransaction();

        this.withdrawService.withdrawalCAToCashWithOutChq2(this.dataService.transaction, Environment.branchCode)
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

    public withdrawalCAToCashWithChq() {
        this.progress.showProgressTransaction();

        this.withdrawService.withdrawalCAToCashWithChq2(this.dataService.transaction, Environment.branchCode)
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

    public onWithdrawSAToCash() {
        this.progress.showProgressTransaction();

        this.withdrawService.withdrawSAToCash2(this.dataService.transaction, Environment.branchCode)
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

    public onWithdrawTDToCash() {
        this.progress.showProgressTransaction();

        this.withdrawService.withdrawTDtoCash2(this.dataService.transaction, Environment.branchCode)
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

    public withdrawalCAToChequeWithChq() {
        this.progress.showProgressTransaction();
        this.withdrawService.withdrawalCAToChequeWithChq2(this.dataService.transaction, Environment.branchCode)
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

    public withdrawalCAToChequeWithOutChq() {
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

    public onWithdrawSAToCheque() {
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

    public onWithdrawTDToCheque() {
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

    public onClickSelectFromAccount() {
        this.dataService.transaction.titleSelectBankAccount = "ต้องการถอนจาก";
        this.isShowInterBankMenu = false;

        this.isSelectAccount = true;
        this.isSelectFrom = true;
        this.isSelectTo = false;

        this.isSelectAppChannel = true;
        this.dataService.transaction.selectType = this.selectType.CHEQUE_BookBank;
    }

    public onClickSelectToAccount() {

        this.dataService.transaction.titleSelectBankAccount = "ต้องการถอนเป็น";

        this.isSelectFrom = false;
        this.isSelectTo = true;
        this.isSelectAccount = true;
        this.isSelectAppChannel = true;
        this.dataService.transaction.selectType = this.selectType.CHEQUE_CASH;
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

    public showPrinter() {
        setTimeout(() => {
            this.progress.hide();
            this.onMoveStep(this.status.complete);
            this.isSelectAccount = true;
            this.isSelectFrom = true;
            this.isSelectTo = true;
        }, 2500);
    }

    public onSelectedType($selectedBankAccount: any) {
        this.isSelectAppChannel = false;

        if (this.isSelectFrom === true && this.isSelectTo === false) {
            if ($selectedBankAccount === this.paymentType.Cheque) {
                this.isScanCheque = true;
            }
        }

        if (this.isSelectFrom === false && this.isSelectTo === true) {
            if ($selectedBankAccount === this.paymentType.Cash) {
                this.dataService.transaction.to.accountType = $selectedBankAccount;
                this.isSelectAccount = false;
                this.onMoveStep(this.paymentType.Cash);
            } else if ($selectedBankAccount === this.paymentType.Cheque) {

                this.isSelectAccount = true;
                this.isSelectTo = false;
                this.dataService.transaction.isCheque = true;
            }
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

        KeyboardService.initKeyboardInputText();
        this.updateWithdrawType();

    }

    public onSelectedAccount($selectedBankAccount) {
        this.isSelectAccount = false;
        if (!isNullOrUndefined(this.dataService.transaction.amount)) {
            this.updateFormatAmount();
        }

        if (isNullOrUndefined($selectedBankAccount)) {
            KeyboardService.initKeyboardInputText();
            return;
        }

        if (this.isSelectFrom) {
            if (this.dataService.transaction.from.accountType === "TD" && $selectedBankAccount.accountType !== 'TD') {
                this.dataService.transaction.amount = null;
            }
            this.dataService.transaction.from = $selectedBankAccount;
            this.AnimationTo();

            if (this.dataService.transaction.from.accountType === "TD") {
                if (this.userService.isLoggedin()) {
                    this.router.navigate(["kk", "selectTDPrincipal"], { queryParams: { returnUrl: "withdraw" } });
                }
                else {
                    this.router.navigate(["kk", "selectTDPrincipalByIndex"], { queryParams: { returnUrl: "withdraw" } });
                }
            }
        } else {
            this.AnimationFrom()
        }
        this.updateWithdrawType();
    }

    public updateWithdrawType() {

        (<Withdraw>this.dataService.transaction).updateWithdrawType();
        KeyboardService.initKeyboardInputText();

    }

    public updateFormatAmount() {
        this.dataService.transaction.amount = new ToStringNumberPipe().transform(
            this.dataService.transaction.amount, Utils.getCountDigit(this.dataService.transaction.amount));
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

    public onConfirmPaymentTypeFee(step) {

        this.dataService.transaction.paymentTypeFee = step;
        this.onMoveStep(this.status.Cashto);
    }

    public onClickSubmit() {
        this.dataService.transaction.phoneNumber = ''; //set default value NullOrUndefined to ''
        this.onMoveStep(this.status.confirmation);
    }

    public selectBank() {
        this.dataService.transaction.from = BankAccount.getAccountTypeCheque();
        const bank = this.bankList[this.activeIndex];

        this.dataService.transaction.from.bank.image = bank.image;
        this.dataService.transaction.from.bank.name = bank.name;
        this.dataService.transaction.from.bank.code = bank.code;
        this.onMoveStep(this.status.inputData);
    }

    public onClickBack() {

        if (this.progress && this.progress.isShowing()) {
            this.progress.hide();
            this.onMoveStep(this.status.inputData);
            return;
        }

        const that = this;
        this.dataService.transaction.isCheque = false;

        if (this.isSelectAccount) {
            this.hardwareService.connectTellerApprove();
            this.isScanCheque = false;
            this.onSelectedAccount(null);
        } else if (this.dataService.transaction.currentStatus === this.status.inputData ||
            this.dataService.transaction.currentStatus === this.status.complete) {

            this.dataService.resetInterLogin();
            if (this.dataService.transaction.fromFix) {
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

            if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.ScanCheque) {
                this.isSelectAccount = false;
                this.isSelectFrom = false;
                this.isSelectTo = false;
                this.isScanCheque = false;
                this.onMoveStep(this.dataService.transaction.status.inputData)
            }

            if (this.checkCurrentStatus()) {

                this.onMoveStep(this.dataService.transaction.status.inputData)
            }
            else if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.confirmation) {
                this.onMoveStep(this.dataService.transaction.status.inputData)
            }
        }
    }

    public checkCurrentStatus() {
        return this.dataService.transaction.currentStatus === this.dataService.transaction.status.selectType ||
        this.dataService.transaction.currentStatus === this.dataService.transaction.status.ScanCheque ||
        this.dataService.transaction.currentStatus === this.dataService.transaction.status.inputCheque;
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
        if (this.dataService.transaction.currentStatus === this.status.inputData || this.dataService.transaction.currentState === this.status.inputCheque) {
            Utils.animate("#container_form_withdraw", "bounceOutRight")
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
}
