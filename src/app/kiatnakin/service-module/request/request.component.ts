import {Component, OnInit, OnDestroy, NgZone, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {BlueSapphire} from '../../_share/bluesapphire.module';
import {Utils} from '../../../share/utils';
import {DataService} from '../../_service/data.service';
import {KeyboardService} from '../../_service/keyboard.service';
import {Modal} from "../../_share/modal-dialog/modal-dialog.component";
import {HardwareService} from "../../_service/hardware.service";
import {UserService} from "../../_service/user.service";

@Component({
    selector: 'request',
    templateUrl: './request.component.html',
    styleUrls: ['./request.component.sass'],
    encapsulation: ViewEncapsulation.None
})
export class RequestComponent implements OnInit, OnDestroy {
    html: string;
    bs: BlueSapphire;
    third_party_scripts = {
        class_name: 'bluesapphire_third_party',
        scripts: [
            'assets/bluesapphire/bluesapphire.sprint3.bundle.js',
        ]
    };

    angular_obj = {
        ngZone: this.ngZone,
        router: this.router,
        dataService: this.dataService,
        third_party_scripts: this.third_party_scripts,
        function: {
            "initObject": this.initObject,
            "getReferenceNo": this.getReferenceNo,
            "Modal": this.Modal
        }
    };

    constructor(private ngZone: NgZone,
                private router: Router,
                private dataService: DataService,
                private hardwareService: HardwareService,
                private userService: UserService) {
        this.bs = new BlueSapphire(this.angular_obj);
        this.dataService.blueSapphireData["userService"] = this.userService;
        this.dataService.blueSapphireData["hardwareService"] = this.hardwareService;
    }

    ngOnInit() {
        this.bs.htmlChange.subscribe((htmlString: string) => {
            this.html = htmlString;
        });
    }

    private initObject() {
        KeyboardService.initKeyboardInputText();
    }

    private getReferenceNo() {
        return Utils.getReferenceNo();
    }

    private Modal() {
        return Modal;
    }

    ngOnDestroy() {
        this.bs.onDestroy();
    }
}
