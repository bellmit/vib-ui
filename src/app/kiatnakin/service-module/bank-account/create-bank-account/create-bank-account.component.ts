import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {Register, IdCardInfo, BankAccount} from "../../../_model/index";
import {KeyboardService} from "../../../_service/keyboard.service";
import {
    FingerScanInfoComponent as fingerScanInfo,
    FingerScanDeviceComponent as fingerDevice,
    FingerStateInfo as fingerStateInfo,
    CardReaderInfoComponent as cardInfo,
    CardReaderDeviceComponent as cardDevice,
    CardReaderStateInfo as cardReaderStateInfo
} from "./../../../_share/index";
import {HardwareService} from "../../../_service/hardware.service";
import {AppConstant} from "../../../../share/app.constant";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../../_service/user.service";
import {DataService} from "../../../_service/data.service";
import {Modal} from "../../../_share/modal-dialog/modal-dialog.component";

@Component({
    selector: 'app-create-bank-account',
    templateUrl: 'create-bank-account.component.html',
    styleUrls: ['create-bank-account.component.sass', '../../../_template/template-flip-book/template-flip-book.component.sass']
})

export class CreateBankAccountComponent implements OnInit {

    public fingerScanFailure: boolean = false;
    public isShowCloseButton: boolean = true;
    public currentPageIndex: number = 2;
    public register: Register;
    public disabledOfficeAddress: boolean = false;
    public disabledCurrentAddress: boolean = false;

    private flipBook = null;
    private currentPageSection: string = "";
    private userInfo: IdCardInfo = new IdCardInfo();

    @ViewChild("ssu_Form1") ssuForm1: NgForm;
    @ViewChild("ssu_Form2") ssuForm2: NgForm;
    @ViewChild("ssu_Form3") ssuForm3: NgForm;
    @ViewChild("ssu_Form4") ssuForm4: NgForm;

    @ViewChild("fatca_Form1") fatcaForm1: NgForm;
    @ViewChild("fatca_Form2") fatcaForm2: NgForm;
    @ViewChild("fatca_Form3") fatcaForm3: NgForm;

    @ViewChild("subscr_Form1") subscriptionForm1: NgForm;
    @ViewChild("subscr_Form2") subscriptionForm2: NgForm;
    @ViewChild("subscr_Form3") subscriptionForm3: NgForm;

    @ViewChild('fingerDevice') fingerDevice: fingerDevice;
    @ViewChild('fingerInfo') fingerInfo: fingerScanInfo;
    @ViewChild('cardDevice') cardDevice: cardDevice;
    @ViewChild('PINDevice') PINDevice: cardDevice;
    @ViewChild('cardInfo') cardInfo: cardInfo;

    private authentication = {
        openAccount: true,
        idScan: false,
        fingerScan: false,
        pin: false,
        termCondition: false,
        transactionSuccess: false
    };

    constructor(private location: Location,
                private router: Router,
                private hardwareService: HardwareService,
                private userService: UserService,
                private dataService: DataService) {
    }

    ngOnInit() {
        this.initTestData();
    }

    private initTestData() {
        this.register = new Register(new IdCardInfo());

        const message = {
            nameTh: {
                title: "",
                firstName: "สมปอง",
                lastName: "มาดี"
            },
            nameEn: {
                title: "",
                firstName: "Sompong",
                lastName: "Madee"
            },
            citizenId: "1929903948172",
            address: {
                no: "",
                village: "",
                road: "",
                district: "",
                subdistrict: "",
                province: ""
            }
        };

        this.userInfo.parseJSON(message);
        this.register.updateUserInfo(this.userInfo);
        // this.register.ssu.nation = "ไทย";
        // this.register.subscription.office.country = "ไทย";
    }

    public onClickClose() {

        Modal.showConfirm(Modal.title.exit, () => {
            this.closeBook();
            setTimeout(() => {
                this.location.back();
            }, 900);
        }, null);
    }

    private closeBook() {
        this.isShowCloseButton = false;
        this.flipBook.turn("page", 2).turn('stop').turn("page", 1);
    }

    public onFlipInit(flipObject) {
        this.flipBook = flipObject;
    }

