import {Component, OnInit, AfterContentInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProgressDialogComponent} from "../../../_share/progress-dialog/progress-dialog.component";
import {Utils} from "../../../../share/utils";
import {DatePipe} from "@angular/common";
import {Modal} from "../../../_share/modal-dialog/modal-dialog.component";
import {UserService} from "../../../_service/user.service";
import {DataService} from "../../../_service/data.service";
import {Investment} from "../../../_model/investment";
import {HardwareService} from "../../../_service/hardware.service";
import {BankAccount} from "../../../_model/bankAccount";
import {isNullOrUndefined} from "util";
import {BahtTextPipe} from "../../../_pipe/bahttext.pipe";
import {KeyboardService} from "../../../_service/keyboard.service";
import {ToStringNumberPipe} from "../../../_pipe/toStringNumber.pipe";
import {PaymentType, SelectType} from "../../../_model/transaction";
import {InvestmentService} from "../../../_service/api/investment.service";
import {Location} from '@angular/common'

@Component({selector: 'purchase', templateUrl: './purchase.component.html', styleUrls: ['./purchase.component.sass']})
export class PurchaseComponent implements OnInit, AfterContentInit {

    @ViewChild('progress')progress: ProgressDialogComponent;

    public headerDesc = 'ใบซื้อกองทุน';
    public txtFrom = 'ชื้อกองทุนด้วย';
    public txtTo = 'เข้า Unitholder';
    public imgTo = './assets/kiatnakin/image/investment/icon_invest_default2.png';
    public returnUrl = 'purchase';

    public status;
    public paymentType = PaymentType;
    public selectType = SelectType;
    public investType: string;
    public isSelectAccount = false;
    public isSelectFrom = false;
    public titleSelectBankAccount: string;
    public isShowInterBankMenu: boolean = false;
    public isPrincipal: boolean = false;
    public ignoreAccountNO;

    constructor(private router: Router
        , private location: Location
        , private activatedRoute: ActivatedRoute
        , public userService: UserService
        , private hardwareService: HardwareService
        , private investmentService: InvestmentService
        , public dataService: DataService) {

        if (isNullOrUndefined(dataService.transaction)) {
            dataService.transaction = new Investment();
        }
        this.status = dataService.transaction.status;
    }

    ngOnInit() {

        this.initObject();
        this
            .activatedRoute
            .queryParams
            .subscribe(params => {
                // refresh page without querystring
                if (!isNullOrUndefined(params.mode)) {
                    this
                        .router
                        .navigate(["kk", "purchase"]);
                }
            });
    }

    ngAfterContentInit() {

        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 500);

