import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { Modal } from '../../_share/modal-dialog/modal-dialog.component';
import { InvestmentService } from '../../_service/api/investment.service';
import { Utils } from '../../../share/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'risk-table',
  templateUrl: './risk-table.component.html',
  styleUrls: ['./risk-table.component.sass']
})
export class RiskTableComponent implements OnInit {
  riskTable;

  constructor(
    public router: Router,
    public location: Location,
    public investmentService: InvestmentService
    ) {}

  ngOnInit() {
    this.getRiskTable();
    Utils.animate('#container', 'slideInUp');
  }

  getRiskTable() {
    Modal.showProgress();
    this.investmentService.getRiskTable().subscribe(
      res => {
        // console.log('getTermMutualfund --- bass res ->', res);
        this.riskTable = res.data ? res.data.utilityConfig : null;
        // console.log('getTermMutualfund --- bass termAndCond ->', this.termAndCond);
        // this.termAndCond = '<h1>test</h1>'
        setTimeout(() => {
          // $('table').addClass('test');
          $('table, tr, td, th').css("border", "1px solid black");
          $('tr.header').css({"text-align": "center", "background": "#7270B3", color: "white"});
          $('.tapHeader th').css({"text-align": "center"});
          // $('td').css("border", "1px solid black");
        }, 0);
      },
      error => {
        Modal.showAlert(error.responseStatus.responseMessage);
      },
      () => {
        Modal.hide();
      }
    );
  }

  onClickBack() {
    Utils.animate('#container', 'slideOutDown').then(() => {
      // this.router.navigate(['kk', 'transactiontype']);
      this.location.back()
    });
  }

}