    public onStart($page) {
        this.isShowCloseButton = false;
        this.currentPageSection = $page.page.getAttribute("data-id");
    }

    public onTurning($page) {
        this.currentPageIndex = $page.index;
        this.validatePageData($page.event);

    }

    public onTurned($page) {
        this.currentPageIndex = $page.index;
        this.currentPageSection = $page.page.getAttribute("data-id");
        this.isShowCloseButton = $page.index !== 1;
        KeyboardService.initKeyboardInputText();
        this.checkRequestAuthentication();

    }

    public onEnd($page) {
        console.log("$page.index", $page.index);
        this.isShowCloseButton = $page.index !== 1;
    }

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // /

    public onClickNextPage() {
        this.flipBook.turn("next");
    }

    public onClickPreviuesPage() {
        this.flipBook.turn("previous");
    }

    public onClickAcceptTerm() {
        this.authentication.termCondition = true;
        this.onClickNextPage();
    }

    public onClickOpenAccountSuccess() {
        this.closeBook();
        this.userService.loginSuccess(null);
        // this.dataService.selectedAccount = BankAccount.getList()[0];
        this.router.navigate(["kk", "transactionBank"]);
    }

    public onSubmit() {

    }

    public displayAccountGroup(group: string): string {
        if (group === 'Saving') {
            return "ออมทรัพย์";
        }
        else if (group === 'Fixed') {
            return "ฝากประจำ";
        }
        else if (group === 'Current') {
            return "กระแสรายวัน";
        }
        return "";
    }

    public setDisableOfficeAddress(bool: boolean) {
        this.disabledOfficeAddress = bool;
    }

    public setDisableAddressFrom(num: number) {
        if (num === 0) {
            // todo กำหนดค่า ก่อจะ submit
            // this.register.subscription.address = this.userInfo.address;
            this.disabledCurrentAddress = true;
        } else if (num === 1) {
            // todo กำหนดค่า ก่อจะ submit
            // this.register.subscription.address = this.register.subscription.office;
            this.disabledCurrentAddress = true;
        } else if (num === 2) {
            // this.register.subscription.address = new address();
            this.disabledCurrentAddress = false;
        }
    }

    private checkRequestAuthentication() {

        if (this.currentPageSection === AppConstant.sectionSavingFlow.idCardScan && !this.authentication.idScan) {
            this.onRequestSmartCardReader();

        }
        else if (this.currentPageSection === AppConstant.sectionSavingFlow.fingerScan && !this.authentication.fingerScan) {
            this.onRequestFingerScan();
        }
        else if (this.currentPageSection === AppConstant.sectionSavingFlow.pin && !this.authentication.pin) {
            this.onRequestPIN();
        }

    }

    private validatePageData(event) {

        if (!AppConstant.ignoreValid) {
            if (this.checkCurrentPageSection()) {
                event.preventDefault();
                return false;
            }
            else if (this.currentPageSection.indexOf("ssu2") !== -1) {
                this.checkSSU2FormValid(event);
            }
            else if (this.currentPageSection.indexOf("ssu4") !== -1) {
                this.checkSSU4FormValid(event);
            }
            else if (this.currentPageSection.indexOf("fatca2") !== -1) {
                this.checkFATCA2FormValid(event);
            }
            else if (this.currentPageSection.indexOf("fatca4") !== -1) {
                this.checkFATCA4FormValid(event);
            }
            else if (this.currentPageSection.indexOf("ssuNew2") !== -1) {
                this.checkSSU2NEWFormValid(event);
            }
            else if (this.currentPageSection.indexOf("ssuNew4") !== -1) {
                this.checkSSU4NEWFormValid(event);
            }
            else if (this.currentPageSection.indexOf("user_authenpin") !== -1) {

                // if ((this.register.PIN === "" || this.register.confirmPIN === "") ||
                //     ( this.register.PIN !== this.register.confirmPIN )
                // ) {
                //     event.preventDefault();
                //     Modal.showAlert(Modal.title.required);
                // }
            }

        }
    }

