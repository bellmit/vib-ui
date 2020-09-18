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


@Component({
    selector: 'redeem',
    templateUrl: './redeem.component.html',
    styleUrls: ['./redeem.component.sass']
})
export class RedeemComponent implements OnInit, AfterContentInit {

    @ViewChild('progress') progress: ProgressDialogComponent;

    public headerDesc = 'ใบขายกองทุน';
    public txtFrom = 'กองทุนที่ต้องการขาย';
    public txtTo = 'ยอดเงินเข้าบัญชี';
    public imgFrom = './assets/kiatnakin/image/investment/patara_purple.png';
    public imgTo = './assets/kiatnakin/image/investment/icon_invest_default2.png';
    public returnUrl = 'redeem';

    public status;
    public paymentType = PaymentType;
    public selectType = SelectType;
    public investType: string;
    public isSelectAccount = false;
    public isSelectFrom = false;
    public titleSelectBankAccount: string;
    public isShowInterBankMenu: boolean = false;
    public isPrincipal: boolean = false;

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        public userService: UserService,
        private investmentService: InvestmentService,
        private hardwareService: HardwareService,
        public dataService: DataService) {
        if (isNullOrUndefined(dataService.transaction)) {
            dataService.transaction = new Investment();
            this.dataService.transaction.from.bank.image = this.imgFrom;
            this.dataService.transaction.to.bank.image = this.imgTo;
        }
        this.status = dataService.transaction.status;
    }

    ngOnInit() {
        this.initObject();
        this.activatedRoute.queryParams.subscribe(params => {
            // refresh page without querystring
            if (!isNullOrUndefined(params.mode)) {
                this.router.navigate(["kk", "purchase"]);
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
                this.dataService.resetInterLogin();
            }
            else {
               // this.onClickSelectFromAccount();
            }
            return;
        }
        else if (!isNullOrUndefined(isSelectAccount)) {
            //reload page for remove all fragment
            this.router.navigate(["kk", "investment"]);
            return;
        }
    }

    public initObject() {

        setTimeout(() => {

            let lastedStatus = this.dataService.transaction.currentStatus ? this.dataService.transaction.currentStatus : this.status.inputData;

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
                break;
            case status.confirmation:

                break;
            case this.paymentType.FundTransfer:
                this.requestInsertOrderSell()

                break;
            case status.complete:

                break;
            default:
                break;
        }
    }

    public onClickSelectFromAccount() {

        this.dataService.transaction.titleSelectBankAccount = "กรุณาเลือกหน่วยลงทุนที่ต้องการทำรายการ";
        this.dataService.transaction.selectType = this.selectType.LTF_RMF;
        this.isSelectFrom = true;
        this.isSelectAccount = true;
        this.isPrincipal = false;
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
            this.dataService.transaction.from = BankAccount.getAccountPatara();
            this.dataService.transaction.from.investType = $selectedBankAccount.type;
            this.dataService.transaction.from.investGroupType = $selectedBankAccount.group_type;
        } else {
            this.dataService.transaction.to = $selectedBankAccount;
        }

        KeyboardService.initKeyboardInputText();
    }

    public isInputAmount(value) {

        if (isNullOrUndefined(value)) {
            return false;
        }

        value = value.toString().split(',').join('');
        const isNumber = !isNaN(value);
        if (isNumber) {

            const number = Number(value);
            return number >= 0.25;
        }

        return false;
    }

    public requestInsertOrderSell() {
        const holder = this.dataService.transaction.selectedHolder
        const fund = this.dataService.transaction.selectedFund
        const amount =  parseFloat(Utils.toStringNumber(this.dataService.transaction.amount_unit))

        if ( (holder.BalanceUnit - amount ) < fund.BalanceMinUnit) {
            Modal.showAlert(`ขายเกินจำนวนขั้นต่ำ`)
            this.onMoveStep(this.status.inputData)
            return
        }

        // if( (holder.BalanceUnit - amount )< fund.BalanceMinUnit){
        //     Modal.showAlert(`สับเปลี่ยนเกินจำนวนขั้นต่ำ`)
        //     this.onMoveStep(this.status.inputData)
        //     return
        // }

        this.progress.showProgressTransaction();

        this
            .investmentService
            .insertOrderSell(this.dataService.transaction)
            .subscribe(data => {
                this.dataService.transaction.insertOrderSell = data.data[0]
                this.progress.hide();
                this.onMoveStep(this.status.complete);
            }, error => {
                this.progress.showErrorWithMessage(error.responseStatus.responseMessage)
            })
    }

    public onClickSubmit(value) {
        this.onMoveStep( this.paymentType.FundTransfer);
    }


    public onSelectedType($selectedBankAccount: any) {

        this.isPrincipal = true;
        this.investType = $selectedBankAccount;

    }

    public onClickBack() {

        if (this.progress && this.progress.isShowing()) {
            this.progress.hide();
            this.onMoveStep(this.status.inputData);
            return;
        }

        const that = this;
        if (this.isSelectAccount) {
            this.onSelectedAccount(null);
        }
        else if (this.dataService.transaction.currentStatus === this.status.inputData ||
            this.dataService.transaction.currentStatus === this.status.complete) {

            this.dataService.resetInterLogin();
            if (this.dataService.transaction.fromFix) {
                this.router.navigate(["/kk/", "transactionBank"], {replaceUrl: true});
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
            if (this.dataService.transaction.currentStatus === this.status.confirmation ||
                this.dataService.transaction.currentStatus === this.status.generateOtp) {
                this.onClickClose()
            }
        }
    }

    public redirectToMain() {
        const that = this;
        if (this.dataService.transaction.currentStatus === this.status.inputData) {
            Utils.animate("#container_form_investment", "bounceOutRight")
                .then(() => {
                    this.router.navigate(["kk", "investment"]);
                });
        }

        if (this.dataService.transaction.currentStatus === this.status.complete) {
            that.router.navigate(["/kk"]);
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
}
