import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { isNullOrUndefined } from "util";
import { Utils, Environment } from "../../../share/utils";

import { DatePipe } from "@angular/common";
import { BahtTextPipe } from "../../_pipe/bahttext.pipe";
import { ToStringNumberPipe } from "../../_pipe/toStringNumber.pipe";

import { Deposit } from "../../_model/deposit";
import { DepositType } from "../../_model/deposit";
import { PaymentType, SelectType, ChequeType } from "../../_model/transaction";
import { DepositTerm } from "../../_model/depositTerm";
import { PromotionTerm } from "../../_model/promotionTerm";
import { Fee } from "../../_model/fee";
import { Bank } from "../../_model/bank";
import { KeyboardService } from "../../_service/keyboard.service";
import { UserService } from "../../_service/user.service";
import { DataService } from "../../_service/data.service";
import { DepositService } from "../../_service/api/deposit.service";
import { TransferService } from "../../_service/api/transfer.service";
import { TransactionService } from "../../_service/api/transaction.service"
import { MasterDataService } from "../../_service/api/master-data.service";
import * as moment from 'moment';

import { HardwareService } from "../../_service/hardware.service";
import { AppConstant } from "../../../share/app.constant";
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { ProgressDialogComponent } from "../../_share/progress-dialog/progress-dialog.component";
import { ChequeService } from "../../_service/api/cheque.service";
import { BankAccount } from "../../_model/bankAccount";

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.sass']
})
export class DepositComponent implements OnInit, AfterContentInit {

    @ViewChild('progress') progress: ProgressDialogComponent;

