import {Component, EventEmitter, OnDestroy, OnInit, Output, AfterContentInit} from '@angular/core';
import {HardwareService} from "../../../../_service/hardware.service";
import { Modal } from '../../../../_share';
import { LoginService, UserService, KeyboardService, DataService } from '../../../../_service';
import { AppConstant } from '../../../../../share/app.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { BankAccount } from '../../../../_model';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment'
import { Utils } from 'app/share/utils';

@Component({
    selector: 'card-atm',
    templateUrl: './card-atm.component.html',
    styleUrls: ['./card-atm.component.sass']
})
export class CardAtmComponent implements OnInit, OnDestroy, AfterContentInit {

    @Output() onAuthenticate: EventEmitter<boolean> = new EventEmitter<boolean>();
    public loginMode;
    public isRequesting: boolean = false
    public readCardResults = null
    public userLogin = {
        atmNo: "",
        pindot: "",
        pin: "",
        encpin: ""
    };

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private hardwareService: HardwareService,
                private loginService: LoginService,
                private dataService: DataService,
                private userService: UserService) {
    }

    ngOnInit() {
        const objectParams = this.activatedRoute.snapshot.queryParams;
        this.loginMode = objectParams.mode;

        KeyboardService.initKeyboardInputText();
    }

    ngAfterContentInit() {
        this.isRequesting = true
        setTimeout(() => {
            // this.requestReadATMCard()
        }, 100);
    }

    ngOnDestroy() {
        this.hardwareService.disconnect()
        this.isRequesting = false
    }

    retry() {
        this.isRequesting = false
        this.userLogin.atmNo = ""
        this.userLogin.pin = ""
        this.userLogin.encpin = ""
        this.requestReadATMCard()
    }

    onInputPIN(data){
        this.userLogin.pin = data
        setTimeout(() => {
            this.userLogin.pindot = data.length == 0 ? "" : Utils.setPadZero( data, data.length)
        }, 10);
        
    }

    requestReadATMCard() {
        if (this.isRequesting) {
            console.log("atm reading")
            return
        }
        this.isRequesting = true
        this.hardwareService.requestATMUnionPAYReader()
            .subscribe(
                data => {
                    this.readCardResults = data
                    const scanCode = data.code;

                    if (scanCode === "0000") {
                        this.isRequesting = false
                        const expireDate = data.results.expDate
                        if (!this.checkExpiredDate(expireDate)) {
                            this.userLogin.atmNo = data.results.cardNumber
                            setTimeout(() => {
                                KeyboardService.initKeyboardInputText()
                            }, 100);
                        }
                        else {
                            console.log("card expired")
                        }
                    }
                    if (scanCode.startsWith("9")) {
                        this.isRequesting = false
                    }

                }, error => {
                    this.isRequesting = false
                });

    }

    public requestENCPin() {
        this.isRequesting = false
        this.hardwareService.requestENCPIN(this.userLogin.pin)
            .subscribe(
                data => {
                    const scanCode = data.code;

                    if (scanCode === "0000") {
                        Modal.hide();
                        this.userLogin.encpin = data.results
                        this.onRequestLogin()
                    }

                }, error => {
                    Modal.hide();
                });

    }

    checkExpiredDate(date) {

        const expireDate =  moment(date, "YYYY-MM-DD")
        const today = moment()

        return today.diff(expireDate, 'days') > 0
    }

    onClickLogin() {
        Modal.showProgress();
        this.requestENCPin()
    }

    onRequestLogin() {
        Modal.showProgress();

        this.loginService
            .loginWithATMAndPIN(this.userLogin.atmNo, this.userLogin.encpin, AppConstant.LoginType.ATMMyPIN)
            .subscribe(
                userProfile => {

                    if (this.loginMode === "authenticate" || this.loginMode === "authenticate-factor2") {
                        this.dataService.config.displayLoginCard = false;
                        const selectedBankAccountFrom: BankAccount = this.dataService.transaction.from

                        if (!isNullOrUndefined(selectedBankAccountFrom)) {
                                if (userProfile.idNumber.toString() !== selectedBankAccountFrom.citizenID) {
                                    //Authen: False
                                    Modal.showAlert("Authenication not match");
                                    this.onAuthenticate.emit(false);
                                    return
                                }
                        }
                        this.userService.authenFector1Success(userProfile);
                    }
                    else {
                        this.userService.isLoggedIn = true;
                        this.userService.loginSuccess(userProfile);
                    }

                    this.onAuthenticate.emit(true);
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                    this.onAuthenticate.emit(false);
                },
            );
    }
}
