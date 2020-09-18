import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../_service/user.service";
import { Modal } from "../../../_share/modal-dialog/modal-dialog.component";
import { DataService } from "../../../_service/data.service";

@Component({
    selector: 'profile-card',
    templateUrl: 'profile-card.component.html',
    styleUrls: ['profile-card.component.sass']
})
export class ProfileCardComponent implements OnInit {

    constructor(public userService: UserService, public dataService: DataService) { }

    ngOnInit() {
    }

    public onClickEditProfile() {

    }

    public onClickLogout() {
        const that = this;
        Modal.showConfirmWithButtonText("ต้องการออกจากระบบหรือไม่?", "ยกเลิก", "ตกลง", () => {
        }, function () {
            that.dataService.isAcceptedTermMutualFund = false;
            that.userService.logout();
        });
    }
}