    public depositType = DepositType;
    public paymentType = PaymentType;
    public selectType = SelectType;
    public isSelectAccount = false;
    public ignoreAccountNO: string = '';
    public titleSelectBankAccount: string;
    public isSelectFrom = true;
    public isSelectTo = false;
    public isSelectType = false;
    public isScanCheque = false;
    public noCard: boolean = true;
    public isShowInterBankMenu = true;
    public image: string = 'deposit_ic.png';
    public bankList: any[];
    public status;
    public imageName: string;
    public bankName: string;
    public ref_id: string;
    public activeIndex: any = 1;
    public micrResult: any = null;
    public cheque_no: string = '';
    public bank_code: string = '';
    public account_no: string = '';
    public chequeType: string = '';
    public progressIsShow: boolean;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        public userService: UserService,
        private hardwareService: HardwareService,
        public dataService: DataService,
        private transactionService: TransactionService,
        private depositService: DepositService,
        private chequeService: ChequeService,
        private masterData: MasterDataService,
        private transferService: TransferService) {


        if (isNullOrUndefined(dataService.transaction)) {
            dataService.transaction = new Deposit();
        }
        this.hardwareService.connectTellerApprove();
        this.status = dataService.transaction.status;
    }

    ngOnInit() {
        this.initObject();
        this.dataService.dataFrom = null;
        this.activatedRoute.queryParams.subscribe(params => {

            if (!isNullOrUndefined(params.mode)) {
                this.router.navigate(["kk", "deposit"]);
            }
            else if (!isNullOrUndefined(params.inputData)) {
                this.dataService.transaction.from = this.dataService.transaction.temp;
                this.dataService.transaction.temp = null;
                this.hardwareService.connectTellerApprove();
                this.isScanCheque = false;
                this.isSelectAccount = false;
                this.isSelectFrom = false;
                this.isSelectType = false;
                this.router.navigate(["kk", "deposit"]);
            }
        });
    }

    ngAfterContentInit() {
        this.bankList = Bank.paymentChannel();

        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 100);

        const isSelectAccount = this.activatedRoute.snapshot.queryParams["selectAccount"];
        if (isSelectAccount && this.userService.isLoggedin()) {
            this.activatedRoute.snapshot.queryParams = this.activatedRoute.snapshot.queryParams['deposit'];
            this.onClickSelectToAccount();

        } else if (!isNullOrUndefined(isSelectAccount)) {
            this.router.navigate(["kk", "deposit"]);
            return;
        }

        if (!isNullOrUndefined(this.dataService.selectedAccount)) {
            this.dataService.transaction.to = this.dataService.selectedAccount;
            this.dataService.transaction.toFix = true;
        }

        Utils.removeClass("#deposit", "bounceInRight");
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

    public onClickSelectFromAccount() {
        this.dataService.transaction.titleSelectBankAccount = "ต้องการฝากด้วย";
        this.dataService.transaction.selectType = this.selectType.CHEQUE_CASH;
        this.isSelectAccount = true;
        this.isSelectFrom = true;
        this.isSelectType = true;
        this.isScanCheque = false;
    }

    public onClickSelectToAccount() {
        this.dataService.transaction.titleSelectBankAccount = "ต้องการฝากด้วย";
        this.isShowInterBankMenu = true;

        this.isSelectFrom = false;
        this.isSelectAccount = true;
        this.isSelectTo = true;
    }

    public onMoveStep(step) {

        KeyboardService.initKeyboardInputText();
        this.dataService.transaction.currentStatus = step;

        if (!isNullOrUndefined(this.dataService.transaction.amount)) {
            this.dataService.transaction.amount = new ToStringNumberPipe().transform(this.dataService.transaction.amount, Utils.getCountDigit(this.dataService.transaction.amount));
        }

        const status = this.dataService.transaction.status;
        switch (step) {
            case this.dataService.transaction.status.inputData:
                if (isNullOrUndefined(this.dataService.transaction.from.accountType)) {
                    setTimeout(() => {
                        Utils.animate("#div-select-account-from", "pulse")
                    }, 100);
                }
                break;
            case status.Cashto:
                // this.onSendApproveTransaction();
                this.onSendApproveTransaction2();
                break;
            case this.paymentType.Cash:
                this.dataService.transaction.paymentType = step;
                this.dataService.transaction.Inputfrom = this.paymentType.Cash;
                this.dataService.transaction.paymentTypeFee = this.paymentType.Cash;
                this.onMoveStep(status.inputData);
                break;
            case status.confirmation:
                this.updateDepositType();
                this.onGetTransactionFee();
                break;
            case status.postTransaction:
                this.onDeposit();
                break;
            case status.complete:
                break;
            case status.inputCheque:
                this.getBankList();
                break;
            default:
                break;
        }
    }

    public onCheckAvailableCheque() {

        this.chequeService.checkAvailableChq(AppConstant.bankCode, "", "", Environment.branchCode)
            .subscribe(
                data => {
                    this.dataService.transaction.from = BankAccount.getAccountTypeCheque();
                    this.dataService.transaction.bank_code = AppConstant.bankCode;
                    this.dataService.transaction.branchCode = Environment.branchCode;
                    this.onMoveStep(this.dataService.transaction.status.inputData)
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );

    }

    public onGetTransactionFee() {

        this.dataService.transaction.totalAmount = 0;
        this.dataService.transaction.amount = Utils.toStringNumber(this.dataService.transaction.amount);

        if (this.dataService.transaction.to.accountType !== "TD") {

            this.progress.showProgressTransaction();

            if (this.dataService.transaction.transactionType === DepositType.CASH_CASA ||
                this.dataService.transaction.transactionType === DepositType.OTHERBANKCHEQUE_CASA ||
                this.dataService.transaction.transactionType === DepositType.CHEQUE_CASA) {
                this.transactionService
                    .getTargetFee(this.dataService.transaction)
                    .subscribe(
                        (fee: Fee) => {

                            this.dataService.transaction.fee = fee;
                            this.dataService.transaction.referenceNo = Utils.getReferenceNo();
                            this.ref_id = this.dataService.transaction.referenceNo;
                            // this.dataService.transaction.to.accountName = fee.ReceivingAccountDisplayName;
                            this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount)
                                + this.dataService.transaction.fee.amount;

                            this.progress.hide();
                            setTimeout(() => {
                                $("#slip_deposit").addClass("animated fadeInUp"); // slideInDown
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
            } else if (this.dataService.transaction.transactionType === DepositType.CASH_InterBank ||
                this.dataService.transaction.transactionType === DepositType.CHEQUE_InterBank) {
                this.transferService
                    .checkTargetFee(this.dataService.transaction)
                    .subscribe(
                        (fee: Fee) => {

                            this.dataService.transaction.fee = fee;
                            this.dataService.transaction.referenceNo = Utils.getReferenceNo();
                            this.ref_id = this.dataService.transaction.referenceNo;
                            // this.dataService.transaction.to.accountName = fee.ReceivingAccountDisplayName;
                            this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount)
                                + this.dataService.transaction.fee.amount;

                            this.progress.hide();
                            setTimeout(() => {
                                $("#slip_deposit").addClass("animated fadeInUp"); // slideInDown
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

        } else {

            if (this.dataService.transaction.to.accountType === "TD") {

                this.progress.showProgressTransaction();
                this.dataService.transaction.totalAmount = 0;
                this.dataService.transaction.referenceNo = Utils.getReferenceNo();
                this.ref_id = this.dataService.transaction.referenceNo;

                this.transactionService.getMaturityDate(Environment.branchCode,
                    this.dataService.transaction.selectedTDTerm.month,
                    this.dataService.transaction.selectedTDTerm.day,
                    this.dataService.transaction.transactionDateTime.format('YYYY-MM-DD'))
                    .flatMap(
                        data => {
                            this.dataService.transaction.maturityDate = moment(data.data.maturityDate);

                            return this.transactionService.getTargetFee(this.dataService.transaction);
                        }
                    )
                    .flatMap(
                        fee => {
                            this.dataService.transaction.fee = fee;
                            this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount)
                                + this.dataService.transaction.fee.amount;

                            if (this.dataService.transaction.selectedTDTerm.constructor === DepositTerm) {

                                return this.transactionService.getTDRateOld(this.dataService.transaction.to.accountNumber,
                                    this.dataService.transaction.amount,
                                    this.dataService.transaction.effectiveDate.format("YYYY-MM-DD"),
                                    this.dataService.transaction.selectedTDTerm,
                                    this.dataService.transaction.to.custCif,
                                    this.dataService.transaction.to.getProductCode(),
                                    this.dataService.transaction.maturityDate.format("YYYY-MM-DD"),
                                    this.dataService.transaction.transactionDateTime.format("YYYY-MM-DD"));
                            }
                            else if (this.dataService.transaction.selectedTDTerm.constructor === PromotionTerm) {

                                return this.transactionService.getPromotionRate(this.dataService.transaction.to.custCif,
                                    this.dataService.transaction.to.accountNumber,
                                    this.dataService.transaction.to.getProductCode(),
                                    this.dataService.transaction.amount,
                                    this.dataService.transaction.selectedTDTerm,
                                    this.dataService.transaction.transactionDateTime.format("YYYY-MM-DD"),
                                    this.dataService.transaction.maturityDate.format("YYYY-MM-DD"));
                            }
                        }
                    )
                    .subscribe(
                        rate => {
                            this.dataService.transaction.interestRate = rate;
                            this.progress.hide();
                            setTimeout(() => {
                                $("#slip_deposit").addClass("animated fadeInUp"); // slideInDown
                                KeyboardService.initKeyboardInputText();
                            }, 50);
                        },
                        error => {

                            this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                            setTimeout(() => {
                                this.progress.hide();
                            }, 2500);

                            this.onMoveStep(this.status.inputData);
                            return;
                        }
                    );

            }
        }

    }

    public onSendApproveTransaction() {

        // if (this.dataService.transaction.Inputfrom !== this.paymentType.Cash) {
        //     if (!this.userService.checkAuthenticationFactor2Transaction(this.dataService.isAuthenticated, "deposit")) {
        //         return;
        //     }
        // }


        this.hardwareService.sendApproveTransaction("deposit", this.dataService.transaction)
            .subscribe(
                (data: any) => {
                    switch (data.status) {
                        case "Approve":
                        case "Approved":
                        case "approve":
                        case "approved":
                            this.progress.showSuccessWithMessage('ทำรายการสำเร็จ');
                            setTimeout(() => {
                                this.progress.hide();
                                this.onMoveStep(this.status.postTransaction);
                            }, 2500);
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

    public onSendApproveTransaction2() {

        if (this.dataService.transaction.Inputfrom !== this.paymentType.Cash) {
            if (!this.userService.checkAuthenticationFactor2Transaction(this.dataService.isAuthenticated, "deposit")) {
                return;
            }
        }

        this.onMoveStep(this.status.postTransaction);
    }

    public onDeposit() {

        switch (this.dataService.transaction.transactionType) {
            case DepositType.CASH_CASA:
                this.onDepositCashToCASA();
                break;
            case DepositType.CASH_TD:
                this.onDepositCashToTD();
                break;
            case DepositType.CASH_InterBank:
                this.onDepositCashToInterBank();
                break;
            case DepositType.CHEQUE_CASA:
                this.validateChequeTypeCasa();
                break;
            case DepositType.CHEQUE_TD:
                this.validateChequeTypeTD();
                break;
            case DepositType.OTHERBANKCHEQUE_CASA:
                this.onDepositOtherBankChequeToCASA();
                break;
            case DepositType.OTHERBANKCHEQUE_TD:
                this.onDepositOtherBankChequeToTD()
                break;
        }
    }

    public validateChequeTypeCasa() {
        if (this.dataService.transaction.from.chequeType === '01') {
            this.depositCurrentChqtoCASA();
        } else if (this.dataService.transaction.from.chequeType === '02') {
            this.depositCashierChqtoCASA();
        }
    }

    public validateChequeTypeTD() {
        if (this.dataService.transaction.from.chequeType === '01') {
            this.depositCurrentChqtoTD();
        } else if (this.dataService.transaction.from.chequeType === '02') {
            this.depositCashierChqtoTD();
        }
    }

    //================ CASH =================
    public onDepositCashToCASA() {
        this.progress.showProgressTransaction();

        this.depositService.depositCashToCASA2(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {

                    this.showPrinter();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    public onDepositCashToTD() {
        this.progress.showProgressTransaction();

        this.depositService.depositCashToTD(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {

                    this.showPrinter();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    public onDepositCashToInterBank() {
        this.progress.showProgressTransaction();

        this.transactionService.transferfund(this.dataService.transaction)
            .subscribe(
                data => {

                    this.showPrinter();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    //================ CHEQUE ===============
    public depositCashierChqtoCASA() {
        this.progress.showProgressTransaction();
        const cheque = this.dataService.transaction.chequeObject;
        this.depositService.depositCashierChqtoCASA(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {

                    this.onPostFee();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    public depositCashierChqtoTD() {
        this.progress.showProgressTransaction();
        this.depositService.depositCashierChqtoTD(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {
                    this.onPostFee();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);
                }
            );
    }

    public depositCurrentChqtoCASA() {
        this.progress.showProgressTransaction();
        const cheque = this.dataService.transaction.chequeObject;
        this.depositService.depositCurrentChqtoCASA(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {

                    this.onPostFee();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    public depositCurrentChqtoTD() {
        this.progress.showProgressTransaction();
        const cheque = this.dataService.transaction.chequeObject;
        this.depositService.depositCurrentChqtoTD(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {

                    this.onPostFee();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    public onDepositOtherBankChequeToCASA() {
        this.progress.showProgressTransaction();

        this.depositService.depositOtherBankChqtoCASA(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {

                    this.onPostFee();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    public onDepositOtherBankChequeToTD() {
        this.progress.showProgressTransaction();

        this.depositService.depositOtherBankChqtoTD(this.dataService.transaction, Environment.branchCode)
            .subscribe(
                data => {

                    this.onPostFee();
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            );
    }

    //==========================================

    public onConfirmPaymentTypeFee(step) {

        this.dataService.transaction.paymentTypeFee = step;

        this.onMoveStep(this.status.Cashto);
    }

    public onPostFee() {
        if (this.dataService.transaction.fee.amount > 0) {
            this.onPayFees();
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

    public getBankList() {

        this.masterData.getMasterBank()
            .subscribe(
                bankList => {
                    this.bankList = bankList;
                    setTimeout(() => {
                        this.frame();
                    }, 150);
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );
    }

    public onClickSubmit() {
        this.dataService.transaction.phoneNumber = ''; //set default value NullOrUndefined to ''
        this.onMoveStep(this.dataService.transaction.status.confirmation);
    }

    public onSelectedType($selectedBankAccount: any) {

        if ($selectedBankAccount === this.paymentType.Cash) {

            this.dataService.transaction.from = BankAccount.getAccountTypeCash();
            this.dataService.transaction.from.accountNumber = BankAccount.getCashAccount();
            this.onMoveStep(this.paymentType.Cash);
            this.isSelectAccount = false;
            this.isSelectFrom = true;

        }
        if ($selectedBankAccount === this.paymentType.Cheque) {
            this.isSelectAccount = true;
            this.isSelectFrom = true;
            this.isSelectType = false;
            this.isScanCheque = true;
        }

        if (isNullOrUndefined(this.dataService.transaction.to.accountType)) {
            setTimeout(() => {
                Utils.animate("#div-select-account-to", "pulse")
            }, 100);

        }

        this.updateDepositType();

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

        if (this.isSelectFrom) {

            if (isNullOrUndefined(this.dataService.transaction.to.accountNumber)) {
                setTimeout(() => {
                    Utils.animate("#div-select-account-to", " pulse")
                }, 100);

            }
        } else {

            this.dataService.transaction.to = $selectedBankAccount;
            if (isNullOrUndefined(this.dataService.transaction.from.accountType)) {
                setTimeout(() => {
                    Utils.animate("#div-select-account-from", "pulse")
                }, 100);

            }
        }


        this.updateDepositType();

    }

    public showPrinter() {
        setTimeout(() => {
            this.progress.hide();
            this.onMoveStep(this.status.complete);
            this.isSelectAccount = true;
            this.isSelectFrom = false;
            this.isSelectTo = false;

        }, 2500);
    }

    public isInputAmount(value) {

        if (isNullOrUndefined(value)) {
            return false;
        }

        value = value.split(',').join('');
        const isNumber = !isNaN(value);
        if (isNumber) {

            const number = Number(value);
            if (this.dataService.transaction.to.accountType === 'TD') {
                return number >= 5000;
            }

            return number >= 0.25;
        }

        return false;
    }

    public getImageHeaderLogo() {

        if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.complete) {
            return './assets/kiatnakin/image/icon_logo_header_violet.png';
        }

        return './assets/kiatnakin/image/icon_logo_header.png';

    }

    public updateDepositType() {

        (<Deposit>this.dataService.transaction).updateDepositType();
        KeyboardService.initKeyboardInputText();

    }

    public redirectToMain() {

        const that = this;
        if (this.dataService.transaction.currentStatus === this.status.inputData) {
            $("#container_form_deposit").addClass("animated bounceOutRight");
            $('#container_form_deposit').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                function () {
                    that.router.navigate(["/kk"]);
                });
        }

        if (this.dataService.transaction.currentStatus === this.status.complete) {
            // $("#Bg_slip").addClass("animated slideOutDown");
            // $('#Bg_slip').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            //     that.router.navigate(["/kk"]);
            // });
            that.router.navigate(["/kk"]);
        }
    }

    public onClickBack() {

        return this.checkProgressShowing();

        const that = this;
        if (this.isSelectAccount) {
            this.hardwareService.connectTellerApprove();
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
            this.redirectToMain();
        }
    }

}