        const isSelectAccount = this.activatedRoute.snapshot.queryParams["selectAccount"];
        if (isSelectAccount && this.userService.isLoggedin()) {

            if (this.dataService.transaction.loginfrom === "INTER") {
                this.onClickSelectToAccount();
                this
                    .dataService
                    .resetInterLogin();
            }
            return;
        } else if (!isNullOrUndefined(isSelectAccount)) {
            //reload page for remove all fragment
            this
                .router
                .navigate(["kk", "investment"]);
            return;
        }

    }

    private initObject() {

        setTimeout(() => {

            let lastedStatus = this.dataService.transaction.currentStatus
                ? this.dataService.transaction.currentStatus
                : this.status.inputData;

            if (lastedStatus !== this.status.inputData && !this.dataService.isAuthenticated) {
                lastedStatus = this.status.inputData;
            }
            this.onMoveStep(lastedStatus);

        }, 500);

    }

    public onMoveStep(step) {
        if (!isNullOrUndefined(this.dataService.transaction.amount)) {
            this.dataService.transaction.amount = new ToStringNumberPipe().transform(this.dataService.transaction.amount, Utils.getCountDigit(this.dataService.transaction.amount));
        }

        KeyboardService.initKeyboardInputText();
        this.dataService.transaction.currentStatus = step;

        const status = this.dataService.transaction.status;
        switch (step) {
            case status.inputData:
                if (this.dataService.transaction.from.accountNumber === '') {
                    setTimeout(() => {
                        Utils.animate("#div-select-account-from", "pulse")
                    }, 100);
                }
                this.requestUpdateCancelOrder();
                break;
            case status.confirmation:
                this.requestInsertOrderBuy();
                this.dataService.transaction.amount = Utils.toStringNumber(this.dataService.transaction.amount);
                this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount) + this.dataService.transaction.fee.amount;
                break;
            case this.paymentType.FundTransfer:
                this.dataService.transaction.paymentTypeFee = step;
                this.onConfirm();
                break;
            case status.complete:

                break;
            default:
                break;
        }
    }

    public onClickSelectFromAccount() {

        this.titleSelectBankAccount = "กรุณาแตะเพื่อเลือกบัญชีที่จะหัก";
        this.isShowInterBankMenu = false;
        this.ignoreAccountNO = this.dataService.transaction.from.accountNumber;
        this.isSelectFrom = true;
        this.isSelectAccount = true;
    }

    public onClickSelectToAccount() {
        this.titleSelectBankAccount = 'กรุณาเลือกหน่วยลงทุนที่ต้องการทำรายการ';
        this.isSelectAccount = true;
        this.isSelectFrom = false;
        this.isShowInterBankMenu = false;
    }

    public onSelectedAccount($selectedBankAccount) {
        this.isSelectAccount = false;

        if (this.isSelectFrom) {

            this.dataService.transaction.from = $selectedBankAccount;
            this.dataService.transaction.from.investType = $selectedBankAccount.type;
            this.dataService.transaction.from.investGroupType = $selectedBankAccount.group_type;
        }

        KeyboardService.initKeyboardInputText();
    }

    public isInputAmount(value) {

        if (isNullOrUndefined(value)) {
            return false;
        }

        value = value
            .split(',')
            .join('');
        const isNumber = !isNaN(value);
        if (isNumber) {

            const number = Number(value);
            return number >= 0.25;
        }

        return false;
    }

    public onConfirm() {

        // if (!this.userService.checkAuthenticationFactor2Transaction(this.dataService.isAuthenticated, this.returnUrl)) {
        //     return;
        // }
        this.progress.showProgressTransaction();
        this.investmentService.paymentAndUpdateStatus(this.dataService.transaction)
            .subscribe(
                data => {
                    this.progress.hide();
                    this.dataService.transaction.paymentAndUpdateStatus = data.data;
                    this.onMoveStep(this.status.complete);
                },
                error => {
                    this.progress.showErrorWithMessage(error.responseStatus.responseMessage);

                }
            )

    }

    public onClickSubmit(value) {
        if (value === this.paymentType.FundTransfer) {
            this.titleSelectBankAccount = 'กรุณาเลือกหน่วยลงทุนที่ต้องการทำรายการ';
            this.isSelectAccount = true;
            this.isSelectFrom = false;
            this.isShowInterBankMenu = false;
        }
        this.onMoveStep(this.status.confirmation);
    }

    public onSelectedType($selectedBankAccount: any) {

        this.isPrincipal = true;
        this.investType = $selectedBankAccount;

        if (isNullOrUndefined(this.dataService.transaction.to.accountType)) {
            setTimeout(() => {
                Utils.animate("#div-select-account-to", "pulse")
            }, 100);

        }

    }

    public onClickBack() {

        return this.checkProgressShowing();

        const that = this;
        if (this.isSelectAccount) {
            if ( this.dataService.transaction.from  === null || this.dataService.transaction.from.accountName.length === 0) {
                this.location.back();
                return
            }
            else {
                this.onSelectedAccount(null);
            }
        } else if (this.dataService.transaction.currentStatus === this.status.inputData || this.dataService.transaction.currentStatus === this.status.complete) {

            this
                .dataService
                .resetInterLogin();
            if (this.dataService.transaction.fromFix) {
                this
                    .router
                    .navigate([
                        "/kk/", "transactionBank"
                    ], {replaceUrl: true});

                this
                    .dataService
                    .resetTransactionData();
            } else {
                Modal
                    .showConfirmWithButtonText(Modal.title.exit, "ใช่", "ไม่ใช่", () => {
                        this.redirectToMain();
                    }, null);
            }
        } else {
            if (this.dataService.transaction.currentStatus === this.status.confirmation || this.dataService.transaction.currentStatus === this.status.generateOtp) {
                this.onMoveStep(this.status.inputData)
            }
        }
    }

    private checkProgressShowing() {
        if (this.progress && this.progress.isShowing()) {
            this
                .progress
                .hide();
            this.onMoveStep(this.status.inputData);
            return;
        }
    }

    public requestInsertOrderBuy() {
        const holder = this.dataService.transaction.selectedHolder;
        const fund = this.dataService.transaction.selectedFund;
        const amount =  parseFloat(Utils.toStringNumber(this.dataService.transaction.amount));

        if (holder.IsFirstTrade === 'Y' && amount < fund.FirstMinAmount) {
            Modal.showAlert(`ชื้อครั้งแรก ขั้นต่ำ ${fund.FirstMinAmount} บาท`);
            this.onMoveStep(this.status.inputData);
            return
        }

        if (holder.IsFirstTrade === 'N' && (amount < fund.MinimumAmount || amount > fund.MaximumAmount ) ) {
            Modal.showAlert(`ขั้นต่ำ ${fund.MinimumAmount} บาท แต่ไม่เกิน ${fund.MaximumAmount } บาท`)
            this.onMoveStep(this.status.inputData);
            return
        }

        this.progress.showProgressTransaction();

        this
            .investmentService
            .insertOrderBuyAndPrePayment(this.dataService.transaction)
            .subscribe(data => {
                this.progress.hide();
                this.dataService.transaction.insertOrderBuyAndPrePayment = data.data;
                this.dataService.transaction.fee.amount = this.dataService.transaction.insertOrderBuyAndPrePayment.FEE_LIST.FEE_INFO.CUST_FEE_AMT;
                this.dataService.transaction.totalAmount += this.dataService.transaction.fee.amount;

                const TIME_OUT = data.data.TIME_OUT;
                const timeout = Utils.timeout(TIME_OUT).subscribe(time => {

                                    if (this.dataService.transaction.currentStatus === this.status.confirmation) {
                                        if (time === 0) {
                                            Modal.showAlertWithOk("your transaction is taking too long, please try again ", () => {
                                                this.onClickBack()
                                            });
                                            timeout.unsubscribe()
                                        }
                                    }
                                    else {
                                        timeout.unsubscribe()
                                    }
                                });

            }, error => {
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage)
            })
    }

    public requestUpdateCancelOrder() {

        if (isNullOrUndefined(this.dataService.transaction.insertOrderBuyAndPrePayment)) {
            return
        }
        this.progress.showProgressTransaction();
        const {UNIT_HOLDER, TRANS_ID} = this.dataService.transaction.insertOrderBuyAndPrePayment;
        this.investmentService.updateOrderCancel(UNIT_HOLDER, TRANS_ID)
            .subscribe(res => {
                this.dataService.transaction.insertOrderBuyAndPrePayment = null;
                this.progress.hide();
                this.onMoveStep(this.status.inputData)

            }, error => {
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage)
            })
    }

    public redirectToMain() {
        const that = this;
        if (this.dataService.transaction.currentStatus === this.status.inputData) {
            Utils
                .animate("#container_form_investment", "bounceOutRight")
                .then(() => {
                    this
                        .router
                        .navigate(["kk", "investment"]);
                });
        }

        if (this.dataService.transaction.currentStatus === this.status.complete) {
            that
                .router
                .navigate(["/kk"]);
        }
    }

    public onClickClose() {

        if (this.userService.isLoggedin()) {
            const that = this;
            Modal.showConfirmWithButtonText(Modal.title.continue, "ต้องการ", "ไม่ต้องการ", () => {
                that.redirectToMain();
            }, function () {
                that
                    .userService
                    .logout();
            });
        } else {
            this
                .router
                .navigate(["/kk"]);
        }
    }
}
