import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, AfterContentInit } from '@angular/core';
import { HardwareService, DataService } from "app/kiatnakin/_service";
import { KeyboardService } from "app/kiatnakin/_service/keyboard.service";
import { Modal } from "../../../../_share/modal-dialog/modal-dialog.component";
import { UserService } from "../../../../_service/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginService } from "../../../../_service/api/login.service";
import { AppConstant } from '../../../../../share/app.constant';
import { BankAccount } from '../../../../_model';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'card-id-card',
    templateUrl: './card-id-card.component.html',
    styleUrls: ['./card-id-card.component.sass']
})
export class CardIdCardComponent implements OnInit, OnDestroy, AfterContentInit {

    @Output() onAuthenticate: EventEmitter<boolean> = new EventEmitter<boolean>();
    private loginMode;
    public textShow = ''
    public scanCode: string = '1000';
    public readCard: boolean = false;

    public userLogin = {
        pin: "",
        idCard: ""
    };

    constructor(private activatedRoute: ActivatedRoute,
        private hardwareService: HardwareService,
        private loginService: LoginService,
        private dataService: DataService,
        private userService: UserService, ) {
    }

    ngOnInit() {
        const objectParams = this.activatedRoute.snapshot.queryParams;
        this.loginMode = objectParams.mode;

    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.requestReadSmartCard()
        }, 1000);
    }

    ngOnDestroy() {
        this.hardwareService.disconnect();
    }

    requestReadSmartCard() {
        console.log("requestReadSmartCard");
        this.hardwareService.requestSmartCardReader()
            .subscribe(
                data => {
                    this.scanCode = data.code;
                    if (this.scanCode === "0000") {
                        this.userLogin.idCard = data.results.citizenId;
                        this.textShow = this.userLogin.idCard;
                        this.readCard = true;

                        setTimeout(() => {
                            KeyboardService.initKeyboardInputText()
                        }, 100);

                    }
                }, error => {
                    console.log(error);
                });

    }

    onClickLogin() {
        Modal.showProgress();

        setTimeout(() => {

            this.loginService.loginWithIDAndPINNewVIB(this.userLogin.idCard, this.userLogin.pin, AppConstant.LoginType.IDCardMyPIN)
                .subscribe(
                    userProfile => {

                        if (this.loginMode === "authenticate" || this.loginMode === "authenticate-factor2") {
                            this.dataService.config.displayLoginCard = false;
                            const selectedBankAccountFrom: BankAccount = this.dataService.transaction.from

                            if (!isNullOrUndefined(selectedBankAccountFrom)) {
                                if (userProfile.kkcisid.toString() !== selectedBankAccountFrom.custCif) {
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

                        this.userService.loginSuccess(userProfile);
                        this.onAuthenticate.emit(true);
                    },
                    error => {
                        Modal.showAlert(error.responseStatus.responseMessage);
                        this.onAuthenticate.emit(false);
                    });

        }, 2000);
    }

    public getkeyboard() {
        KeyboardService.initKeyboardInputText();
    }
}