    private checkCurrentPageSection() {
        if (
            (this.currentPageSection === AppConstant.sectionSavingFlow.openAccount && !this.authentication.openAccount) ||
            (this.currentPageSection === AppConstant.sectionSavingFlow.idCardScan && !this.authentication.idScan) ||
            (this.currentPageSection === AppConstant.sectionSavingFlow.termCondition && !this.authentication.termCondition) ||
            (this.currentPageSection === AppConstant.sectionSavingFlow.fingerScan && !this.authentication.fingerScan)
        ) {
            return true;
        } else {
            return false;
        }
    }

    private checkSSU2FormValid(event) {
        if (!this.ssuForm1.valid || !this.ssuForm2.valid) {
            event.preventDefault();
            Modal.showAlert(Modal.title.required);
        }
    }

    private checkSSU4FormValid(event) {
        if (!this.ssuForm3.valid || !this.ssuForm4.valid) {
            event.preventDefault();
            Modal.showAlert(Modal.title.required);
        }
    }

    private checkFATCA2FormValid(event) {
        if (!this.fatcaForm1.valid || !this.fatcaForm2.valid) {
            event.preventDefault();
            Modal.showAlert(Modal.title.required);
        }
    }

    private checkFATCA4FormValid(event) {
        if (!this.fatcaForm3.valid) {
            event.preventDefault();
            Modal.showAlert(Modal.title.required);
        }
    }

    private checkSSU2NEWFormValid(event) {
        if (!this.subscriptionForm1.valid || !this.subscriptionForm2.valid) {
            event.preventDefault();
            Modal.showAlert(Modal.title.required);
        }
    }

    private checkSSU4NEWFormValid(event) {
        if (!this.subscriptionForm3.valid) {
            event.preventDefault();
            Modal.showAlert(Modal.title.required);
        }
    }

    private setPinValue(pin) {

        document.getElementById("pin-1").innerHTML = pin;
        document.getElementById("pin-2").innerHTML = pin;
        document.getElementById("pin-3").innerHTML = pin;
        document.getElementById("pin-4").innerHTML = pin;
        document.getElementById("pin-5").innerHTML = pin;
        document.getElementById("pin-6").innerHTML = pin;

    }


    // HARDWARE //
    private onRequestFingerScan() {

        this.hardwareService.requestFingerScan((prepare) => {
            this.fingerDevice.moveIn();
            this.fingerInfo.setState(fingerStateInfo.ready);

        }, (capture) => {
            this.fingerDevice.stickIn();
            this.fingerInfo.setState(fingerStateInfo.reading);

        }, (success) => {
            this.fingerDevice.stickOut();
            this.fingerInfo.setState(fingerStateInfo.success);

        }, (error) => {
            this.fingerDevice.stickOut();
            this.fingerInfo.setState(fingerStateInfo.error);

        });

    }

    private onRequestPIN() {

        this.hardwareService.requestPIN((status) => {
            this.fingerDevice.moveIn();
            this.fingerInfo.setState(fingerStateInfo.ready);
        }, (success) => {
            this.fingerDevice.stickOut();
            this.fingerInfo.setState(fingerStateInfo.success);

        }, (error) => {
            this.fingerDevice.stickOut();
            this.fingerInfo.setState(fingerStateInfo.error);

        });

    }

    private onRequestSmartCardReader() {
        // this.cardDevice.moveIn();
        // this.cardInfo.setState(cardReaderStateInfo.ready);
        //
        // this.hardwareService.requestSmartCardReader((ready) => {
        //     this.cardDevice.moveIn();
        //     this.cardInfo.setState(cardReaderStateInfo.ready);
        //
        // }, (foundCard) => {
        //     this.cardDevice.stickIn();
        //     this.cardInfo.setState(cardReaderStateInfo.reading);
        //
        // }, (reading) => {
        //     this.cardDevice.stickIn();
        //     this.cardInfo.setState(cardReaderStateInfo.reading);
        //
        // }, (success) => {
        //     this.cardDevice.stickOut();
        //     this.cardInfo.setState(cardReaderStateInfo.success);
        //
        // }, (error) => {
        //     this.cardDevice.stickOut();
        //     this.cardInfo.setState(cardReaderStateInfo.error);
        //
        // });
    }
}
