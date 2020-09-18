import {AfterViewInit, Component, OnInit, Input, ViewChild, Output, EventEmitter} from '@angular/core';
import {Location, DatePipe} from '@angular/common';
import {BahtTextPipe} from "../../../_pipe/bahttext.pipe";
import {ToStringNumberPipe} from "../../../_pipe/toStringNumber.pipe";
import {Router, ActivatedRoute} from "@angular/router";
import {Modal} from "../../../_share/modal-dialog/modal-dialog.component";
import {UserService} from "../../../_service/user.service";
import {DataService} from "../../../_service/data.service";
import {KeyboardService} from "../../../_service/keyboard.service";
import {HardwareService} from "../../../_service/hardware.service";
import {MasterDataService} from "../../../_service/api/master-data.service";
import {Utils} from "../../../../share/utils";
import {isNullOrUndefined} from "util";
import {BankAccount} from "../../../_model/bankAccount";
import {ServiceCategory} from "../../../_model/serviceCategory";
import {PaymentType, SelectType, Transaction} from "../../../_model/transaction";
import {ProgressDialogComponent} from "../../../_share/progress-dialog/progress-dialog.component";
import {TransactionService} from "../../../_service/api/transaction.service";

@Component({
    selector: 'app-service-detail',
    templateUrl: './service-detail.component.html',
    styleUrls: ['./service-detail.component.sass']
})
export class ServiceDetailComponent implements OnInit, AfterViewInit {

    @ViewChild('progress') progress: ProgressDialogComponent;
    @Output() selectedAccount: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();
    @Input() queryParams: Map<string, string>;

    public status;
    public show = true;
    public imageName: string;
    public bankName: string = 'Null';
    public activeIndex: any = 1;
    public isSelectAccount = false;
    public paymentType = PaymentType;
    public show_btn_back: boolean = true;
    public bankList: any[];
    public isSelectAppChannel: boolean = false;
    public selectedService;
    public serviceCategoryList;

    constructor(private location: Location,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private hardwareService: HardwareService,
        private masterData: MasterDataService,
        public userService: UserService,
        public dataService: DataService,
        private transactionService: TransactionService) {

        if (isNullOrUndefined(dataService.transaction)) {
            dataService.transaction = new Transaction();
        }
        this.status = dataService.transaction.status;
        this.selectedService = dataService.selectedService;
    }

    ngOnInit() {
        this.getBankList();


        setTimeout(() => {
            let lastedStatus = this.dataService.transaction.currentStatus ? this.dataService.transaction.currentStatus : this.status.selectType;

            if (lastedStatus !== this.status.selectType && !this.dataService.isAuthenticated) {
                lastedStatus = this.status.selectType;
            }
            this.onMoveStep(lastedStatus);

        }, 500);
    }

    ngAfterViewInit() {
        Utils.animate("#div-service-detail", "bounceInRight")
        setTimeout(() => {
            KeyboardService.initKeyboardInputText();
        }, 500);
    }

