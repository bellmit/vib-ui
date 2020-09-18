import { Component, OnInit, Input } from '@angular/core';
import { Utils } from 'app/share/utils';
import { KeyboardService } from 'app/kiatnakin/_service';
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { PDFProgressData, PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'page-dialog',
  templateUrl: './page-dialog.component.html',
  styleUrls: ['./page-dialog.component.sass']
})
export class PageDialogComponent implements OnInit {

  @Input() pdfSrc: String;
  @Input() showPageDialog: String;

  name_confirm: boolean = true;

  constructor() { }

  ngOnInit() {
    // Utils.animate("#container", "slideInUp")
    // .then(() => {
    //     KeyboardService.initKeyboardInputText();
    // });
  }

  onClickClose() {
    console.log("onClickClose");
    $('#myModal').modal('toggle')
  }

  onProgress(progressData: PDFProgressData) {
    console.log("onProgress");
    //Modal.showProgress();
  }

  callBackFn(pdf: PDFDocumentProxy) {
    console.log("callBackFn");
    //Modal.hide();
  }

  onError(error: any) {
    console.log(error);
  }

}
