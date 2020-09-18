import { Component, OnInit, OnDestroy, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import { Environment, Utils } from "../../../share/utils";
import { isNullOrUndefined } from "util";
import { KeyboardService } from "../../_service/keyboard.service";
import { HardwareService } from "../../_service/hardware.service";
import { DataService } from "../../_service/data.service";
import { PaymentType, Transaction, TransactionStatus } from "../../_model/transaction";
import { AccountService } from "../../_service/api/account.service";
import { Modal } from "../../_share/modal-dialog/modal-dialog.component";
import { ToStringNumberPipe } from "../../_pipe/toStringNumber.pipe";
import { AppConstant } from "../../../share/app.constant";
import { BankAccount } from "../../_model/bankAccount";
import { TellerService } from '../../_service/teller.service';

@Component({
  selector: 'app-absorption',
  templateUrl: './absorption.component.html',
  styleUrls: ['./absorption.component.sass']
})
export class AbsorptionComponent implements OnInit, OnDestroy {

  @Input() queryParams: [string, string];
  @Input() openFunction: string;
  @Output() scaN: EventEmitter<BankAccount> = new EventEmitter<BankAccount>();

  public status = TransactionStatus;
  public currentStatus;
  private maximumCountdown = 5;
  private maximumCountScanFailure = 1;
  private refreshScan = 2;
  private countScan = 0;
  private interval;
  private countScanError: number = 0;
  public timer = this.maximumCountdown;
  public imageURL = null;
  public imageBase64: string = '';
  public bank_branch: string;

  public bankList: any[];
  public show: boolean = false;
  public bankCode: string;
  public machine_id: string;

  constructor(private router: Router,
    private hardwareService: HardwareService,
    private zone: NgZone,
    private tellerService: TellerService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private dataService: DataService) {

    console.log('constructor');
    dataService.config.displayLoginCard = false;
    this.hardwareService.connectHardware();
  }

  ngOnInit() {
    console.log('ngOnInit');
    // console.log(this.dataService.openFunction);
    this.zone.run(() => {
      $("#bell").hide();
      // this.startTimer();
      this.getStatus();
      // this.OpenFunction(this.dataService.openFunction)
    });
  }

  public getStatus() {
    this.dataService.checkStatus()
      .subscribe(
        data => {
          this.OpenFunction(data);
        }
      )
  }

  public OpenFunction(name) {
    switch (name) {
      case "startTimer":
        this.startTimer();
        break;
      case "reStartTimer":
        clearInterval(this.interval);
        this.reStartTimer();
        break;
      case "onClickBack":
        this.onClickBack();
        break;
      default:
        break
    }
  }

  private initObject() {
    const data = this.bankList;
  }

  ngOnDestroy() {
    $("#bell").show();
    this.stopTimer();
    this.hardwareService.disconnect();
  }

  public reStartTimer() {
    this.currentStatus = this.status.scan_wait;
    this.countScan = 0;
    this.countScanError = 0;
    this.stopTimer();
    this.startTimer();
  }

  public startTimer() {
    this.countScan = this.countScan + 1;


    if (isNullOrUndefined(this.interval)) {
      this.currentStatus = this.status.scan_wait;
      this.imageURL = "";

      $(".content").fadeIn();
      this.timer = this.maximumCountdown;
      const that = this;
      this.interval = setInterval(() => {

        console.log(this.timer);
        if (this.timer === 1) {
          that.stopTimer();
            setTimeout(() => {
                that.onRequest();
            }, 100);
        }
        else {
          this.timer = this.timer - 1;
        }

      }, 1000);
    }
  }

  private stopTimer() {
    if (!isNullOrUndefined(this.interval)) {
      console.log('stopTimer');
      clearInterval(this.interval);
      $(".content").fadeOut();
    }
  }

  private onRequest() {
    const that = this;
    this.hardwareService.requestScanDocumentPaper()
      .subscribe(
        (data: any) => {
          if (data.code.startsWith("9", 0)) {
            this.countScanError++;
            this.tellerService.SendStatusToTeller('ScanFalse', Environment.machine_id);
              this.tellerService.JoinAbsorpRoom()
                  .subscribe(
                      DATA => {
                          this.OpenFunction(DATA);
                      }
                  );
          } else {
              switch (data.code) {
                  case "0000":
                      console.log(data);
                      this.tellerService.connectAbsorption();
                      this.machine_id = Environment.machine_id;
                      this.imageURL = `${Environment.domainImageOutput}${data.results.fileName}`;
                      this.imageBase64 = data.results.base64;
                      this.currentStatus = this.status.scan_success;
                      this.SendImgToTeller(data.results, this.machine_id);
                      this.onScanSuccess();
                      break;
                  case "1000":
                  case "1001":
                      break;
              }
          }
        },
        error => {
          this.countScanError++;
          // if (this.countScanError > this.maximumCountScanFailure) {
          //   this.currentStatus = this.status.scan_false;
          //   this.tellerService.SendStatusToTeller('ScanFalse', AppConstant.machine_id);
          //   this.tellerService.JoinAbsorpRoom()
          //     .subscribe(
          //       data => {
          //         this.OpenFunction(data);
          //       }
          //     )
          //   that.stopTimer();
          //   return
          // }
          // this.startTimer();
        }
      );
  }

  private onScanSuccess() {
    this.stopTimer();
    setTimeout(() => {
      this.onClickBack();
    }, 3000);
    // setTimeout(() => {
    //   this.setImageResultPinch();
    //   $("#button-back").fadeIn();
    // }, 500);
  }

  private setImageResultPinch() {
    let scale = 1;
    let angle = 0;
    const gestureArea = document.getElementById('img-result-area');
    const scaleElement = document.getElementById('img-result');

    resetPosition();
    interact(gestureArea)
      .gesturable({
        onmove: function (event) {
          scale = scale * (1 + event.ds);
          if (scale > 2) {
            scale = 2;
          }
          else if (scale < 0.5) {
            scale = 0.5;
          }
          console.log("scale: ", scale);

          angle += event.da;
          console.log("angle: ", angle);

          scaleElement.style.webkitTransform =
            scaleElement.style.transform =
            'scale(' + scale + ') rotate(' + angle + 'deg)';

        },
        onend: function (event) {
        }
      })
      .draggable({ onmove: dragMoveListener })
      .on('doubletap', function (event) {
        resetPosition();
      });

    function resetPosition() {
      $("html").css("cursor", "default");
      scale = 1;
      angle = 0;
      scaleElement.style.webkitTransform = "";
      scaleElement.style.transform = 'scale(1)';

      scaleElement.style.webkitTransform = "";
      scaleElement.style.transform = 'rotate(0deg)';

      gestureArea.style.webkitTransform = "";
      gestureArea.style.transform = 'translate(0px, 0px)';

      gestureArea.setAttribute('data-x', '0');
      gestureArea.setAttribute('data-y', '0');
    }

    function dragMoveListener(event) {

      const rotate = document.body.classList.contains('rotate-180') ? -1 : 1;
      const target = event.target;
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.dx * rotate);
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.dy * rotate);

      target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

  }

  public onClickBack() {
    this.dataService.absorption = false;
    this.stopTimer();
    this.tellerService.connectAbsorption();
    this.tellerService.SendStatusToTeller('back', Environment.machine_id)

    // if (this.activatedRoute.snapshot.queryParams) {

    //   const objectParams = this.activatedRoute.snapshot.queryParams;
    //   const returnUrl = objectParams.returnUrl || '';
    //   const queryParams = {};
    //   for (const key in objectParams) {

    //     if (key !== "returnUrl") {
    //       queryParams[key] = objectParams[key];
    //     }
    //   }

    //   this.router.navigate(["/kk/" + returnUrl], { queryParams: queryParams, replaceUrl: true });
    // } else {
    //   this.router.navigate(["/kk"]);
    // }
  }

  public SendImgToTeller(transaction, machine_id) {
    console.log('SendImgToTeller');
    this.tellerService.SendImgToTeller(transaction, machine_id)
      .subscribe(
        (data: any) => {
          // this.JoinAbsorptionRoom();
        },
        error => {

        }
      );
  }
}
