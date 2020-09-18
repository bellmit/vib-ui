import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'progress-dialog',
    templateUrl: './progress-dialog.component.html',
    styleUrls: ['./progress-dialog.component.sass']
})
export class ProgressDialogComponent implements OnInit {

    @Output() isShowEmitter = new EventEmitter();
    @Output() onClickEmitter = new EventEmitter();
    @Input() progressId = "";
    private progressIsShowing: boolean = false;

    constructor() {
    }

    ngOnInit() {
        this.progressIsShowing = false;
        this.isShowEmitter.emit(this.progressIsShowing);
    }

    private getProgressId() {
        return `#progress${this.progressId}`;
    }

    showProgressTransaction() {
        this.showProgressWithMessage("กำลังทำรายการ กรุณารอสักครู่");
    }

    showProgressWithMessage(message: string) {
        this.progressIsShowing = true;
        this.isShowEmitter.emit(this.isShowing);

        $(`${this.getProgressId()}`).show();
        $(`${this.getProgressId()}>.loading`).show();
        $(`${this.getProgressId()}>#success, ${this.getProgressId()}>.error`).hide();
        $(`${this.getProgressId()}>#progress-message`).text(message);

    }

    showSuccessWithMessage(message: string) {
        this.progressIsShowing = true;
        this.isShowEmitter.emit(this.progressIsShowing);

        $(`${this.getProgressId()}`).show();
        $(`${this.getProgressId()}>#success`).show();
        $(`${this.getProgressId()}>.error, ${this.getProgressId()}>.loading`).hide();
        $(`${this.getProgressId()}>#progress-message`).text(message);
    }

    showErrorWithMessage(message: string) {
        this.progressIsShowing = true;
        this.isShowEmitter.emit(this.progressIsShowing);

        $(`${this.getProgressId()}`).show();
        $(`${this.getProgressId()}>.error`).show();
        $(`${this.getProgressId()}>#success, ${this.getProgressId()}>.loading`).hide();
        $(`${this.getProgressId()}>#progress-message`).text(message);
    }

    hide() {
        this.progressIsShowing = false;
        this.isShowEmitter.emit(this.progressIsShowing);

        $(`${this.getProgressId()}`).hide();
    }

    isShowing() {
        return this.progressIsShowing;
    }

    onClickBack() {
        this.onClickEmitter.emit();
    }
}
