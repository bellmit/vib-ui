import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { isNullOrUndefined } from 'util';

import { Modal } from '../../../../_share/modal-dialog/modal-dialog.component';
import { Utils } from '../../../../../share/utils';

import { InvestmentService } from '../../../../_service/api/investment.service';
import { UserService } from 'app/kiatnakin/_service/user.service';
import { DataService } from '../../../../_service/data.service';

@Component({
  selector: 'suit-question',
  templateUrl: './suit-question.component.html',
  styleUrls: [
    './suit-question.component.sass',
    '../../../../_template/template-flip-book/template-flip-book.component.sass'
  ]
})
export class SuitQuestionComponent implements OnInit, OnDestroy {
  suitQuestion;
  currentCustomerSuitScore;
  suitFound;
  suitExpired;
  imgPart: string = './assets/kiatnakin/image/';
  currentPageIndex = 0;
  isShowCloseButton: boolean = true;
  turningSectionName: string = null;
  answer = {};
  summarySuitScore = {
    riskTitle: '',
    assetAllocation: {
      bankDeposit: '0', // เงินฝาก,ตราสารหนี้
      governmentInstrument: '0', // ตราสารภาครัฏ
      privateInstrument: '0', // ตราสารภาคเอกชน
      equityInstrument: '0', // ตราสารทุน
      alternativeFund: '0' // การลงทุนทางเลือก
    }
  };

  private savingBook = null;
  private isClosed = false;

  constructor(
    private router: Router,
    private location: Location,
    private dataService: DataService,
    private investmentService: InvestmentService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.suitQuestion = this.dataService.suitQuestion;
    console.log(
      'SuitQuestionComponent --- bass this.suitQuestion ->',
      this.suitQuestion
    );
    this.setShowCloseButton(false);
  }

  ngOnDestroy() {
    // this.dataService.isAcceptedTermMutualFund = false;
  }

  public setShowCloseButton(bool: boolean) {
    this.isShowCloseButton = bool;
  }

  public closeBook() {
    this.setShowCloseButton(false);
    this.isClosed = true;
    this.savingBook
      .turn('page', 2)
      .turn('stop')
      .turn('page', 1);
  }

  public onClickClose() {
    this.currentPageIndex = 0;
    this.closeBook();
    setTimeout(() => {
      this.savingBook.fadeOut();
      this.location.back();
    }, 800);
  }

  public updateCurrentPage(index: number) {
    console.log('SuitQuestionComponent 1 --- this.currentPageIndex ->', this.currentPageIndex)
    this.currentPageIndex = index;
    console.log('SuitQuestionComponent 2 --- this.currentPageIndex ->', this.currentPageIndex)
  }

  public onFlipInit(flipObject) {
    this.savingBook = flipObject;
  }

  public onStart($event) {}

  public onTurning($page) {
    this.updateCurrentPage($page.index);
    if (this.currentPageIndex < 1) {
      this.setShowCloseButton(false);
    }
  }

  public onTurned($page) {
    this.setShowCloseButton($page.index > 1 ? true : false);

    if ($page.index === 1 && !this.isClosed) {
      if (this.savingBook) {
        const that = this;
        setTimeout(function() {
          that.location.back();
        }, 500);
      }
    }
  }

  public onEnd($page) {
    this.setShowCloseButton($page.index !== 1);
  }

  onClickSubmitAnswer() {
    const answerId = [];
    const totalQuestion = $('input[type=hidden]').length;
    console.log('SuitQuestionComponent --- totalQuestion ->', totalQuestion);
    const answer = {};

    // Get raw answer data from input
    $("input[id^='answer']:checked").each((index, item) => {
      console.log($(item).val(), $(item).attr('id'));

      const data = $(item)
        .val()
        .split('|');

      if (isNullOrUndefined(answer[data[0]])) {
        answer[data[0]] = [data[1]];
      } else {
        answer[data[0]].push(data[1]);
      }
    });

    // "submitAnswers": [
    //     {
    //         "questionId": "1",
    //         "answerId": ["1"]
    //     },
    //     {
    //         "questionId": "4",
    //         "answerId": ["13", "14", "15", "16"]
    //     }
    // ]

    // Procress rawdata into parameter format
    for (const key in answer) {
      if (true) {
        const cust_select_answer = [];

        // making arr of anwsers for the question
        answer[key].forEach(element => {
          cust_select_answer.push(element);
        });
        // if answer[4] => cust_select_answer = [13, 14, 15, 16]

        // making obj of anwsers for the question
        const answObj = {
          questionId: key,
          answerId: cust_select_answer
        };
        // answObj = {"questionId": 4, "answerId": [13, 14, 15, 16]}

        answerId.push(answObj);
        // answerId = [{"questionId": 4, "answerId": [13, 14, 15, 16]}, ...]
      }
    }

    console.log('SuitQuestionComponent --- bass answerId ->', answerId);

    if (totalQuestion === answerId.length) {
      Modal.showProgress();
      this.investmentService.submitSuitAnswer(answerId).subscribe(
        res => {
          this.investmentService.updateSuitScore(
            res.data ? res.data.custSuitScoreData : null
          );
          // this.currentCustomerSuitScore = res.data.custSuitScoreData;
          this.onClickClose(); // go back to suitability
        },
        error => {
          Modal.showAlert(error.responseStatus.responseMessage);
        }
      );
    } else {
      Modal.showAlert('กรุณาตอบคำถามให้ครบถ้วน');
    }
  }
}