    public initObject() {

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

    public onMoveStep(step) {
        this.dataService.transaction.currentStatus = step;

        const status = this.dataService.transaction.status;
        this.checkMoveStep1(step, status);
        this.checkMoveStep2(step, status);
        KeyboardService.initKeyboardInputText();
    }

    public checkMoveStep1(step, status) {
        switch (step) {
            case status.selectType:
                setTimeout(() => {
                    this.initObject();
                }, 100);
                break;
            case status.ScanCheque:
                this.show = false;
                break;
            case status.Addbarcode:
                this.show_btn_back = true;
                break;
            case status.scan_success:
                this.show_btn_back = false;
                setTimeout(() => {
                    this.onMoveStep(this.dataService.transaction.status.inputData);
                }, 3000);
                break;
            case status.scan_false:
                this.show_btn_back = false;
                setTimeout(() => {
                    this.onMoveStep(this.dataService.transaction.status.Addbarcode);
                }, 3000);
                break;
            case status.scan_wait:
                this.show_btn_back = false;
                break;
            default:
                break
        }
    }

    public checkMoveStep2(step, status) {
        switch (step) {
            case status.inputData:
                this.show_btn_back = true;
                this.dataService.transaction.serviceName = 'ชำระสินเชื่อบ้าน';
                this.dataService.transaction.service_accountName = 'คณิน ประดิษฐานนท์';
                this.dataService.transaction.service_address = '53/363 กฤษดานคร ถ.แจ้งวัฒนะ ต.บางตลาด อ.ปากเกร็ด จ.นนทบุรี 11120';
                this.dataService.transaction.contract_no = "1111-1111-1111";
                break;
            case status.confirmation:
                this.onGetTransactionFee();
                break;
            case this.paymentType.Cash:
                this.onMoveStep(this.dataService.transaction.status.confirmation);
                break;
            case this.paymentType.FundTransfer:
                if (!this.userService.isLoggedin()) {
                    this.router.navigate(
                        ["kk", "selectBankAccount"], {
                            queryParams: {
                                returnUrl: "service/detail",
                                'selectAccount': true
                            }
                        });
                    this.isSelectAccount = true;
                }
                else {
                    this.isSelectAccount = true;
                }
                break;
            case this.status.complete:
                this.show_btn_back = false;
                break;
            case this.status.Cashto:
                setTimeout(() => {
                    this.onMoveStep(this.dataService.transaction.status.complete);
                }, 3000);
                break;
            default:
                break
        }
    }

    public getBankList() {

        this.masterData.getMasterBank()
            .subscribe(
                bankList => {

                    this.bankList = bankList;
                    setTimeout(() => {
                        $(".bank").show();
                        this.initObject();
                    }, 150);
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );
    }


    public onClickSubmit() {

        this.onMoveStep(this.status.confirmation);
    }

    public onFavorite(status: boolean) {
        console.log(status);
        if (status) {
            setTimeout(() => {
                // this.progress.showSuccessWithMessage("");
                this.onClickClose();
            }, 3000);
            return
        }

        this.onClickClose();
    }

    public onSelectedAccount($selectedBankAccount) {

        this.isSelectAccount = false;
        // this.dataService.transaction.from = $selectedBankAccount
        this.onMoveStep(this.dataService.transaction.status.complete)

    }

    public onselectType() {
        this.isSelectAppChannel = true;
        this.dataService.transaction.titleSelectBankAccount = "ต้องการชำระหนี้ด้วย";
        this.dataService.transaction.selectType = SelectType.BookBank_CASH;
    }

    public onGetTransactionFee() {
        this.dataService.transaction.totalAmount = 0;
        this.dataService.transaction.amount = Utils.toStringNumber(this.dataService.transaction.amount);
        this.dataService.transaction.totalAmount = parseFloat(this.dataService.transaction.amount) + this.dataService.transaction.fee.amount;
    }

    public isInputAmount(value) {

        if (isNullOrUndefined(value)) {
            return false;
        }

        value = value.split(',').join('');
        const isNumber = !isNaN(value);
        if (isNumber) {

            const number = Number(value);
            return number >= 0.01;
        }

        return false;
    }

    public onClickPrintSlip(isPrint: boolean) {

        if (isPrint) {
            this.onRequestPrint();
            // this.progress.showProgressWithMessage("กำลังปริ้นใบเสร็จ");
            setTimeout(() => {
                // this.progress.showSuccessWithMessage("");
                // this.progress.hide();
            }, 3000);
            this.onMoveStep(this.dataService.transaction.status.favorite);
        } else {
            this.onMoveStep(this.dataService.transaction.status.favorite);
        }

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
        console.log("json print ", data);
        this.hardwareService.requestPrintSlip(json);

    }

    public onClickBack() {

        if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.selectType) {
            this.location.back();
        } else if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.ScanCheque) {
            this.onMoveStep(this.dataService.transaction.status.selectType)
        } else if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.Addbarcode
            || this.dataService.transaction.currentStatus === this.dataService.transaction.status.scan_wait
            || this.dataService.transaction.currentStatus === this.dataService.transaction.status.scan_success
            || this.dataService.transaction.currentStatus === this.dataService.transaction.status.scan_false
            || this.dataService.transaction.currentStatus === this.dataService.transaction.status.inputData
        ) {
            this.onMoveStep(this.dataService.transaction.status.ScanCheque)
        } else if (this.dataService.transaction.currentStatus === this.dataService.transaction.status.confirmation) {
            this.onMoveStep(this.dataService.transaction.status.inputData)
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

    public redirectToMain() {

        const that = this;
        that.router.navigate(["/kk"]);
        // $("#favorite_page").addClass("animated bounceOutRight");
        // $('#favorite_page').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        //     that.router.navigate(["/kk"]);
        // });
    }

}
