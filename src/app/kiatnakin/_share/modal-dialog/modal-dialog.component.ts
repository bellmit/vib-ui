import { Component, OnInit } from '@angular/core';
import { isNullOrUndefined, isNumber } from "util";
import { Environment, Utils } from "../../../share/utils";
import { UserService } from "../../_service/user.service";
import { Observable } from "rxjs/Rx";
import { Location } from '@angular/common';

@Component({
    selector: 'modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.sass']
})
export class Modal implements OnInit {

    static title = {
        required: "กรุณาระบุข้อมูลให้ครบถ้วน",
        continue: "ท่านต้องการทำรายการอื่นต่อหรือไม่ ?",
        exit: "ท่านต้องการยกเลิกหรือไม่ ?",
        passbookEAccount: "กรุณาเลือกรูปแบบการเปิดบัญชีที่ท่านต้องการ"
    };

    static status = {
        loading: 0,
        success: 1,
        failure: 2
    };

    static options = {
        id: "#modal"
    };


    static sessionTime;
    static sessionTimeInterval;

    constructor(public location: Location) {
    }

    ngOnInit() {
    }

    static setupConfirmDialog(title, onClickOK?: Function, onClickCancel?: Function) {
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-confirm").show();
        $("#modal-dialog-confirm .modal-title").html(title);

        $("#modal-confirm-button-ok,#modal-confirm-button-cancel").unbind("click");

        $('#modal-confirm-button-ok').click(function () {
            Modal.clearIntervalTimeout();

            if (onClickOK != null) {
                setTimeout(() => {
                    onClickOK();
                }, 100);

            }
        });

        $('#modal-confirm-button-cancel').click(function () {
            Modal.clearIntervalTimeout();

            if (onClickCancel != null) {
                setTimeout(() => {
                    onClickCancel();
                }, 100);

            }
        });
    }

    static setupConfirmDialogMfs(title, onClickLeft?: Function, onClickRight?: Function) {
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-confirm-mfs").show();
        $("#modal-dialog-confirm-mfs .modal-title").html(title);

        $("#modal-confirm-button-left, #modal-confirm-button-right").unbind("click");

        $('#modal-confirm-button-left').click(function () {
            Modal.clearIntervalTimeout();

            if (onClickLeft != null) {
                setTimeout(() => {
                    onClickLeft();
                }, 100);

            }
        });

        $('#modal-confirm-button-right').click(function () {
            Modal.clearIntervalTimeout();

            if (onClickRight != null) {
                setTimeout(() => {
                    onClickRight();
                }, 100);

            }
        });
    }

    static setupConfirmDialogMfsWhite(title, onClickLeft?: Function, onClickRight?: Function) {
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-confirm-mfs-white").show();
        $("#modal-dialog-confirm-mfs-white .modal-title").html(title);

        $("#modal-confirm-button-left-white, #modal-confirm-button-right-white").unbind("click");

        $('#modal-confirm-button-left-white').click(function () {
            Modal.clearIntervalTimeout();

            if (onClickLeft != null) {
                setTimeout(() => {
                    onClickLeft();
                }, 100);

            }
        });

        $('#modal-confirm-button-right-white').click(function () {
            Modal.clearIntervalTimeout();

            if (onClickRight != null) {
                setTimeout(() => {
                    onClickRight();
                }, 100);

            }
        });
    }

    static showAlert(title: any) {
        $("#modal-dialog-alert .modal-title").html(title);
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-alert").show();
        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
        $('#modal-alert-button-ok').unbind("click");
    }

    static showAlertMfs(title: any) {
        $("#modal-dialog-alert-mfs .modal-title").html(title);
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-alert-mfs").show();
        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
        $('#modal-alert-button-ok').unbind("click");
    }

    static showAlertWithOk(title: any, onClickOK?: Function) {
        this.showAlert(title)

        $('#modal-alert-button-ok').click(function () {

            if (onClickOK != null) {
                onClickOK();
            }
        });
    }

    backToPreviousLocation() {
        if ($('#modal-title')[0].innerText === 'Timeout has occurred') {
            return this.location.back();
        }
    }

