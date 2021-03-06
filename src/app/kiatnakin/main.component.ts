import { Component, NgZone, OnInit, Renderer2, ViewChild, } from '@angular/core';
import { UserService, DataService } from "./_service/index";
import { Router, ActivatedRoute } from "@angular/router";
import { isNullOrUndefined } from "util";
import { AppConstant } from "../share/app.constant";
import { HardwareService } from "./_service/hardware.service";
import { environment } from "../../environments/environment";
import { Environment } from "../share/utils";
import { Modal } from "./_share/modal-dialog/modal-dialog.component";
import { TellerService } from "../kiatnakin/_service/teller.service";

@Component({
    selector: 'app-main',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.sass']
})


export class MainComponent implements OnInit {

    @ViewChild('divBell') divBell;
    public isCallAssistant: boolean = false;
    public windowVideoCall;
    public timerCheckWindowVideoCall;
    public messageCalling;
    public messageButtonCalling;
    public audio;
    idleTime;

    constructor(private router: Router,
        public userService: UserService,
        public dataService: DataService,
        private renderer: Renderer2,
        private hardwareService: HardwareService,
        private zone: NgZone) {

    }
    ngOnInit() {

        this.setIdleTimeout();
    }

    public setIdleTimeout() {

        const that = this;
        this.resetTimer();
        $(document).ready(function () {
            //Increment the idle time counter every minute.
            setInterval(function () {
                that.zone.run(() => {
                    that.idleTime -= 1;
                    if (that.idleTime <= 0) {
                        that.userService.logout();
                        that.resetTimer();
                        Modal.hide()
                    }
                });

            }, 1000); // 1 sec

            //Zero the idle timer on mouse movement.
            $(this).mousedown(function (e) {
                // console.log("mouseDown");
                that.resetTimer();
            });
            $(this).keypress(function (e) {
                // console.log("keypress");
                that.resetTimer();
            });

            document.onmousemove = function (e) {
                // console.log("onmousemove");
                that.resetTimer();
            }
            document.ontouchmove = function (e) {
                // console.log("ontouchmove");
                that.resetTimer();
            }

        });
    }


    resetTimer() {
        this.idleTime = Environment.idleTimeout;
    }

    onClickCallAssistant() {

        if (this.isCallAssistant) {
            this.onClickStopCallAssistant();
            return;
        }

        if (!isNullOrUndefined(this.windowVideoCall)) {
            this.windowVideoCall.focus();
            return;
        }

        if (!isNullOrUndefined(this.audio)) {
            this.audio.pause();
        }

        const that = this;

        this.audio = new Audio(AppConstant.assetSoundPath + 'bell-ding.mp3');
        this.audio.volume = 0.3;
        this.audio.play();
        const remoteAddress = encodeURIComponent("http://localhost:5200/#/kk/remote")
        this.windowVideoCall = window.open(`${Environment.socketTellerRTC}&ip=${remoteAddress}`, "Video", "height=550,width=550,location=no,toolbar=no,fullscreen=yes");
        this.hardwareService.movePopupToFullScreen();

        const checkCloseWindow = function () {
            if (isNullOrUndefined(that.windowVideoCall) || that.windowVideoCall.closed) {
                that.onClickStopCallAssistant()
            }
        };

        this.timerCheckWindowVideoCall = setInterval(checkCloseWindow, 500);
        this.hardwareService.movePopupToFullScreen();
        this.messageCalling = "??????????????????????????????????????????\n??????????????????????????????????????????????????????????????????????????????";
        this.messageButtonCalling = "??????????????????";
        setTimeout(() => {
            that.messageCalling = "??????????????????????????????";
            that.messageButtonCalling = "??????????????????";
        }, 5000);
        this.updateCallStatus(true);
        this.onStartRemote();
    }

    onStartRemote() {
        const path = window.location.pathname;
        if (path.indexOf("remote") === -1) {
            Remote.startPublic();
        }
    }

    onClickStopCallAssistant() {

        if (!isNullOrUndefined(this.windowVideoCall)) {
            this.windowVideoCall.close();
        }

        clearInterval(this.timerCheckWindowVideoCall);
        this.audio.pause();
        this.audio = null;
        this.timerCheckWindowVideoCall = null;
        this.windowVideoCall = null;
        this.updateCallStatus(false);
        Remote.stopPublic();
    }

    updateCallStatus(isCallAssistant) {

        let imageName: string = "icon_callbell";
        if (isCallAssistant) {
            imageName = "icon_callbell_active";
        }

        this.isCallAssistant = !this.isCallAssistant;
        this.renderer.setAttribute(this.divBell.nativeElement, "background", `url('/assets/kiatnakin/image/${imageName}.png') no-repeat`)
        this.isCallAssistant = isCallAssistant;

    }
}
