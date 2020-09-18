import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Modal } from '../modal-dialog/modal-dialog.component';
import { isNullOrUndefined } from 'util';
import { Utils } from 'app/share/utils';

@Component({
  selector: 'input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.sass']
})
export class InputDialogComponent implements OnInit, OnDestroy {

  accountNumber: string;
  @Output() onClickConfirm = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    Utils.logDebug('InputDialogComponent', 'OnDestroy');
    $('.modal-backdrop').remove();
  }

  onConfirmClicked() {
    if (isNullOrUndefined(this.accountNumber) || this.accountNumber === '') {
      // Modal.showAlert('test');
    }
    this.onClickConfirm.emit(this.accountNumber);
    this.accountNumber = '';

  }

  onCancelClicked() {

  }

  checkDisableBtnConfirm() {
    if (isNullOrUndefined(this.accountNumber)) {
      return true;
    } else {
      if (this.accountNumber.length === 10) {
        return false;
      } else {
        return true;
      }
    }
  }

  // showConfirmWithSigleButtonText(title: any, okText: string, onClickOK?: Function, onClickCancel?: Function) {
  //   $("#modal-confirm-button-ok").text(okText);
  //   this.setupConfirmDialog(title, onClickOK);
  // }

  // setupConfirmDialog(title, onClickOK?: Function, onClickCancel?: Function) {
  //   $("[id^='modal-dialog-']").hide();
  //   $("#input-modal-dialog-confirm").show();
  //   $("#input-modal-dialog-confirm .modal-title").html(title);

  //   $("#input-modal-confirm-button-ok,#input-modal-confirm-button-cancel").unbind("click");

  //   $('#input-modal-confirm-button-ok').click(function () {

  //     if (onClickOK != null) {
  //       setTimeout(() => {
  //         onClickOK();
  //       }, 100);

  //     }
  //   });

  //   $('#input-modal-confirm-button-cancel').click(function () {

  //     if (onClickCancel != null) {
  //       setTimeout(() => {
  //         onClickCancel();
  //       }, 100);

  //     }
  //   });
  // }

}
