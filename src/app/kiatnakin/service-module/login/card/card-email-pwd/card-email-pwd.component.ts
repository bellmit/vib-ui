import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../../_service/user.service";
import {LoginService} from "../../../../_service/api/login.service";
import {KeyboardService} from "../../../../_service/keyboard.service";
import {DataService} from "../../../../_service/data.service";
import {Modal} from "../../../../_share/modal-dialog/modal-dialog.component";
import { isNullOrUndefined } from 'util';
import { BankAccount } from 'app/kiatnakin/_model';
import { AppConstant } from '../../../../../share/app.constant';

@Component({
    selector: 'card-email-pwd',
    templateUrl: './card-email-pwd.component.html',
    styleUrls: ['./card-email-pwd.component.sass']
})
export class CardEmailPwdComponent implements OnInit {

    @Output() onAuthenticate: EventEmitter<boolean> = new EventEmitter<boolean>();
    private loginMode;
    public userLogin = {
        username: "",
        password: ""
        // username: "ribcbs002",
        // password: "P@ssw0rd"
    };

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private userService: UserService,
                private dataService: DataService,
                private loginService: LoginService) {
    }

    ngOnInit() {
        const objectParams = this.activatedRoute.snapshot.queryParams;
        this.loginMode = objectParams.mode;

        KeyboardService.initKeyboardInputText();
    }

    public onClickLogin() {

        Modal.showProgress();
        this.loginService
            .loginWithUsernameNewVIB(this.userLogin.username, this.userLogin.password, AppConstant.LoginType.UsernamePassword)
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

                    this.onAuthenticate.emit(true);
                },
                error => {
                    Modal.showAlert(error.responseStatus.responseMessage);
                    this.onAuthenticate.emit(false);
                },
            );
    }
}
