import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from "../../../../_service/user.service";
import {Modal} from "../../../../_share/modal-dialog/modal-dialog.component";
import {LoginService} from "../../../../_service/api/login.service";
import {DataService} from "../../../../_service/data.service";
import { AppConstant } from '../../../../../share/app.constant';

@Component({
    selector: 'card-my-pin',
    templateUrl: './card-my-pin.component.html',
    styleUrls: ['./card-my-pin.component.sass']
})
export class CardMyPinComponent implements OnInit {

    @Output() onAuthenticate: EventEmitter<boolean> = new EventEmitter<boolean>();
    public userLogin = {
        pin: ""
    };

    constructor(private loginService: LoginService,
                private userService: UserService,
                private dataService: DataService) {
    }

    ngOnInit() {
        // this.userLogin.pin = '987654';
    }


    onSubmit() {
        const idCard = this.userService.getUser().idNumber.toString();

        Modal.showProgress();

        setTimeout(() => {

            this.loginService.loginWithIDAndPINNewVIB(idCard, this.userLogin.pin, AppConstant.LoginType.IDNoMyPIN)
                .subscribe(
                    userProfile => {

                        this.dataService.isAuthenticated = true;
                        this.onAuthenticate.emit(true);
                    },
                    error => {
                        Modal.showAlert(error.responseStatus.responseMessage);
                        this.onAuthenticate.emit(false);
                    });

        }, 2000);
    }

}
