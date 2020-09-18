import { Component, OnInit, OnDestroy, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Environment, Utils } from "../../../../share/utils";
import { isNullOrUndefined } from "util";
import { KeyboardService } from "../../../_service/keyboard.service";
import { HardwareService } from "../../../_service/hardware.service";
import { DataService } from "../../../_service/data.service";
import { Bank } from "../../../_model/bank";
import { PaymentType, Transaction, TransactionStatus } from "../../../_model/transaction";
import { ChequeService } from "../../../_service/api/cheque.service";
import { AccountService } from "../../../_service/api/account.service";
import { Modal } from "../../../_share/modal-dialog/modal-dialog.component";
import { BankAccount } from "../../../_model/bankAccount";
import { Withdraw } from "../../../_model/withdraw";
import { ToStringNumberPipe } from "../../../_pipe/toStringNumber.pipe";
import { MasterDataService } from "../../../_service/api/master-data.service";
import { Deposit } from "../../../_model/deposit";
import { AppConstant } from "../../../../share/app.constant";

@Component({
    selector: 'app-cheque-scanner',
    templateUrl: './cheque-scanner.component.html',
    styleUrls: ['./cheque-scanner.component.sass']
})
export class ChequeScannerComponent implements OnInit, OnDestroy {

    @Input() queryParams: [string, string];
    @Output() scaN: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();

    public status = TransactionStatus;
    public paymentType = PaymentType;
    public bank = Bank;
    public currentStatus;
    private maximumCountdown = 3;
    private maximumCountScanFailure = 1;
    private refreshScan = 2;
    private countScan = 0;
    private interval;
    private countScanError: number = 0;
    public timer = this.maximumCountdown;
    public imageURL = null;
    public bank_branch: string;
    public micrResultTemplate: any = {
        bank_code: "",
        account_no: "",
        cheque_no: "",
        branch_code: "",
        chequeType: ""
    };
    public micrResult = this.micrResultTemplate;

    public bankList: any[];
    public withdrawChq: boolean = true;
    public show: boolean = false;
    public bankCode: string;

    constructor(private router: Router,
        private hardwareService: HardwareService,
        private zone: NgZone,
        private activatedRoute: ActivatedRoute,
        private accountService: AccountService,
        private masterData: MasterDataService,
        private chequeService: ChequeService,
        private dataService: DataService) {

        dataService.config.displayLoginCard = false;
        this.hardwareService.connectHardware();
    }

    ngOnInit() {
        this.getBankList();
        this.zone.run(() => {
            $("#bell").hide();
            this.startTimerMICR();
        });

        //mockdata
        if (this.dataService.transaction.constructor === Withdraw) {
            this.withdrawChq = false;
        }
    }

    private initObject() {
        const data = this.bankList;
    }

    ngOnDestroy() {

        $("#bell").show();
        this.stopTimerMICR();
        this.hardwareService.disconnect();
    }

    public reStartTimerMICR() {
        console.log("ENTER RestartTimerMIRC");
        this.currentStatus = this.status.scan_wait;
        this.countScan = 0;
        this.countScanError = 0;
        this.stopTimerMICR();
        this.startTimerMICR();

        console.log("EXIT RestartTimerMIRC");
    }

    public startTimerMICR() {

        this.countScan = this.countScan + 1;

        if (isNullOrUndefined(this.interval)) {
            this.currentStatus = this.status.scan_wait;
            console.log("startTimerMICR");
            this.imageURL = "";
            this.micrResult = this.micrResultTemplate;

            $(".content").fadeIn();
            this.timer = this.maximumCountdown;
            const that = this;
            this.interval = setInterval(() => {

                console.log(this.timer);
                if (this.timer === 1) {
                    that.stopTimerMICR();
                    that.onRequestMICR();
                }
                else {
                    this.timer = this.timer - 1;
                }

            }, 1000);
        }
    }

    private stopTimerMICR() {
        console.log("ENTER stopTimerMICR");

        // this.show = true;
        if (!isNullOrUndefined(this.interval)) {
            console.log("stopTimerMICR");

            clearInterval(this.interval);
            this.interval = null;
        }
        $(".content").fadeOut();

        console.log("EXIT stopTimerMICR");
    }