    static showProgressWithTitle(title: any) {
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-progress-title").show();
        $("#modal-dialog-progress-title .modal-title").html(title);
        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    static showSuccessWithTitle(title: any) {
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-success").show();
        $("#modal-dialog-success .modal-title").html(title);
        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    static showFailureWithTitle(title: any) {
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-failure").show();
        $("#modal-dialog-failure .modal-title").html(title);
        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    static showConfirmWithSigleButtonText(title: any, okText: string, onClickOK?: Function, onClickCancel?: Function) {
        $("#modal-confirm-button-ok").text(okText);
        this.setupConfirmDialog(title, onClickOK);

        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }


    static showConfirmWithButtonText(title: any, okText: string, cancelText: string, onClickOK?: Function, onClickCancel?: Function) {
        $("#modal-confirm-button-ok").text(okText);
        $("#modal-confirm-button-cancel").text(cancelText);
        this.setupConfirmDialog(title, onClickOK, onClickCancel);

        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    static showConfirmLogout(title: any, okText: string, cancelText: string, userServiceContext: UserService, onClickOK?: Function, onClickCancel?: Function) {
        this.showConfirmWithButtonText(title, okText, cancelText, onClickOK, onClickCancel);

        if (!isNullOrUndefined(Environment.sessionTimeout)) {
            if (Number(Environment.sessionTimeout) > 0) {

                Modal.sessionTime = Environment.sessionTimeout;
                $("#count-timeout").text(Modal.sessionTime).show();

                if (!isNullOrUndefined(Modal.sessionTimeInterval)) {
                    Modal.sessionTimeInterval.unsubscribe()
                }
                this.sessionTimeInterval = Observable
                    .timer(0, 1000)
                    .map(i => Modal.sessionTime - i)
                    .take(Modal.sessionTime + 1)
                    .subscribe(i => {

                        $("#count-timeout").text(i);
                        if (i <= 0) {
                            Modal.sessionTimeInterval.unsubscribe()
                            Modal.hide();
                            userServiceContext.logout();
                        }
                    });
            }

        }
    }


    static showConfirm(title, onClickOK?: Function, onClickCancel?: Function) {
        $("#modal-confirm-button-ok").text("ตกลง");
        $("#modal-confirm-button-cancel").text("ยกเลิก");
        this.setupConfirmDialog(title, onClickOK, onClickCancel);

        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    static showConfirmMfs(title, onClickLeft?: Function, onClickRight?: Function) {
        $("#modal-confirm-button-left").text("ตกลง");
        $("#modal-confirm-button-right").text("ยกเลิก");

        if (title === "ยืนยันยกเลิกรายการใช่หรือไม่") {
            $("#modal-confirm-button-left").text("ยกเลิก");
            $("#modal-confirm-button-right").text("ตกลง");
        }

        this.setupConfirmDialogMfs(title, onClickLeft, onClickRight);

        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }

    static showConfirmMfsWhite(title, onClickLeft?: Function, onClickRight?: Function) {
        $("#modal-confirm-button-left-white").text("ต้องการ");
        $("#modal-confirm-button-right-white").text("ไม่ต้องการ");

        if (title === "ต้องการยกเลิกรายการใช่หรือไม่") {
            $("#modal-confirm-button-left-white").text("ไม่ต้องการ");
            $("#modal-confirm-button-right-white").text("ต้องการ");
        }

        this.setupConfirmDialogMfsWhite(title, onClickLeft, onClickRight);

        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
    }


    static showProgress() {
        Utils.logDebug('Modal', 'showProgress');
        $("[id^='modal-dialog-']").hide();
        $("#modal-dialog-progress").show();
        $(this.options.id).modal({
            keyboard: false,
            backdrop: 'static'
        });
        $(this.options.id).data('bs.modal')._config.backdrop = 'static'
    }

    static hide() {
        Utils.logDebug('Modal', 'hide');
        $(this.options.id).modal('hide');
        $("#count-timeout").hide();
        $("[id^='modal-dialog-']").hide();

    }

    static clearIntervalTimeout() {

        if (!isNullOrUndefined(Modal.sessionTimeInterval)) {
            Modal.sessionTimeInterval.unsubscribe()
        }
        Modal.sessionTime = null;
        $("#count-timeout").text(Modal.sessionTime);

    }

    static showSelectPassbookOrEAccount(title: any, passbook: string, eAcccount: string, onClickpassbook?: Function, onClickeAcccount?: Function) {
        this.showConfirmWithButtonText(title, passbook, eAcccount, onClickpassbook, onClickeAcccount);
    }

}
