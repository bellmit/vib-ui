import { AfterContentInit, Component, OnInit, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { HardwareService } from "app/kiatnakin/_service/hardware.service";
import { saveAs } from "file-saver";
import { Router, ActivatedRoute } from "@angular/router";
import { KeyboardService } from "app/kiatnakin/_service/keyboard.service";
import { DataService } from "app/kiatnakin/_service/data.service";
import { AccountService } from "app/kiatnakin/_service/api/account.service"
import { Register, IdCardInfo, Gender, ContactInfo, BankAccount } from "app/kiatnakin/_model/";
import { Business, Property, Account, SubscriptionType } from "app/kiatnakin/_model/register";
import { isNullOrUndefined, inspect } from "util";
import { Utils, Environment } from "../../../../share/utils";
import { Modal } from "app/kiatnakin/_share/modal-dialog/modal-dialog.component";
import { TransactionService } from "../../../_service/api/transaction.service";
import { LoginService } from "app/kiatnakin/_service/api/login.service";
import { RegisterService } from "../../../_service/api/register.service";
import { Location } from '@angular/common';
import { UserService } from "app/kiatnakin/_service/user.service";
import { Product } from "../../../_model/Product";
import { TellerService } from '../../../_service/teller.service';
import { AppConstant } from '../../../../share/app.constant';
import * as moment from 'moment';
import { StringToDatePipe } from "../../../_pipe/StringToDatePipe";
import { Th } from '../../../../share/language/th';

@Component({
    selector: 'subscription-account',
    templateUrl: './subscription-account.component.html',
    styleUrls: ['./subscription-account.component.sass',
        '../../../_template/template-flip-book/template-flip-book.component.sass']
})
export class SubscriptionAccountComponent implements OnInit, AfterContentInit, OnDestroy {

    public flipBook = null;
    public currentPageIndex = 0;
    public currentPageSection: string = "";

    public userInfo: IdCardInfo = new IdCardInfo();
    public register: Register;
    public dataList = [];
    public List = [];
    public CountryList = [];
    public AllCountryList = [];
    public TitleList = [];
    public NationList = [];
    public List_mar = [];
    public AccountList = [];
    public InstructionList = [];
    public onSelectedAccountValue: any[];
    public subscription_phone = [];
    public subscription_sms = [];
    public RespondCode: string = "";
    public titleTypeList: string = "";
    public showSelector: boolean = false;
    public selected: string;
    public ActiveNow: any[];
    public sameoffice: boolean = false;
    public sametrans: boolean = false;
    public checkAccept: boolean = false;
    public showInput: boolean = false;
    public marital: any[];
    public ContryincomeTH: string;
    public scanCode: string = '1000';
    public isShowCloseButton: boolean = false;
    public isClosed = false;
    public myPin: string;
    public myPinRegisted: boolean = false;
    public isCASA: boolean = false;
    public assign_mypin_1: string = '';
    public assign_mypin_2: string = '';
    public smsServiceChecked: boolean;
    public pdfFormMasterApp: string;
    public pdfFormProduct: string;
    public pdfFormProductBenefit: string;
    public pdfFormService: string;
    public TermAndCondition: boolean = true;
    public newCustomer: boolean = true;
    public Subscription: boolean = true;
    public Services: boolean = true;
    public genPDF: boolean = false;
    public promtpay: boolean = false;
    public name_confirm: boolean = true;
    public SMS_LANG_CODE: string;
    public AddressSameOld: boolean = false;
    public mypin: boolean = false;
    public otp: boolean = false;
    public MyPINerror: boolean = false;
    public otp_moblie_number: string;
    public showFlipbook: boolean;
    public tempTitle_id: string;
    public checkExisting: boolean = false;
    public AccountTerm: string;
    public ElectronicsTerm: string;
    public customerExist: boolean = false;
    public customerSSU: string;
    public submit: boolean = false;
    public ClickSave: boolean = true;
    public progressModal: boolean = false;
    public progressModalFails: boolean = false;
    public progressSuccess: boolean = false;
    public progressPassRespond: boolean = false;
    public address = {};
    public TD_SA = false;
    public TD_SA_FLAG = false;
    public otp2 = false;
    public productType = "";
    public atmList: any[];
    public activeIndex: any = 0;
    public imageName: "";
    public atmServiceChecked: boolean;
    public isSelectAccount: boolean = false;
    public tempType: string = "";
    public PINcount: number = 1;
    public imgPart: string = "./assets/kiatnakin/image/";
    public otp_PromtPay: boolean = false;
    public otp_moblie_number_txt: string;
    public progressModalFailNoneRedirect: boolean = false;
    public progressModalFailCreateMyPinTDAccount: boolean = false;
    public updateCustomer: boolean = false;
    public validateEmailValue: boolean = false;
    public RegisPromtPay: boolean = false;
    public updateInfo: boolean = false;
    public updateCardInfo: boolean = false;
    public termAndConCound: number = 0;
    public validateEmail: string;
    public red_line: string = "border-bottom: 1px solid #FF0000 !important;";
    public blue_line: string = "border-bottom: 1px solid #594F74 !important;";
    public coverImage: string;
    public type: string;
    public checkPIN: boolean = true;
    public ShowSMS: boolean = false;
    public product: Product;
    public ValidateMobliePhone: boolean = false;
    public ValidateHomePhone: boolean = false;
    public ValidateFaxPhone: boolean = false;
    public ValidateOfficePhone: boolean = false;
    public ValidateContactPhone1: boolean = false;
    public ValidateContactPhone2: boolean = false;
    public ModalShow: boolean = false;
    public Modal_text: string = "";
    public Modal_text2: string = "";
    public Modal_image: string = "";
    public isRequestingSmartCardReader: boolean = false;
    public subIB: boolean = false;
    public subIVR: boolean = false;
    public subSMS: boolean = false;
    public btnSubmit: string = '';
    public genderList: any;
    public genderShowInput: boolean = false;
    public relationship1GenderShowInput: boolean = false;
    public KKSavingPlusType: string = 'SA';
    public relationship2GenderShowInput: boolean = false;
    public KKSavingPlusCode: string = '251';
    public KKSavingPlus: string = 'เคเค เซฟวิ่งส์ พลัส';
    public KKSavingPlusEng: string = 'KK Saving Plus Individual';
    public addSame: boolean = false;
    public tellerApproveType: string = '';
    public tellerApproveDetail: string = '';
    public checkOpenAccount = new Array('account', 'saving', 'fixed', 'current');
    public checkTitleActive: boolean = false;
    public checkSaveIBSuccess: boolean = false;
    public checkSavePinSuccess: boolean = false;

    status: string;
    canFlip = false;

    constructor(public router: Router,
        public dataService: DataService,
        public hardwareService: HardwareService,
        public tellerService: TellerService,
        public accountService: AccountService,
        public transactionService: TransactionService,
        public location: Location,
        public userService: UserService,
        public http: Http,
        public registerService: RegisterService,
        public loginService: LoginService,
        public activatedRoute: ActivatedRoute
    ) {
        dataService.currentUrl = activatedRoute.snapshot['_routerState'].url;
        this.coverImage = this.activatedRoute.snapshot.queryParams['coverImage'] || '';
        this.type = this.activatedRoute.snapshot.queryParams['type'] || '';

        window["cornerSize"] = 50;
        if (this.type === 'other') {
            this.type = 'SubSer';
        }
        this.showFlipbook = true;
    }

    ngOnInit() {
        this.setShowCloseButton(false);
        this.hardwareService.connectHardware();
        this.register = new Register(new IdCardInfo());
        this.genderList = this.getGenderList();
        this.register.subscriptionService.contact.email = '';
        this.register.subscriptionService.contact.moblie_phone = '';
        this.getConfigList('relation_type', 'ssu_relation1', false);
        this.getMasterATM();
        this.Get_TermAndCondition();
        $(`${"#submit_CustomerInfo_id"},${"#seletor_content_modal"},${"#dismiss_bg_otp"}`).hide();
        if (this.type !== 'SubSer') {
            if (isNullOrUndefined(this.dataService.selectedProduct)) {
                this.router.navigate(["/kk"]);
            } else {
                this.register.setProduct(this.dataService);
            }
        }
        this.getkeyboard();
    }

    ngOnDestroy() {
        this.dataService.currentUrl = '';

    }

    public getGenderList() {
        const genderList = [{
            'value': 'M',
            'data': 'ชาย'
        }, {
            'value': 'F',
            'data': 'หญิง'
        }]

        return genderList
    }

    public async getMasterATM() {
        Utils.logDebug('getMasterATM', 'start');
        Utils.logDebug('getMasterATM', 'GetMasterATM');
        return new Promise((resolve, reject) => this.registerService.GetMasterATM()
            .subscribe(
                data => {
                    this.atmList = data.data;
                    setTimeout(() => {
                        Utils.logDebug('getMasterATM', 'GetMasterATM -> setTimeout -> initATMList');
                        this.initATMList();
                        resolve()
                    }, 500);
                }, Error => {
                    Modal.showAlert(Error.responseStatus.responseMessage);
                    reject()
                }));
    }

    public onSelectedChanged(type, $event) {
        if (type === 'birthdate') {
            this.onChangeBirthdate($event);
        }
        if (type === 'issueDate') {
            this.onChangeIssueDate($event);
        }
        if (type === 'expireDate') {
            this.onChangeExpireDate($event);
        }
    }

    public onChangeBirthdate($event) {
        this.register.ssu.cardInfo.birthdate.day = $event.day;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.birthdate.day)) {
            this.setBlueLine("birthdate_day_id");
            this.setWidth('birthdate_day_id', '40px');
        }
        this.register.ssu.cardInfo.birthdate.mounth = $event.month;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.birthdate.mounth)) {
            this.setBlueLine("birthdate_month_id");
            this.setWidth('birthdate_month_id', '40px');
        }
        this.register.ssu.cardInfo.birthdate.year = $event.year;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.birthdate.year)) {
            this.setBlueLine("birthdate_year_id");
            this.setWidth('birthdate_year_id', '40px');
        }
        this.register.ssu.cardInfo.birthdate.sum = $event.day + '/' + Utils.getMonthShottoNumber($event.month) + '/' + $event.year;
        this.register.birthdate = $event.year + Utils.getMonthShottoNumber($event.month) + Utils.setPadZero($event.day, 2);
    }

    public onChangeIssueDate($event) {
        console.log('SubscriptionAccountComponent --- bass $event ->', $event)
        // $event = {day: "3", month: "พ.ค.", monthValue: "05", year: "2557"}
        this.register.ssu.cardInfo.issueDate.day = $event.day;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.issueDate.day)) {
            this.setBlueLine("issueDate_day_id");
            this.setWidth('issueDate_day_id', '40px');
        }
        this.register.ssu.cardInfo.issueDate.mounth = $event.month;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.issueDate.mounth)) {
            this.setBlueLine("issueDate_month_id");
            this.setWidth('issueDate_month_id', '40px');
        }
        this.register.ssu.cardInfo.issueDate.year = $event.year;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.issueDate.year)) {
            this.setBlueLine("issueDate_year_id");
            this.setWidth('issueDate_year_id', '40px');
        }
        this.register.ssu.cardInfo.issueDate.sum = $event.day + '/' + Utils.getMonthShottoNumber($event.month) + '/' + $event.year;
    }

    public onChangeExpireDate($event) {
        this.register.ssu.cardInfo.expireDate.day = $event.day;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.expireDate.day)) {
            this.setBlueLine("expireDate_day_id");
            this.setWidth('expireDate_day_id', '40px');
        }
        this.register.ssu.cardInfo.expireDate.mounth = $event.month;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.issueDate.mounth)) {
            this.setBlueLine("expireDate_month_id");
            this.setWidth('expireDate_month_id', '40px');
        }
        this.register.ssu.cardInfo.expireDate.year = $event.year;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.expireDate.mounth)) {
            this.setBlueLine("expireDate_year_id");
            this.setWidth('expireDate_year_id', '40px');
        }
        this.register.ssu.cardInfo.expireDate.sum = $event.day + '/' + Utils.getMonthShottoNumber($event.month) + '/' + $event.year;
    }

    public initATMList() {
        const that = this;
        const options = {
            horizontal: true,
            itemNav: 'centered',
            smart: true,
            activateOn: 'click',
            activateMiddle: true,
            scrollBy: 0,
            speed: 1200,
            easing: 'easeOutExpo',
            mouseDragging: true,
            touchDragging: true,
            releaseSwing: true,
            elasticBounds: false,
            dragHandle: true,
            dynamicHandle: true,
            clickBar: false
        };
        this.register.subscriptionService.service.card_type = that.atmList[0].CARD_DESC;

        const $frame = $('#frame');
        $frame.sly(options);
        $frame.sly("activate", this.activeIndex, false);
        $frame.sly('on', 'active', function (e, index) {
            that.activeIndex = index;
            that.imageName = that.atmList[index].IMG_NAME;
            that.register.subscriptionService.service.bin_code = that.atmList[index].BIN_CODE;
            that.register.subscriptionService.service.card_type = that.atmList[index].CARD_DESC;
        });
    }

    public checkboxPrincipal() {
        this.checkboxPrincipal ? this.checkAccept = true : this.checkAccept = false
    }

    public async getTitleList(ref_name: string, ref_id, onShow: boolean) {
        if (onShow === true) {
            this.onShow();
        }
        return new Promise((resolve, reject) => this.registerService.GetTitleList()
            .subscribe(
                Data => {
                    this.dataList = Data.data;
                    this.getTitle(ref_id);

                    const tmp = this.TitleList.filter(t => t.SHRT_TITLE_TH === this.register.ssu.cardInfo.titleTH);
                    if (tmp.length > 0) {
                        this.checkTitleActive = true;
                    }
                    resolve()
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                    reject()
                }
            )
        )
    }

    public onRequestSmartCardReader() {

        // manaul key input
        if (!Environment.useSmartCardReaderOpenAccount) {
            this.register.chipNo = '';
            this.getkeyboard();
            this.showInput = false;
            this.scanCode = '9005';
            return;
        }

        // this.scanCode = '1110';
        Utils.logDebug('onRequestSmartCardReader', 'start');
        if (this.isRequestingSmartCardReader) {
            return
        }
        this.isRequestingSmartCardReader = true;
        this.hardwareService.requestSmartCardReader()
            .subscribe(
                respondtSmartCardReader => {
                    this.isRequestingSmartCardReader = false
                    this.scanCode = !isNullOrUndefined(respondtSmartCardReader.code) ? respondtSmartCardReader.code : '1103';
                    if (this.register.ssu.cardInfo.idType === AppConstant.IdType) {
                        this.scanCode = '0000'
                    }
                    switch (this.scanCode) {
                        case '0000':
                            this.hardwareService.disconnect();
                            const message = respondtSmartCardReader.results;
                            if (!isNullOrUndefined(message)) {
                                this.userInfo.parseJSON(message);
                                if (this.userService.isLoggedin() === true && this.userService.getidNumber() !== this.userInfo.idCardNumber) {
                                    this.Modal_image = "./assets/kiatnakin/image/card13.png";
                                    this.Modal_text = "บัตรประชาชนของท่านไม่ตรงกับที่ทำการ Login ไว้";
                                    this.ModalShow = true;
                                    this.onClickShowModal();
                                    this.register.chipNo = '';
                                } else {
                                    this.register.updateUserInfo(this.userInfo);
                                    this.register.updateSubscriptionInfo(this.userInfo);
                                    Utils.logDebug('onRequestSmartCardReader', 'checkExistingCustomerAndSanctionList');
                                    this.checkExistingCustomerAndSanctionList();
                                }
                            }
                            setTimeout(() => {
                                // this.register.chipNo = '';
                                this.getkeyboard();
                                this.showInput = true;
                            }, 1000);
                            break;
                        case '1110':
                            this.showInput = false;
                            break;
                    }
                },
                Error => {
                    this.isRequestingSmartCardReader = false;
                    Modal.showAlert(Error.responseStatus.responseMessage);
                }
            );
    }

    public Get_TermAndCondition() {
        this.http.get(this.register.TermAndCon.Account_Term)
            .subscribe(data => {
                this.AccountTerm = data.text();
                // this.AccountTerm = Utils.replaceEnter(this.AccountTerm);
            });
        this.http.get(this.register.TermAndCon.Electronics_Term)
            .subscribe(data => {
                this.ElectronicsTerm = data.text();
                // this.ElectronicsTerm = Utils.replaceEnter(this.ElectronicsTerm);
            });
        // }
    }

    public getkeyboard() {

        setTimeout(function () {
            KeyboardService.initKeyboardInputText();
        }, 500);

    }

    public hidekeyboard() {
        KeyboardService.setKeyboardHide();
    }

    public ngAfterContentInit() {
        this.setRadioListener();
    }

    public setRadioListener() {
        const $radios = $('input:radio');
        $radios.unbind();
        $radios.change(function () {
            const name = $(this).attr('name');
            const radio = $('input[name=' + name + ']:radio');
            radio.parent().removeClass('checked');
            $(this).parent().addClass('checked');
        });
        $radios.filter(':checked').parent().addClass('checked');
    }

    public updateCurrentPage(index: number) {
        this.currentPageIndex = index;
    }

    public changeFlipbook() {
        $(`${"#seletor_content_modal"},${"#dismiss_bg_otp"}`).hide();

        if (this.checkNoCustomerSSU()) {
            console.log('changeFlipbook bass --- 1');

            this.flipBook.turn('disable', false);
            if (this.termAndConCound === 0) {
                console.log('changeFlipbook bass --- 2');

                this.checkPROD_CODE();
                this.flipBook.turn("next");
                this.termAndConCound++
            }
        } else if (this.checkCustomerSSUWithoutSubser()) {
            console.log('changeFlipbook bass --- 3');

            this.flipBook.turn('disable', false);
            this.checkPROD_CODE();
            for (let i = 0; i < 8; i++) {
                this.flipBook.turn("removePage", 4);
            }
            this.flipBook.turn("next");
        } else if (this.checkCustomerSSUWithSubser()) {
            console.log('changeFlipbook bass --- 4');

            this.flipBook.turn('disable', false);
            this.checkPROD_CODE();
            for (let i = 0; i < 10; i++) {
                this.flipBook.turn("removePage", 4);
            }
            this.flipBook.turn("next");
        }
    }
    public checkNoCustomerSSU() {
        if (this.checkAccept === true && this.submit === true && this.customerSSU === 'N') {
            return true;
        } else {
            return false;
        }
    }

    public checkCustomerSSUWithoutSubser() {
        if (this.checkAccept === true && this.customerExist === true && this.submit === true && this.customerSSU === 'Y' && this.type !== 'SubSer') {
            return true;
        } else {
            return false;
        }
    }

    public checkCustomerSSUWithSubser() {
        if (this.checkAccept === true && this.customerExist === true && this.submit === true && this.customerSSU === 'Y' && this.type === 'SubSer') {
            return true;
        } else {
            return false;
        }
    }

    public checkPROD_CODE() {
        Utils.logDebug('checkPROD_CODE', 'start');
        Utils.logDebug('checkPROD_CODE', 'this.register.subscription.account.PROD_TYPE : ' + this.register.subscription.account.PROD_TYPE);
        if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeSaving
            || this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeCurrent) {
            Utils.logDebug('checkPROD_CODE', 'getMasterATM');
            if (isNullOrUndefined(this.atmList) || this.atmList.length <= 0) {
                this.getMasterATM();
            } else {
                this.initATMList();
            }
            this.isCASA = true;
        } else {
            this.isCASA = false;
        }
    }

    public onFlipInit(flipObject) {
        console.log('onFlipInit --- bass runs')

        this.flipBook = flipObject;

        if (!this.canFlip) {
            this.flipBook.turn('disable', true);
            return console.log("you can never flip")
        }
        this.flipBook.turn('disable', false);
        return console.log("you can flip")

        // if (this.checkAccept === false) { // this is the fucking problem
        //     this.flipBook.turn('disable', true);
        // }
    }

    public onStart($page) {
        console.log("onStart ->", "start")
        console.log("onStart --- $page ->", $page)
        console.log("onStart --- $page.index ->", $page.index)
        console.log("onStart --- $page.event ->", $page.event)
        console.log("onStart --- $page.event.target ->", $page.event.target)

        const before = this.currentPageSection;
        const disableClass = $page.page.getAttribute("disabled");

        if (!isNullOrUndefined(disableClass)) {
            console.log("onStart ->", 1)
            $page.event.preventDefault();
            return
        }

        this.currentPageSection = $page.page.getAttribute("data-id");

        if (this.currentPageSection === 'ssu1-2') {
            console.log("onStart ->", 2)
            this.changeEmailDefault(this.register.ssu.current.contact.email);
            this.changePhoneDefault('mobliePhone', this.register.ssu.current.contact.moblie_phone);
            this.changePhoneDefault('homePhone', this.register.ssu.current.contact.home_phone);
            this.register.subscription.account.ACCOUNT_NAME = this.register.ssu.cardInfo.titleTH + ' ' + this.register.ssu.cardInfo.nameTH + ' ' + this.register.ssu.cardInfo.surnameTH;
        }
        if (this.currentPageSection === 'subscription-2') {
            console.log("onStart ->", 3)
        }

        if (this.currentPageSection === 'termCondition') {
            console.log("onStart ->", 4)
            this.register.subscription.account.ACCOUNT_NAME = this.register.ssu.cardInfo.titleTH + ' ' + this.register.ssu.cardInfo.nameTH + ' ' + this.register.ssu.cardInfo.surnameTH;
        }

        if (!this.validatePageData($page.event)) {
            console.log("onStart ->", 5)
            this.currentPageSection = before;
        }
    }

    public onTurning($page) {
        console.log("onTurning ->", "start")
        console.log("onTurning --- $page ->", $page)
        console.log("onTurning --- $page.index ->", $page.index)
        console.log("onTurning --- $page.event ->", $page.event)
        console.log("onTurning --- $page.event.target ->", $page.event.target)

        if ($page.index === 2 || $page.index === 3) {
            $("#TermAndCondition").show();
            console.log('TermAndCondition -> show')
        }

        this.updateCurrentPage($page.index);
        if (this.currentPageIndex < 1) {
            this.setShowCloseButton(false);
        }

        const before = this.currentPageSection;
        const disableClass = $page.page.getAttribute("disabled");

        if (!isNullOrUndefined(disableClass)) {
            console.log("onTurning ->", 1)

            $page.event.preventDefault();
            return
        }
        this.currentPageSection = $page.page.getAttribute("data-id");
        if (!this.validatePageData($page.event)) {
            console.log("onTurning ->", 2)

            this.currentPageSection = before;
            $page.event.preventDefault();
            return;
        }

        if (this.customerExist) {
            console.log("onTurning ->", 3)
            console.log("this.currentPageSection ->", this.currentPageSection)
            console.log("$page.event.currentTarget.id ->", $page.event.currentTarget.id)

            if ((this.currentPageSection === 'subscription' || this.currentPageSection === 'services')
                && $page.event.currentTarget.id === 'saving-book') {
                console.log("onTurning ->", 4)

                this.currentPageSection = before;
                $page.event.preventDefault();
            }
        }

    }

    public onTurned($page) {
        console.log("onTurned ->", "start")
        console.log("$page.index ->", $page.index)

        if ($page.index === 1 || $page.index === 4) {
            $("#TermAndCondition").hide();
            console.log('TermAndCondition -> hide')
        }

        this.currentPageSection = $page.page.getAttribute("data-id");

        if (this.register.ssu.office.Type === '' && this.currentPageSection === 'ssu2') {
            $("#ssuForm_office_Address").find(":input").attr('disabled', true);
        }

        if (this.register.subscription.current.Type === '' && this.currentPageSection === 'subscription') {
            $("#Subscription_Address").find(":input").attr('disabled', true);
        }

        this.setShowCloseButton(($page.index > 1) ? true : false);
        this.setRadioListener();

        if ($page.index === 1 && !this.isClosed) {
            if (this.flipBook) {
                const that = this;
                setTimeout(function () {
                    Modal.showConfirmWithSigleButtonText('ท่านต้องการยกเลิกรายการหรือไม่', "ตกลง", function () {
                        that.location.back();
                    }, null);
                }, 500);
            }
        }
        this.getkeyboard();
    }

    public onEnd($page) {
        this.setShowCloseButton($page.index !== 1)

    }

    public enableInput(id) {
        $('#' + id + ' :input').attr('disabled', false);
    }

    public setRedLine(id) {
        $('#' + id).css("cssText", this.red_line);
    }

    public setBlueLine(id) {
        $('#' + id).css("cssText", this.blue_line);
    }

    public setWidth(id, width) {
        $('#' + id).width(width);
    }

    public setBlueLineTextisNull(id, $event) {

        if (isNullOrUndefined($event) || $event === '') {
            $('#' + id).css("cssText", this.red_line);
        } else {
            $('#' + id).css("cssText", this.blue_line);
        }
    }

    public setBlueLineTextisNullAndCheckLenght(id, $event, length) {

        if ((!isNullOrUndefined($event) || $event !== '') && $event.length === length) {
            $('#' + id).css("cssText", this.blue_line);
        } else {
            $('#' + id).css("cssText", this.red_line);
        }
    }

    public setBlueLineContactisNull(id, $event) {

        switch (id) {
            case "subscription_contact_phone1":
                if ($event.substr(0, 1) === '0') {
                    this.ValidateContactPhone1 = true;
                    $('#' + id).css("cssText", this.blue_line);
                } else {
                    this.ValidateContactPhone1 = false;
                    $('#' + id).css("cssText", this.red_line);
                }
                break;
            case "subscription_contact_phone2":
                if ($event.substr(0, 1) === '0') {
                    this.ValidateContactPhone2 = true;
                    $('#' + id).css("cssText", this.blue_line);
                } else {
                    this.ValidateContactPhone2 = false;
                    $('#' + id).css("cssText", this.red_line);
                }
                break;
        }
    }

    public validatePageData(event) {
        Utils.logDebug('validatePageData', 'Start');
        if (this.currentPageSection.indexOf("ssu1-2") !== -1) {
            Utils.logDebug('validatePageData', 'current page ssu1-2');
            Utils.logDebug('validatePageData', 'this.register.ssu.spouse : ' + JSON.stringify(this.register.ssu.spouse));
            if (!this.checkContactEmail()
                || !this.checkContactMobilePhone()
                || !this.checkContactTel()
                || !this.checkCurrentType()
                || !this.checkCurrentAddressNo()
                || !this.checkCurrentAddressCountry()
                || !this.checkCurrentAddressProvince()
                || !this.checkCurrentAddressDistrict()
                || !this.checkCurrentAddressLocality()
                || !this.checkCurrentAddressPostcode()
                || !this.checkSpouseStatus()
                || !this.checkSpouseMaritalStatus()
                || !this.checkRelationShip()) {
                console.log('validatePageData --- bass 1 ->', false)

                return false;
            }
            console.log('validatePageData --- bass 2 ->', true)

            return true;
        }
        if (this.currentPageSection.indexOf("ssu2-2") !== -1) {
            Utils.logDebug('validatePageData', 'current page ssu2-2');
            if (!this.checkIncome()
                || !this.checkEducation()
                || !this.checkCareer()
                || !this.checkPosition()
                || !this.checkOfficePhone()
                || !this.checkOfficeAddress()
                || !this.checkBusiness()
                || !this.checkProperty()
                || !this.checkBusinessType()) {
                console.log('validatePageData --- bass 3 ->', false)

                return false;
            }
            console.log('validatePageData --- bass 4 ->', true)

            return true;
        }
        if (this.currentPageSection.indexOf("ssu3-2") !== -1) {
            Utils.logDebug('validatePageData', 'current page ssu3-2');
            if (!this.checkPrimary()
                || !this.checkCountryIncome()
                || !this.checkPrimaryDesc()
                || !this.checkCountryIncomeDesc()
                || !this.checkInterestDesc()) {
                console.log('validatePageData --- bass 5 ->', false)
                return false;
            }
            console.log('validatePageData --- bass 6 ->', true)
            return true;

        }
        if (this.currentPageSection.indexOf("fatca-2") !== -1) {
            Utils.logDebug('validatePageData', 'current page fatca-2');
            console.log('validatePageData --- bass 7 ->', 'checkFatca')
            return this.checkFatca();
        }
        if (this.currentPageSection.indexOf("subscription-2") !== -1 && this.isClosed !== true) {
            Utils.logDebug('validatePageData', 'current page subscription-2');

            if (!this.checkSubscriptionAccountOBJ()
                || !this.checkSubscriptionCurrentType()
                || !this.checkSubscriptionAddressNo()
                || !this.checkSubscriptionAddressCountry()
                || !this.checkSubscriptionAddressProvince()
                || !this.checkSubscriptionAddressDistrict()
                || !this.checkSubscriptionAddressLocality()
                || !this.checkSubscriptionAddressPostCode()
                || !this.checkSubscriptionAccountName()
                || !this.checkSubscriptionAccountPmtCond()
                || !this.checkSubscriptionAccountFlgPsBook()) {
                //|| !this.register.subscription.address.district()) {
                console.log('validatePageData --- bass 8 ->', false)

                return false;
            }
            console.log('validatePageData --- bass 9 ->', true)

            return true;
        }
        console.log('validatePageData --- bass 10 ->', true)

        return true
    }

    public checkContactEmail() {
        if ((isNullOrUndefined(this.register.ssu.current.contact.email) || this.register.ssu.current.contact.email === "") && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ อีเมล');
            this.setRedLine('ssu_address_email_id');
            event.preventDefault();
            return false;
        }

        if ((!isNullOrUndefined(this.register.ssu.current.contact.email) || this.register.ssu.current.contact.email !== "") && event.type !== "start") {
            if (this.validateEmailValue === false && this.checkExisting === false) {
                Modal.showAlert('กรุณาระบุ อีเมลให้ถูกต้อง');
                this.setRedLine('ssu_address_email_id');
                event.preventDefault();
                return false;
            }
        }

        return true;
    }

    public checkContactMobilePhone() {
        if ((isNullOrUndefined(this.register.ssu.current.contact.moblie_phone) || this.register.ssu.current.contact.moblie_phone === "") && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ โทรศัพท์มือถือ');
            this.setRedLine('ssu_address_moblie_phone_id');
            event.preventDefault();
            return false;
        }

        if ((this.register.ssu.current.contact.moblie_phone.length !== 10) && event.type !== "start") {
            if (this.ValidateMobliePhone === false) {
                Modal.showAlert('กรุณาระบุ โทรศัพท์มือถือให้ถูกต้อง');
                this.setRedLine('ssu_address_moblie_phone_id');
                event.preventDefault();
                return false;
            }
        }

        return true;
    }

    public checkContactTel() {
        if (this.checkContactTelHomePhoneEmpty()) {
            if ((this.register.ssu.current.contact.home_phone.length !== 9 || this.ValidateHomePhone === false) && event.type !== "start") {
                Modal.showAlert('กรุณาระบุ โทรศัพท์บ้านให้ถูกต้อง');
                this.setRedLine('ssu_address_home_phone_id');
                event.preventDefault();
                return false;
            }
        }

        if (this.checkContactTelFaxPhoneEmpty()) {
            if ((this.register.ssu.current.contact.fax_phone.length !== 9 || this.ValidateFaxPhone === false) && event.type !== "start") {
                Modal.showAlert('กรุณาระบุ โทรสารให้ถูกต้อง');
                this.setRedLine('ssu_address_fax_phone_id');
                event.preventDefault();
                return false;
            }
        }
        return true;
    }

    public checkContactTelHomePhoneEmpty() {
        return !isNullOrUndefined(this.register.ssu.current.contact.home_phone) && this.register.ssu.current.contact.home_phone !== '';
    }

    public checkContactTelFaxPhoneEmpty() {
        return !isNullOrUndefined(this.register.ssu.current.contact.fax_phone) && this.register.ssu.current.contact.fax_phone !== '';
    }

    public checkCurrentType() {
        if ((isNullOrUndefined(this.register.ssu.current.Type) || this.register.ssu.current.Type === '' && this.updateInfo === false) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ประเภทที่อยู่ที่ติดต่อได้');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkCurrentAddressNo() {
        if ((isNullOrUndefined(this.register.ssu.current.address.no) || this.register.ssu.current.address.no === '') && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ เลขที่');
            this.setRedLine('ssu_current_address_no_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkCurrentAddressCountry() {
        if ((isNullOrUndefined(this.register.ssu.current.address.country) || this.register.ssu.current.address.country === '') && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ประเทศ');
            this.setRedLine('ssu_current_address_country');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkCurrentAddressProvince() {
        if ((isNullOrUndefined(this.register.ssu.current.address.province) || this.register.ssu.current.address.province === '') && this.register.ssu.current.address.country === this.register.ThaiTxT && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ จังหวัด');
            this.setRedLine('ssu_current_address_province_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkCurrentAddressDistrict() {
        if ((isNullOrUndefined(this.register.ssu.current.address.district) || this.register.ssu.current.address.district === '') && !isNullOrUndefined(this.register.ssu.current.address.province) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ เขต/อำเภอ');
            this.setRedLine('ssu_current_address_district_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkCurrentAddressLocality() {
        if ((isNullOrUndefined(this.register.ssu.current.address.locality) || this.register.ssu.current.address.locality === '') && !isNullOrUndefined(this.register.ssu.current.address.district) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ แขวง/ตำบล');
            this.setRedLine('ssu_current_address_locality_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkCurrentAddressPostcode() {
        if (isNullOrUndefined(this.register.ssu.current.address.postcode) && !isNullOrUndefined(this.register.ssu.current.address.locality) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ รหัสไปรษณีย์');
            this.setRedLine('ssu_current_address_postcode_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSpouseStatus() {
        if (isNullOrUndefined(this.register.ssu.spouse.status) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ สถานะภาพการสมรสทางกฏหมาย');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSpouseMaritalStatus() {
        if (this.register.ssu.spouse.status === AppConstant.MaritalStatusMarried) {
            if (!this.checkSpouseNameTH()) {
                return false;
            }
            if (!this.checkSpouseNameEN()) {
                return false;
            }
        }
        return true;
    }

    public checkSpouseNameTH() {
        if (isNullOrUndefined(this.register.ssu.spouse.title.TH) || this.register.ssu.spouse.title.TH === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ คำนำหน้าชื่อคู่สมรส ภาษาไทย');
            this.setRedLine('ContactTitleTH_id');
            event.preventDefault();
            return false;
        }

        if (isNullOrUndefined(this.register.ssu.spouse.name.TH) || this.register.ssu.spouse.name.TH === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ชื่อคู่สมรส ภาษาไทย');
            this.setRedLine('ssu_spouse_nameTH');
            event.preventDefault();
            return false;
        }

        if (isNullOrUndefined(this.register.ssu.spouse.surname.TH) || this.register.ssu.spouse.surname.TH === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ นามสกุลคู่สมรส ภาษาไทย');
            this.setRedLine('ssu_spouse_surnameTH');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSpouseNameEN() {
        if (isNullOrUndefined(this.register.ssu.spouse.title.EN) || this.register.ssu.spouse.title.EN === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ นามสกุลคู่สมรส ภาษาอังกฤษ');
            this.setRedLine('ContactTitleEN_id');
            event.preventDefault();
            return false;
        }

        if (isNullOrUndefined(this.register.ssu.spouse.name.EN) || this.register.ssu.spouse.name.EN === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ชื่อคู่สมรส ภาษาอังกฤษ');
            this.setRedLine('ssu_spouse_nameEN');
            event.preventDefault();
            return false;
        }

        if (isNullOrUndefined(this.register.ssu.spouse.surname.EN) || this.register.ssu.spouse.surname.EN === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ นามสกุลคู่สมรส ภาษาอังกฤษ');
            this.setRedLine('ssu_spouse_surnameEN');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkRelationShip() {
        if (!isNullOrUndefined(this.register.ssu.relationship.Data1) && this.register.ssu.relationship.Data1 !== '') {

            if (!this.checkRelationTitle()
                || !this.checkRelationName()
                || !this.checkRelationSurname()
                || !this.checkRelationGender()
                || !this.checkRelationContactMobile()) {
                return false;
            }
        }
        return true;
    }

    public checkRelationTitle() {
        if (isNullOrUndefined(this.register.ssu.relationship.title1.TH) || this.register.ssu.relationship.title1.TH === '') {
            if (event.type !== "start") {
                Modal.showAlert('กรุณาระบุ คำนำหน้าชื่อผู้ติดต่อ');
            }
            this.setRedLine('ssu_relationship_title1');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkRelationName() {
        if (isNullOrUndefined(this.register.ssu.relationship.name1.TH) || this.register.ssu.relationship.name1.TH === '') {
            if (event.type !== "start") {
                Modal.showAlert('กรุณาระบุ ชื่อผู้ติดต่อ');
            }
            this.setRedLine('ssu_relationship_name1');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkRelationSurname() {
        if (isNullOrUndefined(this.register.ssu.relationship.surname1.TH) || this.register.ssu.relationship.surname1.TH === '') {
            if (event.type !== "start") {
                Modal.showAlert('กรุณาระบุ นามสกุลชื่อผู้ติดต่อ');
            }
            this.setRedLine('ssu_relationship_surname1');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkRelationGender() {
        if (isNullOrUndefined(this.register.ssu.relationship.gender1.value) || this.register.ssu.relationship.gender1.data === '') {
            if (event.type !== "start") {
                Modal.showAlert('กรุณาระบุ เพศผู้ติดต่อ');
            }
            this.setRedLine('relationship_gender1');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkRelationContactMobile() {
        if (isNullOrUndefined(this.register.ssu.relationship.contact1.moblie_phone) || this.register.ssu.relationship.contact1.moblie_phone === '' || this.ValidateContactPhone1 === false) {
            if (event.type !== "start") {
                Modal.showAlert('กรุณาระบุ เบอร์โทรศัพท์ผู้ติดต่อ');
            }
            this.setRedLine('subscription_contact_phone1');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkIncome() {
        if (isNullOrUndefined(this.register.ssu.income.Select) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ รายได้ต่อปี');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkEducation() {
        if (isNullOrUndefined(this.register.ssu.education) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ระดับการศึกษาสูงสุด');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkCareer() {
        if (isNullOrUndefined(this.register.ssu.career.Data) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ อาชีพ');
            this.setRedLine('subscription_ssu_career');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkPosition() {
        if (isNullOrUndefined(this.register.ssu.position.Data) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ตำแหน่ง');
            this.setRedLine('subscription_ssu_position');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkOfficeAddress() {

        if (!this.checkOfficeType()
            || !this.checkOfficeAddressNo()
            || !this.checkOfficeAddressCountry()
            || !this.checkOfficeAddressProvince()
            || !this.checkOfficeAddressDistrict()
            || !this.checkOfficeAddressLocality()
            || !this.checkOfficeAddressPostCode()) {
            return false;
        }
        return true;
    }

    public checkOfficeType() {
        if ((this.register.ssu.office.Type === '' && this.updateInfo === false) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ประเภทที่อยู่ที่ทำงาน');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkOfficeAddressNo() {
        if ((isNullOrUndefined(this.register.ssu.office.address.no) || this.register.ssu.office.address.no === '') && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ เลขที่');
            this.setRedLine('ssu_address_office_no_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkOfficeAddressCountry() {
        if ((isNullOrUndefined(this.register.ssu.office.address.country) || this.register.ssu.office.address.country === '') && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ประเทศ');
            this.setRedLine('ssu_address_office_country');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkOfficeAddressProvince() {
        if ((isNullOrUndefined(this.register.ssu.office.address.province) || this.register.ssu.office.address.province === '') && this.register.ssu.office.address.country === this.register.ThaiTxT && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ จังหวัด');
            this.setRedLine('ssu_address_office_province_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkOfficeAddressDistrict() {
        if ((isNullOrUndefined(this.register.ssu.office.address.district) || this.register.ssu.office.address.district === '') && !isNullOrUndefined(this.register.ssu.office.address.province) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ เขต/อำเภอ');
            this.setRedLine('ssu_address_office_district_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkOfficeAddressLocality() {
        if ((isNullOrUndefined(this.register.ssu.office.address.locality) || this.register.ssu.office.address.locality === '') && !isNullOrUndefined(this.register.ssu.office.address.district) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ แขวง/ตำบล');
            this.setRedLine('ssu_address_office_locality_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkOfficeAddressPostCode() {
        if (isNullOrUndefined(this.register.ssu.office.address.postcode) && !isNullOrUndefined(this.register.ssu.office.address.locality) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ รหัสไปรษณีย์');
            this.setRedLine('ssu_address_office_postcode_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkBusiness() {
        if (isNullOrUndefined(this.register.ssu.business.Type) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ประเภทธุรกิจ');
            this.setRedLine('subscription_ssu_businessType');
            event.preventDefault();
            return false;
        }

        if (this.register.ssu.business.Id === '06') {
            if (this.register.ssu.business.DESC === '' || isNullOrUndefined(this.register.ssu.business.DESC) && event.type !== "start") {
                Modal.showAlert('กรุณาระบุ ประเภทธุรกิจให้ครบถ้วน');
                event.preventDefault();
                return false;
            }
        }

        return true;
    }

    public checkProperty() {
        if (isNullOrUndefined(this.register.ssu.property.Value) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ มูลค่าทรัพย์สินส่วนตัว');
            this.setRedLine('subscription_ssu_property');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkOfficePhone() {
        if ((isNullOrUndefined(this.register.ssu.office.contact.office_phone)
            || this.register.ssu.office.contact.office_phone === ''
            || this.register.ssu.office.contact.office_phone.length !== 9
            || this.ValidateOfficePhone === false)
            && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ เบอร์ที่ทำงาน');
            this.setRedLine('ssu_address_office_office_phone_id');
            event.preventDefault();
            return false;
        }
        return true;
    }
    public checkBusinessType() {
        if (isNullOrUndefined(this.register.ssu.business.Type) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ประเภทธุรกิจ');
            this.setRedLine('subscription_ssu_property');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkPrimary() {
        if (isNullOrUndefined(this.register.ssu.primary.Select) || this.register.ssu.primary.Select === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ แหล่งที่มาของรายได้หลักมาจาก');
            event.preventDefault();
            return false
        } else if (this.register.ssu.primary.Select === '04' && event.type !== "start") {
            if (isNullOrUndefined(this.register.ssu.primary.Desc) || this.register.ssu.primary.Desc === '') {
                Modal.showAlert('กรุณาระบุ รายละเอียดแหล่งที่มาของรายได้หลักมาจาก');
                this.setRedLine('primaryIncomeDesc_id');
                event.preventDefault();
                return false;
            }
        }
        return true;
    }

    public checkCountryIncome() {
        if (isNullOrUndefined(this.register.ssu.Contryincome.Select) || this.register.ssu.Contryincome.Select === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ประเทศที่มาของรายได้หลักมาจาก');
            event.preventDefault();
            return false;
        } else if (isNullOrUndefined(this.register.ssu.ban.Select) || isNullOrUndefined(this.register.ssu.launder.Select) ||
            isNullOrUndefined(this.register.ssu.politic.Select) || isNullOrUndefined(this.register.ssu.interest.Select) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ข้อมูลให้ครบถ้วน');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkPrimaryDesc() {
        if (this.register.ssu.primary.Select === '04' && event.type !== "start") {
            if (isNullOrUndefined(this.register.ssu.primary.Desc) || this.register.ssu.primary.Desc === '') {
                Modal.showAlert('กรุณาระบุ แหล่งที่มาของรายได้หลักมาจาก ให้ครบถ้วน');
                event.preventDefault();
                return false;
            }
        }
        return true;
    }

    public checkCountryIncomeDesc() {
        if (this.register.ssu.Contryincome.Select === '1' && event.type !== "start") {
            if (isNullOrUndefined(this.register.ssu.Contryincome.Desc) || this.register.ssu.Contryincome.Desc === '') {
                Modal.showAlert('กรุณาระบุ ประเทศที่มาของรายได้หลัก ให้ครบถ้วน');
                event.preventDefault();
                return false;
            }
        }
        return true;
    }

    public checkInterestDesc() {
        if (this.register.ssu.interest.Select === '1' && event.type !== "start") {
            if (isNullOrUndefined(this.register.ssu.interest.Desc) || this.register.ssu.interest.Desc === '') {
                Modal.showAlert('กรุณาระบุ บุคคลที่ได้รับผลประโยชน์ ให้ครบถ้วน');
                event.preventDefault();
                return false;
            }
        }
        return true;
    }

    public checkFatca() {
        if (this.checkSubFatca1() || this.checkSubFatca2()) {
            Modal.showAlert('กรุณาระบุ ข้อมูลให้ครบถ้วน');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubFatca1() {
        return isNullOrUndefined(this.register.fatca.usCitizen) || isNullOrUndefined(this.register.fatca.usCard)
            || isNullOrUndefined(this.register.fatca.usLocation) || isNullOrUndefined(this.register.fatca.usTerritory);
    }

    public checkSubFatca2() {
        return isNullOrUndefined(this.register.fatca.usTransfer) || isNullOrUndefined(this.register.fatca.usSignatory)
            || isNullOrUndefined(this.register.fatca.usContact) || isNullOrUndefined(this.register.fatca.usAddress)
            || isNullOrUndefined(this.register.fatca.usTelephone) && event.type !== "start";
    }

    public checkSubscriptionCurrentType() {
        if (isNullOrUndefined(this.register.subscription.current.Type) || this.register.subscription.current.Type === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุประเภทของที่อยู่');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAddressNo() {
        if ((isNullOrUndefined(this.register.subscription.address.no) || this.register.subscription.address.no === '') && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ เลขที่');
            this.setRedLine('subscription_address_no_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAddressCountry() {
        if ((isNullOrUndefined(this.register.subscription.address.country) || this.register.subscription.address.country === '') && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ประเทศ');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAddressProvince() {
        if ((isNullOrUndefined(this.register.subscription.address.province) || this.register.subscription.address.province === '') && this.register.subscription.address.country === this.register.ThaiTxT && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ จังหวัด');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAddressDistrict() {
        if ((isNullOrUndefined(this.register.subscription.address.district) || this.register.subscription.address.district === '') && !isNullOrUndefined(this.register.subscription.address.province) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ เขต/อำเภอ');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAddressLocality() {
        if ((isNullOrUndefined(this.register.subscription.address.locality) || this.register.subscription.address.locality === '') && (!isNullOrUndefined(this.register.subscription.address.district) || this.register.subscription.address.district === '') && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ แขวง/ตำบล');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAddressPostCode() {
        if (isNullOrUndefined(this.register.subscription.address.postcode) && !isNullOrUndefined(this.register.subscription.address.locality) && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ รหัสไปรษณีย์');
            this.setRedLine('subscription_address_postcode_id');
            event.preventDefault();
            return false;
        }

        if ((!isNullOrUndefined(this.register.subscription.address.locality) && this.register.subscription.address.locality !== '') && event.type !== "start") {
            if (this.register.subscription.address.postcode.length !== 5) {
                Modal.showAlert('กรุณาระบุ รหัสไปรษณีย์ให้ถูกต้อง');
                this.setRedLine('subscription_address_postcode_id');
                event.preventDefault();
                return false;
            }
        }
        return true;
    }

    public checkSubscriptionAccountName() {
        if (isNullOrUndefined(this.register.subscription.account.ACCOUNT_NAME) || this.register.subscription.account.ACCOUNT_NAME === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ ชื่อบัญชี');
            this.setRedLine('register_subscription3');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAccountPmtCond() {
        if (isNullOrUndefined(this.register.subscription.account.PMT_COND) || this.register.subscription.account.PMT_COND === '' && event.type !== "start") {
            Modal.showAlert('กรุณาเลือก เงื่อนไขการสั่งจ่าย');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAccountFlgPsBook() {
        if (this.register.subscription.account.PROD_TYPE !== AppConstant.ProdTypeCurrent && isNullOrUndefined(this.register.subscription.account.flg_psbook) && event.type !== "start") {
            Modal.showAlert('กรุณาเลือก ประเภทหลักฐานการรับฝากเงิน');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAccountOBJ() {
        if (isNullOrUndefined(this.register.subscription.account.OBJ.Id) || this.register.subscription.account.OBJ.Id === '' && event.type !== "start") {
            Modal.showAlert('กรุณาระบุ วัตถุประสงค์การเปิดบัญชี');
            this.setRedLine('register_subscription4');
            event.preventDefault();
            return false;
        } else if (this.register.subscription.account.OBJ.Data === 'อื่นๆ' && (this.register.subscription.account.OBJ_OTH === '' || isNullOrUndefined(this.register.subscription.account.OBJ_OTH))) {
            Modal.showAlert('กรุณาระบุ วัตถุประสงค์การเปิดบัญชี');
            this.setRedLine('OBJ_OTH_id');
            event.preventDefault();
            return false;
        }
        return true;
    }

    public checkSubscriptionAccountInterest() {
        if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeFix && this.register.haveFD === "Y") {
            if (isNullOrUndefined(this.register.subscription.account.interestData) || this.register.subscription.account.interestData === '' && event.type !== "start") {
                Modal.showAlert('กรุณาเลือกบัญชีรับดอกเบี้ย');
                this.setRedLine('Account_interest_id');
                event.preventDefault();
                return false;
            }
        }
        return true;
    }

    public checkIsEmail($event) {
        if (!isNullOrUndefined($event) && $event !== '') {
            this.validateEmailValue = Utils.checkIsEmail($event);
        }
        if (this.validateEmailValue === false && $event !== "") {
            $('#ssu_address_email_id').css("cssText", this.red_line);
        } else {
            $('#ssu_address_email_id').css("cssText", this.blue_line);
            this.register.subscription.contact.email = this.register.ssu.current.contact.email;
            this.register.subscriptionService.contact.email = this.register.subscription.contact.email;
        }
    }

    public changeEmailDefault($event) {

        if (!isNullOrUndefined($event) && $event !== '') {
            this.validateEmailValue = Utils.checkIsEmail($event);
        }
        if (this.validateEmailValue === false && $event !== "") {
            $('#ssu_address_email_id').css("cssText", this.red_line);
        } else {
            $('#ssu_address_email_id').css("cssText", this.blue_line);
        }
        if (this.validateEmailValue === true && !isNullOrUndefined(this.register.ssu.current.contact.email) && this.register.ssu.current.contact.email !== '') {
            this.checkSubscriptionContactEmail();
        }
    }

    public checkSubscriptionContactEmail() {
        if (isNullOrUndefined(this.register.subscription.contact.email) || this.register.subscription.contact.email === '') {
            this.register.subscription.contact.email = this.register.ssu.current.contact.email;
        }
        if (isNullOrUndefined(this.register.subscriptionService.contact.email) || this.register.subscriptionService.contact.email === '') {
            this.register.subscriptionService.contact.email = this.register.ssu.current.contact.email;
        }
    }

    public checkPhoneDefault(value, Data) {
        switch (value) {
            case "mobliePhone":
                this.checkMobilePhone(Data);
                break;
            case "homePhone":
                this.checkHomePhone(Data);
                break;
            case "faxPhone":
                this.checkFaxPhone(Data);
                break;
            case "officePhone":
                this.checkOfficePhoneNo(Data);
                break;
        }
    }

    public checkMobilePhone(Data) {
        if (!(Data.substr(0, 1) === '0')) {
            this.ValidateMobliePhone = false;
        } else {
            this.ValidateMobliePhone = true;
        }
        if (Data === '' || Data.length === 10 && this.ValidateMobliePhone === true) {
            $('#ssu_address_moblie_phone_id').css("cssText", this.blue_line);
            this.register.subscription.contact.moblie_phone = this.register.ssu.current.contact.moblie_phone;
            this.register.subscriptionService.contact.moblie_phone = this.register.subscription.contact.moblie_phone;
        } else {
            $('#ssu_address_moblie_phone_id').css("cssText", this.red_line);
        }
    }

    public checkHomePhone(Data) {
        if (Data.substr(0, 1) === '0') {
            this.ValidateHomePhone = true;
        } else {
            this.ValidateHomePhone = false;
        }

        if (Data === '' || Data.length === 9 && this.ValidateHomePhone === true) {
            $('#ssu_address_home_phone_id').css("cssText", this.blue_line);
        } else {
            $('#ssu_address_home_phone_id').css("cssText", this.red_line);
        }
    }

    public checkOfficePhoneNo(Data) {
        if (Data.substr(0, 1) === '0') {
            this.ValidateOfficePhone = true;
        } else {
            this.ValidateOfficePhone = false;
        }

        if (Data === '' || Data.length === 9 && this.ValidateOfficePhone === true) {
            $('#ssu_address_office_office_phone_id').css("cssText", this.blue_line);
        } else {
            $('#ssu_address_office_office_phone_id').css("cssText", this.red_line);
        }
    }

    public checkFaxPhone(Data) {
        if (Data.substr(0, 1) === '0') {
            this.ValidateFaxPhone = true;
        } else {
            this.ValidateFaxPhone = false;
        }
        if (Data === '' || Data.length === 9 && this.ValidateFaxPhone === true) {
            $('#ssu_address_fax_phone_id').css("cssText", this.blue_line);
        } else {
            $('#ssu_address_fax_phone_id').css("cssText", this.red_line);
        }
    }

    public changePhoneDefault(value, Data) {
        Utils.logDebug('changePhoneDefault', 'start');
        Utils.logDebug('changePhoneDefault', 'value : ' + value + ' / Data : ' + Data);
        switch (value) {
            case 'mobliePhone':
                this.changeMobilePhone(Data);
                break;
            case 'homePhone':
                this.changeHomePhone(Data);
                break;
            case 'faxPhone':
                this.changeFaxPhone(Data);
                break;
        }
    }

    public changeMobilePhone(Data) {
        if (Data === '' || Data.length === 10) {
            $('#ssu_address_moblie_phone_id').css("cssText", this.blue_line);
            this.changeMobilePhoneValidateData(Data);
        } else {
            $('#ssu_address_moblie_phone_id').css("cssText", this.red_line);
        }
    }

    public changeMobilePhoneValidateData(Data) {
        if (isNullOrUndefined(this.register.subscription.contact.moblie_phone) || this.register.subscription.contact.moblie_phone === '' && Data.length === 10 && this.ValidateMobliePhone === true) {
            this.register.subscription.contact.moblie_phone = Data;
        }
        if (isNullOrUndefined(this.register.subscriptionService.contact.moblie_phone) || this.register.subscriptionService.contact.moblie_phone === '' && Data.length === 10 && this.ValidateMobliePhone === true) {
            this.register.subscriptionService.contact.moblie_phone = Data;
        }
    }
    public changeHomePhone(Data) {
        if (Data === '' || Data.length === 9) {
            $('#ssu_address_home_phone_id').css("cssText", this.blue_line);
            if (isNullOrUndefined(this.register.ssu.office.contact.office_phone) || this.register.ssu.office.contact.office_phone === '' && Data.length === 9 && this.ValidateHomePhone === true) {
                //this.register.ssu.office.contact.office_phone = Data;
            }
        } else {
            $('#ssu_address_home_phone_id').css("cssText", this.red_line);
        }
    }

    public changeFaxPhone(Data) {
        if (Data === '' || Data.length === 9 && this.ValidateFaxPhone === true) {
            $('#ssu_address_fax_phone_id').css("cssText", this.blue_line);
        } else {
            $('#ssu_address_fax_phone_id').css("cssText", this.red_line);
        }
    }

    public resetPrimary() {
        this.register.ssu.primary.Desc = '';
    }

    public resetInterest() {
        this.register.ssu.interest.Desc = '';
    }

    public changeTermAndCon() {
        if (isNullOrUndefined(this.marital) || this.marital.length <= 0) {
            this.getConfigList('marital_status', 'ssu_status', false);
        }
        this.getkeyboard();
        if (this.checkAccept === true) {
            this.checkAccept = false;
            this.termAndConCound++;
        } else {
            this.checkAccept = true;
            this.onRequestSmartCardReader();
        }
    }

    public onRequestInputSmartCard() {
        Utils.logDebug('onRequestInputSmartCard', 'start');
        this.register.ssu.cardInfo.idType = "N";
        this.showInput = true;

        // hack is here --- bass below ---
        // this.register.ssu.cardInfo.idCardNumber = "1140600270324" // new customer case
        // this.register.ssu.cardInfo.titleTH = "นาย" // new customer case
        // this.register.ssu.cardInfo.nameTH = "ลูกค้า" // new customer case
        // this.register.ssu.cardInfo.surnameTH = "ใหม่" // new customer case
        // this.register.ssu.cardInfo.titleEN = "MR." // new customer case
        // this.register.ssu.cardInfo.nameEN = "New" // new customer case
        // this.register.ssu.cardInfo.surnameEN = "Customer" // new customer case
        // this.register.ssu.cardInfo.gender.value = "ชาย" // new customer case
        // this.register.ssu.cardInfo.birthdate.day = "3"; // new customer case
        // this.register.ssu.cardInfo.birthdate.mounth = "พ.ค."; // new customer case
        // this.register.ssu.cardInfo.birthdate.year = "2464"; // new customer case
        // this.register.birthdate = (
        //     this.register.ssu.cardInfo.birthdate.year + Utils.getMonthShottoNumber(this.register.ssu.cardInfo.birthdate.mounth) + Utils.setPadZero(this.register.ssu.cardInfo.birthdate.day, 2)
        // ); // new customer case
        // this.register.ssu.cardInfo.address.no = "2464"; // new customer case
        // this.register.ssu.cardInfo.address.country = "ไทย"; // new customer case
        // this.register.ssu.cardInfo.address.province = "กรุงเทพมหานคร" // new customer case
        // this.register.ssu.cardInfo.address.district = "คลองสาน" // new customer case
        // this.register.ssu.cardInfo.address.locality = "คลองต้นไทร" // new customer case
        // this.register.ssu.cardInfo.address.postcode = "10600" // new customer case
        // hack is here --- bass above ---

        if (this.userService.isLoggedin() === true) {
            this.customerExist = true;
            this.register.ssu.cardInfo.birthdate.mounth = Utils.getshotMonth(moment(this.userService.getUser().BIRTH_DATE, 'MM/DD/YYYY').format('MM'));
            this.register.ssu.cardInfo.birthdate.day = moment(this.userService.getUser().BIRTH_DATE, 'MM/DD/YYYY').format('DD');
            this.register.ssu.cardInfo.birthdate.year = Utils.AnnoDominiYeartoBuddhistYear(moment(this.userService.getUser().BIRTH_DATE, 'MM/DD/YYYY').format('YYYY'));
            this.register.birthdate = this.register.ssu.cardInfo.birthdate.year + Utils.getMonthShottoNumber(this.register.ssu.cardInfo.birthdate.mounth) + Utils.setPadZero(this.register.ssu.cardInfo.birthdate.day, 2);
            const filterGender = this.genderList.filter(x => x.value === this.userService.getUser().gender)[0];
            this.register.ssu.cardInfo.gender.value = filterGender.value;
            this.register.ssu.cardInfo.gender.data = filterGender.data;
            this.register.ssu.cardInfo.idType = 'E';
            this.register.ssu.cardInfo.idCardNumber = this.userService.getUser().idNumber.toString();
            this.register.ssu.cardInfo.idCardNumbertxt = Utils.idCardformat(this.userService.getUser().idNumber.toString());
            this.register.ssu.cardInfo.titleTH = this.userService.getUser().titleTH;
            this.register.ssu.cardInfo.titleEN = this.userService.getUser().titleEN;
            this.register.ssu.cardInfo.nameTH = this.userService.getUser().nameTH;
            this.register.ssu.cardInfo.nameEN = this.userService.getUser().nameEN;
            this.register.ssu.cardInfo.surnameTH = this.userService.getUser().surenameTH;
            this.register.ssu.cardInfo.surnameEN = this.userService.getUser().surenameEN;

            this.getGetSubscriptionInfo(this.register.ssu.cardInfo.idCardNumber.toString());
        }

        // hack is here --- bass below ---
        // this.register.ssu.cardInfo.idCardNumber = "0606448325667" // old customer not login case
        // this.register.ssu.cardInfo.titleTH = "นางสาว" // old customer not login case
        // this.register.ssu.cardInfo.nameTH = "สม" // old customer not login case
        // this.register.ssu.cardInfo.surnameTH = "ศรี" // old customer not login case
        // this.register.ssu.cardInfo.titleEN = "MS." // old customer not login case
        // this.register.ssu.cardInfo.nameEN = "SOM" // old customer not login case
        // this.register.ssu.cardInfo.surnameEN = "SRI" // old customer not login case
        // this.register.ssu.cardInfo.gender.value = "หญิง" // old customer not login case
        // this.register.ssu.cardInfo.birthdate.day = "1"; // old customer not login case
        // this.register.ssu.cardInfo.birthdate.mounth = "ม.ค."; // old customer not login case
        // this.register.ssu.cardInfo.birthdate.year = "2515"; // old customer not login case
        // this.register.birthdate = (
        //   this.register.ssu.cardInfo.birthdate.year + Utils.getMonthShottoNumber(this.register.ssu.cardInfo.birthdate.mounth) + Utils.setPadZero(this.register.ssu.cardInfo.birthdate.day, 2)
        // ); // old customer not login case
        // this.register.ssu.cardInfo.address.no = "หก"; // old customer not login case
        // this.register.ssu.cardInfo.address.country = "ไทย"; // old customer not login case
        // this.register.ssu.cardInfo.address.province = "กรุงเทพมหานคร" // old customer not login case
        // this.register.ssu.cardInfo.address.district = "พญาไท" // old customer not login case
        // this.register.ssu.cardInfo.address.locality = "พญาไท" // old customer not login case
        // this.register.ssu.cardInfo.address.postcode = "10400" // old customer not login case

        // this.register.ssu.cardInfo.nation = 'ไทย';

        // this.register.ssu.cardInfo.issueDate.day = "3";
        // this.register.ssu.cardInfo.issueDate.mounth = "พ.ค.";
        // this.register.ssu.cardInfo.issueDate.year = "2557";
        // this.register.ssu.cardInfo.expireDate.day = "3";
        // this.register.ssu.cardInfo.expireDate.mounth = "พ.ค.";
        // this.register.ssu.cardInfo.expireDate.year = "2575";

        // this.register.laser_no1 = "123";
        // this.register.laser_no2 = "1234567";
        // this.register.laser_no3 = "12";
        // hack is here --- bass above ---

        this.getkeyboard();
        this.scanCode = '9999';
    }

    public getGetSubscriptionInfo(idCardNumber) {
        Modal.showProgress();
        Utils.logDebug('getGetSubscriptionInfo', 'start');
        Utils.logDebug('getGetSubscriptionInfo', 'idCardNumber : ' + idCardNumber);
        this.accountService.getGetSubscriptionInfo(idCardNumber)
            .subscribe(
                Data => {
                    Modal.hide();
                    const dataAddress = Data.data.address_info_detail.filter(Value => Value.Address_Type_Code === AppConstant.AddressTypeRegister);
                    Utils.logDebug('getGetSubscriptionInfo', 'mapAddressCardInfoAddress');
                    this.mapAddressCardInfoAddress(dataAddress[0]);
                }, Error => {
                    Modal.hide();
                    Modal.showConfirmWithButtonText(Error.responseStatus.responseMessage, "ลองใหม่อีกครั้ง", "ยกเลิกรายการ", () => {
                        setTimeout(() => {
                            this.getGetSubscriptionInfo(this.register.ssu.cardInfo.idCardNumber.toString());
                        }, 200);
                    });

                }
            )
    }

    public AddressSameIDcard(sameAddress) {
        Utils.logDebug('AddressSameIDcard', 'start');
        Utils.logDebug('AddressSameIDcard', 'sameAddress : ' + sameAddress);
        this.checkAddressSameIDCardSub1(sameAddress);
        this.checkAddressSameIDCardSub2(sameAddress);
        this.getkeyboard();
    }

    public checkAddressSameIDCardSub1(sameAddress) {
        switch (sameAddress) {
            case 'AddresssameId13':
                this.register.ssu.current.address = this.register.ssu.cardInfo.address;
                $('#ssuFrom_Address_Current :input').attr('disabled', false);
                this.updateDataOffice();
                Utils.logDebug('checkAddressSameIDCardSub1', 'this.register.ssu : ' + JSON.stringify(this.register.ssu));
                break;
            case 'inputCurrent':
                if (this.register.ssu.current.address === this.register.ssu.cardInfo.address) {
                    this.register.resetSubscriptionCurrent();
                }
                $('#ssuFrom_Address_Current :input').attr('disabled', false);
                this.updateDataOffice();
                Utils.logDebug('checkAddressSameIDCardSub1', 'this.register.ssu : ' + JSON.stringify(this.register.ssu));
                break;
            case 'OfficesameId13':
                this.register.ssu.office.address = this.register.ssu.cardInfo.address;
                this.sameoffice = true;
                Utils.logDebug('checkAddressSameIDCardSub1', 'this.register.ssu : ' + JSON.stringify(this.register.ssu));
                break;
            case 'TransportId13':
                this.register.subscription.address = this.register.ssu.cardInfo.address;
                this.sametrans = true;
                Utils.logDebug('checkAddressSameIDCardSub1', 'this.register.ssu : ' + JSON.stringify(this.register.ssu));
                break;
            case 'OfficesameCurrent':
                this.register.ssu.office.address = this.register.ssu.current.address;
                this.sameoffice = true;
                Utils.logDebug('checkAddressSameIDCardSub1', 'this.register.ssu : ' + JSON.stringify(this.register.ssu));
                break;
        }
    }

    public checkAddressSameIDCardSub2(sameAddress) {
        switch (sameAddress) {
            case 'SameSSU':
                this.register.subscription.address = this.register.ssu.current.address;
                this.sametrans = true;
                Utils.logDebug('checkAddressSameIDCardSub2', 'this.register.subscription : ' + JSON.stringify(this.register.subscription));
                break;
            case 'TransportOffice':
                this.register.subscription.address = this.register.ssu.office.address;
                this.sametrans = true;
                Utils.logDebug('checkAddressSameIDCardSub2', 'this.register.subscription : ' + JSON.stringify(this.register.subscription));
                break;
            case 'Officeinput':
                this.checkOfficeInput();
                this.sameoffice = false;
                Utils.logDebug('checkAddressSameIDCardSub2', 'this.register.subscription : ' + JSON.stringify(this.register.subscription));
                break;
            case 'Transportinput':
                this.checkTransportInput();
                this.sametrans = false;
                Utils.logDebug('checkAddressSameIDCardSub2', 'this.register.subscription : ' + JSON.stringify(this.register.subscription));
                break;
        }
    }

    public checkOfficeInput() {
        if (this.register.ssu.office.address === this.register.ssu.cardInfo.address || this.register.ssu.office.address === this.register.ssu.current.address) {
            this.register.resetSubscriptionOffice();
        }
    }

    public checkTransportInput() {
        if (this.register.subscription.address === this.register.ssu.cardInfo.address || this.register.subscription.address === this.register.ssu.office.address) {
            this.register.resetSubscriptionTrans();
        }
    }

    public updateDataOffice() {
        if (this.register.ssu.office.Type === "CU") {
            this.register.ssu.office.address = this.register.ssu.current.address;
            this.sameoffice = true;
        }
    }

    public onClickNextPage() {
        console.log('onClickNextPage --- bass runs');
        this.flipBook.turn("next");
    }

    public onClickPreviuesPage() {
        this.flipBook.turn("previous");
    }

    public checkNextPage() {
        console.log('checkNextPage --- bass runs');
        if (!isNullOrUndefined(this.register.sanction_list)) {
            this.flipBook.turn("next");
        }
    }

    public checkBackPage() {
        console.log('checkBackPage --- bass runs');
        this.flipBook.turn("previous");
    }

    public setShowCloseButton(bool: boolean) {
        this.isShowCloseButton = bool;
    }

    public onClickClose() {
        this.closeBook();
        const that = this;
        setTimeout(function () {
            that.flipBook.fadeOut();
            that.location.back();
        }, 1000);
    }

    public closeBook() {
        console.log("book closed")
        this.setShowCloseButton(false);
        this.isClosed = true;
        this.flipBook.turn('disable', false);
        this.flipBook.turn("page", 2).turn('stop').turn("page", 1);
    }

    public changeGenderValue(dataValue, id) {
        Utils.logDebug('changeGenderValue', 'start');
        Utils.logDebug('changeGenderValue', 'dataValue : ' + dataValue + ' / id : ' + id);
        let genderTemp = [];
        switch (id) {
            case 'ssu_titleTH':
            case 'ssu_titleEN':
                if (!isNullOrUndefined(dataValue)) {
                    this.genderShowInput = true;
                } else {
                    this.genderShowInput = false;
                }

                genderTemp = this.genderList.filter(data => data.value === dataValue);
                if (genderTemp.length >= 1) {
                    this.register.ssu.cardInfo.gender = genderTemp[0];
                } else {
                    this.register.ssu.cardInfo.gender = new Gender();
                }
                break;
            case 'relationship_title1':
                if (!isNullOrUndefined(dataValue)) {
                    this.relationship1GenderShowInput = true;
                } else {
                    this.relationship1GenderShowInput = false;
                }

                genderTemp = this.genderList.filter(data => data.value === dataValue);
                if (genderTemp.length >= 1) {
                    this.register.ssu.relationship.gender1 = genderTemp[0];
                } else {
                    this.register.ssu.relationship.gender1 = new Gender();
                }
                Utils.logDebug('changeGenderValue', 'this.register.ssu.relationship.gender1 : ' + this.register.ssu.relationship.gender1);
                break;
            case 'relationship_title2':
                if (!isNullOrUndefined(dataValue)) {
                    this.relationship2GenderShowInput = true;
                } else {
                    this.relationship2GenderShowInput = false;
                }
                genderTemp = this.genderList.filter(data => data.value === dataValue);
                if (genderTemp.length >= 1) {
                    this.register.ssu.relationship.gender2 = genderTemp[0];
                } else {
                    this.register.ssu.relationship.gender2 = new Gender();
                }
                break;
        }
    }

    public onSelector(id) {
        Utils.logDebug('onSelector', 'start');
        Utils.logDebug('onSelector', 'id : ' + id);
        this.selected = id;
        this.dataList = [];
        this.checkOnSelector1(id);
        this.checkOnSelector2(id);
        this.checkOnSelector3(id);
        this.checkOnSelector4(id);
    }

    public checkOnSelector1(id) {
        switch (id) {
            case 'relationship_gender2':
            case 'relationship_gender1':
            case 'ssu_gender':
                this.titleTypeList = 'เพศ';

                this.dataList = this.genderList;
                this.onShow();
                this.ActiveGender(id);
                break;
            case 'subscription_instruction':
                this.titleTypeList = 'เงื่อนไขการสั่งจ่าย';
                this.dataList = this.InstructionList;
                if (this.dataList.length.toString() !== '0') {
                    this.onShow();
                    this.ActiveInstruction(id);
                } else {
                    this.getConfigList('instruction_sub', id, true);
                }
                break;
            case 'subscription_FeeSMS':
            case 'subscription_interest':
                this.titleTypeList = 'บัญชีของท่าน';
                this.dataList = this.AccountList;
                if (this.dataList.length.toString() !== '0') {
                    this.onShow();
                } else {
                    this.ongetAccountList(id, true);
                }
                break;
            default:
                break;
        }
    }

    public checkOnSelector2(id) {
        switch (id) {
            case 'ssu_titleTH':
            case 'ssu_titleEN':
            case 'ssu_spouse_titleTH':
            case 'ssu_spouse_titleEN':
            case 'relationship_title1':
            case 'relationship_title2':
                this.titleTypeList = 'คำนำหน้าชื่อ';
                this.dataList = this.TitleList;
                if (this.dataList.length.toString() !== '0' && this.tempTitle_id === id) {
                    this.onShow();
                    this.ActiveTitle(id);
                } else {
                    this.tempTitle_id = id;
                    this.getTitleList('title', id, true);
                }
                break;
            case 'ssu_nation':
                this.titleTypeList = 'สัญชาติ';
                this.dataList = this.NationList;
                if (this.dataList.length.toString() !== '0') {
                    this.onShow();
                    this.ActiveNation(id);
                } else {
                    this.getConfigList('nationality', id, true);
                }
                break;
            case 'ssu_country':
            case 'ssu_address_country':
            case 'ssu_address_office_country':
            case 'subscription_country':
            case 'ssu_countryincome':
                this.titleTypeList = 'ประเทศ';
                if (id !== 'ssu_countryincome') {
                    this.dataList = this.AllCountryList.filter(x => x.REF_VALUE === 'TH');
                    if (this.dataList.length.toString() !== '0') {
                        this.onShow();
                        this.ActiveCountry(id);
                    } else {
                        this.getConfigList('country', id, true);
                    }
                } else {
                    this.dataList = this.AllCountryList.filter(x => x.REF_VALUE !== 'TH');
                    if (this.dataList.length.toString() !== '0') {
                        this.onShow();
                        this.ActiveCountry(id);
                    } else {
                        this.getConfigList('country', id, true);
                    }
                }
                break;
            default:
                break;
        }
    }

    public checkOnSelector3(id) {
        switch (id) {
            case 'ssu_province':
            case 'ssu_address_province':
            case 'ssu_address_office_province':
            case 'subscription_province':
                this.titleTypeList = 'จังหวัด';
                this.getConfigList('province', id, true);
                break;
            case 'ssu_district':
                this.titleTypeList = 'เขต/อำเภอ';
                this.getCustAddressListByValue(this.register.ssu.cardInfo.address.province, "", "province", id, true);
                break;
            case 'subscription_district':
                this.titleTypeList = 'เขต/อำเภอ';
                this.getCustAddressListByValue(this.register.subscription.address.province, "", "province", id, true);
                break;
            case 'ssu_address_district':
                this.titleTypeList = 'เขต/อำเภอ';
                this.getCustAddressListByValue(this.register.ssu.current.address.province, "", "province", id, true);
                break;
            case 'ssu_address_office_district':
                this.titleTypeList = 'เขต/อำเภอ';
                this.getCustAddressListByValue(this.register.ssu.office.address.province, "", "province", id, true);
                break;
            case 'ssu_locality':
                this.titleTypeList = 'แขวง/ตำบล';
                this.getCustAddressListByValue(this.register.ssu.cardInfo.address.province, this.register.ssu.cardInfo.address.district, "province_district", id, true);
                break;
            case 'subscription_locality':
                this.titleTypeList = 'แขวง/ตำบล';
                this.getCustAddressListByValue(this.register.subscription.address.province, this.register.subscription.address.district, "province_district", id, true);
                break;
            default:
                break;
        }
    }

    public checkOnSelector4(id) {
        switch (id) {
            case 'ssu_address_locality':
                this.titleTypeList = 'แขวง/ตำบล';
                this.getCustAddressListByValue(this.register.ssu.current.address.province, this.register.ssu.current.address.district, "province_district", id, true);
                break;
            case 'ssu_address_office_locality':
                this.titleTypeList = 'แขวง/ตำบล';
                this.getCustAddressListByValue(this.register.ssu.office.address.province, this.register.ssu.office.address.district, "province_district", id, true);
                break;
            case 'ssu_property':
                this.titleTypeList = 'มูลค่าทรัพย์สินส่วนตัว';
                this.getConfigList('properties_value', id, true);
                break;
            case 'business_sector':
                this.titleTypeList = 'ประเภทธุรกิจของสถานที่ทำงาน';
                this.getConfigList('business_sector', id, true);
                break;
            case 'ssu_career':
                this.titleTypeList = 'อาชีพ';
                this.getConfigList('occupation', id, true);
                break;
            case 'subscription_purpose':
                this.titleTypeList = 'วัตถุประสงค์ในการเปิดบัญชี';
                this.getConfigList('purpose', id, true);
                break;
            case 'ssu_position':
                this.titleTypeList = 'ตำแหน่ง';
                this.getConfigList('job_title', id, true);
                break;
            default:
                break;
        }
    }

    public onSet(value) {
        Utils.logDebug('onSet', 'start');
        const id = value.id;
        Utils.logDebug('onSet', 'value : ' + JSON.stringify(value));

        this.checkOnSet1(id, value);
        this.checkOnSet2(id, value);
        this.checkOnSet3(id, value);
        this.checkOnSet4(id, value);
        this.checkOnSet5(id, value);
        this.checkOnSet6(id, value);
        this.checkOnSet7(id, value);
    }

    public checkOnSet1(id, value) {
        switch (id) {
            case 'ssu_gender':
                this.register.ssu.cardInfo.gender.data = value.selected.data;
                this.register.ssu.cardInfo.gender.value = value.selected.value;
                this.setBlueLine('gender_id');
                Utils.logDebug('onSet', 'ssu_gender -> this.register.ssu.cardInfo.gender.data  : ' + this.register.ssu.cardInfo.gender.data);
                Utils.logDebug('onSet', 'ssu_gender -> this.register.ssu.cardInfo.gender.value : ' + this.register.ssu.cardInfo.gender.value);
                break;
            case 'relationship_gender1':
                this.register.ssu.relationship.gender1.data = value.selected.data;
                this.register.ssu.relationship.gender1.value = value.selected.value;
                this.setBlueLine('relationship_gender1');
                Utils.logDebug('onSet', 'relationship_gender1 -> this.register.ssu.relationship.gender1.data  : ' + this.register.ssu.relationship.gender1.data);
                Utils.logDebug('onSet', 'relationship_gender1 -> this.register.ssu.relationship.gender1.value : ' + this.register.ssu.relationship.gender1.value);
                break;
            case 'relationship_gender2':
                this.register.ssu.relationship.gender2.data = value.selected.data;
                this.register.ssu.relationship.gender2.value = value.selected.value;
                this.setBlueLine('relationship_gender2');
                Utils.logDebug('onSet', 'relationship_gender2 -> this.register.ssu.relationship.gender2.data  : ' + this.register.ssu.relationship.gender2.data);
                Utils.logDebug('onSet', 'relationship_gender2 -> this.register.ssu.relationship.gender2.value : ' + this.register.ssu.relationship.gender2.value);
                break;
            case 'Debit Card':
                this.onSelectedAccountValue = value.selected;
                this.register.subscription.account.PROD_TYPE = value.selected.accountType;
                this.register.account_no = value.selected.accountNo;
                this.atmServiceChecked = true;
                Utils.logDebug('onSet', 'Debit Card -> this.onSelectedAccountValue : ' + this.onSelectedAccountValue);
                Utils.logDebug('onSet', 'Debit Card -> this.register.subscription.account.PROD_TYPE : ' + this.register.subscription.account.PROD_TYPE);
                Utils.logDebug('onSet', 'Debit Card -> this.register.account_no : ' + this.register.account_no);
                Utils.logDebug('onSet', 'Debit Card -> this.atmServiceChecked : ' + this.atmServiceChecked);
                this.checkConfigProduct();
                break;
            case 'PromptPay':
                this.onSelectedAccountValue = value.selected;
                this.register.subscription.account.PROD_TYPE = value.selected.accountType;
                this.register.account_no = value.selected.accountNo;
                Utils.logDebug('onSet', 'PromptPay -> this.onSelectedAccountValue : ' + this.onSelectedAccountValue);
                Utils.logDebug('onSet', 'PromptPay -> this.register.subscription.account.PROD_TYPE : ' + this.register.subscription.account.PROD_TYPE);
                Utils.logDebug('onSet', 'PromptPay -> this.register.account_no : ' + this.register.account_no);
                Utils.logDebug('onSet', 'PromptPay -> this.showModalPromtPay');
                this.showModalPromtPay();
                break;
            case 'SMS':
                this.onSelectedAccountValue = value.selected;
                this.register.subscription.account.PROD_TYPE = value.selected.accountType;
                this.register.account_no = value.selected.accountNo;
                if (this.register.haveSMS.length > 0) {
                    if (this.register.haveSMS.filter(Value => Value.ACCOUNT_NO === this.register.account_no).length > 0) {
                        this.ShowSMS = true;
                    } else {
                        this.register.smsServiceChecked = true;
                        this.smsServiceChecked = true;
                        this.ShowSMS = false;
                    }
                } else {
                    this.register.smsServiceChecked = true;
                    this.smsServiceChecked = true;
                    this.ShowSMS = false;
                }
                Utils.logDebug('onSet', 'SMS -> this.onSelectedAccountValue : ' + this.onSelectedAccountValue);
                Utils.logDebug('onSet', 'SMS -> this.register.subscription.account.PROD_TYPE : ' + this.register.subscription.account.PROD_TYPE);
                Utils.logDebug('onSet', 'SMS -> this.register.account_no : ' + this.register.account_no);
                Utils.logDebug('onSet', 'SMS -> checkConfigProduct');
                this.checkConfigProduct();
                break;
            case 'eBanking':
                this.onSelectedAccountValue = value.selected;
                this.register.subscription.account.PROD_TYPE = value.selected.accountType;
                this.register.account_no = value.selected.accountNo;
                if (this.register.haveSMS.length > 0) {
                    if (this.register.haveSMS.filter(Value => Value.ACCOUNT_NO === this.register.account_no).length > 0) {
                        this.ShowSMS = true;
                    } else {
                        this.register.smsServiceChecked = false;
                        this.smsServiceChecked = false;
                        this.ShowSMS = false;
                    }
                } else {
                    this.register.smsServiceChecked = false;
                    this.smsServiceChecked = false;
                    this.ShowSMS = false;
                }
                Utils.logDebug('onSet', 'eBanking -> this.onSelectedAccountValue : ' + this.onSelectedAccountValue);
                Utils.logDebug('onSet', 'eBanking -> this.register.subscription.account.PROD_TYPE : ' + this.register.subscription.account.PROD_TYPE);
                Utils.logDebug('onSet', 'eBanking -> this.register.account_no : ' + this.register.account_no);
                Utils.logDebug('onSet', 'eBanking -> checkConfigProduct');
                this.checkConfigProduct();
                break;
            default:
                break;
        }
    }

    public checkOnSet2(id, value) {
        switch (id) {
            case 'subscription_instruction':
                this.register.subscription.account.PMT_DESC = value.selected.DESC_THAI;
                this.register.subscription.account.PMT_ID = value.selected.REF_ID;
                Utils.logDebug('onSet', 'subscription_instruction -> this.register.subscription.account.PMT_DESC : ' + this.register.subscription.account.PMT_DESC);
                Utils.logDebug('onSet', 'subscription_instruction -> this.register.subscription.account.PMT_ID : ' + this.register.subscription.account.PMT_ID);
                break;
            case 'subscription_interest':
                this.setBlueLine("Account_interest_id");
                if (value.selected.accountType === 'new') {
                    this.register.subscription.account.interest = value.selected.value;
                    this.tempType = SubscriptionType.newSA;
                } else {
                    this.register.subscription.account.interest = value.selected.accountNo;
                    this.tempType = value.selected.accountType;
                    Utils.logDebug('onSet', 'this.tempType : ' + this.tempType);
                }
                this.register.subscription.account.interestData = value.selected.data;
                Utils.logDebug('onSet', 'subscription_interest -> this.register.subscription.account.interest : ' + this.register.subscription.account.interest);
                Utils.logDebug('onSet', 'subscription_interest -> this.tempType : ' + this.tempType);
                Utils.logDebug('onSet', 'subscription_interest -> this.register.subscription.account.interestData : ' + this.register.subscription.account.interestData);
                break;
            case 'subscription_FeeSMS':
                this.setBlueLine("AccountNoFeeSMS_id");
                if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeFix) {
                    this.register.subscriptionService.service.internet.AccountNoFeeSMS = value.selected.accountNo;
                }

                this.register.subscriptionService.service.internet.AccountNoFeeSMS_DATA = value.selected.data;
                Utils.logDebug('onSet', 'subscription_FeeSMS -> this.register.subscriptionService.service.internet.AccountNoFeeSMS : ' + this.register.subscriptionService.service.internet.AccountNoFeeSMS);
                Utils.logDebug('onSet', 'subscription_FeeSMS -> this.register.subscriptionService.service.internet.AccountNoFeeSMS_DATA : ' + this.register.subscriptionService.service.internet.AccountNoFeeSMS_DATA);
                break;
            case 'ssu_titleTH':
                this.setBlueLine('titleTH_id');
                this.setBlueLine('titleEN_id');
                this.changeGenderValue(value.selected.GENDER, id);
                this.register.ssu.cardInfo.titleTH = value.selected.SHRT_TITLE_TH;
                this.register.ssu.cardInfo.titleTHId = value.selected.value;
                this.register.ssu.cardInfo.titleEN = value.selected.SHRT_TITLE_EN;
                this.register.ssu.cardInfo.titleENId = value.selected.value;
                this.register.ssu.cardInfo.titleFullTH = value.selected.CUST_CONFIG_DESC_TH;
                this.register.ssu.cardInfo.titleFullEN = value.selected.CUST_CONFIG_DESC_EN;
                Utils.logDebug('onSet', 'ssu_titleTH -> this.register.ssu.cardInfo.titleTH : ' + this.register.ssu.cardInfo.titleTH);
                Utils.logDebug('onSet', 'ssu_titleTH -> this.register.ssu.cardInfo.titleENId : ' + this.register.ssu.cardInfo.titleENId);
                Utils.logDebug('onSet', 'ssu_titleTH -> this.register.ssu.cardInfo.titleFullTH : ' + this.register.ssu.cardInfo.titleFullTH);
                Utils.logDebug('onSet', 'ssu_titleTH -> this.register.ssu.cardInfo.titleFullEN : ' + this.register.ssu.cardInfo.titleFullEN);
                break;
            case 'ssu_titleEN':
                this.setBlueLine('titleTH_id');
                this.setBlueLine('titleEN_id');
                this.changeGenderValue(value.selected.GENDER, id);
                this.register.ssu.cardInfo.titleEN = value.selected.SHRT_TITLE_EN;
                this.register.ssu.cardInfo.titleENId = value.selected.value;
                this.register.ssu.cardInfo.titleTH = value.selected.SHRT_TITLE_TH;
                this.register.ssu.cardInfo.titleTHId = value.selected.value;
                this.register.ssu.cardInfo.titleFullTH = value.selected.CUST_CONFIG_DESC_TH;
                this.register.ssu.cardInfo.titleFullEN = value.selected.CUST_CONFIG_DESC_EN;
                Utils.logDebug('onSet', 'ssu_titleEN -> this.register.ssu.cardInfo.titleEN : ' + this.register.ssu.cardInfo.titleEN);
                Utils.logDebug('onSet', 'ssu_titleEN -> this.register.ssu.cardInfo.titleENId : ' + this.register.ssu.cardInfo.titleENId);
                Utils.logDebug('onSet', 'ssu_titleEN -> this.register.ssu.cardInfo.titleTH : ' + this.register.ssu.cardInfo.titleENId);
                Utils.logDebug('onSet', 'ssu_titleEN -> this.register.ssu.cardInfo.titleTHId : ' + this.register.ssu.cardInfo.titleTHId);
                Utils.logDebug('onSet', 'ssu_titleEN -> this.register.ssu.cardInfo.titleFullTH : ' + this.register.ssu.cardInfo.titleFullTH);
                Utils.logDebug('onSet', 'ssu_titleEN -> this.register.ssu.cardInfo.titleFullEN : ' + this.register.ssu.cardInfo.titleFullEN);
                break;
            case 'ssu_spouse_titleTH':
                this.register.ssu.spouse.title.TH = value.selected.SHRT_TITLE_TH;
                this.register.ssu.spouse.title.TH_Id = value.selected.value;
                this.register.ssu.spouse.title.EN = value.selected.SHRT_TITLE_EN;
                this.register.ssu.spouse.title.EN_Id = value.selected.value;
                this.register.ssu.spouse.title.titleFullTH = value.selected.CUST_CONFIG_DESC_TH;
                this.register.ssu.spouse.title.titleFullEN = value.selected.CUST_CONFIG_DESC_EN;

                this.checkGenderOnSet(value);
                this.setBlueLine('ContactTitleTH_id');
                Utils.logDebug('onSet', 'ssu_spouse_titleTH -> this.register.ssu.spouse.title.EN : ' + this.register.ssu.spouse.title.EN);
                Utils.logDebug('onSet', 'ssu_spouse_titleTH -> this.register.ssu.spouse.title.EN_Id : ' + this.register.ssu.spouse.title.EN_Id);
                Utils.logDebug('onSet', 'ssu_spouse_titleTH -> this.register.ssu.spouse.title.TH : ' + this.register.ssu.spouse.title.TH);
                Utils.logDebug('onSet', 'ssu_spouse_titleTH -> this.register.ssu.spouse.title.TH_Id : ' + this.register.ssu.spouse.title.TH_Id);
                Utils.logDebug('onSet', 'ssu_spouse_titleTH -> this.register.ssu.spouse.title.titleFullTH : ' + this.register.ssu.spouse.title.titleFullTH);
                Utils.logDebug('onSet', 'ssu_spouse_titleTH -> this.register.ssu.spouse.title.titleFullEN : ' + this.register.ssu.spouse.title.titleFullEN);
                Utils.logDebug('onSet', 'ssu_spouse_titleTH -> this.register.ssu.spouse.gender.value : ' + this.register.ssu.spouse.gender.value);
                Utils.logDebug('onSet', 'ssu_spouse_titleTH -> this.register.ssu.spouse.gender.data : ' + this.register.ssu.spouse.gender.data);
                break;
            default:
                break;
        }
    }

    public checkGenderOnSet(value) {
        if (!isNullOrUndefined(value.selected.GENDER)) {
            this.register.ssu.spouse.gender.value = value.selected.GENDER
            this.register.ssu.spouse.gender.data = value.selected.GENDER === 'M' ? 'ชาย' : 'หญิง'
        }
    }

    public checkOnSet3(id, value) {
        switch (id) {
            case 'ssu_spouse_titleEN':
                this.register.ssu.spouse.title.EN = value.selected.SHRT_TITLE_EN;
                this.register.ssu.spouse.title.EN_Id = value.selected.EN_ID;
                this.register.ssu.spouse.title.TH = value.selected.SHRT_TITLE_TH;
                this.register.ssu.spouse.title.TH_Id = value.selected.TH_ID;
                this.register.ssu.spouse.title.titleFullTH = value.selected.CUST_CONFIG_DESC_TH;
                this.register.ssu.spouse.title.titleFullEN = value.selected.CUST_CONFIG_DESC_ENG;
                Utils.logDebug('onSet', 'ssu_spouse_titleEN -> this.register.ssu.spouse.title.EN : ' + this.register.ssu.spouse.title.EN);
                Utils.logDebug('onSet', 'ssu_spouse_titleEN -> this.register.ssu.spouse.title.EN_Id : ' + this.register.ssu.spouse.title.EN_Id);
                Utils.logDebug('onSet', 'ssu_spouse_titleEN -> this.register.ssu.spouse.title.TH : ' + this.register.ssu.spouse.title.TH);
                Utils.logDebug('onSet', 'ssu_spouse_titleEN -> this.register.ssu.spouse.title.TH_Id : ' + this.register.ssu.spouse.title.TH_Id);
                Utils.logDebug('onSet', 'ssu_spouse_titleEN -> this.register.ssu.spouse.title.titleFullTH : ' + this.register.ssu.spouse.title.titleFullTH);
                Utils.logDebug('onSet', 'ssu_spouse_titleEN -> this.register.ssu.spouse.title.titleFullEN : ' + this.register.ssu.spouse.title.titleFullEN);
                break;
            case 'relationship_title1':
                this.changeGenderValue(value.selected.GENDER, id);
                this.register.ssu.relationship.title1.TH = value.selected.SHRT_TITLE_TH;
                this.register.ssu.relationship.title1.TH_Id = value.selected.TH_ID;
                this.register.ssu.relationship.title1.titleFullTH = value.selected.CUST_CONFIG_DESC_TH;
                this.register.ssu.relationship.title1.titleFullEN = value.selected.CUST_CONFIG_DESC_ENG;
                this.setBlueLine('ssu_relationship_title1');
                Utils.logDebug('onSet', 'relationship_title1 -> this.register.ssu.relationship.title1.TH : ' + this.register.ssu.relationship.title1.TH);
                Utils.logDebug('onSet', 'relationship_title1 -> this.register.ssu.relationship.title1.TH_Id : ' + this.register.ssu.relationship.title1.TH_Id);
                Utils.logDebug('onSet', 'relationship_title1 -> this.register.ssu.relationship.title1.titleFullTH : ' + this.register.ssu.relationship.title1.titleFullTH);
                Utils.logDebug('onSet', 'relationship_title1 -> this.register.ssu.relationship.title1.titleFullEN : ' + this.register.ssu.relationship.title1.titleFullEN);
                break;
            case 'relationship_title2':
                this.changeGenderValue(value.selected.GENDER, id);
                this.register.ssu.relationship.title2.TH = value.selected.SHRT_TITLE_TH;
                this.register.ssu.relationship.title2.TH_Id = value.selected.TH_ID;
                this.register.ssu.relationship.title2.titleFullTH = value.selected.CUST_CONFIG_DESC_TH;
                this.register.ssu.relationship.title2.titleFullEN = value.selected.CUST_CONFIG_DESC_ENG;
                this.setBlueLine('ssu_relationship_title2');
                Utils.logDebug('onSet', 'relationship_title2 -> this.register.ssu.relationship.title2.TH : ' + this.register.ssu.relationship.title2.TH);
                Utils.logDebug('onSet', 'relationship_title2 -> this.register.ssu.relationship.title2.TH_Id : ' + this.register.ssu.relationship.title2.TH_Id);
                Utils.logDebug('onSet', 'relationship_title2 -> this.register.ssu.relationship.title2.titleFullTH : ' + this.register.ssu.relationship.title2.titleFullTH);
                Utils.logDebug('onSet', 'relationship_title2 -> this.register.ssu.relationship.title2.titleFullEN : ' + this.register.ssu.relationship.title2.titleFullEN);
                break;
            case 'ssu_nation':
                this.register.ssu.cardInfo.nation = value.selected.data;
                this.register.ssu.cardInfo.nationId = value.selected.REF_VALUE;
                this.setBlueLine('ssu_nation_id');
                Utils.logDebug('onSet', 'ssu_nation -> this.register.ssu.cardInfo.nation : ' + this.register.ssu.cardInfo.nation);
                Utils.logDebug('onSet', 'ssu_nation -> this.register.ssu.cardInfo.nationId : ' + this.register.ssu.cardInfo.nationId);
                break;
            case 'ssu_country':
                if (value.selected.data !== 'ไทย') {
                    this.resetProvince(id);
                    this.resetDistrict(id);
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.register.ssu.cardInfo.address.country = value.selected.data;
                this.register.ssu.cardInfo.address.countryId = value.selected.value;
                this.setBlueLine('ssu_address_country');
                Utils.logDebug('onSet', 'ssu_country -> this.register.ssu.cardInfo.address.country : ' + this.register.ssu.cardInfo.address.country);
                Utils.logDebug('onSet', 'ssu_country -> this.register.ssu.cardInfo.address.countryId : ' + this.register.ssu.cardInfo.address.countryId);
                break;
            case 'ssu_countryincome':
                this.register.ssu.Contryincome.Desc = value.selected.data;
                this.register.ssu.Contryincome.Value = value.selected.value;
                Utils.logDebug('onSet', 'ssu_countryincome -> this.register.ssu.Contryincome.Desc : ' + this.register.ssu.Contryincome.Desc);
                Utils.logDebug('onSet', 'ssu_countryincome -> this.register.ssu.Contryincome.Value : ' + this.register.ssu.Contryincome.Value);
                break;
            case 'ssu_province':
                if (this.register.ssu.cardInfo.address.province !== value.selected.data) {
                    this.resetDistrict(id);
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.register.ssu.cardInfo.address.province = value.selected.data;
                this.register.ssu.cardInfo.address.provinceId = value.selected.value;
                this.setBlueLine('ssu_province');
                Utils.logDebug('onSet', 'ssu_district -> this.register.ssu.cardInfo.address.province : ' + this.register.ssu.cardInfo.address.province);
                Utils.logDebug('onSet', 'ssu_district -> this.register.ssu.cardInfo.address.provinceId : ' + this.register.ssu.cardInfo.address.provinceId);
                break;
            default:
                break;
        }
    }

    public checkOnSet4(id, value) {
        switch (id) {
            case 'ssu_district':
                if (this.register.ssu.cardInfo.address.district !== value.selected.data) {
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.register.ssu.cardInfo.address.district = value.selected.data;
                this.register.ssu.cardInfo.address.districtId = value.selected.value;
                this.setBlueLine('ssu_address_district_id');
                Utils.logDebug('onSet', 'ssu_district -> this.register.ssu.cardInfo.address.district : ' + this.register.ssu.cardInfo.address.district);
                Utils.logDebug('onSet', 'ssu_district -> this.register.ssu.cardInfo.address.districtId : ' + this.register.ssu.cardInfo.address.districtId);
                break;
            case 'ssu_locality':
                if (this.register.ssu.cardInfo.address.locality !== value.selected.data) {
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.register.ssu.cardInfo.address.locality = value.selected.data;
                this.register.ssu.cardInfo.address.localityId = value.selected.value;
                this.register.ssu.cardInfo.address.postcode = value.selected.ZIP_CODE;
                Utils.logDebug('onSet', 'ssu_locality -> this.register.ssu.cardInfo.address.locality  : ' + this.register.ssu.cardInfo.address.locality);
                Utils.logDebug('onSet', 'ssu_locality -> this.register.ssu.cardInfo.address.localityId : ' + this.register.ssu.cardInfo.address.localityId);
                Utils.logDebug('onSet', 'ssu_locality -> this.register.ssu.cardInfo.address.postcode : ' + this.register.ssu.cardInfo.address.postcode);

                this.setBlueLine('ssu_address_locality_id');
                break;
            case 'ssu_property':
                this.register.ssu.property.Value = value.selected.data;
                this.register.ssu.property.Id = value.selected.value;
                Utils.logDebug('onSet', 'ssu_property -> this.register.ssu.property.Value  : ' + this.register.ssu.property.Value);
                Utils.logDebug('onSet', 'ssu_property -> this.register.ssu.property.Id : ' + this.register.ssu.property.Id);
                break;
            case 'subscription_province':
                if (this.register.subscription.address.province !== value.selected.data) {
                    this.resetDistrict(id);
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.register.subscription.address.province = value.selected.data;
                this.register.subscription.address.provinceId = value.selected.value;
                Utils.logDebug('onSet', 'subscription_province -> this.register.subscription.address.province  : ' + this.register.subscription.address.province);
                Utils.logDebug('onSet', 'subscription_province -> this.register.subscription.address.provinceId : ' + this.register.subscription.address.provinceId);
                break;
            case 'subscription_district':
                if (this.register.subscription.address.district !== value.selected.data) {
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.register.subscription.address.district = value.selected.data;
                this.register.subscription.address.districtId = value.selected.value;
                Utils.logDebug('onSet', 'subscription_district -> this.register.subscription.address.district  : ' + this.register.subscription.address.district);
                Utils.logDebug('onSet', 'subscription_district -> this.register.subscription.address.districtId : ' + this.register.subscription.address.districtId);
                break;
            default:
                break;
        }
    }

    public checkOnSet5(id, value) {
        switch (id) {
            case 'subscription_locality':
                if (this.register.subscription.address.locality !== value.selected.data) {
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.register.subscription.address.locality = value.selected.data;
                this.register.subscription.address.localityId = value.selected.value;
                this.register.subscription.address.postcode = value.selected.ZIP_CODE;
                Utils.logDebug('onSet', 'subscription_locality -> this.register.subscription.address.locality  : ' + this.register.subscription.address.locality);
                Utils.logDebug('onSet', 'subscription_locality -> this.register.subscription.address.localityId : ' + this.register.subscription.address.localityId);
                Utils.logDebug('onSet', 'subscription_locality -> this.register.subscription.address.postcode : ' + this.register.subscription.address.postcode);
                break;
            case 'ssu_address_country':
                if (value.selected.data !== 'ไทย') {
                    this.resetProvince(id);
                    this.resetDistrict(id);
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.setBlueLine('ssu_current_address_country');
                this.register.ssu.current.address.country = value.selected.data;
                this.register.ssu.current.address.countryId = value.selected.value;
                Utils.logDebug('onSet', 'ssu_address_country -> this.register.ssu.current.address.country  : ' + this.register.ssu.current.address.country);
                Utils.logDebug('onSet', 'ssu_address_country -> this.register.ssu.current.address.countryId : ' + this.register.ssu.current.address.countryId);
                break;
            case 'ssu_address_province':
                if (this.register.ssu.current.address.province !== value.selected.data) {
                    this.resetDistrict(id);
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.setBlueLine('ssu_current_address_province_id');
                this.register.ssu.current.address.province = value.selected.data;
                this.register.ssu.current.address.provinceId = value.selected.value;
                Utils.logDebug('onSet', 'ssu_address_province -> this.register.ssu.current.address.province  : ' + this.register.ssu.current.address.province);
                Utils.logDebug('onSet', 'ssu_address_province -> this.register.ssu.current.address.provinceId : ' + this.register.ssu.current.address.provinceId);
                break;
            case 'ssu_address_district':
                if (this.register.ssu.current.address.district !== value.selected.data) {
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.setBlueLine('ssu_current_address_district_id');
                this.register.ssu.current.address.district = value.selected.data;
                this.register.ssu.current.address.districtId = value.selected.value;
                Utils.logDebug('onSet', 'ssu_address_district -> this.register.ssu.current.address.district  : ' + this.register.ssu.current.address.district);
                Utils.logDebug('onSet', 'ssu_address_district -> this.register.ssu.current.address.districtId : ' + this.register.ssu.current.address.districtId);
                break;
            case 'ssu_address_locality':
                this.checkResetAddressLocality(id, value);
                this.setBlueLine('ssu_current_address_locality_id');
                this.setBlueLine('ssu_current_address_postcode_id');
                this.register.ssu.current.address.locality = value.selected.data;
                this.register.ssu.current.address.localityId = value.selected.value;
                this.register.ssu.current.address.postcode = value.selected.ZIP_CODE;
                Utils.logDebug('onSet', 'ssu_address_locality -> this.register.ssu.current.address.locality  : ' + this.register.ssu.current.address.locality);
                Utils.logDebug('onSet', 'ssu_address_locality -> this.register.ssu.current.address.localityId : ' + this.register.ssu.current.address.localityId);
                Utils.logDebug('onSet', 'ssu_address_locality -> this.register.ssu.current.address.postcode : ' + this.register.ssu.current.address.postcode);
                break;
            default:
                break;
        }
    }

    public checkResetAddressLocality(id, value) {
        if (this.register.ssu.current.address.locality !== value.selected.data) {
            this.resetSubDistrict(id);
            this.resetPostCode(id);
        }
    }

    public checkOnSet6(id, value) {
        switch (id) {
            case 'ssu_address_office_country':
                if (value.selected.data !== 'ไทย') {
                    this.resetProvince(id);
                    this.resetDistrict(id);
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.setBlueLine('ssu_address_office_country');
                this.register.ssu.office.address.country = value.selected.data;
                this.register.ssu.office.address.countryId = value.selected.value;
                Utils.logDebug('onSet', 'ssu_address_office_country -> this.register.ssu.office.address.country : ' + this.register.ssu.office.address.country);
                Utils.logDebug('onSet', 'ssu_address_office_country -> this.register.ssu.office.address.countryId : ' + this.register.ssu.office.address.countryId);
                break;
            case 'ssu_address_office_province':
                if (this.register.ssu.office.address.province !== value.selected.data) {
                    this.resetDistrict(id);
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.setBlueLine('ssu_address_office_province_id');
                this.register.ssu.office.address.province = value.selected.data;
                this.register.ssu.office.address.provinceId = value.selected.value;
                Utils.logDebug('onSet', 'ssu_address_office_province -> this.register.ssu.office.address.province : ' + this.register.ssu.office.address.province);
                Utils.logDebug('onSet', 'ssu_address_office_province -> this.register.ssu.office.address.provinceId : ' + this.register.ssu.office.address.provinceId);
                break;
            case 'ssu_address_office_district':
                if (this.register.ssu.office.address.district !== value.selected.data) {
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.setBlueLine('ssu_address_office_district_id');
                this.register.ssu.office.address.district = value.selected.data;
                this.register.ssu.office.address.districtId = value.selected.value;
                Utils.logDebug('onSet', 'ssu_address_office_district -> this.register.ssu.office.address.district : ' + this.register.ssu.office.address.district);
                Utils.logDebug('onSet', 'ssu_address_office_district -> this.register.ssu.office.address.districtId : ' + this.register.ssu.office.address.districtId);
                break;
            case 'ssu_address_office_locality':
                if (this.register.ssu.office.address.locality !== value.selected.data) {
                    this.resetSubDistrict(id);
                    this.resetPostCode(id);
                }
                this.setBlueLine('ssu_address_office_locality_id');
                this.register.ssu.office.address.locality = value.selected.data;
                this.register.ssu.office.address.localityId = value.selected.value;
                this.register.ssu.office.address.postcode = value.selected.ZIP_CODE;
                Utils.logDebug('onSet', 'ssu_address_office_locality -> this.register.ssu.office.address.locality : ' + this.register.ssu.office.address.locality);
                Utils.logDebug('onSet', 'ssu_address_office_locality -> this.register.ssu.office.address.localityId : ' + this.register.ssu.office.address.localityId);
                Utils.logDebug('onSet', 'ssu_address_office_locality -> this.register.ssu.office.address.postcode : ' + this.register.ssu.office.address.postcode);
                break;
            case 'subscription_country':
                this.checkResetSubscriptionCountry(id, value);
                this.setBlueLine('ssu_countryincome');
                this.register.subscription.address.country = value.selected.data;
                this.register.subscription.address.countryId = value.selected.value;
                Utils.logDebug('onSet', 'subscription_country -> this.register.subscription.address.country : ' + this.register.subscription.address.country);
                Utils.logDebug('onSet', 'subscription_country -> this.register.subscription.address.countryId : ' + this.register.subscription.address.countryId);
                break;
            default:
                break;
        }
    }

    public checkResetSubscriptionCountry(id, value) {
        if (value.selected.data !== 'ไทย') {
            this.resetProvince(id);
            this.resetDistrict(id);
            this.resetSubDistrict(id);
            this.resetPostCode(id);
        }
    }

    public checkOnSet7(id, value) {
        switch (id) {
            case 'business_sector':
                this.register.ssu.business = new Business();
                this.setBlueLine('subscription_ssu_businessType');
                this.register.ssu.business.Type = value.selected.data;
                this.register.ssu.business.Id = value.selected.value;
                this.register.ssu.business.business_type = value.selected.TYPE_GROUP;
                Utils.logDebug('onSet', 'business_sector -> this.register.ssu.business.Type : ' + this.register.ssu.business.Type);
                Utils.logDebug('onSet', 'business_sector -> this.register.ssu.business.Id : ' + this.register.ssu.business.Id);
                Utils.logDebug('onSet', 'business_sector -> this.register.ssu.business.business_type : ' + this.register.ssu.business.business_type);
                break;
            case 'ssu_relationship1':
                break;
            case 'ssu_relationship2':
                break;
            case 'property_value':
                this.register.ssu.property = new Property();
                this.register.ssu.property.Value = value.selected.data;
                this.register.ssu.property.Id = value.selected.value;
                Utils.logDebug('onSet', 'property_value -> this.register.ssu.property.Value : ' + this.register.ssu.property.Value);
                Utils.logDebug('onSet', 'property_value -> this.register.ssu.property.Id : ' + this.register.ssu.property.Id);
                break;
            case 'ssu_career':
                this.setBlueLine('subscription_ssu_career');
                this.register.ssu.career.Data = value.selected.data;
                this.register.ssu.career.Id = value.selected.value;
                Utils.logDebug('onSet', 'setBlueLine -> this.register.ssu.career.Data : ' + this.register.ssu.career.Data);
                Utils.logDebug('onSet', 'setBlueLine -> this.register.ssu.career.Id : ' + this.register.ssu.career.Id);
                break;
            case 'subscription_purpose':
                this.setBlueLine('register_subscription4');
                this.register.subscription.account.OBJ.Data = value.selected.data;
                this.register.subscription.account.OBJ.Id = value.selected.value;
                Utils.logDebug('onSet', 'subscription_purpose -> this.register.subscription.account.OBJ.Id : ' + this.register.subscription.account.OBJ.Id);
                Utils.logDebug('onSet', 'subscription_purpose -> this.register.subscription.account.OBJ.Data : ' + this.register.subscription.account.OBJ.Data);
                break;
            case 'ssu_position':
                this.setBlueLine('subscription_ssu_position');
                this.register.ssu.position.Data = value.selected.data;
                this.register.ssu.position.Id = value.selected.value;
                Utils.logDebug('onSet', 'setBlueLine -> this.register.ssu.position.Data : ' + this.register.ssu.position.Data);
                Utils.logDebug('onSet', 'setBlueLine -> this.register.ssu.position.Id : ' + this.register.ssu.position.Id);
                break;
            default:
                break
        }
    }

    public onShow(value: boolean = true) {
        this.showSelector = value;
        this.getkeyboard();
    }

    public setID(ref_id, value) {
        Utils.logDebug('setID', 'start');
        Utils.logDebug('setID', 'value : ' + JSON.stringify(value));
        switch (ref_id) {
            case 'ssu_titleTH':
                this.register.ssu.cardInfo.titleTHId = Utils.checkEmptyValue(this.ActiveNow[0].TH_ID);
                this.register.ssu.cardInfo.titleENId = Utils.checkEmptyValue(this.ActiveNow[0].EN_ID);
                this.register.ssu.cardInfo.titleFullTH = Utils.checkEmptyValue(this.ActiveNow[0].data);
                break;
            case 'ssu_country':
                this.register.ssu.cardInfo.address.countryId = Utils.checkEmptyValue(this.ActiveNow[0]).REF_VALUE;
                break;
            case 'ssu_nation':
                this.register.ssu.cardInfo.nationId = Utils.checkEmptyValue(this.ActiveNow[0]).REF_VALUE;
                break;
            case 'district_subdistrict':
                this.register.ssu.cardInfo.address.provinceId = Utils.checkEmptyValue(value.PROVINCE[0].PROVINCE_CODE);
                this.register.ssu.cardInfo.address.districtId = Utils.checkEmptyValue(value.DISTRICT[0].DISTRICT_CODE);
                this.register.ssu.cardInfo.address.localityId = Utils.checkEmptyValue(value.SUB_DISTRICT[0].SUB_DISTRICT_CODE);
                break;
        }
    }

    public ActiveAccount(ref_id) {
        this.resetActive();
        this.AccountList = this.dataList;

        if (!isNullOrUndefined(this.register.subscription.account.interest)) {
            this.ActiveNow = this.AccountList.filter(Data => Data.data === this.register.subscription.account.interest);
            this.setID(ref_id, this.ActiveNow);
        }
    }

    public ActiveGender(ref_id) {
        Utils.logDebug('ActiveGender', 'start');
        Utils.logDebug('ActiveGender', 'ref_id : ' + ref_id);
        this.resetActive();
        this.genderList = this.dataList;
        switch (ref_id) {
            case "ssu_gender":
                if (!isNullOrUndefined(this.register.ssu.cardInfo.gender.data)) {
                    this.ActiveNow = this.genderList.filter(Data => Data.data === this.register.ssu.cardInfo.gender.data);
                }
                break;
            case "relationship_gender1":
                if (!isNullOrUndefined(this.register.ssu.relationship.gender1.data)) {
                    this.ActiveNow = this.genderList.filter(Data => Data.data === this.register.ssu.relationship.gender1.data);
                }
                break;
            case "relationship_gender2":
                if (!isNullOrUndefined(this.register.ssu.relationship.gender2.data)) {
                    this.ActiveNow = this.genderList.filter(Data => Data.data === this.register.ssu.relationship.gender2.data);
                }
                break;
        }

    }

    public ActiveInstruction(ref_id) {
        this.resetActive();
        this.InstructionList = this.dataList;

        if (!isNullOrUndefined(this.register.subscription.account.PMT_DESC)) {
            this.ActiveNow = this.InstructionList.filter(Data => Data.data === this.register.subscription.account.PMT_DESC);
            this.setID(ref_id, this.ActiveNow);
        }
    }

    public ActiveCountry(ref_id) {
        this.resetActive();
        this.CountryList = this.dataList;
        switch (ref_id) {
            case 'ssu_country':
                this.checkSSUCountry(ref_id);
                break;
            case 'ssu_address_country':
                this.checkSSUAddressCountry();
                break;
            case 'ssu_address_office_country':
                this.checkSSUAddressOfficeCountry();
                break;
            case 'subscription_country':
                if (!isNullOrUndefined(this.register.subscription.address.country)) {
                    this.ActiveNow = this.AllCountryList.filter(Data => Data.data === this.register.subscription.address.country);
                }
                break;
            case 'ssu_countryincome':
                if (!isNullOrUndefined(this.register.ssu.Contryincome.Desc)) {
                    this.ActiveNow = this.AllCountryList.filter(Data => Data.data === this.register.ssu.Contryincome.Desc);
                }
                break;
        }
    }

    public checkSSUCountry(ref_id) {
        if (!isNullOrUndefined(this.register.ssu.cardInfo.address.country)) {
            this.ActiveNow = this.CountryList.filter(Data => Data.data === this.register.ssu.cardInfo.address.country);
            this.setID(ref_id, this.ActiveNow);
        }
    }

    public checkSSUAddressCountry() {
        if (!isNullOrUndefined(this.register.ssu.current.address.country)) {
            this.ActiveNow = this.CountryList.filter(Data => Data.data === this.register.ssu.current.address.country);
        }
    }

    public checkSSUAddressOfficeCountry() {
        if (!isNullOrUndefined(this.register.ssu.office.address.country)) {
            this.ActiveNow = this.CountryList.filter(Data => Data.data === this.register.ssu.office.address.country);
        }
    }

    public ActiveNation(ref_id) {
        this.resetActive();
        this.NationList = this.dataList;
        if (!isNullOrUndefined(this.register.ssu.cardInfo.nation)) {
            this.ActiveNow = this.NationList.filter(Data => Data.data === this.register.ssu.cardInfo.nation);
            this.setID(ref_id, this.ActiveNow);
        }
    }

    public ActiveTitle(ref_id) {
        this.resetActive();
        this.TitleList = this.dataList;
        if (ref_id === 'ssu_titleTH') {
            this.checkSSUTitleTH(ref_id);
        }
        if (ref_id === 'ssu_titleEN') {
            this.checkSSUTitleEN(ref_id);
        }
        if (ref_id === 'relationship_title1') {
            if (!isNullOrUndefined(this.register.ssu.relationship.title1.TH)) {
                this.ActiveNow = this.TitleList.filter(data => data.data === this.register.ssu.relationship.title1.TH.toLocaleUpperCase());
            }
        }
        if (ref_id === 'relationship_title2') {
            if (!isNullOrUndefined(this.register.ssu.relationship.title2.TH)) {
                this.ActiveNow = this.TitleList.filter(data => data.data === this.register.ssu.relationship.title2.TH.toLocaleUpperCase());
            }
        }

        if (ref_id === 'ssu_spouse_titleTH') {
            this.checkSSUSpouseTitleTH();
        }

        if (ref_id === 'ssu_spouse_titleEN') {
            this.checkSSUSpouseTitleEN();
        }
    }

    public checkSSUTitleTH(ref_id) {
        if (!isNullOrUndefined(this.TitleList)) {
            if (this.TitleList.length <= 0) {
                this.register.ssu.cardInfo.titleTH = '';
                this.register.ssu.cardInfo.titleEN = '';
                return;
            }
        }
        if (!isNullOrUndefined(this.register.ssu.cardInfo.titleTH)) {
            this.ActiveNow = this.TitleList.filter(Data => Data.SHRT_TITLE_TH === this.register.ssu.cardInfo.titleTH);
            if (!isNullOrUndefined(this.ActiveNow)) {
                if (this.ActiveNow.length > 0) {
                    this.setID(ref_id, this.ActiveNow);
                } else {
                    this.register.ssu.cardInfo.titleTH = '';
                    this.register.ssu.cardInfo.titleEN = '';
                }
            } else {
                this.register.ssu.cardInfo.titleTH = '';
                this.register.ssu.cardInfo.titleEN = '';
            }
        }
    }

    public checkSSUSpouseTitleTH() {
        if (!isNullOrUndefined(this.register.ssu.spouse.title.TH)) {
            this.ActiveNow = this.TitleList.filter(data => data.data === this.register.ssu.spouse.title.TH.toLocaleUpperCase());
        }
    }

    public checkSSUSpouseTitleEN() {
        if (!isNullOrUndefined(this.register.ssu.spouse.title.EN)) {
            this.ActiveNow = this.TitleList.filter(data => data.data === this.register.ssu.spouse.title.EN.toLocaleUpperCase());
        }
    }

    public checkSSUTitleEN(ref_id) {
        if (isNullOrUndefined(this.TitleList)) {
            this.register.ssu.cardInfo.titleTH = '';
            this.register.ssu.cardInfo.titleEN = '';
            return;
        }
        if (this.TitleList.length <= 0) {
            this.register.ssu.cardInfo.titleTH = '';
            this.register.ssu.cardInfo.titleEN = '';
            return;
        }
        if (!isNullOrUndefined(this.register.ssu.cardInfo.titleEN)) {

            // if (this.register.ssu.cardInfo.titleEN === 'Miss') {
            //     this.register.ssu.cardInfo.titleTH = 'นางสาว';
            //     this.register.ssu.cardInfo.titleEN = 'MS.'
            // }

            this.ActiveNow = this.TitleList.filter(data => data.data === this.register.ssu.cardInfo.titleEN.toLocaleUpperCase());
            if (!isNullOrUndefined(this.ActiveNow)) {
                if (this.ActiveNow.length > 0) {
                    this.setID(ref_id, this.ActiveNow);
                } else {
                    this.register.ssu.cardInfo.titleTH = '';
                    this.register.ssu.cardInfo.titleEN = '';
                }
            } else {
                // this.register.ssu.cardInfo.titleEN = 'Unidentify';
                this.register.ssu.cardInfo.titleTH = '';
                this.register.ssu.cardInfo.titleEN = '';
                this.ActiveNow = this.TitleList.filter(data => data.data === this.register.ssu.cardInfo.titleEN);
            }
        }
    }

    public resetProvince(ref_id) {

        switch (ref_id) {
            case 'ssu_country':
                this.register.ssu.cardInfo.address.province = null;
                this.register.ssu.cardInfo.address.provinceId = null;
                break;
            case 'ssu_address_country':
                this.register.ssu.current.address.province = null;
                this.register.ssu.current.address.provinceId = null;
                break;
            case 'ssu_address_office_country':
                this.register.ssu.office.address.province = null;
                this.register.ssu.office.address.provinceId = null;
                break;
            case 'subscription_country':
                this.register.subscription.address.province = null;
                this.register.subscription.address.provinceId = null;
                break;
        }
    }

    public resetDistrict(ref_id) {

        switch (ref_id) {
            case 'ssu_country':
            case 'ssu_province':
                this.register.ssu.cardInfo.address.district = null;
                this.register.ssu.cardInfo.address.districtId = null;
                break;
            case 'ssu_address_country':
            case 'ssu_address_province':
                this.register.ssu.current.address.district = null;
                this.register.ssu.current.address.districtId = null;
                break;
            case 'ssu_address_office_country':
            case 'ssu_address_office_province':
                this.register.ssu.office.address.district = null;
                this.register.ssu.office.address.districtId = null;
                break;
            case 'subscription_country':
            case 'subscription_province':
                this.register.subscription.address.district = null;
                this.register.subscription.address.districtId = null;
                break
        }
    }

    public resetSubDistrict(ref_id) {

        switch (ref_id) {
            case "ssu_country":
            case "ssu_province":
            case "ssu_district":
                this.register.ssu.cardInfo.address.locality = null;
                this.register.ssu.cardInfo.address.localityId = null;
                break;
            case "ssu_address_country":
            case "ssu_address_province":
            case "ssu_address_district":
                this.register.ssu.current.address.locality = null;
                this.register.ssu.current.address.localityId = null;
                break;
            case "ssu_address_office_country":
            case "ssu_address_office_province":
            case "ssu_address_office_district":
                this.register.ssu.office.address.locality = null;
                this.register.ssu.office.address.localityId = null;
                break;
            case "subscription_country":
            case "subscription_province":
            case "subscription_district":
                this.register.subscription.address.locality = null;
                this.register.subscription.address.districtId = null;
                break;
        }
    }

    public resetPostCode(ref_id) {

        if (this.checkResetPostCode1(ref_id)) {
            this.register.ssu.cardInfo.address.postcode = null;
        }

        if (this.checkResetPostCode2(ref_id)) {
            this.register.ssu.current.address.postcode = null;
        }

        if (this.checkResetPostCode3(ref_id)) {
            this.register.ssu.office.address.postcode = null;
        }

        if (this.checkResetPostCode4(ref_id)) {
            this.register.subscription.address.postcode = null
        }
    }

    public checkResetPostCode1(ref_id) {
        if (ref_id === 'ssu_country' || ref_id === 'ssu_province' || ref_id === 'ssu_district' || ref_id === 'ssu_locality') {
            return true;
        } else {
            return false;
        }
    }

    public checkResetPostCode2(ref_id) {
        if (ref_id === 'ssu_address_country' || ref_id === 'ssu_address_province' || ref_id === 'ssu_address_district' || ref_id === 'ssu_address_locality') {
            return true;
        } else {
            return false;
        }
    }

    public checkResetPostCode3(ref_id) {
        if (ref_id === 'ssu_address_office_country' || ref_id === 'ssu_address_office_province' || ref_id === 'ssu_address_office_district' || ref_id === 'ssu_address_office_locality') {
            return true;
        } else {
            return false;
        }
    }

    public checkResetPostCode4(ref_id) {
        if (ref_id === 'subscription_country' || ref_id === 'subscription_province' || ref_id === 'subscription_district' || ref_id === 'subscription_locality') {
            return true;
        } else {
            return false;
        }
    }

    public resetActive() {
        this.ActiveNow = [];
    }

    public getAccount(ref_id) {
        const that = this;
        let accountType = "";
        let count = 0;
        const result = new Array();
        Utils.logDebug('getAccount', 'ref_id:' + ref_id);
        switch (ref_id) {
            case 'subscription_interest':
                this.dataList = this.dataList.filter(Data => Data.accountType !== AppConstant.ProdTypeFix);
                break;
            case 'subscription_FeeSMS':
                this.dataList = this.dataList.filter(Data => Data.accountType !== AppConstant.ProdTypeFix);
                break;
            case 'SMS': // Not TD, and already regis
                Utils.logDebug('getAccount', JSON.stringify(this.register.haveSMS));
                // filter not in sms
                this.dataList.forEach(item => {
                    if (item.accountType !== AppConstant.ProdTypeFix) {
                        let found = false;
                        this.register.haveSMS.forEach(item2 => {
                            if (item.accountNo === item2.ACCOUNT_NO) {
                                found = true;
                                return;
                            }
                        });
                        if (found === false) {
                            result.push(item);
                        }
                    }
                });
                if (isNullOrUndefined(result) || result.length <= 0) {
                    this.dataList = result;
                    Modal.showAlertWithOk('ไม่พบบัญชีที่สมัครบริการได้', () => {
                        this.router.navigate(["/kk"]);
                    });
                } else {
                    this.dataList = result;
                }
                break;

            case 'Debit Card':  // Not TD
                this.dataList.forEach(item => {
                    if (item.accountType !== AppConstant.ProdTypeFix) {
                        result.push(item);
                    }
                });
                if (isNullOrUndefined(result) || result.length <= 0) {
                    this.dataList = result;
                    Modal.showAlertWithOk('ไม่พบบัญชีที่สมัครบริการได้', () => {
                        this.router.navigate(["/kk"]);
                    });
                } else {
                    this.dataList = result;
                }
                break;

            case 'PromptPay': // Not TD
                this.dataList.forEach(item => {
                    if (item.accountType !== AppConstant.ProdTypeFix) {
                        result.push(item);
                    }
                });
                if (isNullOrUndefined(result) || result.length <= 0) {
                    this.dataList = result;
                    Modal.showAlertWithOk('ไม่พบบัญชีที่สมัครบริการได้', () => {
                        this.router.navigate(["/kk"]);
                    });
                } else {
                    this.dataList = result;
                }
                break;

            default:
                break;
        }

        this.dataList.forEach(function (list, index) {
            if (list.accountType === AppConstant.ProdTypeSaving) {
                accountType = 'ออมทรัพย์';
            }
            if (list.accountType === AppConstant.ProdTypeCurrent) {
                accountType = 'กระแสรายวัน';
            }
            if (list.accountType === AppConstant.ProdTypeFix) {
                accountType = 'ประจำ';
            }

            if (list.accountType === 'new') {
                accountType = 'เปิดบัญชีใหม่ : ออมทรัพย์';
            }
            that.dataList[count]['value'] = list.accountNo;
            that.dataList[count]['data'] = list.accountNo + " : " + accountType + " : " + list.ProductDesc;
            count++;

            if (list.accountType === 'new') {
                that.dataList[count]['value'] = list.value;
                that.dataList[count]['data'] = accountType + ' : ' + list.data;
            }
        });
    }

    public getTitle(ref_id) {
        const that = this;
        if (ref_id === 'ssu_titleTH' || ref_id === 'ssu_spouse_titleTH' || ref_id === 'relationship_title1' || ref_id === 'relationship_title2') {
            this.dataList.forEach(function (list, index) {
                that.dataList[index]['value'] = list.TH_ID;
                that.dataList[index]['data'] = list.CUST_CONFIG_DESC_TH;
            });
            this.ActiveTitle(ref_id);
            return;
        }

        if (ref_id === 'ssu_titleEN' || ref_id === 'ssu_spouse_titleEN') {
            this.dataList.forEach(function (list, index) {
                that.dataList[index]['value'] = list.EN_ID;
                that.dataList[index]['data'] = list.CUST_CONFIG_DESC_ENG;
            });
        }
        this.ActiveTitle(ref_id);
    }

    public getCountry(ref_id) {
        const that = this;
        this.AllCountryList = this.dataList;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_VALUE;
            that.dataList[index]['data'] = list.DESC_THAI;

            if (list.REF_ID === '3') {
                that.ContryincomeTH = list.REF_VALUE;
            }
        });

        if (ref_id === 'ssu_country'
            || ref_id === 'ssu_address_country'
            || ref_id === 'ssu_address_office_country'
            || ref_id === 'subscription_country') {
            this.dataList = this.AllCountryList.filter(x => x.REF_VALUE === 'TH');
        }

        if (ref_id === 'subscription_country_id') {
            const data = this.dataList.filter(Data => Data.data === this.register.ssu.cardInfo.address.country);
            this.register.subscription.address.countryId = data['0'].REF_VALUE;
            this.getConfigList('province', 'subscription_province_id', false);
        } else {
            this.ActiveCountry(ref_id)
        }
    }

    public getNation(ref_id) {
        const that = this;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_VALUE;
            that.dataList[index]['data'] = list.DESC_THAI;
        });
        this.ActiveNation(ref_id);
    }

    public getProvince(ref_id) {
        const that = this;

        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_VALUE;
            that.dataList[index]['data'] = list.DESC_THAI;
        });
        this.resetActive();

        switch (ref_id) {
            case "ssu_province":
                this.checkSSUProvince();
                break;
            case "ssu_address_province":
                this.checkSSUAddressProvince();
                break;
            case "ssu_address_office_province":
                if (!isNullOrUndefined(this.register.ssu.office.address.province)) {
                    this.ActiveNow = this.dataList.filter(Data => Data.data === this.register.ssu.office.address.province);
                }
                break;
            case "subscription_province":
                if (!isNullOrUndefined(this.register.subscription.address.province)) {
                    this.ActiveNow = this.dataList.filter(Data => Data.data === this.register.subscription.address.province);
                }
                break;
            case "subscription_province_id":
                if (!isNullOrUndefined(this.register.subscription.address.province)) {
                    const data = this.dataList.filter(Data => Data.data === this.register.subscription.address.province);
                    this.register.subscription.address.provinceId = data['0'].REF_VALUE;
                    this.getCustAddressListByValue(this.register.subscription.address.province, this.register.subscription.address.district, "province", 'subscription_district_id', false);
                }
                break;
        }
    }

    public checkSSUProvince() {
        if (!isNullOrUndefined(this.register.ssu.cardInfo.address.province)) {
            this.ActiveNow = this.dataList.filter(Data => Data.data === this.register.ssu.cardInfo.address.province);
        }
    }

    public checkSSUAddressProvince() {
        if (!isNullOrUndefined(this.register.ssu.current.address.province)) {
            this.ActiveNow = this.dataList.filter(Data => Data.data === this.register.ssu.current.address.province);
        }
    }

    public getDistrict(ref_id, onSet) {
        const that = this;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.DISTRICT_CODE;
            that.dataList[index]['data'] = list.DISTRICT_TH;
        });
        this.resetActive();

        switch (ref_id) {
            case "ssu_district":
                this.checkSSUDistrict();
                break;
            case "ssu_address_district":
                this.checkSSUAddressDistrict();
                break;
            case "ssu_address_office_district":
                if (!isNullOrUndefined(this.register.ssu.office.address.district)) {
                    this.ActiveNow = this.dataList.filter(data => data.data === this.register.ssu.office.address.district);
                }
                break;
            case "subscription_district":
                if (!isNullOrUndefined(this.register.subscription.address.district)) {
                    this.ActiveNow = this.dataList.filter(data => data.data === this.register.subscription.address.district);
                }
                break;
            case "subscription_district_id":
                if (!isNullOrUndefined(this.register.subscription.address.district)) {
                    const data = this.dataList.filter(dataItem => dataItem.data === this.register.subscription.address.district);
                    this.register.subscription.address.districtId = data['0'].DISTRICT_CODE;
                    this.getCustAddressListByValue(this.register.subscription.address.province, this.register.subscription.address.district, "province_district", 'subscription_locality_id', false);
                }
                break;

        }
    }

    public checkSSUDistrict() {
        if (!isNullOrUndefined(this.register.ssu.cardInfo.address.district)) {
            this.ActiveNow = this.dataList.filter(data => data.data === this.register.ssu.cardInfo.address.district);
        }
    }

    public checkSSUAddressDistrict() {
        if (!isNullOrUndefined(this.register.ssu.current.address.district)) {
            this.ActiveNow = this.dataList.filter(data => data.data === this.register.ssu.current.address.district);
        }
    }

    public getLocality(ref_id, onSet) {
        const that = this;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.SUB_DISTRICT_CODE;
            that.dataList[index]['data'] = list.SUB_DISTRICT_TH;
        });
        this.resetActive();
        switch (ref_id) {
            case "ssu_locality":
                this.checkSSULocality();
                break;
            case "ssu_address_locality":
                this.checkSSUAddressLocality();
                break;
            case "ssu_address_office_district":
                if (!isNullOrUndefined(this.register.ssu.office.address.locality)) {
                    this.ActiveNow = this.dataList.filter(Data => Data.data === this.register.ssu.office.address.locality);
                }
                break;
            case "subscription_locality":
                if (!isNullOrUndefined(this.register.subscription.address.locality)) {
                    this.ActiveNow = this.dataList.filter(Data => Data.data === this.register.subscription.address.locality);
                }
                break;
            case "subscription_locality_id":
                if (!isNullOrUndefined(this.register.subscription.address.locality)) {
                    const data = this.dataList.filter(Data => Data.data === this.register.subscription.address.locality);
                    this.register.subscription.address.localityId = data['0'].SUB_DISTRICT_CODE;
                    this.GetDummyAccountNo();
                }
                break;

        }
    }

    public checkSSULocality() {
        if (!isNullOrUndefined(this.register.ssu.cardInfo.address.locality)) {
            this.ActiveNow = this.dataList.filter(Data => Data.data === this.register.ssu.cardInfo.address.locality);
        }
    }

    public checkSSUAddressLocality() {
        if (!isNullOrUndefined(this.register.ssu.current.address.locality)) {
            this.ActiveNow = this.dataList.filter(Data => Data.data === this.register.ssu.current.address.locality);
        }
    }

    public getOccupation(ref_id) {
        const that = this;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_VALUE;
            that.dataList[index]['data'] = list.DESC_THAI;
        });
        if (!isNullOrUndefined(this.register.ssu.career.Data)) {
            this.ActiveNow = this.dataList.filter(data => data.data === this.register.ssu.career.Data);
        }
    }

    public getProperty(ref_id) {
        const that = this;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_VALUE;
            that.dataList[index]['data'] = list.DESC_THAI;
        });
        if (!isNullOrUndefined(this.register.ssu.property.Value)) {
            this.ActiveNow = this.dataList.filter(data => data.data === this.register.ssu.property.Value);
        }
    }

    public getbusinessType(ref_id) {
        const that = this;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_VALUE;
            that.dataList[index]['data'] = list.DESC_THAI;
        });

        if (!isNullOrUndefined(this.register.ssu.business.Type)) {
            this.ActiveNow = this.dataList.filter(data => data.data === this.register.ssu.business.Type);
        }
    }

    public getRelation(ref_id) {
        const that = this;
        Utils.logDebug('getRelation', 'this.dataList : ' + JSON.stringify(this.dataList));
        this.register.Realation.realation1 = this.dataList;
        this.register.Realation.realation2 = this.dataList;
    }

    public showHidden(value) {
        switch (value) {
            case 'realation1':
                $('#ssu_relationship1_Hide :input').attr('disabled', false);
                break
            case 'realation2':
                $('#ssu_relationship2_Hide :input').attr('disabled', false);
                break
            case 'ssuFrom_Office_Address':
                $('#ssuFrom_Office_Address :input').attr('disabled', false);
                break
            case 'Subscription_Address':
                $('#Subscription_Address :input').attr('disabled', false);
                break
        }
    }

    public getRelationMarry(value) {
        Utils.logDebug('getRelationMarry', 'start');
        setTimeout(() => {
            if (this.register.ssu.relationship.Data1 === '04' && value === 'Data1') {
                this.register.ssu.relationship.title1.TH = this.register.ssu.spouse.title.TH;
                this.register.ssu.relationship.title1.TH_Id = this.register.ssu.spouse.title.TH_Id;
                this.register.ssu.relationship.name1.TH = this.register.ssu.spouse.name.TH;
                this.register.ssu.relationship.surname1.TH = this.register.ssu.spouse.surname.TH;
                this.register.ssu.relationship.gender1.data = this.register.ssu.spouse.gender.data;
                this.register.ssu.relationship.gender1.value = this.register.ssu.spouse.gender.value;
                this.relationship1GenderShowInput = true;
                Utils.logDebug('getRelationMarry', 'this.register.ssu.relationship.gender1 : ' + this.register.ssu.relationship.gender1);
            } else if (this.register.ssu.relationship.Data1 !== '04' && value === 'Data1') {
                this.register.ssu.relationship.title1.TH = "";
                this.register.ssu.relationship.title1.TH_Id = "";
                this.register.ssu.relationship.name1.TH = "";
                this.register.ssu.relationship.surname1.TH = "";
                this.register.ssu.relationship.gender1 = new Gender();
                this.relationship1GenderShowInput = false;
            }

            if (this.register.ssu.relationship.Data2 === '04' && value === 'Data2') {
                this.register.ssu.relationship.title2.TH = this.register.ssu.spouse.title.TH;
                this.register.ssu.relationship.title2.TH_Id = this.register.ssu.spouse.title.TH_Id;
                this.register.ssu.relationship.name2.TH = this.register.ssu.spouse.name.TH;
                this.register.ssu.relationship.surname2.TH = this.register.ssu.spouse.surname.TH;
                this.register.ssu.relationship.gender2.data = this.register.ssu.spouse.gender.data;
                this.register.ssu.relationship.gender2.value = this.register.ssu.spouse.gender.value;
                this.relationship2GenderShowInput = true;
            } else if (this.register.ssu.relationship.Data2 !== '04' && value === 'Data2') {
                this.register.ssu.relationship.title2.TH = "";
                this.register.ssu.relationship.title2.TH_Id = "";
                this.register.ssu.relationship.name2.TH = "";
                this.register.ssu.relationship.surname2.TH = "";
                this.register.ssu.relationship.gender2 = new Gender();
                this.relationship2GenderShowInput = false;
            }
        }, 500);

    }

    public getmaritalStatus(ref_id) {
        const that = this;
        Utils.logDebug('getmaritalStatus', 'this.dataList : ' + JSON.stringify(this.dataList));
        this.dataList.forEach(function (list) {

            // const id = list.REF_ID;
            // if (id === 105) {
            //     that.List_mar[0] = list;
            // }
            // if (id === 106) {
            //     that.List_mar[1] = list;
            // }
            // if (id === 108) {
            //     that.List_mar[2] = list;
            // }
            // if (id === 107) {
            //     that.List_mar[3] = list;
            // }
        });
        this.marital = this.dataList;
        Utils.logDebug('getmaritalStatus', 'this.marital : ' + JSON.stringify(this.marital));
    }

    public getInstruction(ref_id) {
        const that = this;
        this.InstructionList = this.dataList;

        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_ID;
            that.dataList[index]['data'] = list.DESC_THAI;
        });

        if (!isNullOrUndefined(this.register.subscription.account.PMT_COND)) {
            this.ActiveNow = this.dataList.filter(data => data.data === this.register.subscription.account.PMT_COND);
        }
    }

    public getPurpost(ref_id) {
        const that = this;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_VALUE;
            that.dataList[index]['data'] = list.DESC_THAI;
        });

        if (!isNullOrUndefined(this.register.subscription.account.OBJ.Data)) {
            this.ActiveNow = this.dataList.filter(data => data.data === this.register.subscription.account.OBJ.Data);
        }
    }

    public onSetThai() {
        this.register.ssu.Contryincome.Desc = '';
        this.register.ssu.Contryincome.Value = this.ContryincomeTH;
    }

    public checkExistingCustomerAndSanctionList() {
        Utils.logDebug('checkExistingCustomerAndSanctionList', 'start');
        // const YearNow = moment();
        const cardexpireDate_Data = this.register.ssu.cardInfo.expireDate.day + "/" + Utils.getMonthShottoNumber(this.register.ssu.cardInfo.expireDate.mounth) + "/" + Utils.getMinusYearEn(this.register.ssu.cardInfo.expireDate.year);
        const cardexpireDate = moment(cardexpireDate_Data, 'DD/MM/YYYY');
        Utils.logDebug('checkExistingCustomerAndSanctionList', 'this.register.ssu.cardInfo.expireDate : ' + this.register.ssu.cardInfo.expireDate);
        Utils.logDebug('checkExistingCustomerAndSanctionList', 'this.register.ssu.cardInfo.birthdate : ' + this.register.ssu.cardInfo.birthdate);
        Utils.logDebug('checkExistingCustomerAndSanctionList', 'this.register.ssu.cardInfo.issueDate : ' + this.register.ssu.cardInfo.issueDate);
        //const checkExpireCard = YearNow.diff((cardexpireDate).startOf('day'), 'days');
        const checkExpireCard = moment(cardexpireDate).startOf('day').diff(moment(Date.now()).startOf('day'), 'days');
        Utils.logDebug('checkExistingCustomerAndSanctionList', 'checkExpireCard : ' + checkExpireCard);
        if (checkExpireCard < 0) { //expired case
            this.ModalShow = true;
            this.Modal_image = "./assets/kiatnakin/image/card13.png";
            this.Modal_text = "บัตรของท่านหมดอายุ ไม่สามารถทำรายการได้";
            this.onClickShowModal();
        } else { // valid case
            Utils.logDebug('checkExistingCustomerAndSanctionList', 'getTitleList');
            this.getTitleList('title', 'ssu_titleTH', false);
            Modal.showProgress();
            this.accountService.checkExistingCustomerAndSanctionList(
                this.register.ssu.cardInfo.idCardNumber.toString(),
                this.register.chipNo, this.register.requestNo, this.register.birthdate,
                this.register.ssu.cardInfo.idType,
                this.register.ssu.cardInfo.nameTH, this.register.ssu.cardInfo.surnameTH)
                .subscribe(
                    data => {
                        console.log('SubscriptionAccountComponent --- bass checkExistingCustomerAndSanctionList data ->', data)
                        const getData = data.data;
                        this.customerSSU = !isNullOrUndefined(getData.SSU) ? getData.SSU : 'N';
                        this.customerExist = data.data.customerExist;
                        const SanctionListLevel = getData.SanctionListLevel;
                        this.register.sanction_list = data.data.OutrightRejectFlag;

                        if (this.register.sanction_list === 'Y') { // invalid case
                            Modal.hide();
                            //this.dataError();
                            this.showMessageSanctionReject();
                        } else { // valid case
                            if (isNullOrUndefined(this.register.subscription.account.ACCOUNT_NAME) || this.register.subscription.account.ACCOUNT_NAME === '') {
                                this.register.subscription.account.ACCOUNT_NAME = this.register.ssu.cardInfo.titleTH + ' ' + this.register.ssu.cardInfo.nameTH + ' ' + this.register.ssu.cardInfo.surnameTH;
                            }

                            Utils.logDebug('checkExistingCustomerAndSanctionList', 'this.register.subscription.account.ACCOUNT_NAME : ' + this.register.subscription.account.ACCOUNT_NAME);
                            Utils.logDebug('checkExistingCustomerAndSanctionList', 'this.customerExist : ' + this.customerExist);
                            if (this.customerExist === true) {
                                if (this.customerSSU === 'N') { // invalid case
                                    Modal.hide();
                                    this.updateInfo = true;
                                    Utils.logDebug('checkExistingCustomerAndSanctionList', 'onShowRespondMessage');
                                    this.Modal_image = "./assets/kiatnakin/image/read_false.png";
                                    this.Modal_text = "ขออภัยท่านไม่สามารถทำรายการได้ กรุณาติดต่อเจ้าหน้าที่";
                                    this.ModalShow = true;
                                    this.onClickShowModal();
                                } else { // valid case
                                    Utils.logDebug('checkExistingCustomerAndSanctionList', 'CustomerExisting');
                                    console.log('basssssssssssssssssss getData ->', getData);
                                    console.log('basssssssssssssssssss this.updateCustomer ->', this.updateCustomer);
                                    this.CustomerExisting(getData, this.updateCustomer);
                                    this.checkTitleActive = true;
                                    if (this.type !== 'SubSer') {
                                        if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeSaving
                                            || this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeCurrent) {
                                            this.isCASA = true;
                                        } else {
                                            this.isCASA = false;
                                        }
                                    }
                                }
                            } else { // valid case
                                //Modal.hide();
                                Utils.logDebug('checkExistingCustomerAndSanctionList', 'NoneExisting');
                                this.NoneExisting(getData);
                                if (this.type !== 'SubSer') {
                                    if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeSaving
                                        || this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeCurrent) {
                                        this.isCASA = true;
                                    } else {
                                        this.isCASA = false;
                                    }
                                }
                            }
                        }
                    }
                    , Error => {
                        Modal.hide();
                        Modal.showAlertWithOk(Error.responseStatus.responseMessage, () => {
                            this.router.navigate(["/kk"]);
                        });
                    }
                );
        }
    }

    public CustomerExisting(data, updateCustomer) {
        Utils.logDebug('CustomerExisting', 'start');
        Utils.logDebug('CustomerExisting', 'this.register : ' + JSON.stringify(this.register));
        // Utils.logDebug('CustomerExisting', 'data : ' + JSON.stringify(data));
        console.log('CustomerExisting --- bass data ->', data);
        Utils.logDebug('CustomerExisting', 'updateCustomer : ' + updateCustomer);
        Utils.logDebug('CustomerExisting', 'this.customerSSU : ' + this.customerSSU);
        const value = data.profileMain.CUSTPROFILEMAINSUB_LIST.CUSTPROFILEMAIN_INFO;
        if (this.customerSSU === 'N') {
            this.register.ssu.current.contact.email = value.EMAIL;
            this.register.ssu.current.contact.moblie_phone = value.MOBILE_NO;
            this.register.ssu.current.contact.home_phone = value.HOME_TEL_NO;
            this.register.ssu.current.contact.fax_phone = value.FAX_NO;
        }

        // find address seq from address type mailing
        const addrSeqForSaveSub = data.subAddress.address_info_detail;
        const contactList = data.subAddress.contact_info_detail;
        const addSeq = addrSeqForSaveSub.filter(Value => {
            return Value.Address_Type_Code === AppConstant.AddressTypeMailing
        });
        Utils.logDebug('CustomerExisting', 'addSeq : ' + JSON.stringify(addSeq));
        if (!isNullOrUndefined(contactList) && contactList.length > 0) {
            // find last seq of mail
            const lastEmail = contactList
                .filter(x => x.CONTACT_CODE === AppConstant.ContactTypeEmailCode)
                .sort(function (a, b) {
                    return b.SEQ - a.SEQ;
                })[0];
            this.register.ssu.contact.EMAIL_SEQ = lastEmail.SEQ;
            this.register.ssu.contact.EMAIL = lastEmail.CONTACT_DETAIL
            this.register.subscriptionService.contact.email = lastEmail.CONTACT_DETAIL;
            this.register.subscription.contact.email = lastEmail.CONTACT_DETAIL;

            // find last seq of mobile
            const lastMobile = contactList
                .filter(x => x.CONTACT_CODE === AppConstant.ContactTypeMobileCode)
                .sort(function (a, b) {
                    return b.SEQ - a.SEQ;
                })[0];
            this.register.ssu.contact.MOBILE_NO_SEQ = lastMobile.SEQ;
            this.register.ssu.contact.MOBILE_NO = lastMobile.CONTACT_DETAIL;
            this.register.subscriptionService.contact.moblie_phone = lastMobile.CONTACT_DETAIL;
            this.register.subscription.contact.moblie_phone = lastMobile.CONTACT_DETAIL;
            const homePhone = contactList.filter(x => x.CONTACT_CODE === AppConstant.ContactTypeHomePhoneCode);
            if (isNullOrUndefined(homePhone) || homePhone.length <= 0) {
                this.register.ssu.current.contact.home_phone = '';
            } else {
                this.register.ssu.current.contact.home_phone = homePhone[0].CONTACT_DETAIL;
            }
            const fax = contactList.filter(x => x.CONTACT_CODE === AppConstant.ContactTypeFaxCode);
            if (isNullOrUndefined(fax) || fax.length <= 0) {
                this.register.ssu.current.contact.fax_phone = '';
            } else {
                this.register.ssu.current.contact.fax_phone = fax[0].CONTACT_DETAIL;
            }
            const workPhone = contactList.filter(x => x.CONTACT_CODE === AppConstant.ContactTypeWorkPhoneCode);
            if (isNullOrUndefined(workPhone) || workPhone.length <= 0) {
                this.register.ssu.current.contact.office_phone = '';
            } else {
                this.register.ssu.office.contact.office_phone = workPhone[0].CONTACT_DETAIL;
            }
        } else {
            this.register.ssu.contact.EMAIL_SEQ = value.EMAIL_SEQ;
            this.register.ssu.contact.EMAIL = value.EMAIL
            this.register.ssu.contact.MOBILE_NO_SEQ = value.MOBILE_NO_SEQ;
            this.register.ssu.contact.MOBILE_NO = value.MOBILE_NO;

            this.register.subscriptionService.contact.email = Utils.checkEmptyValue(value.EMAIL);
            this.register.subscriptionService.contact.moblie_phone = Utils.checkEmptyValue(value.MOBILE_NO);
            this.register.subscription.contact.email = Utils.checkEmptyValue(value.EMAIL);
            this.register.subscription.contact.moblie_phone = Utils.checkEmptyValue(value.MOBILE_NO);
        }
        this.register.ssu.cardInfo.address.seq = addSeq.ADDRESS_SEQ;
        this.register.ssu.contact.FAX_NO_SEQ = value.FAX_NO_SEQ;
        this.register.ssu.contact.FAX_NO = value.FAX_NO;
        this.register.ssu.contact.HOME_TEL_NO_SEQ = value.HOME_TEL_NO_SEQ;
        this.register.ssu.contact.HOME_TEL_NO = value.HOME_TEL_NO;

        this.register.subscriptionService.contact.home_phone = Utils.checkEmptyValue(value.HOME_TEL_NO);
        this.register.subscription.contact.home_phone = Utils.checkEmptyValue(value.HOME_TEL_NO);

        this.register.subscriptionService.contact.fax_phone = Utils.checkEmptyValue(value.FAX_NO);
        this.register.subscription.contact.fax_phone = Utils.checkEmptyValue(value.FAX_NO);
        this.register.ssu.kyc.Select = value.KYC_KKB;

        this.register.haveFD = data.subAddress.haveFD ? data.subAddress.haveFD : 'N';
        // this.register.haveFD = 'N'; // fix ค่าส่ง N ไปก่อน
        if (!isNullOrUndefined(data.cusAddress.Address_info_list['InquiryCustomerAddressOutputModel.ADDRESS_INFO'])) {
            this.mapAddressSubAddresstoPageSub(data.cusAddress.Address_info_list['InquiryCustomerAddressOutputModel.ADDRESS_INFO']);
        }
        if (this.register.haveFD === 'Y') {

            Modal.showProgress();
            Utils.logDebug('CustomerExisting', 'checkInternetBankingAndPin');
            this.accountService.checkInternetBankingAndPin(this.register.ssu.cardInfo.idCardNumber.toString(), AppConstant.IdType)
                .subscribe(
                    internet => {

                        const internetbanking = !isNullOrUndefined(internet.data) ? internet.data : '';
                        this.register.haveIB = internetbanking.haveIB;
                        this.register.haveIVR = internetbanking.haveIVR;
                        this.register.haveMyPin = internetbanking.haveMyPin;
                        if (!isNullOrUndefined(internetbanking.haveSMS)) {
                            this.register.haveSMS = internetbanking.haveSMS.length > 0 ? internetbanking.haveSMS : [];
                        } else {
                            this.register.haveSMS = [];
                        }
                        if (this.type === 'SubSer' && this.dataService.selectedProduct.PROD_TYPE === 'eBanking') {
                            if (this.register.haveIB === 'Y' && this.register.haveMyPin === 'Y') {
                                Modal.hide();
                                this.Modal_image = "./assets/kiatnakin/image/read_false.png";
                                this.Modal_text = "ไม่สามารถทำรายการได้ เนื่องจากท่านได้ทำการสมัคร eBanking เรียบร้อยแล้ว";
                                this.ModalShow = true;
                                this.onClickShowModal();
                            } else {
                                Utils.logDebug('CustomerExisting', 'checkSameCustomer 1');
                                this.checkSameCustomer(data);
                            }
                        } else {
                            Utils.logDebug('CustomerExisting', 'checkSameCustomer 2');
                            this.checkSameCustomer(data);
                        }
                        //Modal.hide();
                    },
                    Error => {
                        Modal.hide();
                        Modal.showAlertWithOk(Error.responseStatus.responseMessage, () => {
                            this.router.navigate(["/kk"]);
                        });
                    }
                )
        } else {
            this.register.haveFD = 'N';
            this.register.haveIB = 'N';
            this.register.haveIVR = 'N';
            this.register.haveMyPin = 'N';
            this.register.haveSMS = [];
            Utils.logDebug('CustomerExisting', 'checkSameCustomer 3');
            this.checkSameCustomer(data);
        }
        this.register.haveFD = 'Y';
    }

    public checkSameCustomer(dataAddress) {
        Utils.logDebug('checkSameCustomer', 'start');
        Utils.logDebug('checkSameCustomer', 'dataAddress : ' + dataAddress);
        Utils.logDebug('checkSameCustomer', 'getCustomerProfileMain');
        this.accountService.getCustomerProfileMain(this.register.ssu.cardInfo.idCardNumber.toString(), AppConstant.IdType)
            .subscribe(
                dataInfo => {
                    this.mapCustomerInfo(dataInfo, dataAddress);
                }, Error => {
                    Modal.hide();
                    Modal.showAlertWithOk(Error.responseStatus.responseMessage, () => {
                        this.router.navigate(["/kk"]);
                    });
                }
            );
    }

    public mapCustomerInfo(dataInfo, dataAddress) {
        Utils.logDebug('mapCustomerInfo', 'start');
        Utils.logDebug('mapCustomerInfo', 'dataInfo : ' + JSON.stringify(dataInfo));
        const Info = dataInfo.data.CUSTPROFILEMAINSUB_LIST.CUSTPROFILEMAIN_INFO;
        if (Info.SURNAME_TH !== this.register.ssu.cardInfo.surnameTH ||
            Info.FIRSTNAME_TH !== this.register.ssu.cardInfo.nameTH ||
            Info.SURNAME_EN.toUpperCase() !== this.register.ssu.cardInfo.surnameEN.toUpperCase() ||
            Info.FIRSTNAME_EN.toUpperCase() !== this.register.ssu.cardInfo.nameEN.toUpperCase()) {
            Modal.hide();
            this.ModalCallTeller();
        } else {
            this.register.ssu.cardInfo.titleTH = Info.TITLE_TH;
            this.register.ssu.cardInfo.titleEN = Info.TITLE_EN;
            Utils.logDebug('mapCustomerInfo', 'checkSameAddress');
            this.checkSameAddress(dataAddress);
        }
    }

    public ModalCallTeller() {
        this.Modal_image = "./assets/kiatnakin/image/card13.png";
        this.Modal_text = "ข้อมูลจากบัตรของท่านไม่ตรงกับที่ได้แจ้งไว้กับธนาคาร";
        this.Modal_text2 = "กรุณาติดต่อเจ้าหน้าที่เพื่อปรับข้อมูล";
        this.ModalShow = true;
        this.onClickShowModal();
    }

    public async checkSameAddress(dataAddress) {
        Utils.logDebug('checkSameAddress', 'dataAddress : ' + JSON.stringify(dataAddress));
        let value = dataAddress.cusAddress.Address_info_list['InquiryCustomerAddressOutputModel.ADDRESS_INFO'];
        if (Array.isArray(value) === false) {
            value = [value];
        }

        const customerInfo = value.filter(Value => {
            return Value.ADDRESS_TYPE === AppConstant.AddressTypeRegister
        });
        const currentInfo = value.filter(Value => {
            return Value.ADDRESS_TYPE === AppConstant.AddressTypeMailing
        });
        const officeInfo = value.filter(Value => {
            return Value.ADDRESS_TYPE === AppConstant.AddressTypeOffice
        });

        Utils.logDebug('checkSameAddress', 'value.length : ' + value.length);
        Utils.logDebug('checkSameAddress', 'customerInfo.length : ' + customerInfo.length);
        if (value.length >= 3 && customerInfo.length > 0) {
            await this.mapAddressid13(customerInfo.length > 0 ? customerInfo[0] : []);
            this.mapAddressCurrentAddress(currentInfo.length > 0 ? currentInfo[0] : []);
            this.mapAddressOfficeAddress(officeInfo.length > 0 ? officeInfo[0] : []);

            Utils.logDebug('checkSameAddress', 'this.AddressSameOld : ' + this.AddressSameOld);
            Utils.logDebug('checkSameAddress', 'this.addSame : ' + this.addSame);
            if (this.register.ssu.cardInfo.idType !== AppConstant.IdType && this.AddressSameOld === false && this.addSame === true) {
                this.checkReadCard();
            }

            Modal.hide();
        } else {
            Utils.logDebug('checkSameAddress', 'dataError');
            Modal.hide();
            this.dataError();
        }
    }

    public dataError() {
        this.Modal_image = "./assets/kiatnakin/image/read_false.png";
        this.Modal_text = "ข้อมูลของท่านไม่สมบูรณ์ กรุณาติดต่อเจ้าหน้าที่เพื่อปรับข้อมูล";
        this.ModalShow = true;
        this.onClickShowModal();
    }

    public showMessageSanctionReject() {
        this.Modal_image = "./assets/kiatnakin/image/read_false.png";
        this.Modal_text = "ขออภัยท่านไม่สามารถทำรายการได้ กรุณาติดต่อเจ้าหน้าที่";
        this.ModalShow = true;
        this.onClickShowModal();
    }

    public async NoneExisting(data) {
        Utils.logDebug('NoneExisting', 'start');
        this.customerExist = false;
        this.register.sanction_list = data.OutrightRejectFlag ? data.OutrightRejectFlag : 'N';
        this.register.haveFD = 'N';
        this.register.haveIB = 'N';
        this.register.haveIVR = 'N';
        this.register.haveMyPin = 'N';

        try {
            Utils.logDebug('NoneExisting', 'getTitleList');
            const responseTitle = await this.getTitleList('title', 'ssu_titleTH', false);
            Utils.logDebug('NoneExisting', 'getConfigList 1');
            const responseConfigNationality = await this.getConfigList('nationality', 'ssu_nation', false);
            Utils.logDebug('NoneExisting', 'getConfigList 2');
            const responseConfigCountry = await this.getConfigList('country', 'ssu_country', false);
            Utils.logDebug('NoneExisting', 'getCustAddressListByValue');
            const responseCustAddressList = await this.getCustAddressListByValue(this.register.ssu.cardInfo.address.district, this.register.ssu.cardInfo.address.locality, "district_subdistrict", "ssu_locality", false);

        } catch (e) {
            if (!isNullOrUndefined(e) && e.length > 0) {
                Modal.showAlert(e)
            }
            return;
        }

        if (this.type === 'SubSer') {
            Modal.showAlertWithOk(Th.CUSTOMER_DIDNOT_HAVE_BANKACCOUNT, () => {
                this.router.navigate(["/kk"]);
            });
        }

        if (this.register.ssu.cardInfo.idType !== AppConstant.IdType && this.type !== 'SubSer') {
            // this.checkConfigProduct();
            Utils.logDebug('NoneExisting', 'verifyidcard');
            this.verifyidcard();
        }
    }

    public filterCoutry(country_code) {
        Utils.logDebug('filterCoutry', 'start');
        Utils.logDebug('filterCoutry', 'country_code : ' + country_code);
        let CountryValue = "";
        if (!isNullOrUndefined(country_code) || country_code !== '') {
            this.transactionService.GetConfigList('country')
                .subscribe(
                    data => {
                        const CountryList = data.data;
                        const CounrtyInfo = CountryList.filter(value => {
                            return value.REF_VALUE === country_code
                        });
                        Utils.logDebug('filterContry', 'CounrtyInfo : ' + JSON.stringify(CounrtyInfo));
                        CountryValue = CounrtyInfo[0].DESC_THAI;
                    },
                    ERROR => {
                        return ERROR
                    }
                )
            Utils.logDebug('filterCoutry', 'return CountryValue : ' + CountryValue);
            return CountryValue
        } else {
            Utils.logDebug('filterCoutry', 'dataError');
            this.dataError();
        }
    }

    public async filterCoutry2(country_code) {
        Utils.logDebug('filterCoutry2', 'start');
        Utils.logDebug('filterCoutry2', 'country_code : ' + country_code);
        let CountryValue = "";
        if (!isNullOrUndefined(country_code) || country_code !== '') {
            return new Promise((resolve, reject) => {
                this.transactionService.GetConfigList('country').subscribe(
                    data => {
                        const CountryList = data.data;
                        const CounrtyInfo = CountryList.filter(value => {
                            return value.REF_VALUE === country_code
                        });
                        Utils.logDebug('filterContry2', 'CounrtyInfo : ' + JSON.stringify(CounrtyInfo));
                        CountryValue = CounrtyInfo[0].DESC_THAI;
                        return resolve(CountryValue);
                    },
                    ERROR => {
                        return reject(ERROR);
                    }
                )
            })
        } else {
            Utils.logDebug('filterCoutry2', 'dataError');
            this.dataError();
        }
    }

    public mapAddressCardInfoAddress(address) {

        this.register.ssu.cardInfo.address.seq = address.ADDRESS_SEQ ? address.ADDRESS_SEQ : 0;
        this.register.ssu.cardInfo.address.no = Utils.checkEmptyValue(address.ADDRESS_NUMBER);
        this.register.ssu.cardInfo.address.moo = Utils.checkEmptyValue(address.Moo);
        this.register.ssu.cardInfo.address.floor = Utils.checkEmptyValue(address.FLOOR);
        this.register.ssu.cardInfo.address.tower = Utils.checkEmptyValue(address.Building);
        this.register.ssu.cardInfo.address.alley = Utils.checkEmptyValue(address.Soi);
        this.register.ssu.cardInfo.address.village = Utils.checkEmptyValue(address.Village);
        this.register.ssu.cardInfo.address.street = Utils.checkEmptyValue(address.Street);
        this.register.ssu.cardInfo.address.country = Utils.checkEmptyValue(address.Country);
        this.register.ssu.cardInfo.address.countryId = Utils.checkEmptyValue(address.Country_Code);
        this.register.ssu.cardInfo.address.province = Utils.checkEmptyValue(address.Province_Name);
        this.register.ssu.cardInfo.address.provinceId = Utils.checkEmptyValue(address.Province_Code);
        this.register.ssu.cardInfo.address.district = Utils.checkEmptyValue(address.DISTRICT_NAME);
        this.register.ssu.cardInfo.address.districtId = Utils.checkEmptyValue(address.DISTRICT_CODE);
        this.register.ssu.cardInfo.address.locality = Utils.checkEmptyValue(address.Sub_District_Name);
        this.register.ssu.cardInfo.address.localityId = Utils.checkEmptyValue(address.Sub_District_Code);
        this.register.ssu.cardInfo.address.postcode = Utils.checkEmptyValue(address.Postal_Code);
    }

    public async mapAddressCurrentAddress(address) {
        Utils.logDebug('mapAddressCurrentAddress', 'start');
        Utils.logDebug('mapAddressCurrentAddress', 'address : ' + JSON.stringify(address));
        let COUNTRY = null;
        if (!isNullOrUndefined(address)) {
            if (!isNullOrUndefined(address.COUNTRY_CODE)) {
                if (address.COUNTRY_CODE === AppConstant.COUNTRY_TH) {
                    COUNTRY = 'ไทย';
                } else {
                    COUNTRY = await this.filterCoutry2(address.COUNTRY_CODE);
                    Utils.logDebug('mapAddressCurrentAddress', ' ====> COUNTRY : ' + JSON.stringify(COUNTRY));
                }
            }
            if (address.Country === '' && address.Province_Name === ''
                || address.DISTRICT_NAME === '' || address.Sub_District_Name === ''
                || address.Postal_Code === '') {
                Modal.showAlertWithOk('ข้อมูลเกิดข้อผิดพลาด กรุณาติดต่อพนักงาน', () => {
                    this.router.navigate(["/kk"]);
                });
            }
            this.register.ssu.current.address.seq = Utils.checkEmptyValue(address.ADDRESS_SEQ);
            this.register.ssu.current.address.no = Utils.checkEmptyValue(address.ADDRESS_NUMBER);
            this.register.ssu.current.address.moo = Utils.checkEmptyValue(address.MOO);
            this.register.ssu.current.address.floor = Utils.checkEmptyValue(address.FLOOR);
            this.register.ssu.current.address.tower = Utils.checkEmptyValue(address.TOWER);
            this.register.ssu.current.address.alley = Utils.checkEmptyValue(address.SOI);
            this.register.ssu.current.address.village = Utils.checkEmptyValue(address.VILLAGE);
            this.register.ssu.current.address.street = Utils.checkEmptyValue(address.STREET);
            this.register.ssu.current.address.country = Utils.checkEmptyValue(COUNTRY);
            this.register.ssu.current.address.province = Utils.checkEmptyValue(address.PROVINCE_NAME);
            this.register.ssu.current.address.district = Utils.checkEmptyValue(address.DISTRICT_NAME);
            this.register.ssu.current.address.locality = Utils.checkEmptyValue(address.SUB_DISTRICT_NAME);
            this.register.ssu.current.address.postcode = Utils.checkEmptyValue(address.POSTAL_CODE);
        }
    }

    public async mapAddressid13(address) {
        Utils.logDebug('mapAddressid13', 'start');
        return new Promise((resolve) => {
            let COUNTRY = null;
            if (!isNullOrUndefined(address)) {
                if (!isNullOrUndefined(address.COUNTRY_CODE)) {
                    if (address.COUNTRY_CODE === AppConstant.COUNTRY_TH) {
                        COUNTRY = 'ไทย';
                    } else {
                        COUNTRY = this.filterCoutry2(address.COUNTRY_CODE);
                        Utils.logDebug('mapAddressid13', 'COUNTRY : ' + COUNTRY);
                    }
                }
                if (this.checkAddress(address)) {
                    Modal.showAlertWithOk('ข้อมูลเกิดข้อผิดพลาด กรุณาติดต่อพนักงาน', () => {
                        this.router.navigate(["/kk"]);
                    });
                }

                this.register.temp.cardInfo.address.seq = Utils.checkEmptyValue(address.ADDRESS_SEQ);
                this.register.temp.cardInfo.address.no = Utils.checkEmptyValue(address.ADDRESS_NUMBER);
                this.register.temp.cardInfo.address.moo = Utils.checkEmptyValue(address.MOO);
                this.register.temp.cardInfo.address.floor = Utils.checkEmptyValue(address.FLOOR);
                this.register.temp.cardInfo.address.tower = Utils.checkEmptyValue(address.BUILDING);
                this.register.temp.cardInfo.address.alley = Utils.checkEmptyValue(address.SOI);
                this.register.temp.cardInfo.address.village = Utils.checkEmptyValue(address.VILLAGE);
                this.register.temp.cardInfo.address.street = Utils.checkEmptyValue(address.STREET);
                this.register.temp.cardInfo.address.country = Utils.checkEmptyValue(COUNTRY);
                this.register.temp.cardInfo.address.province = Utils.checkEmptyValue(address.PROVINCE_NAME);
                this.register.temp.cardInfo.address.district = Utils.checkEmptyValue(address.DISTRICT_NAME);
                this.register.temp.cardInfo.address.locality = Utils.checkEmptyValue(address.SUB_DISTRICT_NAME);
                this.register.temp.cardInfo.address.postcode = Utils.checkEmptyValue(address.POSTAL_CODE);

                Utils.logDebug('mapAddressid13', 'this.register.ssu.cardInfo.address : ' + JSON.stringify(this.register.ssu.cardInfo.address));
                Utils.logDebug('mapAddressid13', 'this.register.temp.cardInfo.address : ' + JSON.stringify(this.register.temp.cardInfo.address));
                if (this.checkAddressDuplicate()) {
                    this.MyPINerror = false;
                    this.progressModalFails = false;
                    this.otp = false;
                    this.mypin = false;
                    Utils.logDebug('mapAddressid13', 'ModalCallTeller');
                    Modal.hide();
                    this.ModalCallTeller();
                }
                else {
                    if (this.checkAddressEmpty(address, COUNTRY)) {
                        Modal.showAlertWithOk('ข้อมูลเกิดข้อผิดพลาด กรุณาติดต่อพนักงาน', () => {
                            this.router.navigate(["/kk"]);
                        });
                    }

                    this.register.ssu.cardInfo.address.no = Utils.checkEmptyValue(address.ADDRESS_NUMBER);
                    this.register.ssu.cardInfo.address.moo = Utils.checkEmptyValue(address.MOO);
                    this.register.ssu.cardInfo.address.floor = Utils.checkEmptyValue(address.FLOOR);
                    this.register.ssu.cardInfo.address.tower = Utils.checkEmptyValue(address.BUILDING);
                    this.register.ssu.cardInfo.address.alley = Utils.checkEmptyValue(address.SOI);
                    this.register.ssu.cardInfo.address.village = Utils.checkEmptyValue(address.VILLAGE);
                    this.register.ssu.cardInfo.address.street = Utils.checkEmptyValue(address.STREET);
                    this.register.ssu.cardInfo.address.country = Utils.checkEmptyValue(COUNTRY);
                    this.register.ssu.cardInfo.address.province = Utils.checkEmptyValue(address.PROVINCE_NAME);
                    this.register.ssu.cardInfo.address.district = Utils.checkEmptyValue(address.DISTRICT_NAME);
                    this.register.ssu.cardInfo.address.locality = Utils.checkEmptyValue(address.SUB_DISTRICT_NAME);
                    this.register.ssu.cardInfo.address.postcode = Utils.checkEmptyValue(address.POSTAL_CODE);
                    this.addSame = true;
                }
            }
            resolve();
        });
    }

    public checkAddress(address) {
        if (address.Country === '' && address.Province_Name === ''
            || address.DISTRICT_NAME === '' || address.Sub_District_Name === ''
            || address.Postal_Code === '') {
            return true;
        } else {
            return false;
        }
    }

    public checkAddressDuplicate() {
        if (this.register.temp.cardInfo.address.no !== this.register.ssu.cardInfo.address.no ||
            this.register.temp.cardInfo.address.province !== this.register.ssu.cardInfo.address.province ||
            this.register.temp.cardInfo.address.district !== this.register.ssu.cardInfo.address.district ||
            this.register.temp.cardInfo.address.locality !== this.register.ssu.cardInfo.address.locality) {
            return true;
        }
        else {
            return false;
        }
    }

    public checkAddressEmpty(address, COUNTRY) {
        if (COUNTRY === '' && address.PROVINCE_NAME === ''
            || address.DISTRICT_NAME === '' || address.SUB_DISTRICT_NAME === ''
            || address.POSTAL_CODE === '') {
            return true;
        } else {
            return false;
        }
    }

    public async mapAddressOfficeAddress(address) {
        Utils.logDebug('mapAddressOfficeAddress', 'start');
        Utils.logDebug('mapAddressOfficeAddress', 'address : ' + JSON.stringify(address));
        let COUNTRY = null;
        if (!isNullOrUndefined(address)) {
            if (!isNullOrUndefined(address.COUNTRY_CODE)) {
                if (address.COUNTRY_CODE === AppConstant.COUNTRY_TH) {
                    COUNTRY = 'ไทย';
                } else {
                    COUNTRY = await this.filterCoutry2(address.COUNTRY_CODE);
                    Utils.logDebug('mapAddressOfficeAddress', 'COUNTRY : ' + COUNTRY);
                }
            }
            this.register.ssu.office.address.seq = Utils.checkEmptyValue(address.ADDRESS_SEQ);
            this.register.ssu.office.address.no = Utils.checkEmptyValue(address.ADDRESS_NUMBER);
            this.register.ssu.office.address.moo = Utils.checkEmptyValue(address.MOO);
            this.register.ssu.office.address.floor = Utils.checkEmptyValue(address.FLOOR);
            this.register.ssu.office.address.tower = Utils.checkEmptyValue(address.BUILDING);
            this.register.ssu.office.address.alley = Utils.checkEmptyValue(address.SOI);
            this.register.ssu.office.address.village = Utils.checkEmptyValue(address.VILLAGE);
            this.register.ssu.office.address.street = Utils.checkEmptyValue(address.STREET);
            this.register.ssu.office.address.country = Utils.checkEmptyValue(COUNTRY);
            this.register.ssu.office.address.province = Utils.checkEmptyValue(address.PROVINCE_NAME);
            this.register.ssu.office.address.district = Utils.checkEmptyValue(address.DISTRICT_NAME);
            this.register.ssu.office.address.locality = Utils.checkEmptyValue(address.SUB_DISTRICT_NAME);
            this.register.ssu.office.address.postcode = Utils.checkEmptyValue(address.POSTAL_CODE);
        }
    }

    public async mapAddressSubAddresstoPageSub(valueAddress) {
        Utils.logDebug('mapAddressSubAddresstoPageSub', 'start');
        Utils.logDebug('mapAddressSubAddresstoPageSub', 'valueAddress : ' + JSON.stringify(valueAddress));
        let address: any;

        if (Array.isArray(valueAddress) === false) {
            valueAddress = [valueAddress];
        }
        Utils.logDebug('mapAddressSubAddresstoPageSub', 'valueAddress.length : ' + valueAddress.length);
        if (valueAddress.length >= 3) {

            Utils.logDebug('mapAddressSubAddresstoPageSub', 'address type mailing : ' + JSON.stringify(valueAddress.filter(value => value.ADDRESS_TYPE === AppConstant.AddressTypeMailing)));
            let addressCurrent;
            if (valueAddress.filter(value => value.ADDRESS_TYPE === AppConstant.AddressTypeMailing).length > 1) {
                // get address type mailling sort last address seq
                addressCurrent = valueAddress
                    .filter(value => value.ADDRESS_TYPE === AppConstant.AddressTypeMailing)
                    .sort(function (a, b) {
                        return b.ADDRESS_SEQ - a.ADDRESS_SEQ;
                    })[0];
            } else {
                addressCurrent = valueAddress.filter(value => value.ADDRESS_TYPE === AppConstant.AddressTypeMailing)[0];
            }

            const addressOffice = valueAddress.filter(value => {
                return value.ADDRESS_TYPE === AppConstant.AddressTypeOffice
            });

            /* select index address type mailing for save sub */
            const addrSaveSubIndex = 0;
            Utils.logDebug('mapAddressSubAddresstoPageSub', 'addressCurrent[0] : ' + JSON.stringify(addressCurrent['0']));
            if (addressCurrent.length > 1) {
                Utils.logDebug('mapAddressSubAddresstoPageSub', 'addressCurrent[1] : ' + JSON.stringify(addressCurrent['1']));
            }
            if (!isNullOrUndefined(addressCurrent)) {
                address = addressCurrent;
                let COUNTRY = null;
                if (address.COUNTRY_CODE !== 'ไทย') {
                    //COUNTRY = this.filterCoutry(address.COUNTRY_CODE);
                    COUNTRY = await this.filterCoutry2(address.COUNTRY_CODE);
                    Utils.logDebug('mapAddressSubAddresstoPageSub', 'COUNTRY : ' + COUNTRY);
                }
                this.register.subscription.address.seq = address.ADDRESS_SEQ ? address.ADDRESS_SEQ : 0;
                this.register.subscription.address.no = Utils.checkEmptyValue(address.ADDRESS_NUMBER);
                this.register.subscription.address.moo = Utils.checkEmptyValue(address.MOO);
                this.register.subscription.address.floor = Utils.checkEmptyValue(address.FLOOR);
                this.register.subscription.address.tower = Utils.checkEmptyValue(address.BUILDING);
                this.register.subscription.address.alley = Utils.checkEmptyValue(address.SOI);
                //this.register.subscription.address.village = Utils.checkEmptyValue(address.ROOM);
                this.register.subscription.address.street = Utils.checkEmptyValue(address.STREET);
                this.register.subscription.address.country = Utils.checkEmptyValue(COUNTRY);
                this.register.subscription.address.province = Utils.checkEmptyValue(address.PROVINCE_NAME);
                this.register.subscription.address.district = Utils.checkEmptyValue(address.DISTRICT_NAME);
                this.register.subscription.address.locality = Utils.checkEmptyValue(address.SUB_DISTRICT_NAME);
                this.register.subscription.address.postcode = Utils.checkEmptyValue(address.POSTAL_CODE);
                this.sametrans = true;
                this.register.subscription.current.Type = AppConstant.ProdTypeSaving;

                Utils.logDebug('mapAddressSubAddresstoPageSub', 'this.register.subscription.address : ' + JSON.stringify(this.register.subscription.address));
            }

            if (!isNullOrUndefined(addressOffice['0'])) {
                address = addressOffice['0'];
                let COUNTRY = null;
                if (address.COUNTRY_CODE !== 'ไทย') {
                    //COUNTRY = this.filterCoutry(address.COUNTRY_CODE)
                    COUNTRY = await this.filterCoutry2(address.COUNTRY_CODE);
                    Utils.logDebug('mapAddressSubAddresstoPageSub', 'COUNTRY : ' + COUNTRY);
                }
                this.register.subscription.office.address.seq = address.ADDRESS_SEQ ? address.ADDRESS_SEQ : 0;
                this.register.subscription.office.address.no = Utils.checkEmptyValue(address.ADDRESS_NUMBER);
                this.register.subscription.office.address.moo = Utils.checkEmptyValue(address.MOO);
                this.register.subscription.office.address.floor = Utils.checkEmptyValue(address.FLOOR);
                this.register.subscription.office.address.tower = Utils.checkEmptyValue(address.Building);
                this.register.subscription.office.address.alley = Utils.checkEmptyValue(address.Soi);
                // this.register.subscription.office.address.village = Utils.checkEmptyValue(address.Village);
                this.register.subscription.office.address.street = Utils.checkEmptyValue(address.Street);
                this.register.subscription.office.address.country = Utils.checkEmptyValue(COUNTRY);
                this.register.subscription.office.address.province = Utils.checkEmptyValue(address.PROVINCE_NAME);
                this.register.subscription.office.address.district = Utils.checkEmptyValue(address.DISTRICT_NAME);
                this.register.subscription.office.address.locality = Utils.checkEmptyValue(address.SUB_DISTRICT_NAME);
                this.register.subscription.office.address.postcode = Utils.checkEmptyValue(address.POSTAL_CODE);

                Utils.logDebug('mapAddressSubAddresstoPageSub', 'this.register.subscription.office.address : ' + JSON.stringify(this.register.subscription.office.address));
            }
        } else {
            Utils.logDebug('mapAddressSubAddresstoPageSub', 'dataError');
            this.dataError();
        }
    }

    public resetContryincome() {
        this.register.ssu.Contryincome.Desc = '';
    }

    public CheckIdCard(CardNo) {

        if (CardNo.length === 13) {
            this.setBlueLine('ssu_idcard');
        } else if (CardNo.length >= 1) {
            this.setRedLine('ssu_idcard');
        }
    }

    public CheckPostCode(id, postCode) {
        if (postCode.length === 5) {
            this.setBlueLine(id);
        } else if (postCode.length >= 1) {
            this.setRedLine(id);
        }
    }

    public CheckIdType() {
        Utils.logDebug('CheckIdType', 'start');
        Utils.logDebug('CheckIdType', 'this.register.ssu.cardInfo.idCardNumber : ' + this.register.ssu.cardInfo.idCardNumber);
        let validateNext = true;
        if (!this.checkIdTypeIdCardNumber()) {
            validateNext = false;
            return;
        }
        Utils.logDebug('CheckIdType', 'this.register.ssu.cardInfo.titleTH : ' + this.register.ssu.cardInfo.titleTH);
        if (!this.checkIdTypeTitleTH()) {
            validateNext = false;
            return;
        }
        Utils.logDebug('CheckIdType', 'this.register.ssu.cardInfo.titleEN : ' + this.register.ssu.cardInfo.titleEN);
        if (!this.checkIdTypeTitleEN()) {
            validateNext = false;
            return;
        }

        Utils.logDebug('CheckIdType', 'this.register.ssu.cardInfo.nameTH : ' + this.register.ssu.cardInfo.nameTH);
        if (!this.checkIdTypeNameTH()) {
            validateNext = false;
            return;
        }

        Utils.logDebug('CheckIdType', 'this.register.ssu.cardInfo.nameEN : ' + this.register.ssu.cardInfo.nameEN);
        if (!this.checkIdTypeNameEN()) {
            validateNext = false;
            return;
        }

        Utils.logDebug('CheckIdType', 'this.register.ssu.cardInfo.surnameTH : ' + this.register.ssu.cardInfo.surnameTH);
        if (!this.checkIdTypeSurnameTH()) {
            validateNext = false;
            return;
        }

        Utils.logDebug('CheckIdType', 'this.register.ssu.cardInfo.surnameEN : ' + this.register.ssu.cardInfo.surnameEN);
        if (!this.checkIdTypeSurnameEN()) {
            validateNext = false;
            return;
        }

        if (this.register.ssu.cardInfo.idType === 'N') {

            if (!this.checkIdTypeBirthdateDay()) {
                validateNext = false;
                return;
            }

            if (!this.checkIdTypeBirthdateMonth()) {
                validateNext = false;
                return;
            }

            if (!this.checkIdTypeBirthdateYear()) {
                validateNext = false;
                return;
            }
        }

        if (!this.checkIdTypeGender()) {
            validateNext = false;
            return;
        }

        if (!this.checkIdTypeNation()) {
            validateNext = false;
            return;
        }

        if (!this.checkIdTypeAddressNo()) {
            validateNext = false;
            return;
        }

        if (!this.checkIdTypeAddressCountry()) {
            validateNext = false;
            return;
        }

        if (!this.checkIdTypeAddressProvince()) {
            validateNext = false;
            return;
        }

        if (!this.checkIdTypeAddressDistrict()) {
            validateNext = false;
            return;
        }

        if (!this.checkIdTypeAddressLocality()) {
            validateNext = false;
            return;
        }

        if (!this.checkIdTypeAddressPostcode()) {
            validateNext = false;
            return;
        }

        if (this.register.ssu.cardInfo.idType === 'N' || this.register.ssu.cardInfo.idType === 'E') {

            if (!this.checkIdTypeIssueDateDay()) {
                validateNext = false;
                return;
            }

            if (!this.checkIdTypeIssueDateMonth()) {
                validateNext = false;
                return;
            }

            if (!this.checkIdTypeIssueDateYear()) {
                validateNext = false;
                return;
            }

            if (!this.checkIdTypeExpireDateDay()) {
                validateNext = false;
                return;
            }

            if (!this.checkIdTypeExpireDateMonth()) {
                validateNext = false;
                return;
            }

            if (!this.checkIdTypeExpireDateYear()) {
                validateNext = false;
                return;
            }

            if (!this.checkIdTypeLaserNo()) {
                validateNext = false;
                return;
            }
        }

        if (!validateNext) {
            return;
        }

        if (this.register.ssu.cardInfo.idType !== AppConstant.IdType) {
            $('#submit_CustomerInfo_id').hide();
        }
        Utils.logDebug('CheckIdType', 'idType = ' + this.register.ssu.cardInfo.idType);
        if (this.register.ssu.cardInfo.idType === AppConstant.IdType) {
            if (this.type === 'SubSer' && this.register.haveFD !== 'Y') {
                Modal.showAlertWithOk(Th.CUSTOMER_DIDNOT_HAVE_BANKACCOUNT, () => {
                    this.router.navigate(["/kk"]);
                });
            } else {
                Utils.logDebug('CheckIdType', 'checkBirthDayValidWithProductKK55UP');
                if (this.checkBirthDayValidWithProductKK55UP()) {
                    Utils.logDebug('CheckIdType', 'checkReadCard');
                    this.checkReadCard();
                } else {
                    this.Modal_image = "./assets/kiatnakin/image/card13.png";
                    this.Modal_text = "ขออภัยอายุท่านยังไม่ถึงไม่สามารถสมัครบริการนี้ได้";
                    this.ModalShow = true;
                    Utils.logDebug('checkConfigProduct', 'onClickShowModal');
                    this.onClickShowModal();
                }
            }
        } else {
            Utils.logDebug('CheckIdType', 'checkExistingCustomerAndSanctionList');
            this.checkExistingCustomerAndSanctionList();
        }
    }

    public checkIdTypeIdCardNumber(): boolean {
        if (this.register.ssu.cardInfo.idCardNumber.toString().length !== 13) {
            // if (Utils.validateThaiCitizenID(this.register.ssu.cardInfo.idCardNumber.toString())) {
            Modal.showAlert('กรุณาระบุ รหัสประชาชนให้ถูกต้อง');
            this.setRedLine('ssu_idcard');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeTitleTH(): boolean {
        if (!this.register.ssu.cardInfo.titleTH) {
            Modal.showAlert('กรุณาระบุ คำนำหน้าชื่อ');
            this.setRedLine('titleTH_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeTitleEN(): boolean {
        if (!this.register.ssu.cardInfo.titleEN) {
            Modal.showAlert('กรุณาระบุ คำนำหน้าชื่อ');
            this.setRedLine('titleEN_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeNameTH(): boolean {
        if (this.register.ssu.cardInfo.nameTH === '') {
            Modal.showAlert('กรุณาระบุ ชื่อภาษาไทย');
            this.setRedLine('ssu_nameTH');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeNameEN(): boolean {
        if (this.register.ssu.cardInfo.nameEN === '') {
            Modal.showAlert('กรุณาระบุ ชื่อภาษาอังกฤษ');
            this.setRedLine('ssu_nameEN');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeSurnameTH(): boolean {
        if (this.register.ssu.cardInfo.surnameTH === '') {
            Modal.showAlert('กรุณาระบุ นามสกุลภาษาไทย');
            this.setRedLine('ssu_surnameTH');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeSurnameEN(): boolean {
        if (this.register.ssu.cardInfo.surnameEN === '') {
            Modal.showAlert('กรุณาระบุ นามสกุลภาษาอังกฤษ');
            this.setRedLine('ssu_surnameEN');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeBirthdateDay(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.birthdate.day) || this.register.ssu.cardInfo.birthdate.day === '') {
            Modal.showAlert('กรุณาระบุ วัน ของวันเกิด');
            this.setRedLine('birthdate_day_id');
            this.setWidth('birthdate_day_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeBirthdateMonth(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.birthdate.mounth) || this.register.ssu.cardInfo.birthdate.mounth === '') {
            Modal.showAlert('กรุณาระบุ เดือน ของวันเกิด');
            this.setRedLine('birthdate_month_id');
            this.setWidth('birthdate_month_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeBirthdateYear(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.birthdate.year) || this.register.ssu.cardInfo.birthdate.year === '') {
            Modal.showAlert('กรุณาระบุ ปี ของวันเกิด');
            this.setRedLine('birthdate_year_id');
            this.setWidth('birthdate_year_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeGender(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.gender.value) || this.register.ssu.cardInfo.gender.value === '') {
            Modal.showAlert('กรุณาระบุ เพศ');
            this.setRedLine('gender_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeNation(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.nation) || this.register.ssu.cardInfo.nation === '') {
            Modal.showAlert('กรุณาระบุ สัญชาติ');
            this.setRedLine('ssu_nation_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeAddressNo(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.address.no) || this.register.ssu.cardInfo.address.no === '') {
            Modal.showAlert('กรุณาระบุ เลขที่');
            this.setRedLine('ssu_address_no_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeAddressCountry(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.address.country) || this.register.ssu.cardInfo.address.country === '') {
            Modal.showAlert('กรุณาระบุ ประเทศ');
            this.setRedLine('ssu_address_country');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeAddressProvince(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.address.province) || this.register.ssu.cardInfo.address.province === '') {
            Modal.showAlert('กรุณาระบุ จังหวัด');
            this.setRedLine('ssu_address_province_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeAddressDistrict(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.address.district) || this.register.ssu.cardInfo.address.district === '') {
            Modal.showAlert('กรุณาระบุ เขต/อำเภอ');
            this.setRedLine('ssu_address_district_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeAddressLocality(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.address.locality) || this.register.ssu.cardInfo.address.locality === '') {
            Modal.showAlert('กรุณาระบุ แขวง/ตำบล');
            this.setRedLine('ssu_address_locality_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeAddressPostcode(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.address.postcode) || this.register.ssu.cardInfo.address.postcode === '') {
            Modal.showAlert('กรุณาระบุ รหัสไปรษณีย์');
            this.setRedLine('ssu_address_postcode_id');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeIssueDateDay(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.issueDate.day) || this.register.ssu.cardInfo.issueDate.day === '') {
            Modal.showAlert('กรุณาระบุ วัน ของวันที่ออกบัตร');
            this.setRedLine('issueDate_day_id');
            this.setWidth('issueDate_day_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeIssueDateMonth(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.issueDate.mounth) || this.register.ssu.cardInfo.issueDate.mounth === '') {
            Modal.showAlert('กรุณาระบุ เดือน ของวันที่ออกบัตร');
            this.setRedLine('issueDate_month_id');
            this.setWidth('issueDate_month_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeIssueDateYear(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.issueDate.year) || this.register.ssu.cardInfo.issueDate.year === '') {
            Modal.showAlert('กรุณาระบุ ปี ของวันที่ออกบัตร');
            this.setRedLine('issueDate_year_id');
            this.setWidth('issueDate_year_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeExpireDateDay(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.expireDate.day) || this.register.ssu.cardInfo.expireDate.day === '') {
            Modal.showAlert('กรุณาระบุ วัน ของวันที่บัตรหมดอายุ');
            this.setRedLine('expireDate_day_id');
            this.setWidth('expireDate_day_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeExpireDateMonth(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.expireDate.mounth) || this.register.ssu.cardInfo.expireDate.mounth === '') {
            Modal.showAlert('กรุณาระบุ เดือน ของวันที่บัตรหมดอายุ');
            this.setRedLine('expireDate_month_id');
            this.setWidth('expireDate_month_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeExpireDateYear(): boolean {
        if (isNullOrUndefined(this.register.ssu.cardInfo.expireDate.year) || this.register.ssu.cardInfo.expireDate.year === '') {
            Modal.showAlert('กรุณาระบุ ปี ของวันที่บัตรหมดอายุ');
            this.setRedLine('expireDate_year_id');
            this.setWidth('expireDate_year_id', '40px');
            return false;
        } else {
            return true;
        }
    }

    public checkIdTypeLaserNo(): boolean {
        let validate = true;
        if (this.register.laser_no1.length !== 3) {
            Modal.showAlert('กรุณาระบุ เลขหลังบัตรให้ถูกต้อง');
            this.setRedLine('ssu_backNo1_id');
            validate = false;
        }

        if (this.register.laser_no2.length !== 7) {
            Modal.showAlert('กรุณาระบุ เลขหลังบัตรให้ถูกต้อง');
            this.setRedLine('ssu_backNo2_id');
            validate = false;
        }

        if (this.register.laser_no3.length !== 2) {
            Modal.showAlert('กรุณาระบุ เลขหลังบัตรให้ถูกต้อง');
            this.setRedLine('ssu_backNo3_id');
            validate = false;
        }
        return validate;
    }

    public CheckMyPIN1() {
        setTimeout(() => {
            if (this.assign_mypin_1.length === 6 || (this.assign_mypin_1.length === 0 && this.assign_mypin_2.length === 0)) {
                this.setBlueLine('ssu_current_address_moblie_phone_id1');
            } else {
                this.checkPIN = false;
                this.CheckMyPIN2();
                this.setRedLine('ssu_current_address_moblie_phone_id1');
            }
        }, 100)
    }

    public CheckMyPIN2() {
        setTimeout(() => {
            if (this.assign_mypin_2.length === 6 || (this.assign_mypin_1.length === 0 && this.assign_mypin_2.length === 0)) {
                this.setBlueLine('ssu_current_address_moblie_phone_id2');
                if (this.assign_mypin_1 === this.assign_mypin_2) {
                    this.checkPIN = true;
                }
            } else {
                this.checkPIN = false;
                this.CheckMyPIN1();
                this.setRedLine('ssu_current_address_moblie_phone_id2');
            }
        }, 100)
    }

    public CheckPhoneNo(value) {
        if (value.length !== 10) {
            Modal.showAlert('กรุณาระบุหมายเลขโทรศัพท์ให้ถูกต้อง');
        }
    }

    public checkBirthDayValidWithProductKK55UP(): boolean {
        if (this.dataService.selectedProduct.PROD_CODE === '318') {
            const today = Date.now();
            const birthday = new Date(Utils.getMinusYearEn(this.register.ssu.cardInfo.birthdate.year) + '-' + Utils.getMonthShottoNumber(this.register.ssu.cardInfo.birthdate.mounth) + '-' + this.register.ssu.cardInfo.birthdate.day).getTime();
            const ageDate = new Date(today - birthday);
            const old = Math.abs(ageDate.getUTCFullYear() - 1970);
            if (old >= 55) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    public checkConfigProduct() {
        Utils.logDebug('checkConfigProduct', 'start');
        if (!isNullOrUndefined(this.dataService.selectedProduct.PROD_CODE)) {
            switch (this.dataService.selectedProduct.PROD_CODE) {
                case "318":
                    if (this.checkBirthDayValidWithProductKK55UP()) {
                        Utils.logDebug('checkConfigProduct', 'onSendTellerApproveSubscription 1');
                        this.tellerApproveType = 'เปิดบัญชี';
                        this.tellerApproveDetail = this.dataService.selectedProduct.PROD_DESC;
                        this.onSendTellerApproveSubscription(this.tellerApproveType, this.tellerApproveDetail);
                    } else {
                        this.Modal_image = "./assets/kiatnakin/image/card13.png";
                        this.Modal_text = "ขออภัยอายุท่านยังไม่ถึงไม่สามารถสมัครบริการนี้ได้";
                        this.ModalShow = true;
                        Utils.logDebug('checkConfigProduct', 'onClickShowModal');
                        this.onClickShowModal();
                    }
                    break;
                default:
                    Utils.logDebug('checkConfigProduct', 'default');
                    Utils.logDebug('checkConfigProduct', 'onSendTellerApproveSubscription 2');
                    if (this.checkOpenAccount.indexOf(this.dataService.selectedDepositType) > -1) {
                        this.tellerApproveType = 'เปิดบัญชี';
                        this.tellerApproveDetail = this.dataService.selectedProduct.PROD_DESC;
                    } else {
                        this.tellerApproveType = 'สมัครบริการ';
                        this.tellerApproveDetail = this.dataService.selectedProduct.PROD_DESC;
                    }
                    this.onSendTellerApproveSubscription(this.tellerApproveType, this.tellerApproveDetail);
                    break;
            }
        } else {
            this.Modal_image = "./assets/kiatnakin/image/read_false.png";
            this.Modal_text = "ไม่มีข้อมูลข้อมูลโปรดัคส์";
            this.ModalShow = true;
            this.onClickShowModal();
        }
    }

    public verifyidcard() {
        Utils.logDebug("verifyidcard", 'start');
        if (this.register.ssu.cardInfo.idType === AppConstant.IdType) {
            $('#submit_CustomerInfo_id').hide();
        }

        if (this.register.ssu.cardInfo.idType === "E" || this.register.ssu.cardInfo.idType === "N") {
            this.setBlueLine("ssu_backNo1_id");
            this.setBlueLine("ssu_backNo2_id");
            this.setBlueLine("ssu_backNo3_id");

            if (this.register.laser_no1.length === 3 && this.register.laser_no2.length === 7 && this.register.laser_no3.length === 2) {
                this.register.ssu.cardInfo.laser_no = this.register.laser_no1.substr(0, 2).toUpperCase() + this.register.laser_no1.substr(2, 1) + this.register.laser_no2 + this.register.laser_no3
                $('#submit_CustomerInfo_id').hide();
            } else {


                if (this.register.laser_no1.length !== 3) {
                    this.setRedLine('ssu_backNo1_id');
                    return
                }

                if (this.register.laser_no2.length !== 7) {
                    this.setRedLine('ssu_backNo2_id');
                    return
                }

                if (this.register.laser_no3.length !== 2) {
                    this.setRedLine('ssu_backNo3_id');
                    return
                }
            }
        }
        this.submit = true;
        this.register.subscription.account.ACCOUNT_NAME = this.register.ssu.cardInfo.titleTH + ' ' + this.register.ssu.cardInfo.nameTH + ' ' + this.register.ssu.cardInfo.surnameTH;
        Modal.showProgress();
        this.accountService.verifyidcard(
            this.register.ssu.cardInfo.idCardNumber.toString(),
            this.register.chipNo, this.register.requestNo,
            this.register.birthdate,
            this.register.ssu.cardInfo.nameTH,
            this.register.ssu.cardInfo.surnameTH,
            this.register.ssu.cardInfo.laser_no)
            .subscribe(
                Value => {
                    Modal.hide();
                    this.checkTeller();
                }, Error => {
                    Modal.hide();
                    this.submit = false
                    $('#submit_CustomerInfo_id').show();
                    Modal.showAlert(Error.responseStatus.responseMessage);
                }
            )
    }

    public onChangeAddress() {
        Utils.logDebug('onChangeAddress', 'start');
        this.updateCardInfo = true;
        if (this.register.ssu.cardInfo.idType !== AppConstant.IdType && this.customerExist === true) {
            Utils.logDebug('onChangeAddress', 'checkReadCard');
            this.checkReadCard();
            this.AddressSameOld = false;
        } else {
            // this.checkConfigProduct();
            this.onCloseModalAll();
            this.AddressSameOld = false;
        }
    }

    public checkReadCard() {
        Utils.logDebug("checkReadCard", 'start');
        return new Promise((resolve, reject) => {
            if (this.userService.isLoggedin()) {
                if (this.type === 'SubSer') {
                    switch (this.dataService.selectedProduct.PROD_TYPE) {
                        case 'SMS':
                            this.selected = 'SMS';
                            break;
                        case 'PromptPay':
                            this.selected = 'PromptPay';
                            break;
                    }
                }
            }
            resolve();
            this.verifyidcard();
        });
    }

    public checkTeller() {
        Utils.logDebug('checkTeller', 'start');
        console.log('this.customerExist ->', this.customerExist);
        console.log('this.userService.isLoggedin() ->', this.userService.isLoggedin());
        // if (!this.register.isTellerApproved && this.customerExist === true) {
        if (this.customerExist === true && this.userService.isLoggedin() !== true) {
            if (this.register.haveMyPin === 'Y') {
                this.progressModalFails = false;
                this.btnSubmit = 'MyPIN';
                this.mypin = true;
                this.register.AuthenMyPIN = '';
            } else {
                Utils.logDebug('checkTeller', 'getMobile_no');
                this.getMobile_no();
            }
            this.onClickShowModal();
        } else { // if (this.customerExist !== true || this.userService.isLoggedin() == true) {
            Utils.logDebug('checkTeller', 'checkTeller : else');

            if (this.type === 'SubSer') {
                if (this.register.haveFD === 'Y') {
                    Utils.logDebug('checkTeller', 'this.dataService.selectedProduct.PROD_TYPE : ' + this.dataService.selectedProduct.PROD_TYPE);
                    switch (this.dataService.selectedProduct.PROD_TYPE) {
                        case 'SMS':
                            this.selected = 'SMS';
                            break;
                        case 'PromptPay':
                            this.selected = 'PromptPay';
                            break;
                        case 'Debit Card':
                            this.selected = 'Debit Card';
                            break;
                        case 'eBanking':
                            this.selected = 'eBanking';
                            break;
                    }
                    this.dataList = [];
                    this.onShow(true);
                    this.ongetAccountListService(this.selected);
                } else {
                    Modal.showAlertWithOk(Th.CUSTOMER_DIDNOT_HAVE_BANKACCOUNT, () => {
                        this.router.navigate(["/kk"]);
                    });
                }
            } else {
                if (isNullOrUndefined(this.marital) || this.marital.length <= 0) {
                    this.getConfigList('marital_status', 'ssu_status', false);
                }
                this.checkConfigProduct();
            }
        }
    }

    public getMobile_no() {
        Utils.logDebug('getMobile_no', 'getGetSubscriptionInfo');
        Modal.showProgress();
        this.accountService.getGetSubscriptionInfo(this.register.ssu.cardInfo.idCardNumber)
            .subscribe(
                Data => {
                    Modal.hide();
                    const dataMobile = Data.data.contact_info_detail
                        .filter(Value => Value.CONTACT_CODE === AppConstant.ContactTypeMobileCode)
                        .sort(function (a, b) {
                            return b.SEQ - a.SEQ;
                        });
                    if (!isNullOrUndefined(dataMobile)) {
                        this.otp_moblie_number = dataMobile[0].CONTACT_DETAIL;
                        this.otp_moblie_number_txt = this.otp_moblie_number.substr(0, 3) + 'XXX' + this.otp_moblie_number.substr(6);
                        this.progressModalFails = false;
                        this.otp = true;
                        this.openOTP();
                        this.mypin = false;
                    } else {
                        this.dataError();
                    }
                }, Error => {
                    Modal.hide();
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                });
    }

    public getMobileNoForgotPin() {
        Utils.logDebug('getMobileNoForgotPin', 'getGetSubscriptionInfo');
        this.accountService.getGetSubscriptionInfo(this.register.ssu.cardInfo.idCardNumber)
            .subscribe(
                Data => {
                    const dataMobile = Data.data.contact_info_detail
                        .filter(Value => Value.CONTACT_CODE === AppConstant.ContactTypeMobileCode)
                        .sort(function (a, b) {
                            return b.SEQ - a.SEQ;
                        });
                    if (!isNullOrUndefined(dataMobile)) {
                        this.otp_moblie_number = dataMobile[0].CONTACT_DETAIL;
                        this.otp_moblie_number_txt = this.otp_moblie_number.substr(0, 3) + 'XXX' + this.otp_moblie_number.substr(6);
                        this.progressModalFails = false;
                        this.otp = true;
                        this.openOTP(AppConstant.OTP_TEMP_LOGIN_TH);
                    } else {
                        this.dataError();
                    }
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                });
    }

    public otpPromtpay() {
        Utils.logDebug('otpPromtpay', 'start');
        this.promtpay = false;
        this.otp_PromtPay = true;
        this.otp = true;
        this.register.otp_no = "";
        this.getMobile_no();
    }

    public openOTP(templateOtp: string = '') {
        Utils.logDebug('openOTP', 'start');
        let txn_type = "";
        if (templateOtp !== '') {
            txn_type = templateOtp;
        } else {
            if (this.otp_PromtPay === true) {
                txn_type = AppConstant.OTP_REGISTER_PROMPTPAY_TH;
            } else {
                txn_type = AppConstant.OTP_ACCEPT_TERM_TH;
            }
        }

        this.registerService.generateOTP(this.register, txn_type)
            .subscribe(
                Value => {
                    this.getkeyboard();
                    Utils.logDebug('openOTP', 'generateOTP => Value.data : ' + JSON.stringify(Value.data));
                    this.otp2 = true;
                    this.register.ReferenceNo = Value.data.GenerateOTPDetail.ReferenceNo;
                    this.register.TokenUUID = Value.data.GenerateOTPDetail.TokenUUID;
                }, Error => {
                    this.otp_moblie_number_txt = Error.responseStatus.responseMessage
                }
            );
    }

    public verifyOTP() {
        Utils.logDebug('verifyOTP', 'start');
        if (this.register.otp_no.length === 6) {
            Utils.logDebug('verifyOTP', 'verifyOTP');
            this.accountService.verifyOTP(this.register.TokenUUID, this.register.ReferenceNo, this.register.otp_no)
                .subscribe(
                    userProfile => {
                        this.hidekeyboard();
                        if (this.type === 'SubSer' && this.otp_PromtPay === false) {
                            Utils.logDebug('verifyOTP', 'verifyOTP -> getCustomerProfileSub');
                            this.accountService.getCustomerProfileSub(this.register.ssu.cardInfo.idCardNumber.toString(), AppConstant.IdType)
                                .subscribe(
                                    (UserProfile) => {
                                        if (this.register.haveFD === 'Y') {
                                            UserProfile = UserProfile.data.CUSTPROFILEMAINSUB_LIST.CUSTOMER_INFO_DETAIL;
                                            this.userService.loginSuccess(UserProfile);
                                            switch (this.dataService.selectedProduct.PROD_TYPE) {
                                                case 'SMS':
                                                    this.selected = 'SMS';
                                                    break;
                                                case 'PromptPay':
                                                    this.selected = 'PromptPay';
                                                    break;
                                                case 'Debit Card':
                                                    this.selected = 'Debit Card';
                                                    break;
                                                case 'eBanking':
                                                    this.selected = 'eBanking';
                                            }

                                            this.isSelectAccount = true;
                                            this.otp = false;
                                            $(`${"#seletor_content_modal"},${"#dismiss_bg_otp"}`).hide();
                                            Utils.logDebug('verifyOTP', 'verifyOTP -> getCustomerProfileSub -> ongetAccountListService');
                                            this.ongetAccountListService(this.selected);
                                        } else {
                                            Modal.showAlertWithOk(Th.CUSTOMER_DIDNOT_HAVE_BANKACCOUNT, () => {
                                                this.router.navigate(["/kk"]);
                                            });
                                        }
                                    })

                        } else if (this.otp_PromtPay === true) {
                            this.otp = false;
                            this.progressModal = true;
                            Utils.logDebug('verifyOTP', 'verifyOTP -> CheckKKAnyId_mobile');
                            this.CheckKKAnyId_mobile();
                        } else {
                            this.otp = false;
                            this.submit = true;
                            $(`${"#seletor_content_modal"},${"#dismiss_bg_otp"}`).hide();
                            Utils.logDebug('verifyOTP', 'verifyOTP -> checkConfigProduct');
                            this.checkConfigProduct()

                        }
                    },
                    Error => {
                        this.register.otp_no = '';
                        this.otp_moblie_number_txt = Error.responseStatus.responseMessage;
                    }
                )
        }
    }

    public CreateMyPinByKKCisIdOnly(pin: string) {
        Utils.logDebug('CreateMyPinByKKCisIdOnly', 'start');
        this.myPin = pin;
        this.registerService.CreateMyPinByKKCisId(this.register, this.myPin)
            .subscribe(
                dataPin => {
                    this.checkSavePinSuccess = true;
                    Utils.logDebug('CreateMyPinByKKCisId', 'create success');
                    this.CheckTD();
                }, Error => {
                    this.onShowFailMessage(Error.responseStatus.responseMessage, this.register.subscription.account.PROD_TYPE);
                    if (this.register.haveIB === 'N' || this.atmServiceChecked === true || this.register.smsServiceChecked === true) {
                        this.CheckTD();
                    }
                }
            );
    }

    public CreateMyPinByKKCisId(pin: string) {
        Utils.logDebug('CreateMyPinByKKCisId', 'start');
        this.myPin = pin;
        this.registerService.CreateMyPinByKKCisId(this.register, this.myPin)
            .subscribe(
                dataPin => {
                    this.checkSavePinSuccess = true;
                    Utils.logDebug('CreateMyPinByKKCisId', 'create success');
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public checkMyPin() {
        Utils.logDebug('checkMyPin', 'start');
        if (this.assign_mypin_1.length === 6 || this.assign_mypin_2.length === 6) {

            if (this.assign_mypin_1.length === 6 && this.assign_mypin_2.length === 6) {
                if (this.assign_mypin_1 !== this.assign_mypin_2) {
                    Modal.showAlert('กรุณาระบุ MyPIN ให้ถูกต้อง');
                    this.assign_mypin_2 = '';
                    $("#ssu_current_address_moblie_phone_id2").focus();
                }
            }
        }
    }

    public ongetAccountListService(id) {
        Utils.logDebug('ongetAccountListService', 'start');
        if (this.showSelector === false) {
            this.dataList = [];
            this.onShow();
        }
        Utils.logDebug('ongetAccountListService', 'getaccountlistbyidcard');
        this.accountService.getaccountlistbyidcard(this.register)
            .subscribe(
                data => {
                    this.titleTypeList = 'กรุณาเลือกบัญชี';
                    this.dataList = data.data.inquiryAccountList.inquiryAccount;
                    if (Array.isArray(this.dataList) === false) {
                        this.dataList = [this.dataList];
                    }
                    Utils.logDebug('ongetAccountListService', 'getaccountlistbyidcard -> getAccount');
                    this.getAccount(id);
                },
                Error => {
                    this.submit = false;
                    $('#submit_CustomerInfo_id').show();
                }
            )
    }

    public ongetAccountList(ref_id, onShow: boolean) {
        Utils.logDebug('ongetAccountList', 'start');
        Utils.logDebug('ongetAccountList', 'ref_id : ' + ref_id);
        if (ref_id === 'subscription_interest') {
            if (this.checkExisting === true) {
                if (onShow === true) {
                    this.onShow();
                }

                if (!isNullOrUndefined(this.RespondCode)) {
                    this.RespondCode = '';
                }
                Utils.logDebug('ongetAccountList', 'getaccountlistbyidcard');
                this.accountService.getaccountlistbyidcard(this.register)
                    .subscribe(
                        data => {
                            this.dataList = data.data.inquiryAccountList.inquiryAccount;
                            // 1 = Active
                            // 4 = Open Today , New Today
                            this.dataList = this.dataList.filter(Data =>
                                Data.accountStatusCode === AppConstant.AccountStatusCodeActive
                                || Data.accountStatusCode === AppConstant.AccountStatusCodeOpenToday);

                            if (Array.isArray(this.dataList) === false) {
                                this.dataList = [this.dataList];
                            }
                            this.dataList.push({
                                'data': this.KKSavingPlusEng,
                                'value': "NEW",
                                'accountType': 'new'
                            });
                            Utils.logDebug('ongetAccountList', 'getaccountlistbyidcard -> getAccount');
                            this.getAccount(ref_id);
                        },
                        Error => {
                        }
                    )
            } else {
                Utils.logDebug('ongetAccountList', 'getAccount');
                this.dataList = [];
                this.dataList.push({
                    'data': this.KKSavingPlusEng,
                    'value': "NEW",
                    'accountType': 'new'
                });

                this.getAccount(ref_id);
                if (onShow === true) {
                    this.onShow();
                }
            }
        } else if (ref_id === 'subscription_FeeSMS') {
            if (onShow === true) {
                this.onShow();
            }
            Utils.logDebug('ongetAccountList', 'getaccountlistbyidcard');
            this.accountService.getaccountlistbyidcard(this.register)
                .subscribe(
                    data => {
                        this.dataList = data.data.inquiryAccountList.inquiryAccount;
                        this.dataList = this.dataList.filter(Data => Data.accountStatusCode === '6' || Data.accountStatusCode === '8');
                        if (Array.isArray(this.dataList) === false) {
                            this.dataList = [this.dataList];
                        }
                        Utils.logDebug('ongetAccountList', 'getaccountlistbyidcard -> getAccount');
                        this.getAccount(ref_id);
                    },
                    Error => {
                    }
                )
        }
    }

    public async getConfigList(ref_name: string, ref_id, onShow: boolean) {
        Utils.logDebug('getConfigList', 'ref_name : ' + ref_name);
        Utils.logDebug('getConfigList', 'ref_id : ' + ref_id);
        const that = this;

        return new Promise((resolve, reject) => {
            Utils.logDebug('getConfigList', 'GetConfigList');
            this.transactionService
                .GetConfigList(ref_name)
                .subscribe(
                    data => {
                        this.dataList = data.data;
                        this.checkRefName1(ref_name, ref_id);
                        this.checkRefName2(ref_name, ref_id);
                        if (onShow === true) {
                            this.onShow();
                        }
                        resolve()
                    }, error => {
                        reject(error.responseStatus.responseMessage);
                        return;
                    }
                );
        })
    }

    public checkRefName1(ref_name, ref_id) {
        switch (ref_name) {
            case 'title':
                this.getTitle(ref_id);
                break;
            case 'country':
                this.getCountry(ref_id);
                break;
            case 'province':
                this.getProvince(ref_id);
                break;
            case 'nationality':
                this.getNation(ref_id);
                break;
            case 'properties_value':
                this.getProperty(ref_id);
                break;
            case 'business_sector':
                this.getbusinessType(ref_id);
                break;
            default:
                break;
        }
    }

    public checkRefName2(ref_name, ref_id) {
        switch (ref_name) {
            case 'occupation':
                this.getOccupation(ref_id);
                break;
            case 'relation_type':
                this.getRelation(ref_id);
                break;
            case 'marital_status':
                this.getmaritalStatus(ref_id);
                break;
            case 'purpose':
                this.getPurpost(ref_id);
                break;
            case 'instruction_sub':
                this.getInstruction(ref_id);
                break;
            case 'job_title':
                this.getJobTitle(ref_id);
                break;
            default:
                break;
        }
    }

    public getJobTitle(ref_id: any): any {
        const that = this;
        this.dataList.forEach(function (list, index) {
            that.dataList[index]['value'] = list.REF_VALUE;
            that.dataList[index]['data'] = list.DESC_THAI;
        });
        if (!isNullOrUndefined(this.register.ssu.position.Data)) {
            this.ActiveNow = this.dataList.filter(data => data.data === this.register.ssu.position.Data);
        }
    }

    public async getCustAddressListByValue(province: string, sub_search_value: string, ref_name: string, ref_id, onShow) {
        Utils.logDebug('getCustAddressListByValue', 'province : ' + province);
        Utils.logDebug('getCustAddressListByValue', 'sub_search_value : ' + sub_search_value);
        Utils.logDebug('getCustAddressListByValue', 'ref_name : ' + ref_name);
        Utils.logDebug('getCustAddressListByValue', 'ref_id : ' + ref_id);
        return new Promise((resolve, reject) => {
            this.transactionService
                .GetCustAddressListByValue(province, sub_search_value, ref_name)
                .subscribe(
                    data => {
                        Utils.logDebug('getCustAddressListByValue', 'GetCustAddressListByValue -> data : ' + JSON.stringify(data));
                        switch (ref_name) {
                            case 'province':
                                this.dataList = data.data.DISTRICT;
                                Utils.logDebug('getCustAddressListByValue', 'GetCustAddressListByValue -> getDistrict');
                                this.getDistrict(ref_id, onShow);
                                if (onShow === true) {
                                    this.onShow();
                                }
                                break;
                            case 'province_district':
                                this.dataList = data.data.SUB_DISTRICT;
                                Utils.logDebug('getCustAddressListByValue', 'GetCustAddressListByValue -> getLocality');
                                this.getLocality(ref_id, onShow);
                                if (onShow === true) {
                                    this.onShow();
                                }
                                break;
                            case 'district_subdistrict':
                                Utils.logDebug('getCustAddressListByValue', 'GetCustAddressListByValue -> setID');
                                this.setID(ref_name, data.data);
                                this.register.ssu.cardInfo.address.postcode = data.data.SUB_DISTRICT[0].ZIP_CODE;
                                Modal.hide();
                                break;
                            default:
                                break;
                        }
                        resolve()
                    },
                    error => {
                        this.progressModal = false;
                        this.MyPINerror = false;
                        this.RespondCode = error.responseStatus.responseMessage;
                        reject(error.responseStatus.responseMessage);
                        return;
                    }
                );
        })
    }

    public sumFATCA() {
        Utils.logDebug('sumFATCA', 'start');
        const FATCA_THAI_CITIZEN = 'FATCLOC';
        const FATCA_US_CITIZEN = 'FATCUSA';
        const FATCA_NON_US_CITIZEN = 'FATCNUS';

        if (this.register.fatca.usCitizen === 'Y' || this.register.fatca.usCard === 'Y' || this.register.fatca.usLocation === 'Y') {
            this.register.fatca.status = FATCA_US_CITIZEN;
        } else if (this.register.fatca.usTerritory === 'Y' || this.register.fatca.usTransfer === 'Y' ||
            this.register.fatca.usSignatory === 'Y' || this.register.fatca.usContact === 'Y' || this.register.fatca.usAddress === 'Y' || this.register.fatca.usTelephone === 'Y') {
            this.register.fatca.status = FATCA_NON_US_CITIZEN;
        } else {
            this.register.fatca.status = FATCA_THAI_CITIZEN;
        }

        this.checkUpdateInfoState();

    }

    public checkUpdateInfoState() {
        if (this.updateInfo === true) {
            Utils.logDebug('sumFATCA', 'UpdateCustomer');
            this.UpdateCustomer();
        } else {
            Utils.logDebug('sumFATCA', 'CreateCustomerIndividual');
            this.CreateCustomerIndividual();
        }
    }

    public checkPhoneListSSU(contactValue) {
        Utils.logDebug('checkPhoneListSSU', 'start');
        Utils.logDebug('checkPhoneListSSU', 'contactValue : ' + JSON.stringify(contactValue));
        const phone_info_list = [];
        const currentContact = contactValue.current.contact;
        const officeContact = contactValue.office.contact;

        if (currentContact.moblie_phone !== '') {
            phone_info_list.push({
                ["phone_number"]: this.checkPhoneNumber(currentContact.moblie_phone),
                ["phone_type"]: this.checkPhoneType(currentContact.moblie_phone, '02') //02 เบอร์มือถือ
            });
        }

        if (currentContact.home_phone !== '') {
            phone_info_list.push({
                ["phone_number"]: this.checkPhoneNumber(currentContact.home_phone),
                ["phone_type"]: this.checkPhoneType(currentContact.home_phone, '03') //03 เบอร์บ้าน
            });
        }

        if (officeContact.office_phone !== '') {
            phone_info_list.push({
                ["phone_number"]: this.checkPhoneNumber(officeContact.office_phone),
                ["phone_type"]: this.checkPhoneType(officeContact.office_phone, '04') //04 เบอร์ที่ทำงาน
            });
        }

        if (currentContact.fax_phone !== '') {
            phone_info_list.push({
                ["phone_number"]: this.checkPhoneNumber(currentContact.fax_phone),
                ["phone_type"]: this.checkPhoneType(currentContact.fax_phone, '05') //05 เบอร์แฟ็ค
            });
        }

        return phone_info_list;
    }

    public checkPhoneNumber(number) {
        return !isNullOrUndefined(number) ? number : null;
    }

    public checkPhoneType(number, type) {
        return !isNullOrUndefined(number) ? type : null;
    }

    public getCurrentDate(format) {
        let MM: string = '';
        let DD: string = '';
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1; //January is 0!
        const yyyy = today.getFullYear();
        let todays;

        if (mm <= 9) {
            MM = '0' + mm;
        } else {
            MM = mm + '';
        }

        if (dd <= 9) {
            DD = '0' + dd;
        } else {
            DD = dd + '';
        }

        if (MM !== '' && DD !== '') {
            if (format === 'dd/mm/yyyy') {
                todays = DD + '/' + MM + '/' + yyyy;
            } else if (format === 'yyy-mm-dd') {
                todays = yyyy + '-' + MM + '-' + DD;
            }
        } else {
            Modal.showAlert('Convert Date Error');
        }

        return todays
    }

    public checkKYC() {
        Utils.logDebug('checkKYC', 'start');
        Utils.logDebug('checkKYC', 'CheckSanctionListAndKYCLevel');
        this.registerService.CheckSanctionListAndKYCLevel(this.register)
            .subscribe(
                kycLV => {
                    this.register.ssu.kyc.Select = kycLV.data.KYC_Level;
                    this.register.ssu.kyc.Value = kycLV.data.KYC_Reason_Code;
                    this.register.ssu.SANCTION_FLAG = kycLV.data.SANCTION_FLAG;
                    if (!isNullOrUndefined(this.register.ssu.kyc.Select)) {
                        this.sumFATCA();
                    } else {
                        this.onShowRespondMessage('เกิดข้อผิดพลาดในการคำนวณ KYC Level');
                    }
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public SaveSubscriptionServiceWithPin() {
        Utils.logDebug('SaveSubscriptionServerWithPin', 'start');
        Utils.logDebug('SaveSubscriptionServerWithPin', 'this.register.haveIB : ' + this.register.haveIB);
        if (this.selected === 'SMS') {

            if (this.register.haveMyPin === 'N'
                && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
                && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {

                if (this.assign_mypin_1 === this.assign_mypin_2) {
                    if (this.register.smsServiceChecked) {
                        // pin & sms
                        this.setSMSLanguange();
                        this.subSMS = true;
                        this.SaveSubscriptionIB(true);
                    } else {
                        // pin only
                        this.SaveSubscriptionIB(true);
                    }
                } else {
                    if (this.register.smsServiceChecked) {
                        // sms only
                        this.setSMSLanguange();
                        this.subSMS = true;
                        this.CheckTD();
                    } else {
                        this.CheckTD();
                    }
                }
            } else {
                // sms and atm
                if (this.register.smsServiceChecked) {
                    this.setSMSLanguange();
                    this.subSMS = true;
                    this.CheckTD();
                } else {
                    this.CheckTD();
                }
            }
        } else if (this.selected === 'eBanking') {

            if (this.register.haveMyPin === 'N'
                && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
                && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {

                if (this.assign_mypin_1 === this.assign_mypin_2) {
                    if (this.register.smsServiceChecked) {
                        // pin & ebanking & sms
                        this.setSMSLanguange();
                        this.subSMS = true;
                        if (this.register.haveIB === 'N') {
                            this.SaveSubscriptionIB(true);
                        } else {
                            this.createCustPin(this.assign_mypin_1, false);
                        }
                    } else {
                        // pin and ebanking
                        if (this.register.haveIB === 'N') {
                            this.SaveSubscriptionIB(true);
                        } else {
                            this.createCustPin(this.assign_mypin_1, false);
                        }
                    }
                } else {
                    if (this.register.smsServiceChecked) {
                        // ebanking & sms
                        this.setSMSLanguange();
                        this.subSMS = true;
                        this.SaveSubscriptionIB(false);
                    } else {
                        // ebanking only
                        this.SaveSubscriptionIB(false);
                    }
                }
            } else {
                // ebanking only
                if (this.register.haveIB !== 'Y') {
                    this.SaveSubscriptionIB(false);
                } else {
                    this.CheckTD();
                }
            }
        } else if (this.selected === 'Debit Card') {
            if (this.register.haveMyPin === 'N'
                && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
                && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {
                if (this.assign_mypin_1 === this.assign_mypin_2) {
                    if (this.register.haveIB === 'N') {
                        this.SaveSubscriptionIB(true);
                    } else {
                        this.createCustPin(this.assign_mypin_1, false);
                    }
                } else {
                    this.CheckTD();
                }
            } else {
                // debit card only
                this.CheckTD();
            }
        } else {
            // other
            if (this.type !== 'SubSer') {
                if ((!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
                    && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {
                    if (this.assign_mypin_1 === this.assign_mypin_2) {
                        this.createCustPin(this.assign_mypin_1, false);
                    } else {
                        this.CheckTD();
                    }
                } else {
                    this.CheckTD();
                }
            } else {
                this.CheckTD();
            }
        }
    }

    public SaveSubscriptionService() {
        Utils.logDebug('SaveSubscriptionService', 'start');
        Utils.logDebug('SaveSubscriptionService', 'CheckTD');
        if (this.type === 'SubSer') {
            if (this.selected === "SMS") {
                // sms only
                if (this.register.smsServiceChecked) {
                    this.setSMSLanguange();
                    this.subSMS = true;
                    this.CheckTD();
                } else {
                    this.CheckTD();
                }
            } else if (this.selected === "eBanking") {
                if (this.register.smsServiceChecked) {
                    // eBanking and sms
                    this.setSMSLanguange();
                    this.subSMS = true;
                    this.SaveSubscriptionIB(false);
                } else {
                    // eBanking only
                    this.SaveSubscriptionIB(false);
                }
            } else {
                // other
                this.CheckTD();
            }
        } else {
            // open acount
            this.CheckTD();
        }
    }

    public setSMSLanguange() {
        if (this.SMS_LANG_CODE === '2') {
            this.register.subscriptionService.service.sms.SMS_LANG = 'อังกฤษ';
            this.register.subscriptionService.service.sms.SMS_LANG_CODE = '2';
        } else {
            this.register.subscriptionService.service.sms.SMS_LANG = 'ไทย';
            this.register.subscriptionService.service.sms.SMS_LANG_CODE = '1';
        }
    }

    public SaveSubscriptionSMS() {
        Utils.logDebug('SaveSubscriptionSMS', 'start');
        if (this.SMS_LANG_CODE === '2') {
            this.register.subscriptionService.service.sms.SMS_LANG = 'อังกฤษ';
            this.register.subscriptionService.service.sms.SMS_LANG_CODE = '2';
        } else {
            this.register.subscriptionService.service.sms.SMS_LANG = 'ไทย';
            this.register.subscriptionService.service.sms.SMS_LANG_CODE = '1';
        }

        this.register.subscriptionService.service.sms.ACTIVE_DATE = this.getCurrentDate('dd/mm/yyyy');

        Utils.logDebug('SaveSubscriptionSMS', 'SaveSubscriptionSMS');
        this.registerService.SaveSubscriptionSMS(this.register, this.register.subscription.account.PROD_TYPE, this.tempType)
            .subscribe(
                data => {
                    this.subSMS = true;
                    Utils.logDebug('SaveSubscriptionSMS', 'SaveSubscriptionSMS -> CheckTD');
                    this.CheckTD();
                }, Error => {
                    Utils.logDebug('SaveSubscriptionSMS', 'SaveSubscriptionSMS -> ERROR');
                    this.onShowPassRespondMessage(Error.responseStatus.responseMessage);
                    setTimeout(() => {
                        this.RespondCode = '';
                        this.progressModal = true;
                        Utils.logDebug('SaveSubscriptionSMS', 'SaveSubscriptionSMS -> CheckTD');
                        this.CheckTD();
                    }, 3000);
                }
            );
    }

    public SaveSubscriptionIB(withCreatePin: boolean) {
        Utils.logDebug('SaveSubscriptionIB', 'start');
        Utils.logDebug('SaveSubscriptionIB', 'SaveSubscriptionIB');
        this.registerService.SaveSubscriptionIB(this.register, this.register.subscription.account.PROD_TYPE)
            .subscribe(
                data => {
                    this.checkSaveIBSuccess = true;
                    if (withCreatePin) {
                        if (this.register.haveMyPin === 'N'
                            && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
                            && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {
                            if (this.assign_mypin_1 === this.assign_mypin_2) {
                                this.createCustPin(this.assign_mypin_1, false);
                            } else {
                                Utils.logDebug('SaveSubscriptionIB', 'SaveSubscriptionIB -> CheckTD');
                                this.CheckTD();
                            }
                        } else {
                            Utils.logDebug('SaveSubscriptionIB', 'SaveSubscriptionIB -> CheckTD');
                            this.CheckTD();
                        }
                    } else {
                        Utils.logDebug('SaveSubscriptionIB', 'SaveSubscriptionIB -> CheckTD');
                        this.CheckTD();
                    }
                }, Error => {
                    Utils.logDebug('SaveSubscriptionIB', 'SaveSubscriptionIB -> ERROR');
                    this.onShowFailMessage(Error.responseStatus.responseMessage, this.register.subscription.account.PROD_TYPE);
                    if (this.type === "SubSer") {
                        if (this.atmServiceChecked === true || this.register.smsServiceChecked === true) {
                            this.CheckTD();
                        } else {
                            setTimeout(() => {
                                this.RespondCode = '';
                                this.progressModal = true;
                                Utils.logDebug('SaveSubscriptionIB', 'SaveSubscriptionIB -> CheckTD');
                                this.CheckTD();
                            }, 3000);
                        }
                    }
                }
            );
    }

    public CheckTD() {
        Utils.logDebug('CheckTD', 'start');
        let createMyPin = 'N';
        if (this.register.haveMyPin === 'N'
            && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
            && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {
            createMyPin = 'Y';
        }
        if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeSaving && this.tempType === SubscriptionType.newSA) {
            Utils.logDebug('CheckTD', 'if');
            this.register.subscription.account.interest = this.register.account_no;
            this.register.subscription.account.PROD_TYPE = AppConstant.ProdTypeFix;
            this.TD_SA = true;
            this.tempType = SubscriptionType.newTD;
            Utils.logDebug('CheckTD', 'GetDummyAccountNo');
            this.GetDummyAccountNo();
        } else if (this.register.subscription.account.PROD_TYPE !== AppConstant.ProdTypeFix) {
            Utils.logDebug('CheckTD', 'else if');
            if (this.type === 'SubSer') {
                if (createMyPin === 'N'
                    || this.checkSaveIBSuccess === true
                    || this.checkSavePinSuccess === true
                    || this.register.smsServiceChecked === true
                    || this.atmServiceChecked === true) {
                    Utils.logDebug('CheckTD', 'onRequestPrintPDF');
                    this.onRequestPrintPDF();
                }
                if (createMyPin === 'Y' && this.checkSavePinSuccess !== false) {
                    Utils.logDebug('CheckTD', 'showModalPromtPay');
                    this.showModalPromtPay();
                } else {
                    if (this.selected === 'eBanking') {
                        if (this.atmServiceChecked !== true
                            && this.register.smsServiceChecked !== true
                            && createMyPin === 'N'
                            && this.checkSaveIBSuccess === true
                            && this.checkSavePinSuccess === false) {
                            Utils.logDebug('CheckTD', 'SubSer not select anything');
                            Utils.logDebug('CheckTD', 'showModalPromtPay');
                            this.showModalPromtPay();
                        }
                    } else {
                        if (this.atmServiceChecked !== true
                            && this.register.smsServiceChecked !== true
                            && createMyPin === 'N'
                            && this.checkSaveIBSuccess === false
                            && this.checkSavePinSuccess === false) {
                            Utils.logDebug('CheckTD', 'SubSer not select anything');
                            Utils.logDebug('CheckTD', 'showModalPromtPay');
                            this.showModalPromtPay();
                        }
                    }
                }
            } else {
                if (createMyPin === 'N') {
                    Utils.logDebug('CheckTD', 'onRequestPrintPDF');
                    this.onRequestPrintPDF();
                    Utils.logDebug('CheckTD', 'showModalPromtPay');
                    this.showModalPromtPay();
                }
                if (createMyPin === 'Y' && this.checkSavePinSuccess !== false) {
                    Utils.logDebug('CheckTD', 'showModalPromtPay');
                    this.showModalPromtPay();
                }
            }
        } else {
            Utils.logDebug('CheckTD', 'else');
            Utils.logDebug('CheckTD', 'ongetAccountDetail');
            //this.ongetAccountDetail();
            if (createMyPin === 'N') {
                Utils.logDebug('CheckTD', 'onRequestPrintPDF');
                this.onRequestPrintPDF();
                this.ongetAccountDetail()
            } else {
                if (this.checkSavePinSuccess === true) {
                    this.ongetAccountDetail();
                }
            }
        }
    }

    public checkOBJ() {
        Utils.logDebug('checkOBJ', 'start');
        switch (this.register.subscription.account.OBJ.Data) {
            case 'ออมเงิน':
                this.register.subscription.account.OBJ1 = 'Y';
                break;
            case 'เพื่อลงทุน':
                this.register.subscription.account.OBJ2 = 'Y';
                break;
            case 'เพื่อหมุนเวียนทางธุรกิจ':
                this.register.subscription.account.OBJ3 = 'Y';
                break;
            case 'ชำระค่าบริการ':
                this.register.subscription.account.OBJ4 = 'Y';
                break;
            case 'บัญชีเงินเดือน':
                this.register.subscription.account.OBJ5 = 'Y';
                break;
            case 'อื่นๆ':
                this.register.subscription.account.OBJ6 = 'Y';
                break;
            default:
                break
        }

        if (!this.customerExist) {
            // new customer
            Utils.logDebug('checkOBJ', 'Check address seq or email seq or mobile seq');
            if (isNullOrUndefined(this.register.subscription.address.seq) || this.register.subscription.address.seq === '' || this.register.subscription.address.seq.toString() === '0'
                || isNullOrUndefined(this.register.ssu.contact.EMAIL_SEQ) || this.register.ssu.contact.EMAIL_SEQ === '' || this.register.ssu.contact.EMAIL_SEQ.toString() === '0'
                || isNullOrUndefined(this.register.ssu.contact.MOBILE_NO_SEQ) || this.register.ssu.contact.MOBILE_NO_SEQ === '' || this.register.ssu.contact.MOBILE_NO_SEQ.toString() === '0') {

                Utils.logDebug('checkOBJ', 'Not found address seq or email seq or mobile seq');
                // call GetSubscriptionInfo again
                this.accountService.getGetSubscriptionInfo(this.register.ssu.cardInfo.idCardNumber)
                    .subscribe(
                        Data => {
                            const dataAddressCustomer = Data.data.address_info_detail;
                            Utils.logDebug('checkOBJ', 'getGetSubscriptionInfo -> dataAddressCustomer : ' + JSON.stringify(dataAddressCustomer));
                            const dataMobile = Data.data.contact_info_detail
                                .filter(Value => Value.CONTACT_CODE === AppConstant.ContactTypeMobileCode)
                                .sort(function (a, b) {
                                    return b.SEQ - a.SEQ;
                                });
                            Utils.logDebug('checkOBJ', 'getGetSubscriptionInfo -> dataMobile : ' + JSON.stringify(dataMobile));
                            const dataEmail = Data.data.contact_info_detail
                                .filter(Value => Value.CONTACT_CODE === AppConstant.ContactTypeEmailCode)
                                .sort(function (a, b) {
                                    return b.SEQ - a.SEQ;
                                });
                            Utils.logDebug('checkOBJ', 'getGetSubscriptionInfo -> dataEmail : ' + JSON.stringify(dataEmail));
                            this.register.ssu.contact.EMAIL_SEQ = dataEmail[0].SEQ;
                            this.register.ssu.contact.MOBILE_NO_SEQ = dataMobile[0].SEQ;

                            // filter find address seq match user selected
                            if (this.register.subscription.current.Type === 'CI') {
                                // register
                                this.register.subscription.address.seq = dataAddressCustomer.filter(x => x.Address_Type === AppConstant.AddressTypeRegister)[0].ADDRESS_SEQ;
                            } else if (this.register.subscription.current.Type === 'CU') {
                                // office
                                this.register.subscription.address.seq = dataAddressCustomer.filter(x => x.Address_Type === AppConstant.AddressTypeOffice)[0].ADDRESS_SEQ;
                            } else if (this.register.subscription.current.Type === 'CS') {
                                // mailling
                                const addressMailing = dataAddressCustomer.filter(x => x.Address_Type === AppConstant.AddressTypeMailing);
                                const seq = addressMailing.filter(x => x.ADDRESS_NUMBER === this.register.ssu.current.address.no)[0].ADDRESS_SEQ;
                                this.register.subscription.address.seq = seq;
                            } else if (this.register.subscription.current.Type === 'IN') {
                                // mailling input
                                const addressMailing = dataAddressCustomer.filter(x => x.Address_Type === AppConstant.AddressTypeMailing);
                                const seq = addressMailing.filter(x => x.ADDRESS_NUMBER === this.register.subscription.address.no)[0].ADDRESS_SEQ;
                                this.register.subscription.address.seq = seq;
                            }

                            Utils.logDebug('checkOBJ', 'checkToCallOpenAccount');
                            this.checkToCallOpenAccount();
                        }, Error => {
                            this.onShowRespondMessage(Error.responseStatus.responseMessage);
                        }
                    )
            } else {
                Utils.logDebug('checkOBJ', 'checkToCallOpenAccount');
                this.checkToCallOpenAccount();
            }
        } else {
            // old customer
            Utils.logDebug('checkOBJ', 'checkToCallOpenAccount');
            this.checkToCallOpenAccount();
        }
    }

    checkToCallOpenAccount() {
        Utils.logDebug('checkToCallOpenAccount', 'Start');
        if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeSaving
            || this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeCurrent) {
            Utils.logDebug('checkToCallOpenAccount', 'OpenCASAAccount');
            this.OpenCASAAccount();
        }
        if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeFix) {
            Utils.logDebug('checkToCallOpenAccount', 'OpenTDAccount');
            this.OpenTDAccount();
        }
    }

    public checkRegister() {
        Utils.logDebug('checkRegister', 'start');
        const PROD_TYPE = this.dataService.selectedProduct.PROD_TYPE;
        const AccountNoFeeSMS_DATA = this.register.subscriptionService.service.internet.AccountNoFeeSMS_DATA
        if (PROD_TYPE === AppConstant.ProdTypeFix
            && this.register.haveFD === 'Y'
            && this.register.smsServiceChecked === true
            && (isNullOrUndefined(AccountNoFeeSMS_DATA) || AccountNoFeeSMS_DATA === '')) {
            Modal.showAlert("กรุณาระบุ บัญชีที่หักค่าธรรมเนียม");
            Utils.logDebug('checkRegister', 'setRedLine');
            this.setRedLine("AccountNoFeeSMS_id");
        } else {
            this.mypin = false;
            this.progressModal = true;
            this.onClickShowModal();
            Utils.logDebug('checkRegister', 'showPDFConfirm');
            this.showPDFConfirm();
        }
    }

    public checkGender() {
        let gender = '';
        switch (this.register.ssu.cardInfo.gender.value) {
            case 'Male':
                gender = 'M';
                break
            case 'Female':
                gender = 'F';
                break;
            default:
                gender = this.register.ssu.cardInfo.gender.value;
                break
        }
        return gender
    }

    public onCheckAbsorption() {
        Utils.logDebug('onCheckAbsorption', 'start');
        this.showFlipbook = true;
        this.mypin = false;
        this.progressModal = true;
        this.onClickShowModal();
        Utils.logDebug('onCheckAbsorption', 'showPDFConfirm');
        this.showPDFConfirm();
    }

    public getConfigSubscription() {
        this.getConfigList('country', 'subscription_country_id', false);
    }

    public UpdateCustomer() {
        Utils.logDebug('UpdateCustomer', 'start');
        const dataValue = [];
        let relation_info_list = [];

        dataValue['gender'] = this.checkGender();

        dataValue['birth_date'] = Utils.changeDateFormat(this.register.ssu.cardInfo.birthdate);
        dataValue['expired_date'] = Utils.changeDateFormat(this.register.ssu.cardInfo.expireDate);
        dataValue['issued_date'] = Utils.changeDateFormat(this.register.ssu.cardInfo.issueDate);

        const phone_info_list = this.checkPhoneListSSU(this.register.ssu);

        relation_info_list = this.setRelationlist();

        if (this.register.ssu.Contryincome.Select === '0') {
            this.register.ssu.Contryincome.Desc = 'TH';
        }

        const dateNow = this.getCurrentDate('yyy-mm-dd');
        Utils.logDebug('UpdateCustomer', 'UpdateCustomer');
        this.registerService.UpdateCustomer(this.register, dataValue, dateNow, relation_info_list, phone_info_list)
            .subscribe(
                UpdateCustomer => {
                    if (this.type === 'SubSer') {
                        Utils.logDebug('UpdateCustomer', 'UpdateCustomer -> checkSubService');
                        this.checkSubService();
                    } else {
                        Utils.logDebug('UpdateCustomer', 'UpdateCustomer -> GetDummyAccountNo');
                        this.GetDummyAccountNo();
                    }
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public CreateCustomerIndividual() {
        Utils.logDebug('CreateCustomerIndividual', 'start');
        const dataValue = [];
        let relation_info_list = [];

        dataValue['gender'] = this.checkGender();

        dataValue['birth_date'] = Utils.changeDateFormat(this.register.ssu.cardInfo.birthdate);
        dataValue['expired_date'] = Utils.changeDateFormat(this.register.ssu.cardInfo.expireDate);
        dataValue['issued_date'] = Utils.changeDateFormat(this.register.ssu.cardInfo.issueDate);

        const phone_info_list = this.checkPhoneListSSU(this.register.ssu);

        relation_info_list = this.setRelationlist();

        if (this.register.ssu.Contryincome.Select === '0') {
            this.register.ssu.Contryincome.Desc = AppConstant.COUNTRY_TH;
        }

        const dateNow = this.getCurrentDate('yyy-mm-dd');
        Utils.logDebug('CreateCustomerIndividual', 'CreateCustomerIndividual');
        this.registerService.CreateCustomerIndividual(this.register, dataValue, dateNow, relation_info_list, phone_info_list)
            .subscribe(
                createCustomerData => {
                    Utils.logDebug('CreateCustomerIndividual', 'createCustomerData : ' + JSON.stringify(createCustomerData));
                    this.register.onStatus = 'print';
                    //Utils.logDebug('CreateCustomerIndividual', 'CreateCustomerIndividual -> UpdateKYCLevel');
                    //this.UpdateKYCLevel();
                    this.onRequestPrintPDF();

                    // get address seq and contact seq
                    Utils.logDebug('CreateCustomerIndividual', 'getGetSubscriptionInfo');
                    this.accountService.getGetSubscriptionInfo(this.register.ssu.cardInfo.idCardNumber)
                        .subscribe(
                            Data => {
                                const dataAddressCustomer = Data.data.address_info_detail;
                                Utils.logDebug('CreateCustomerIndividual', 'getGetSubscriptionInfo -> dataAddressCustomer : ' + JSON.stringify(dataAddressCustomer));
                                const dataMobile = Data.data.contact_info_detail
                                    .filter(Value => Value.CONTACT_CODE === AppConstant.ContactTypeMobileCode)
                                    .sort(function (a, b) {
                                        return b.SEQ - a.SEQ;
                                    });
                                Utils.logDebug('CreateCustomerIndividual', 'getGetSubscriptionInfo -> dataMobile : ' + JSON.stringify(dataMobile));
                                const dataEmail = Data.data.contact_info_detail
                                    .filter(Value => Value.CONTACT_CODE === AppConstant.ContactTypeEmailCode)
                                    .sort(function (a, b) {
                                        return b.SEQ - a.SEQ;
                                    });
                                Utils.logDebug('CreateCustomerIndividual', 'getGetSubscriptionInfo -> dataEmail : ' + JSON.stringify(dataEmail));
                                // const contact = new ContactInfo();
                                // contact.EMAIL_SEQ = dataEmail[0].SEQ;
                                // contact.MOBILE_NO_SEQ = dataMobile[0].SEQ;
                                this.register.ssu.contact.EMAIL_SEQ = dataEmail[0].SEQ;
                                this.register.ssu.contact.MOBILE_NO_SEQ = dataMobile[0].SEQ;

                                // filter find address seq match user selected
                                if (this.register.subscription.current.Type === 'CI') {
                                    // register
                                    this.register.subscription.address.seq = dataAddressCustomer.filter(x => x.Address_Type === AppConstant.AddressTypeRegister)[0].ADDRESS_SEQ;
                                } else if (this.register.subscription.current.Type === 'CU') {
                                    // office
                                    this.register.subscription.address.seq = dataAddressCustomer.filter(x => x.Address_Type === AppConstant.AddressTypeOffice)[0].ADDRESS_SEQ;
                                } else if (this.register.subscription.current.Type === 'CS') {
                                    // mailling
                                    const addressMailing = dataAddressCustomer.filter(x => x.Address_Type === AppConstant.AddressTypeMailing);
                                    const seq = addressMailing.filter(x => x.ADDRESS_NUMBER === this.register.ssu.current.address.no)[0].ADDRESS_SEQ;
                                    this.register.subscription.address.seq = seq;
                                } else if (this.register.subscription.current.Type === 'IN') {
                                    // mailling input
                                    const addressMailing = dataAddressCustomer.filter(x => x.Address_Type === AppConstant.AddressTypeMailing);
                                    const seq = addressMailing.filter(x => x.ADDRESS_NUMBER === this.register.subscription.address.no)[0].ADDRESS_SEQ;
                                    this.register.subscription.address.seq = seq;
                                }
                                Utils.logDebug('CreateCustomerIndividual', 'getGetSubscriptionInfo -> this.register : ' + JSON.stringify(this.register));
                            }
                        );

                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public updateAddressSeq() {

    }

    public updateContactSeq() {

    }

    public setRelationlist() {
        const relation_info_list = [];
        if (this.register.ssu.relationship.Data1 !== '') {
            if (this.register.ssu.relationship.title1.TH_Id !== '' && this.register.ssu.relationship.name1.TH !== '' && this.register.ssu.relationship.surname1.TH !== '') {
                relation_info_list.push({
                    ["relation_first_name_th"]: this.register.ssu.relationship.name1.TH,
                    ["relation_last_name_th"]: this.register.ssu.relationship.surname1.TH,
                    ["relation_middle_name_en"]: "",
                    ["relation_middle_name_th"]: "",
                    ["relation_phone"]: this.register.ssu.relationship.contact1.moblie_phone,
                    ["relation_type"]: this.register.ssu.relationship.Data1,
                    ["relation_inv_rel_type"]: this.register.ssu.relationship.Data1,
                    ["relation_desc"]: this.register.ssu.relationship.Other1,
                    ["relation_type_gender"]: this.register.ssu.relationship.gender1.value,
                    ["relation_type_title_id"]: this.register.ssu.relationship.title1.TH_Id
                });
            }
        }

        if (this.register.ssu.relationship.Data2 !== '') {
            if (this.register.ssu.relationship.title2.TH_Id !== '' && this.register.ssu.relationship.name2.TH !== '' && this.register.ssu.relationship.surname2.TH !== '') {
                relation_info_list.push({
                    ["relation_first_name_th"]: this.register.ssu.relationship.name2.TH,
                    ["relation_last_name_th"]: this.register.ssu.relationship.surname2.TH,
                    ["relation_middle_name_en"]: "",
                    ["relation_middle_name_th"]: "",
                    ["relation_phone"]: this.register.ssu.relationship.contact2.moblie_phone,
                    ["relation_type"]: this.register.ssu.relationship.Data2,
                    ["relation_inv_rel_type"]: this.register.ssu.relationship.Data2,
                    ["relation_desc"]: this.register.ssu.relationship.Other2,
                    ["relation_type_gender"]: this.register.ssu.relationship.gender2.value,
                    ["relation_type_title_id"]: this.register.ssu.relationship.title2.TH_Id
                }
                );
            }
        }
        return relation_info_list
    }

    public UpdateKYCLevel() {
        Utils.logDebug('UpdateKYCLevel', 'start');
        this.registerService.UpdateKYCLevel(this.register)
            .subscribe(
                Data => {
                    Utils.logDebug('UpdateKYCLevel', 'onRequestPrintPDF');
                    this.onRequestPrintPDF();
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            )
    }

    public GetDummyAccountNo() {
        Utils.logDebug('GetDummyAccountNo', ' start');
        // this.registerService.GetDummyAccountNo()
        //     .subscribe(
        //         data => {
        //             this.register.subscription.account.ACCOUNT_NO = data.data.account_no;
        //             this.register.subscription.account.PMT_COND = 'S';
        //             this.checkOBJ();
        //         },
        //         Error => {
        //             this.onShowRespondMessage(Error.responseStatus.responseMessage);
        //         }
        //     )
        this.register.subscription.account.ACCOUNT_NO = '';
        this.register.subscription.account.PMT_COND = 'S';
        this.checkOBJ();
    }

    public OpenCASAAccount() {
        Utils.logDebug('OpenCASAAcount', 'start');
        //Utils.logDebug('OpenCASAcount', 'this.register : ' + JSON.stringify(this.register));

        let createMyPin = 'N';
        if (this.register.haveMyPin === 'N'
            && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
            && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {
            createMyPin = 'Y';
        }

        this.registerService.OpenCASAAcount(this.register, createMyPin)
            .subscribe(
                data => {
                    this.register.account_no = data.data.account_no;
                    if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeFix
                        && this.tempType === SubscriptionType.newSA) {
                        this.register.account_no_interest = data.data.account_no;
                        this.register.subscription.account.PROD_TYPE = AppConstant.ProdTypeSaving;
                    }
                    Utils.logDebug('OpenCASAAcount', 'checkSubService');
                    this.checkSubService();
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public async OpenTDAccount() {
        Utils.logDebug('OpenTDAccount', 'start');

        let createMyPin = 'N';
        if (this.register.haveMyPin === 'N'
            && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
            && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {
            createMyPin = 'Y';
        }

        // check new customer never open account
        this.accountService.getaccountlistbyidcard(this.register)
            .subscribe(
                dataAccount => {
                    let autoOpenCASAAccount = 'N';
                    Utils.logDebug('OpenTDAccount', 'getaccountlistbyidcard -> dataAccount : ' + JSON.stringify(dataAccount));
                    if (Number(dataAccount.data.TotalSAAccount) > 0 || Number(dataAccount.data.TotalCAAccount > 0)) {
                        autoOpenCASAAccount = 'N';
                    } else {
                        autoOpenCASAAccount = 'Y';
                    }

                    // open td account
                    this.registerService.OpenTDAcount(this.register, autoOpenCASAAccount, createMyPin)
                        .subscribe(
                            data => {
                                this.register.account_no = data.data.td_account_no;
                                if (autoOpenCASAAccount === 'Y') {
                                    this.register.account_no_interest = data.data.benefit_account_no;
                                } else {
                                    this.register.account_no_interest = '';
                                }
                                Utils.logDebug('OpenTDAccount', 'checkSubService');
                                this.checkSubService();
                            }, Error => {
                                Utils.logDebug('OpenTDAccount', 'OpenTDAcount -> Error');
                                this.onShowRespondMessage(Error.responseStatus.responseMessage);
                            }
                        );
                },
                ErrorAccount => {
                    Utils.logDebug('OpenTDAccount', 'getaccountlistbyidcard -> ErrorAccount');

                    // open td account
                    this.registerService.OpenTDAcount(this.register, 'Y', createMyPin)
                        .subscribe(
                            data => {
                                this.register.account_no = data.data.td_account_no;
                                this.register.account_no_interest = data.data.benefit_account_no;
                                Utils.logDebug('OpenTDAccount', 'checkSubService');
                                this.checkSubService();
                            }, Error => {
                                Utils.logDebug('OpenTDAccount', 'OpenTDAcount -> Error');
                                this.onShowRespondMessage(Error.responseStatus.responseMessage);
                            }
                        );
                }
            )
    }

    // create mypin
    public createCustPin(pin: string, withOtherSub: boolean) {
        Utils.logDebug('getCustomerProfileSub', 'start');
        const idCard = this.register.subscription.cardInfo.idCardNumber.length !== 0 ? this.register.subscription.cardInfo.idCardNumber : this.register.ssu.cardInfo.idCardNumber;
        Utils.logDebug('getCustomerProfileSub', 'idCard : ' + idCard);
        Utils.logDebug('getCustomerProfileSub', 'getCustomerProfileSub');
        this.accountService.getCustomerProfileSub(idCard, AppConstant.IdType)
            .subscribe(
                Value => {
                    this.register.KKCISID = Value.data.CUSTPROFILEMAINSUB_LIST.CUSTOMER_INFO_DETAIL.KKCISID;
                    Utils.logDebug('getCustomerProfileSub', 'getCustomerProfileSub -> CreateMyPinByKKCisId');
                    if (this.type !== 'SubSer') {
                        this.onRequestPrintPDF();
                    }

                    if (withOtherSub) {
                        this.CreateMyPinByKKCisId(pin);
                    } else {
                        this.CreateMyPinByKKCisIdOnly(pin);
                    }
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public getCustomerProfileMain() {
        Utils.logDebug('getCustomerProfileMain', 'getCustomerProfileMain');
        const idCard = this.register.subscription.cardInfo.idCardNumber.length !== 0 ? this.register.subscription.cardInfo.idCardNumber : this.register.ssu.cardInfo.idCardNumber
        this.accountService.getCustomerProfileMain(idCard, AppConstant.IdType)
            .subscribe(
                Value => {
                    const value = Value.data.CUSTPROFILEMAINSUB_LIST.CUSTPROFILEMAIN_INFO;
                    this.register.CISID = value.CISID;
                    if (isNullOrUndefined(this.register.CISID) || this.register.CISID === '') {
                        this.onShowRespondMessage("CISID is Null");
                    } else {
                        Utils.logDebug('getCustomerProfileMain', 'RegisterAnyIdByAccount');
                        this.RegisterAnyIdByAccount();
                    }
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public CheckKKAnyId_idcard() {
        Utils.logDebug('CheckKKAnyId_idcard', 'start');
        this.promtpay = false;
        this.progressModal = true;
        Utils.logDebug('CheckKKAnyId_idcard', 'CheckKKAnyId_idcard');
        this.registerService.CheckKKAnyId_idcard(this.register)
            .subscribe(
                data_idcard => {
                    Utils.logDebug('CheckKKAnyId_idcard', 'data_idcard : ' + JSON.stringify(data_idcard));
                    if (data_idcard.data.isRegisted === 'N') {
                        this.register.AnyIdType = AppConstant.REGISTER_ANY_ID_TYPE;
                        this.register.id13orPhoneNo = this.register.ssu.cardInfo.idCardNumber.toString();
                        Utils.logDebug('CheckKKAnyId_idcard', 'getCustomerProfileMain');
                        this.getCustomerProfileMain();
                    } else {
                        this.onShowRespondMessage(data_idcard.responseStatus.responseMessage);
                    }
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public CheckKKAnyId_mobile() {
        Utils.logDebug('CheckKKAnyId_mobile', 'start');
        this.promtpay = false;
        this.progressModal = true;
        this.registerService.CheckKKAnyId_mobile(this.register, this.otp_moblie_number)
            .subscribe(
                data_mobile => {
                    Utils.logDebug('CheckKKAnyId_idcard', 'data_mobile : ' + JSON.stringify(data_mobile));
                    if (data_mobile.data.isRegisted === 'N') {
                        this.register.AnyIdType = 'MSISDN';
                        this.register.id13orPhoneNo = this.register.subscription.contact.moblie_phone;
                        Utils.logDebug('CheckKKAnyId_mobile', 'getCustomerProfileMain');
                        this.getCustomerProfileMain();
                    } else {
                        this.onShowRespondMessage(data_mobile.responseStatus.responseMessage);
                    }
                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public RegisterAnyIdByAccount() {
        Utils.logDebug('RegisterAnyIdByAccount', 'start');
        this.registerService.RegisterAnyIdByAccount(this.register)
            .subscribe(
                Value => {
                    this.RegisPromtPay = true;
                    Utils.logDebug('RegisterAnyIdByAccount', 'onPrintPromptPayForm');
                    this.onPrintPromptPayForm();
                }, Error => {
                    this.progressModal = false;
                    this.progressModalFailNoneRedirect = true;
                    this.RespondCode = Error.responseStatus.responseMessage;
                }
            );
    }

    public generateOTP() {
        Utils.logDebug('generateOTP', ' start');
        const txn_type = AppConstant.OTP_ACCEPT_TERM_TH;
        this.registerService.generateOTP(this.register, txn_type)
            .subscribe(
                Value => {

                }, Error => {
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            )
    }

    public getJobid(job_id) {
        Utils.logDebug('getJobid', 'start');
        Utils.logDebug('getJobid', 'job_id : ' + job_id);
        if (this.TD_SA === true) {
            this.productType = AppConstant.ProdTypeSaving;
        } else {
            this.productType = this.register.subscription.account.PROD_TYPE;
        }
        Utils.logDebug('getJobid', 'OpenCASAAccount');
        if (this.productType === AppConstant.ProdTypeSaving
            || this.productType === AppConstant.ProdTypeCurrent) {
            this.OpenCASAAccount();
        }
        if (this.productType === AppConstant.ProdTypeFix) {
            this.OpenTDAccount();
        }
    }

    public checkSubService() {
        Utils.logDebug('checkSubService', 'start');
        if (this.TD_SA === false && this.register.haveMyPin === 'N' && this.tempType !== SubscriptionType.newTD) {
            Utils.logDebug('checkSubService', 'SaveSubscriptionServiceWithPin');
            // save sub with create pin
            this.SaveSubscriptionServiceWithPin();
        } else {
            Utils.logDebug('checkSubService', 'SaveSubscriptionService');
            // save sub without pin
            this.SaveSubscriptionService();
        }
    }

    public showPDFConfirm() {
        Utils.logDebug('showPDFConfirm', 'start');
        this.register.onStatus = 'preview';
        this.mypin = false;
        this.otp = false;
        this.AddressSameOld = false;
        this.register.onStatus = 'preview';
        if (isNullOrUndefined(this.register.ssu.office.address)) {
            this.register.ssu.office.address = this.register.subscription.office.address;
        }

        if (isNullOrUndefined(this.register.ssu.current.address)) {
            this.register.ssu.current.address = this.register.subscription.current.address;
        }

        if (this.customerSSU === 'N') {
            Utils.logDebug('showPDFConfirm', 'masterAppForm');
            this.masterAppForm();
            Utils.logDebug('showPDFConfirm', 'subscriptionForm');
            this.subscriptionForm();
        } else {
            Utils.logDebug('showPDFConfirm', 'subscriptionForm');
            this.subscriptionForm();
        }
    }

    public masterAppForm() {
        Utils.logDebug('masterAppForm', 'start');
        Utils.logDebug('masterAppForm', 'GetMasterAppForm');
        this.registerService.GetMasterAppForm(this.register)
            .subscribe(
                dataPDF => {
                    this.pdfFormMasterApp = 'data:application/pdf;base64,' + dataPDF.data.content;
                }
            );
    }

    public subscriptionForm() {
        Utils.logDebug('subscriptionForm', 'start');
        this.checkSubscriptionFromTitle();

        let subscriptionService = {};
        Utils.logDebug('subscriptionForm', 'this.register => ' + JSON.stringify(this.register));
        Utils.logDebug('subscriptionForm', 'this.register.subscription => ' + JSON.stringify(this.register.subscription));
        let isSMS = 'N';
        isSMS = this.checkServiceSMS();
        if (isSMS === 'Y') {
            this.checkSmsLangCode();
        }
        let getFormFor = '';
        if (!isNullOrUndefined(this.register.subscription.account.PROD_TYPE) && this.type !== 'SubSer') {
            getFormFor = 'OpenAccount';
        } else if (this.type === 'SubSer') {
            getFormFor = 'SubService';
        }

        let createMyPin = 'N';
        if (this.register.haveMyPin === 'N'
            && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
            && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {
            createMyPin = 'Y';
        }

        let sentIB = 'Y'; // N = regis , Y = not regis
        if (this.type === 'SubSer') {
            if (this.register.haveIB === 'N' && (createMyPin === 'Y' || this.selected === 'eBanking')) {
                sentIB = 'N';
            }
        } else {
            sentIB = this.register.haveIB;
        }

        Utils.logDebug('subscriptionForm', 'this.atmServiceChecked => ' + this.atmServiceChecked);
        if (this.atmServiceChecked === true) {

            subscriptionService = {
                ['atm_flg']: 'Y',
                ['atm_no']: '',
                ['atm_pri_account']: Utils.checkEmptyValue(this.register.account_no),
                ['card_type']: Utils.checkEmptyValue(this.register.subscriptionService.service.card_type),
                ['deducted_account_no']: Utils.checkEmptyValue(this.register.account_no_interest),
                ['ib_flg']: sentIB,
                ['create_mypin']: createMyPin,
                ['phone_flg']: 'N',
                ['sms_flg']: isSMS,
                ['sms_lang']: this.register.subscriptionService.service.sms.SMS_LANG
            };
        } else {
            subscriptionService = {
                ['atm_flg']: 'N',
                ['atm_no']: '',
                ['atm_pri_account']: '',
                ['card_type']: '',
                ['deducted_account_no']: Utils.checkEmptyValue(this.register.account_no_interest),
                ['ib_flg']: sentIB,
                ['create_mypin']: createMyPin,
                ['phone_flg']: 'N',
                ['sms_flg']: isSMS,
                ['sms_lang']: this.register.subscriptionService.service.sms.SMS_LANG
            };
        }

        this.registerService.GetSubscriptionForm2(this.register, subscriptionService, this.customerExist, getFormFor)
            .subscribe(
                dataPDF => {
                    //this.pdfConfirm2 = 'VIB/files/inv_fund_fact/PHATRA%20MP.pdf';
                    // this.pdfConfirm2 = 'VIBContent/subscription_20190103_1234.pdf';
                    this.pdfFormProduct = '';
                    this.pdfFormProductBenefit = '';
                    this.pdfFormService = '';
                    this.pdfFormProduct = 'data:application/pdf;base64,' + dataPDF.data.content_form_product;
                    if (dataPDF.data.content_form_product_benefit !== '') {
                        this.pdfFormProductBenefit = 'data:application/pdf;base64,' + dataPDF.data.content_form_product_benefit;
                    }
                    if (dataPDF.data.content_form_service !== '') {
                        this.pdfFormService = 'data:application/pdf;base64,' + dataPDF.data.content_form_service;
                    }
                    this.progressModal = false;
                    this.genPDF = true;
                    this.register.E_name = "";
                    this.register.E_lastname = "";
                    this.getkeyboard();
                }, Error => {
                    this.genPDF = false;
                    this.onShowRespondMessage(Error.responseStatus.responseMessage);
                }
            );
    }

    public checkProdTypeSavingOrCurrent() {
        return this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeSaving
            || this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeCurrent;
    }

    public checkSubscriptionFromTitle() {
        if (!isNullOrUndefined(this.register.subscription.cardInfo.titleFullTH) || this.register.subscription.cardInfo.titleFullTH !== '') {
            this.register.subscription.cardInfo.titleFullTH = this.register.ssu.cardInfo.titleFullTH;
        }
    }

    public checkSmsLangCode() {
        if (this.SMS_LANG_CODE === '2') {
            this.register.subscriptionService.service.sms.SMS_LANG = 'อังกฤษ';
            this.register.subscriptionService.service.sms.SMS_LANG_CODE = '2';
        } else {
            this.register.subscriptionService.service.sms.SMS_LANG = 'ไทย';
            this.register.subscriptionService.service.sms.SMS_LANG_CODE = '1';
        }
    }

    public checkAccNOFee() {
        return this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeFix && this.tempType !== SubscriptionType.newSA && this.register.haveFD === 'Y' ? this.register.subscriptionService.service.internet.AccountNoFeeSMS : this.register.account_no_interest;
    }

    public checkPmtCond() {
        if (this.register.subscription.account.PMT_COND === 'S') {
            return 'สั่งจ่ายคนเดียว';
        } else {
            return 'อื่นๆ';
        }
    }

    public checkServiceSMS() {
        if (this.register.smsServiceChecked === true) {
            return 'Y';
        } else {
            return 'N';
        }
    }

    public showModalPromtPay() {
        this.onCloseModalAll();
        this.promtpay = true;
        this.onClickShowModal();
    }


    public onSubscriptionAccount() {
        if (this.register.E_name !== this.register.ssu.cardInfo.nameTH || this.register.E_lastname !== this.register.ssu.cardInfo.surnameTH) {
            Modal.showAlert("กรุณาระบุ ชื่อ-นามสกุล ให้ถูกต้อง");
            return
        }
        this.ClickSave = false;
        this.genPDF = false;
        this.progressModal = true;
        this.progressModalFails = false;
        this.RespondCode = "";

        if (this.customerSSU === 'Y') {

            if (this.register.haveFD === 'N') {
                this.getConfigSubscription();
            } else {
                if (this.updateCardInfo === true) {
                    this.UpdateCustomer();
                } else {
                    if (this.type === 'SubSer') {
                        this.checkSubService();
                    } else {
                        this.GetDummyAccountNo();
                    }
                }
            }

        } else {
            if (this.updateCardInfo === true) {
                this.UpdateCustomer();
            } else {
                this.checkKYC();
            }
        }
    }

    public onSendTellerApproveSubscription(tellerApproveType, tellerApproveDetail) {
        Modal.showProgress();
        const date = Utils.getCurrentDate("", "dd/mm/yyyy");
        const time = Utils.getCurrentDate("", "HH:MM:ss");
        const id = Math.floor(Math.random() * 100);

        const data = {
            "txn_type": tellerApproveType,
            "txn_detail": tellerApproveDetail,
            "cust_name": this.register.ssu.cardInfo.titleTH + ' ' + this.register.ssu.cardInfo.nameTH + ' ' + this.register.ssu.cardInfo.surnameTH,
            "id_no": this.register.ssu.cardInfo.idCardNumber.toString()
        }

        this.tellerService.sendApproveTransaction(data)
            .subscribe(
                res => {
                    console.log('SubscriptionAccountComponent --- bass res ->', res)
                    const txn_id = (res.data) ? res.data.approveList.txn_id : null; // collect the id from the res

                    if (txn_id) {
                        this.loopCheckApproveStatus(txn_id); // pass the collected id to check the status
                    }
                },
                Error => {
                    this.ModalProgress(Error.responseStatus.responseMessage);
                }
            )

    }

    loopCheckApproveStatus(id) { // check the status for every specified milliseconds
        const startTime = new Date().getTime();
        const interval = setInterval(() => {
            console.log('SubscriptionAccountComponent ---bass this.dataService.currentUrl->', this.dataService.currentUrl)
            if (!/^[/]kk[/]subscription[/]account*/.test(this.dataService.currentUrl)) {
                clearInterval(interval);
                Modal.hide();
                return Utils.logDebug('onSendTellerApproveSubscription', 'loopCheckApproveStatus have been stopped');
            } else if (new Date().getTime() - startTime > 360000) { // 6 min timeout
                clearInterval(interval);
                Modal.hide();
                this.showConfirmModal("กรุณาติดต่อเจ้าหน้าที่");
                return Utils.logDebug('onSendTellerApproveSubscription', 'loopCheckApproveStatus have been stopped');
            }

            Utils.logDebug('onSendTellerApproveSubscription', 'loopCheckApproveStatus have been started');
            console.log('SubscriptionAccountComponent --- bass loopCheckApproveStatus id ->', id);

            this.tellerService.checkApproveStatus(id)
                .subscribe(
                    res => {
                        console.log('SubscriptionAccountComponent --- bass checkApproveStatus res ->', res)

                        if (res.data) {
                            res.data.approveList.filter(item => {
                                if (item.txn_id === id) {
                                    this.status = item.status;
                                }
                            });
                        }

                        console.log('SubscriptionAccountComponent --- bass loopCheckApproveStatus this.status ->', this.status);

                        if (this.status === "A" || this.status === "R" || this.status === "E") {
                            clearInterval(interval);
                            Modal.hide();
                            if (this.status === "A") {
                                this.register.isTellerApproved = true;
                                this.canFlip = true;
                                this.onFlipInit(this.flipBook); //----------------
                                this.changePage();
                            } else if (this.status === "R" || this.status === "E") {
                                this.register.isTellerApproved = false;
                                this.showConfirmModal("กรุณาติดต่อเจ้าหน้าที่");
                            }
                        }
                    }
                )
        }, 5000); // run it every 5 sec

    }

    // onGetApproveStatus(id) {
    //   // Utils.logDebug('onGetApproveStatus', 'id : ' + id);
    //   // Utils.logDebug('onGetApproveStatus', 'checkApproveStatus');
    //   let status = null;
    //   this.tellerService.checkApproveStatus(id)
    //     .subscribe(
    //       res => {
    //         console.log('SubscriptionAccountComponent --- bass checkApproveStatus res ->', res)
    //         Utils.logDebug('onGetApproveStatus', 'checkApproveStatus = res : ' + JSON.stringify(res));
    //         // Modal.hide();
    //         // if (res.machine_id !== Environment.machine_id) {
    //         //     return;
    //         // }
    //         const item = (res.data) ? res.data.approveList.filter(index => index.txn_id === id) : null;
    //         status = item.status;
    //         // Modal.hide();
    //       }
    //     )

    // }

    showConfirmModal(content: string) {
        Modal.showConfirmWithButtonText(content, "ลองใหม่อีกครั้ง", "ยกเลิกรายการ", () => {
            setTimeout(() => {
                this.onSendTellerApproveSubscription(this.tellerApproveType, this.tellerApproveDetail);
            }, 200);
        }, () => {
            this.router.navigate(["kk"])
        });

    }

    public ModalProgress(value) {
        Modal.showAlert(value)

    }

    public changePage() {
        if (this.customerExist === true) {
            console.log('changePage --- bass runs 1');
            this.checkExisting = true;
            this.changeFlipbook();
        } else {
            console.log('changePage --- bass runs 2');
            this.checkExisting = false;
            $("#ssuFrom_Address_Current :input").attr('disabled', true);
            $("#ssu_relationship1_Hide :input").attr('disabled', true);
            $("#ssu_relationship2_Hide :input").attr('disabled', true);
            this.changeFlipbook();
        }

    }

    public ongetAccountDetail() {
        this.progressModal = false;
        this.promtpay = false;

        if (this.type === 'SubSer') {
            let createMyPin = 'N';
            if (this.register.haveMyPin === 'N'
                && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
                && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')) {
                createMyPin = 'Y';
            }
            if (this.register.haveIB === 'Y') {
                if (createMyPin === 'Y'
                    && this.checkSavePinSuccess === true) {
                    // register only mypin
                    this.progressSuccess = true;
                    setTimeout(() => {
                        this.router.navigate(["/kk"]);
                    }, 1500);
                } else {
                    // not register mypin
                    this.router.navigate(["/kk"]);
                }
            } else if (this.register.haveIB === 'N') {
                if (createMyPin === 'Y'
                    && this.checkSavePinSuccess === true
                    && this.checkSaveIBSuccess === true) {
                    // register ib and mypin
                    this.progressSuccess = true;
                    setTimeout(() => {
                        this.router.navigate(["/kk"]);
                    }, 1500);
                } else {
                    // not register ib or mypin
                    this.router.navigate(["/kk"]);
                }
            } else {
                // not register ib or mypin
                this.progressSuccess = true;
                setTimeout(() => {
                    this.router.navigate(["/kk"]);
                }, 1500);
            }

        } else {

            this.progressSuccess = true;

            if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeCurrent
                || this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeSaving) {
                Utils.logDebug('ongetAccountDetail', 'getAccountDetail');
                this.accountService.getAccountDetail(this.register.account_no)
                    .subscribe(
                        Data => {
                            Utils.logDebug('ongetAccountDetail', 'Data : ' + JSON.stringify(Data));
                            this.dataService.selectedAccount = Data;
                            this.dataService.dataFrom = 'NC';
                            KeyboardService.setKeyboardHide();
                            this.router.navigate(["kk", "transactionBank"])
                        }, Error => {
                            this.progressModal = false;
                            this.MyPINerror = false;
                            this.progressModalFails = true;
                            this.RespondCode = Error.responseStatus.responseMessage;
                        }
                    )
            }
            if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeFix) {
                Utils.logDebug('ongetAccountDetail', 'getAccountTDDetail');
                this.accountService.getAccountTDDetail(this.register.account_no)
                    .subscribe(
                        Data => {
                            Utils.logDebug('ongetAccountDetail', 'Done Data : ' + JSON.stringify(Data));
                            const selectedBankAccount = new BankAccount(Data);
                            selectedBankAccount.accountType = AppConstant.ProdTypeFix;
                            selectedBankAccount.accountNumber = this.register.account_no;
                            selectedBankAccount.accountName = Data.accountName;
                            this.dataService.selectedAccount = selectedBankAccount;
                            this.dataService.dataFrom = 'NC';
                            KeyboardService.setKeyboardHide();
                            this.router.navigate(["kk", "transactionBank"])
                        }, Error => {
                            Utils.logDebug('ongetAccountDetail', 'Error');
                            this.progressModal = false;
                            this.MyPINerror = false;
                            this.progressModalFails = true;
                            this.RespondCode = Error.responseStatus.responseMessage;
                        }
                    )
            }
        }
    }

    public onSubmitMyPIN() {
        this.mypin = false;
        this.progressModalFails = false;
        this.progressModal = true;
        Utils.logDebug('onSubmitMyPIN', 'this.dataService.selectedProduct.PROD_TYPE : ' + this.dataService.selectedProduct.PROD_TYPE);
        Utils.logDebug('onSubmitMyPIN', 'loginWithIDAndPINNewVIB');
        this.loginService.loginWithIDAndPINNewVIB(this.register.ssu.cardInfo.idCardNumber.toString(), this.register.AuthenMyPIN, AppConstant.LoginType.IDNoMyPIN)
            .subscribe(
                userProfile => {
                    this.onCloseModalAll();
                    Utils.logDebug('onSubmitMyPIN', 'loginWithIDAndPINNewVIB -> this.type : ' + this.type);
                    if (this.type === 'SubSer') {
                        Utils.logDebug('onSubmitMyPIN', 'loginWithIDAndPINNewVIB -> this.register.haveFD : ' + this.register.haveFD);
                        if (this.register.haveFD === 'Y') {
                            switch (this.dataService.selectedProduct.PROD_TYPE) {
                                case 'SMS':
                                    this.selected = 'SMS';
                                    break;
                                case 'PromptPay':
                                    this.selected = 'PromptPay';
                                    break;
                                case 'Debit Card':
                                    this.selected = 'Debit Card';
                                    break;
                                case 'eBanking':
                                    this.selected = 'eBanking';
                                    break;
                            }
                            this.userService.loginSuccess(userProfile);
                            this.dataList = [];
                            this.onShow(true);
                            this.ongetAccountListService(this.selected);
                        } else {
                            Modal.showAlertWithOk(Th.CUSTOMER_DIDNOT_HAVE_BANKACCOUNT, () => {
                                this.router.navigate(["/kk"]);
                            });
                        }
                    } else {
                        Utils.logDebug('onSubmitMyPIN', 'loginWithIDAndPINNewVIB -> onSendTellerApproveSubscription(2)');
                        this.tellerApproveType = 'เปิดบัญชี';
                        this.tellerApproveDetail = this.dataService.selectedProduct.PROD_DESC;
                        if (this.dataService.selectedProduct.PROD_TYPE === AppConstant.ProdTypeSaving) {
                            this.onSendTellerApproveSubscription(this.tellerApproveType, this.tellerApproveDetail);
                        } else if (this.dataService.selectedProduct.PROD_TYPE === AppConstant.ProdTypeFix) {
                            this.onSendTellerApproveSubscription(this.tellerApproveType, this.tellerApproveDetail);
                        } else if (this.dataService.selectedProduct.PROD_TYPE === AppConstant.ProdTypeCurrent) {
                            this.onSendTellerApproveSubscription(this.tellerApproveType, this.tellerApproveDetail);
                        } else {
                            this.onSendTellerApproveSubscription('', '');
                        }
                    }
                },
                Error => {
                    this.progressModal = false;
                    this.mypin = false;
                    this.MyPINerror = true;
                    this.RespondCode = Error.responseStatus.responseMessage;
                }
            );
    }

    public onRestartMyPIN() {
        this.MyPINerror = false;
        this.mypin = true;
        this.register.AuthenMyPIN = '';
        this.getkeyboard();

        if (this.PINcount === 4) {
            const that = this;
            Modal.showConfirmWithSigleButtonText('ท่านกรอก รหัสส่วนตัวMyPINเกินกำหนด ระบบจะยกเลิกการทำรายการของท่าน', "ตกลง", function () {
                that.redirectToMain('seletor_content_modal');
            }, null);
        } else {
            this.PINcount++;
        }
    }

    public redirectToMain(type) {
        const that = this;
        switch (type) {
            case 'seletor_content_modal':
                Utils.animate("#seletor_content_modal", "fadeOutDown")
                    .then(() => {
                        that.router.navigate(["/kk"]);
                    });
                break;
        }
    }

    public onClickShowModal() {
        Utils.animate("#seletor_content_modal", "fadeInUp")
            .then(
                $(`${"#seletor_content_modal"},${"#dismiss_bg_otp"}`).show()
            );
        this.getkeyboard();
    }

    public onClickDismiss() {
        if (this.otp === true || this.mypin === true) {
            this.submit = false;
            //$('#submit_CustomerInfo_id').show();
            this.btnSubmit = '';
            this.router.navigate(["/kk/"]);
        }

        setTimeout(() => {
            this.onCloseModalAll();
        }, 700);
    }

    public onClickDismissError() {
        this.onCloseModalAll();
        this.router.navigate(["/kk/"]);
    }

    public onCloseModalMyPinError() {
        this.onCloseModalAll();
        this.ongetAccountDetail();
    }

    public onCloseModalAll() {
        this.mypin = false;
        this.otp = false;
        this.MyPINerror = false;
        this.AddressSameOld = false;
        this.progressModal = false;
        this.genPDF = false;
        this.progressModalFailNoneRedirect = false;
        this.progressModalFailCreateMyPinTDAccount = false;
        this.progressModalFails = false;
        $(`${"#seletor_content_modal"},${"#dismiss_bg"},${"#dismiss_bg_otp"}`).hide()
    }

    public onShowPassRespondMessage(responseMessage) {
        this.progressModal = false;
        this.MyPINerror = false;
        this.progressModalFails = false;
        this.progressPassRespond = false;
        this.RespondCode = responseMessage;
    }

    public onShowRespondMessage(responseMessage) {
        this.progressModal = false;
        this.MyPINerror = false;
        this.progressPassRespond = false;
        this.progressModalFails = true;
        this.RespondCode = responseMessage;
    }

    public onShowFailMessage(responseMessage, accountType) {
        if (accountType === AppConstant.ProdTypeSaving) {
            this.progressModalFailNoneRedirect = true;
            this.progressModalFailCreateMyPinTDAccount = false;
        } else {
            this.progressModalFailNoneRedirect = false;
            this.progressModalFailCreateMyPinTDAccount = true;
        }
        this.progressModal = false;
        this.MyPINerror = false;
        this.progressModalFails = false;
        this.progressPassRespond = false;
        this.RespondCode = responseMessage;
    }

    public onSelectedAccount($selectedBankAccount) {
        this.isSelectAccount = false;
        this.onSelectedAccountValue = $selectedBankAccount;
        this.register.subscription.account.PROD_TYPE = $selectedBankAccount.accountType;
        this.register.account_no = $selectedBankAccount.accountNumber;
        this.showFlipbook = true;
        setTimeout(() => {
            this.checkReadCard();
            // this.changeFlipbook();
        }, 2000);
    }

    public onAtmCheckboxPrincipalChanged(checkbox) {
        this.atmServiceChecked = checkbox.checked;
        this.register.atmServiceChecked = this.atmServiceChecked;
        if (isNullOrUndefined(this.atmList) || this.atmList.length === 0) {
            this.getMasterATM();
        } else {
            this.initATMList();
        }
    }

    public onSpouseStatusChanged($event) {

        if ($event !== '02') {
            this.register.ssu.spouse.title.TH = "";
            this.register.ssu.spouse.title.TH_Id = "";
            this.register.ssu.spouse.title.EN = "";
            this.register.ssu.spouse.title.EN_Id = "";

            this.register.ssu.spouse.name.TH = "";
            this.register.ssu.spouse.name.EN = "";
            this.register.ssu.spouse.surname.TH = "";
            this.register.ssu.spouse.surname.EN = "";
        }

        if ($event === "01") {
            if (this.register.ssu.relationship.Data1 === "04") {
                $(`#label_ssu_relationship1${this.register.ssu.relationship.Data1}_id`).removeClass('checked');
                this.register.ssu.relationship.Data1 = "";
                this.register.ssu.relationship.title1.TH = "";
                this.register.ssu.relationship.title1.TH_Id = "";
                this.register.ssu.relationship.name1.TH = "";
                this.register.ssu.relationship.surname1.TH = "";
                this.register.ssu.relationship.contact1.moblie_phone = "";
            }
            if (this.register.ssu.relationship.Data2 === "04") {
                $(`#label_ssu_relationship2${this.register.ssu.relationship.Data2}_id`).removeClass('checked');
                this.register.ssu.relationship.Data2 = "";
                this.register.ssu.relationship.title2.TH = "";
                this.register.ssu.relationship.title2.TH_Id = "";
                this.register.ssu.relationship.name2.TH = "";
                this.register.ssu.relationship.surname2.TH = "";
                this.register.ssu.relationship.contact2.moblie_phone = "";
            }
        }
    }

    public OngetValueCommandPrint(base64data) {
        this.hardwareService.connectHardware();
        this.register.onStatus = '';
        const data = {
            "cmd": "printerSendQueryPdf",
            "params": {
                "doc": "PRINT_BASE64_PDF",
                "base64data": base64data
            }
        };
        const json = JSON.stringify(data);
        Utils.logDebug('OngetValueCommandPrint', json);
        this.hardwareService.requestPrintPDF(json);
    }

    public onRequestPrintPDF() {
        Utils.logDebug('onRequestPrintPDF', 'Start');
        this.register.onStatus = 'print';
        this.hardwareService.connectHardware();
        this.mypin = false;
        this.promtpay = false;
        // this.progressModal = true;
        if (this.customerSSU === 'N') {
            this.registerService.GetMasterAppForm(this.register)
                .subscribe(
                    dataPDF => {
                        const base64data = dataPDF.data.content;
                        const data = {
                            "cmd": "printerSendQueryPdf",
                            "params": {
                                "doc": "PRINT_BASE64_PDF",
                                "base64data": base64data
                            }
                        };
                        const json = JSON.stringify(data);
                        this.hardwareService.requestPrintPDF(json);
                        setTimeout(() => {
                            this.onPrintFATCAForm();
                        }, 3000);

                    }, Error => {
                        this.onShowRespondMessage(Error.responseStatus.responseMessage);
                    }
                );
        } else {
            this.onPrintSubscriptionForm();
        }
    }

    public onPrintFATCAForm() {
        Utils.logDebug('onPrintFATCAForm', 'start');
        Utils.logDebug('onPrintFATCAForm', 'GetFATCAForm');
        this.register.onStatus = 'print';
        this.registerService.GetFATCAForm(this.register)
            .subscribe(
                dataPDF => {
                    Utils.logDebug('onPrintFATCAForm', 'GetFATCAForm -> dataPDF : ' + JSON.stringify(dataPDF));
                    const data = dataPDF.data.content;
                    this.OngetValueCommandPrint(data);
                    setTimeout(() => {
                        this.customerSSU = 'Y';
                        this.getConfigSubscription();
                    }, 3000);
                }, Error => {
                    this.progressSuccess = false;
                    this.progressModalFails = false;
                    this.progressModalFailNoneRedirect = true;
                    Modal.showAlert(Error.responseStatus.responseMessage);
                }
            )
    }

    public onPrintSubscriptionForm() {

        this.checkTDSA();

        let subscriptionService = {};
        let isSMS = 'N';
        isSMS = this.checkServiceSMS();
        if (isSMS === 'Y') {
            this.checkSmsLangCode();
        }
        this.register.onStatus = 'print';

        let getFormFor = '';
        if (!isNullOrUndefined(this.register.subscription.account.PROD_TYPE) && this.type !== 'SubSer') {
            getFormFor = 'OpenAccount';
        } else if (this.type === 'SubSer') {
            getFormFor = 'SubService';
        }

        let createMyPin = 'N';
        if (this.register.haveMyPin === 'N'
            && (!isNullOrUndefined(this.assign_mypin_1) && this.assign_mypin_1 !== '')
            && (!isNullOrUndefined(this.assign_mypin_2) && this.assign_mypin_2 !== '')
            && this.checkSavePinSuccess === true) {
            createMyPin = 'Y';
        }

        let sentIB = 'Y'; // N = regis , Y = not regis
        if (this.type === 'SubSer') {
            if (this.register.haveIB === 'N' && this.checkSaveIBSuccess === true) {
                sentIB = 'N';
            }
        } else {
            sentIB = this.register.haveIB;
        }

        if (this.atmServiceChecked === true) {

            subscriptionService = {
                ['atm_flg']: 'Y',
                ['atm_no']: '',
                ['atm_pri_account']: Utils.checkEmptyValue(this.register.account_no),
                ['card_type']: Utils.checkEmptyValue(this.register.subscriptionService.service.card_type),
                ['deducted_account_no']: Utils.checkEmptyValue(this.register.account_no_interest),
                ['ib_flg']: sentIB,
                ['create_mypin']: createMyPin,
                ['phone_flg']: 'N',
                ['sms_flg']: isSMS,
                ['sms_lang']: this.register.subscriptionService.service.sms.SMS_LANG
            };
        } else {
            subscriptionService = {
                ['atm_flg']: 'N',
                ['atm_no']: '',
                ['atm_pri_account']: '',
                ['card_type']: '',
                ['deducted_account_no']: Utils.checkEmptyValue(this.register.account_no_interest),
                ['ib_flg']: sentIB,
                ['create_mypin']: createMyPin,
                ['phone_flg']: 'N',
                ['sms_flg']: isSMS,
                ['sms_lang']: this.register.subscriptionService.service.sms.SMS_LANG
            };
        }

        if (this.selected !== 'PromptPay') {
            this.registerService.GetSubscriptionForm2(this.register, subscriptionService, this.customerExist, getFormFor)
                .subscribe(
                    dataPDF => {
                        const delaySendPrintProduct = 1000;
                        const delaySendPrintBenefit = 2000;
                        let delaySendPrintService = 3000;
                        const dataProduct = dataPDF.data.content_form_product;
                        setTimeout(() => {
                            this.OngetValueCommandPrint(dataProduct);
                        }, delaySendPrintProduct);

                        const dataProductBenefit = dataPDF.data.content_form_product_benefit;
                        if (dataProductBenefit !== '') {
                            delaySendPrintService += 1000;
                            setTimeout(() => {
                                this.OngetValueCommandPrint(dataProductBenefit);
                            }, delaySendPrintBenefit);
                        }

                        const dataService = dataPDF.data.content_form_service;
                        if (dataService !== '') {
                            setTimeout(() => {
                                this.OngetValueCommandPrint(dataService);
                            }, delaySendPrintService);
                        }
                        // if (this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeFix) {
                        //     this.ongetAccountDetail();
                        // }
                    }, Error => {
                        this.progressModalFailNoneRedirect = true;
                        Modal.showAlert(Error.responseStatus.responseMessage);
                    });
        } else {
            this.onPrintPromptPayForm();
        }
    }

    public checkTDSA() {
        if (this.TD_SA_FLAG === true) {
            this.tempType = SubscriptionType.newSA;
        }
    }

    public checkAccNoFeeOnPrint() {
        return this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeFix && this.register.haveFD === 'Y' ? this.register.subscriptionService.service.internet.AccountNoFeeSMS : this.register.account_no_interest;
    }

    public checkServiceATM() {
        if (isNullOrUndefined(this.register.subscription_id) || this.register.subscription_id === '') {
            this.register.subscription_id = 'ATM';
        }
    }

    public checkPhoneService() {
        if (this.register.haveFD === 'N') {
            return true;
        }
    }

    public checkProdType() {
        return this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeSaving || this.register.subscription.account.PROD_TYPE === AppConstant.ProdTypeCurrent;
    }

    public checkSubIB() {
        return this.register.haveMyPin === 'N' && this.subIB === true;
    }

    public checkProdTypeAndSubService() {
        return !isNullOrUndefined(this.register.subscription.account.PROD_TYPE) && this.type !== 'SubSer';
    }

    public onPrintPromptPayForm() {
        this.register.onStatus = 'print';
        if (this.RegisPromtPay === true) {
            this.registerService.GetPromptPayForm(this.register)
                .subscribe(
                    dataPDF => {
                        const data = dataPDF.data.content;
                        setTimeout(() => {
                            this.OngetValueCommandPrint(data);
                        }, 1000);
                        if (this.type !== 'SubSer') {
                            this.ongetAccountDetail();
                        } else {
                            this.progressSuccess = true;
                            this.progressModal = false;
                            setTimeout(() => {
                                this.progressSuccess = false;
                                this.ongetAccountDetail();
                            }, 1500);
                        }
                    }, Error => {
                        Modal.showAlert(Error.responseStatus.responseMessage);
                    });
        } else {
            this.ongetAccountDetail();
        }
    }
}