    // private onRequestMICRMOCK() {
    //     console.log("onRequestMICR_MOCK");
    //     KeyboardService.initKeyboardInputText();
    //     const cheque_no = '102238';
    //     const bank_code = '069';
    //     const branch_code = '003';
    //     const account_no = '00091420000013';
    //     const chequeType = '01';
    //
    //     this.micrResult = Utils.splitMICRNumber(
    //         "@" + cheque_no + "@" + bank_code + "-" + branch_code + "[" + account_no + "@" + chequeType); // Mock Data Bookbank CA
    //     if (!isNullOrUndefined(this.micrResult)) {
    //         this.dataService.transaction.chequeObject = this.micrResult;
    //         this.onScanSuccess();
    //     }
    // }

    private onRequestMICR() {
        console.log("onRequestMICR");
        this.micrResult = this.micrResultTemplate;
        const that = this;
        this.hardwareService.requestScanDocumentMICR()
            .subscribe(
                (data: any) => {

                    if (data.code === "0000") {

                        this.imageURL = `${Environment.domainImageOutput}${data.results.fileName}`;
                        // console.log(data.results.value);
                        // if (isNullOrUndefined(data.results.value)) {
                        this.micrResult = Utils.splitMICRNumber(data.results.value);
                        // } else {
                        //     this.startTimerMICR();
                        // }
                        // console.log(this.micrResult);

                        if (!isNullOrUndefined(this.micrResult)) {
                            this.dataService.transaction.chequeObject = this.micrResult;
                            this.currentStatus = this.status.scan_success;
                            this.onScanSuccess();
                            return;
                        }
                        else {
                            this.countScanError++;
                            this.startTimerMICR();
                        }

                    }
                    else if (data.code.startsWith("9", 0)) {
                        this.countScanError++;
                        that.startTimerMICR();
                        return
                    }

                    if (this.countScanError > this.maximumCountScanFailure) {
                        this.currentStatus = this.status.scan_false;
                        console.log('countScanError > maximum');
                        that.stopTimerMICR();
                        return
                    }

                },
                error => {
                    this.micrResult = this.micrResultTemplate;
                    this.countScanError++;
                    if (this.countScanError > this.maximumCountScanFailure) {
                        this.currentStatus = this.status.scan_false;
                        console.log('Error');
                        that.stopTimerMICR();
                        return
                    }
                    this.startTimerMICR();
                }
            );
    }

    private onScanSuccess() {
        setTimeout(() => {
            this.setImageResultPinch();
            $("#button-back").fadeIn();
        }, 500);
    }

    public onSelectedAccount(type?: string) {

        if (this.queryParams) {
            KeyboardService.initKeyboardInputText();

            if (type === 'onChooseAnother') {
                this.currentStatus = this.status.inputCheque;
                // this.micrResult = false;
                // this.scaN.emit(this.dataService.transaction.status.inputCheque);
                // const returnUrl = this.queryParams["returnUrl"];
                //
                // if (!isNullOrUndefined(returnUrl)) {
                //     this.router.navigate(['/kk/', returnUrl], {queryParams: {"inputData": true}});
                // }
            }
            else {
                setTimeout(() => {
                    Utils.animate("#div-select-account-to", "pulse")
                }, 100);

                // this.dataService.transaction.temp.accountType = PaymentType.Cheque;
                // this.dataService.transaction.temp.cheque_no = this.micrResult.cheque_no;
                // this.dataService.transaction.currentStatus = this.dataService.transaction.status.inputData;
            }
        } else {
            // this.dataService.config.displayLoginCard = true;
            // this.dataService.isAnonymousMode = true;
            this.router.navigate(['kk', 'chequeBuy'], { replaceUrl: true });
        }
    }

    private getBankList() {

        this.masterData.getMasterBank()
            .subscribe(
                bankList => {

                    this.bankList = bankList;
                    this.initObject();
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );
    }

    public onCheckAvailableCheque() {
        let bankdata = null

        this.micrResult.cheque_no = this.micrResult.cheque_no.padStart(8, '0');
        this.micrResult.bank_code = this.micrResult.bank_code.padStart(3, '0');
        this.micrResult.branch_code = this.micrResult.branch_code.padStart(4, '0');

        console.log('onCheckAvailableCheque');
        if (this.micrResult.bank_code === "069") {
            if (this.dataService.transaction.constructor === Deposit || this.micrResult.chequeType === '01') {
                Modal.showProgress();
                if (this.micrResult.chequeType === '01') {

                    this.chequeService.checkcastatus(
                        this.micrResult.account_no,
                        this.micrResult.cheque_no)
                        .subscribe(
                            data => {
                                if (data.data.V_PAID_STATUS === 'U') {
                                    const bankData = this.bankList.filter(bank => bank.code === this.micrResult.bank_code);
                                    this.dataService.transaction.temp = BankAccount.getAccountTypeCheque();
                                    this.dataService.transaction.temp.accountNumber = this.micrResult.account_no;
                                    this.dataService.transaction.temp.branchCode = this.micrResult.branch_code;
                                    this.dataService.transaction.bank_code_org = this.micrResult.bank_code;
                                    this.dataService.transaction.temp.micrResult = this.micrResult.cheque_no;
                                    this.dataService.transaction.temp.chequeType = this.micrResult.chequeType;
                                    this.getAccount(this.dataService.transaction.temp.accountNumber);

                                    for (bankdata of bankData) {
                                        this.dataService.transaction.temp.bank.name = bankdata.name;
                                        this.dataService.transaction.temp.bank.image = bankdata.image;
                                        this.dataService.transaction.temp.bank.code = bankdata.code;
                                    }
                                }
                            },
                            error => {
                                Modal.showAlert(error.responseStatus.responseMessage);
                            }
                        )
                        ;
                }
                else if (this.micrResult.chequeType === '02') {
                    this.chequeService.checkAvailableChq(
                        this.micrResult.bank_code,
                        this.micrResult.account_no,
                        this.micrResult.cheque_no,
                        this.micrResult.branch_code)
                        .subscribe(
                            data => {

                                const bankData = this.bankList.filter(bank => bank.code === this.micrResult.bank_code);
                                this.dataService.transaction.temp = BankAccount.getAccountTypeCheque();
                                this.dataService.transaction.temp.branchCode = this.micrResult.branch_code;
                                this.dataService.transaction.bank_code_org = this.micrResult.bank_code;
                                this.dataService.transaction.temp.micrResult = this.micrResult.cheque_no;
                                this.dataService.transaction.temp.chequeType = this.micrResult.chequeType;
                                this.dataService.transaction.temp.beneficiary_name = data.data.BENEFICIARY_NAME;
                                for (bankdata of bankData) {
                                    this.dataService.transaction.temp.bank.name = bankdata.name;
                                    this.dataService.transaction.temp.bank.image = bankdata.image;
                                    this.dataService.transaction.temp.bank.code = bankdata.code;
                                }
                                const returnUrl = this.queryParams["returnUrl"];

                                Modal.hide();

                                if (data.data.CHQ_AVAILABLE !== 'Y') {
                                    this.dataService.transaction.stock_serial_no = data.data.SERIAL_NO;
                                    this.dataService.transaction.amount = data.data.AMOUNT.toString();
                                    this.dataService.transaction.amount = new ToStringNumberPipe().transform(this.dataService.transaction.amount, Utils.getCountDigit(this.dataService.transaction.amount))
                                }

                                if (this.dataService.transaction.constructor === Deposit) {
                                    this.dataService.transaction.Inputfrom = this.paymentType.Cheque;
                                }

                                if (!isNullOrUndefined(returnUrl)) {
                                    this.router.navigate(['/kk/', returnUrl], { queryParams: { "inputData": true } });
                                }
                            },
                            error => {
                                Modal.showAlert(error.responseStatus.responseMessage);
                            }
                        );

                }
            } else {
                Modal.showAlert('ขออภัยระบบไม่สามารถทำการถอนเงินจาก แคชเชียร์เช็คได้');
            }
        } else {
            if (this.dataService.transaction.constructor === Deposit) {
                Modal.showProgress();
                this.chequeService.checkAvailableChq(
                    this.micrResult.bank_code,
                    this.micrResult.account_no,
                    this.micrResult.cheque_no,
                    this.micrResult.branch_code)
                    .subscribe(
                        value => {
                            if (value.data.CHQ_AVAILABLE === 'Y') {
                                this.chequeService.checkreceivingotherbankstatus(Environment.branchCode).subscribe(
                                    data => {
                                        // if (data.data.FLG_LATE_CLEARING !== 'N') {
                                        const bankData = this.bankList.filter(bank => bank.code === this.micrResult.bank_code);
                                        this.dataService.transaction.temp = BankAccount.getAccountTypeCheque();
                                        this.dataService.transaction.temp.branchCode = this.micrResult.branch_code;
                                        this.dataService.transaction.bank_code_org = this.micrResult.bank_code;
                                        this.dataService.transaction.temp.micrResult = this.micrResult.cheque_no;
                                        this.dataService.transaction.temp.chequeType = this.micrResult.chequeType;
                                        this.dataService.transaction.temp.cheque.chq_status = value.data.CHQ_AVAILABLE;
                                        for (bankdata of bankData) {
                                            this.dataService.transaction.temp.bank.name = bankdata.name;
                                            this.dataService.transaction.temp.bank.image = bankdata.image;
                                            this.dataService.transaction.temp.bank.code = bankdata.code;
                                        }
                                        const returnUrl = this.queryParams["returnUrl"];
                                        Modal.hide();
                                        if (!isNullOrUndefined(returnUrl)) {
                                            this.router.navigate(['/kk/', returnUrl], { queryParams: { "inputData": true } });
                                        }
                                        // } else {
                                        //     Modal.showAlert('ขออภัยเช็คต่างธนาคารไม่อยู่ในช่วงเวลาทำการ');
                                        // }
                                    },
                                    error => {
                                        Modal.showAlert(error.responseStatus.responseMessage);
                                    }
                                );
                            }
                        },
                        error => {
                            Modal.showAlert(error.responseStatus.responseMessage);
                        }
                    )

            } else {
                Modal.showAlert('ขออภัยระบบไม่สามารถทำการถอนเงินจาก เช็คต่างธนาคารได้');
            }
        }

    }

    public subBank() {
        if (this.bank_branch.length === 5) {
            this.micrResult.bank_code = this.bank_branch.substr(0, 2);
            this.micrResult.branch_code = this.bank_branch.substr(3, 3);
        }
        else if (this.bank_branch.length === 7) {
            this.micrResult.bank_code = this.bank_branch.substr(0, 3);
            this.micrResult.branch_code = this.bank_branch.substr(4, 4);
        }
        console.log('bank code = ' + this.micrResult.bank_code + ' branch code = ' + this.micrResult.branch_code);
    }

    public getAccount(accountNumber) {

        this.accountService
            .getAccountDetail(accountNumber)
            .subscribe(
                (bankAccount: BankAccount) => {
                    Modal.showProgress();
                    console.log(bankAccount);
                    this.dataService.transaction.temp.accountName = bankAccount.accountName;
                    this.dataService.transaction.temp.cust_id = bankAccount.custCif;
                    this.dataService.transaction.temp.availBalance = bankAccount.availBalance;

                    const returnUrl = this.queryParams["returnUrl"];

                    Modal.hide();
                    if (!isNullOrUndefined(returnUrl)) {
                        this.router.navigate(['/kk/', returnUrl], { queryParams: { "inputData": true } });
                    }
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                }
            );
    }

    private setImageResultPinch() {
        let scale = 1;
        let angle = 0;
        const gestureArea = document.getElementById('img-result-area');
        const scaleElement = document.getElementById('img-result');

        resetPosition();
        interact(gestureArea)
            .gesturable({
                onmove: function (event) {
                    scale = scale * (1 + event.ds);
                    if (scale > 2) {
                        scale = 2;
                    }
                    else if (scale < 0.5) {
                        scale = 0.5;
                    }
                    console.log("scale: ", scale);

                    angle += event.da;
                    console.log("angle: ", angle);

                    scaleElement.style.webkitTransform =
                        scaleElement.style.transform =
                        'scale(' + scale + ') rotate(' + angle + 'deg)';

                },
                onend: function (event) {
                }
            })
            .draggable({ onmove: dragMoveListener })
            .on('doubletap', function (event) {
                resetPosition();
            });

        function resetPosition() {
            $("html").css("cursor", "default");
            scale = 1;
            angle = 0;
            scaleElement.style.webkitTransform = "";
            scaleElement.style.transform = 'scale(1)';

            scaleElement.style.webkitTransform = "";
            scaleElement.style.transform = 'rotate(0deg)';

            gestureArea.style.webkitTransform = "";
            gestureArea.style.transform = 'translate(0px, 0px)';

            gestureArea.setAttribute('data-x', '0');
            gestureArea.setAttribute('data-y', '0');
        }

        function dragMoveListener(event) {

            const rotate = document.body.classList.contains('rotate-180') ? -1 : 1;
            const target = event.target;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.dx * rotate);
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.dy * rotate);

            target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
        }

    }

    public onClickBack() {
        this.stopTimerMICR();

        if (this.activatedRoute.snapshot.queryParams) {

            const objectParams = this.activatedRoute.snapshot.queryParams;
            const returnUrl = objectParams.returnUrl || '';
            const queryParams = {};
            for (const key in objectParams) {

                if (key !== "returnUrl") {
                    queryParams[key] = objectParams[key];
                }
            }

            this.router.navigate(["/kk/" + returnUrl], { queryParams: queryParams, replaceUrl: true });
        } else {
            this.router.navigate(['kk']);
        }
    }
}
