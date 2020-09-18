import { Injectable } from '@angular/core';
import { API, AppConstant } from '../../../share/app.constant';
import { APIService } from './api.service';
import { Utils, Environment } from '../../../share/utils';
import { UserService } from '../../_service/user.service';
import { BankAccount } from 'app/kiatnakin/_model';
import { Transaction } from '../../_model/transaction';
import { Investment } from '../../_model/investment';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs/Rx';
import { DataService } from '../data.service';
import * as moment from 'moment';

@Injectable()
export class InvestmentService {
  private dataFund: any = [];
  private dataFundSwich_In: any = [];
  private dataFundSwich_Out: any = [];
  private UNITHOLDER_ID: any = [];
  public fundlistMode = {
    buy: 'AO',
    new: 'NF',
    redeem: 'RD',
    switchOut: 'SO',
    switchIn: 'SI'
  };

  public transactionType = {
    purchase: 'BU',
    redeem: 'SE',
    switch_out: 'SO',
    switch_in: 'SO'
  };

  constructor(
    private apiService: APIService,
    private userService: UserService,
    private dataService: DataService
  ) { }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }

  getGUID() {
    const json = {
      card_id: this.userService.getUser().idNumber
    };
    const url = API.GetGUID;
    return this.apiService
      .post(url, json) // Bass made changes here
      .map(response => {
        this.userService.getUser().GUID = response.value[0].PortGuid;
        return response;
      })
      .catch(this.handleError);
  }

  // const userInfo = this.userService.getUser()

  // const json = {
  //     "card_no": userInfo.idNumber,
  //     "cif_id": userInfo.kkcisid,
  //     "id_type": userInfo.idType,
  //     "suitability_code": "101",
  //     "version": "",
  // };

  getInquiryCurrentCustSuitScore() {
    const userInfo = this.userService.getUser();
    const json = {
      cifId: userInfo.kkcisid,
      idType: userInfo.idType,
      cardNo: userInfo.idNumber
    };
    const url = API.GetInquiryCurrentCustSuitScore;
    // console.log('InvestmentService --- bass url ->', url);
    return this.apiService
      .postMfs(url, json) // Bass made changes here
      .map(response => {
        // console.log('InvestmentService --- bass response ->', response);
        this.updateSuitScore(
          response.data ? response.data.currentCustSuitScoreData : null
        );
        // console.log('InvestmentService --- bass this.userService.getUser().suitScore ->', this.userService.getUser().suitScore);
        return response;
      })
      .catch(this.handleError);
  }

  checkIsSuitExpired(suitScore) {
    if (isNullOrUndefined(suitScore)) {
      return (this.userService.getUser().suitFound = false);
    }
    console.log('suitScore.expiryDate', suitScore.expiryDate);
    const suiteExpireDate = moment(suitScore.expiryDate, 'DD-MM-YYYY');
    const today = moment(moment().format('DD-MM-YYYY'), 'DD-MM-YYYY');
    console.log('suiteExpireDate', suiteExpireDate);
    console.log('today', today);
    console.log('diff', today.diff(suiteExpireDate, 'days'));
    console.log('isExpired', today.diff(suiteExpireDate, 'days') > 0);
    return (this.userService.getUser().suitExpired =
      today.diff(suiteExpireDate, 'days') > 0);
  }

  updateSuitScore(suitScore) {
    this.userService.getUser().suitScore = suitScore;
    if (suitScore) {
      this.userService.getUser().suitFound = true;
      this.userService.getUser().suitExpired = this.checkIsSuitExpired(
        suitScore
      );
    } else {
      this.userService.getUser().suitFound = false;
      this.userService.getUser().suitExpired = null;
    }
  }

  getInquirySuitabiltyQuestion() {
    const json = {
      suitabilityCode: ''
    };
    const url = API.GetInquirySuitabiltyQuestion;
    return this.apiService.postMfs(url, json).map(res => {
      const question = [];
      let list = [];

      // this block below is for test
      // const testQuestionDetailList = [
      //   {
      //     id: '1',
      //     type: 'R',
      //     description: 'ปัจจุบันท่านอายุ',
      //     answerDataList: [
      //       { id: '1', description: 'มากกว่า 55 ปี' },
      //       { id: '2', description: '45-55 ปี' },
      //       { id: '3', description: '35-44 ปี' },
      //       { id: '4', description: 'น้อยกว่า 35 ปี' }
      //     ],
      //     seq: '1'
      //   },
      //   {
      //     id: '2',
      //     type: 'R',
      //     description:
      //       'ปัจจุบันท่านมีภาระทางการเงินและค่าใช้จ่ายประจำ เช่น ค่าผ่อนบ้าน รถ ค่าใช้จ่ายส่วนตัว และค่าเลี้ยงดูครอบครัวเป็นสัดส่วนเท่าใด',
      //     answerDataList: [
      //       { id: '5', description: 'มากกว่าร้อยละ 75 ของรายได้ทั้งหมดี' },
      //       {
      //         id: '6',
      //         description: 'ระหว่างกว่าร้อยละ 50 ถึงร้อยละ 75 ของรายได้ทั้งหมด'
      //       },
      //       {
      //         id: '7',
      //         description: 'ระหว่างกว่าร้อยละ 25 ถึงร้อยละ 50 ของรายได้ทั้งหมด'
      //       },
      //       { id: '8', description: 'น้อยกว่าร้อยละ 25 ของรายได้ทั้งหมด' }
      //     ],
      //     seq: '2'
      //   },
      //   {
      //     id: '3',
      //     type: 'R',
      //     description: 'ท่านมีสถานภาพทางการเงินในปัจจุบันอย่างไร',
      //     answerDataList: [
      //       { id: '9', description: 'มีทรัพย์สินน้อยกว่าหนี้สิ้น' },
      //       { id: '10', description: 'มีทรัพย์สินเท่ากับหนี้สิ้น' },
      //       { id: '11', description: 'มีทรัพย์สินมากกว่าหนี้สิ้น' },
      //       {
      //         id: '12',
      //         description:
      //           'มีความมั่นใจว่ามีเงินออมหรือเงินลงทุนเพียงพอสำหรับการใช้ชีวิตหลังเกษียณอายุแล้ว'
      //       }
      //     ],
      //     seq: '3'
      //   },
      //   {
      //     id: '4',
      //     type: 'C',
      //     description:
      //       'ท่านเคยมีประสบการณ์ หรือมีความรู้ในการลงทุนในทรัพย์สินกลุ่มใดต่อไปนี้บ้าง (เลือกได้มากกว่า 1 ข้อ)',
      //     answerDataList: [
      //       { id: '13', description: 'เงินฝากธนาคาร' },
      //       {
      //         id: '14',
      //         description: 'พันธบัตรรัฐบาล หรือกองทุนพันธบัตรรัฐบาล'
      //       },
      //       { id: '15', description: 'หุ้นกู้ หรือกองทุนรวมตราสารหนี้' },
      //       {
      //         id: '16',
      //         description:
      //           'หุ้นสามัญ หรือกองทุนรวมหุ้น หรือสินทรัพย์อื่นที่มีความเสี่ยงสูง'
      //       }
      //     ],
      //     seq: '4'
      //   },
      //   {
      //     id: '5',
      //     type: 'R',
      //     description:
      //       'ระยะเวลาที่ท่านคาดว่าจะไม่มีความจำเป็นต้องใช้เงินลงทุนนี้',
      //     answerDataList: [
      //       { id: '17', description: 'ไม่เกิน 1 ปี' },
      //       { id: '18', description: '1 ถึง 3 ปี' },
      //       { id: '19', description: '3 ถึง 5 ปี' },
      //       { id: '20', description: 'มากกว่า 5 ปี' }
      //     ],
      //     seq: '5'
      //   },
      //   {
      //     id: '6',
      //     type: 'R',
      //     description: 'วัตถุประสงค์หลักในการลงทุนของท่าน คือ ',
      //     answerDataList: [
      //       {
      //         id: '21',
      //         description:
      //           'เน้นเงินต้นต้องปลอดภัยและได้รับผลตอบแทนสม่ำเสมอแต่ต่ำได้'
      //       },
      //       {
      //         id: '22',
      //         description:
      //           'เน้นโอกาสได้รับผลตอบแทนที่สม่ำเสมอ แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้บ้าง'
      //       },
      //       {
      //         id: '23',
      //         description:
      //           'เน้นโอกาสได้รับผลตอบแทนที่สูงขึ้น แต่อาจเสี่ยงที่จะสูญเสียเงินต้นได้มากขึ้น'
      //       },
      //       {
      //         id: '24',
      //         description:
      //           'เน้นผลตอบแทนสูงสุดในระยะยาว แต่อาจเสี่ยงที่จะสูญเงินต้นส่วนใหญ่ได้'
      //       }
      //     ],
      //     seq: '6'
      //   },
      //   {
      //     id: '7',
      //     type: 'R',
      //     description:
      //       'เมื่อพิจารณารูปแสดงตัวอย่างผลตอบแทนของกลุ่มการลงทุนที่อาจเกิดขึ้นด้านล่าง ท่านเต็มใจที่จะลงทุนในกลุ่มการลงทุนใดมากที่สุด',
      //     answerDataList: [
      //       {
      //         id: '25',
      //         description:
      //           'กลุ่มการลงทุนที่ 1 มีโอกาสได้รับผลตอบแทน 2.5% โดยไม่ขาดทุนเลย'
      //       },
      //       {
      //         id: '26',
      //         description:
      //           'กลุ่มการลงทุนที่ 2 มีโอกาสได้รับผลตอบแทนสุงสุด 7% แต่อาจมีผลขาดทุนได้ถึง 1%'
      //       },
      //       {
      //         id: '27',
      //         description:
      //           'กลุ่มการลงทุนที่ 3 มีโอกาสได้รับผลตอบแทนสุงสุด 15% แต่อาจมีผลขาดทุนได้ถึง 5%'
      //       },
      //       {
      //         id: '28',
      //         description:
      //           'กลุ่มการลงทุนที่ 4 มีโอกาสได้รับผลตอบแทนสุงสุด 25% แต่อาจมีผลขาดทุนได้ถึง 15%'
      //       }
      //     ],
      //     seq: '7'
      //   },
      //   {
      //     id: '8',
      //     type: 'R',
      //     description:
      //       'ถ้าท่านเลือกลงทุนในทรัพย์สินที่มีโอกาสได้รับผลตอบแทนมาก แต่มีโอกาสขาดทุนสูงด้วยเช่นกัน ท่านจะรู้สึกอย่างไร ',
      //     answerDataList: [
      //       { id: '29', description: 'กังวลและตื่นตระหนกกลัวขาดทุน' },
      //       { id: '30', description: 'ไม่สบายใจแต่พอเข้าใจได้บ้าง' },
      //       { id: '31', description: 'เข้าใจและรับความผันผวนได้ในระดับหนึ่ง' },
      //       {
      //         id: '32',
      //         description:
      //           'ไม่กังวลกับโอกาสขาดทุนสูง และหวังกับผลตอบแทนที่อาจจะได้รับสูงขึ้น'
      //       }
      //     ],
      //     seq: '8'
      //   },
      //   {
      //     id: '9',
      //     type: 'R',
      //     description:
      //       'ท่านจะรู้สึกกังวล/รับไม่ได้ เมื่อมูลค่าเงินลงทุนของท่านมีการปรับตัวลดลงในสัดส่วนเท่าใด',
      //     answerDataList: [
      //       { id: '33', description: '5% หรือน้อยกว่า' },
      //       { id: '34', description: 'มากกว่า 5%-10%' },
      //       { id: '35', description: 'มากกว่า 10%-20%' },
      //       { id: '36', description: 'มากกว่า 20% ขึ้นไป' }
      //     ],
      //     seq: '9'
      //   },
      //   {
      //     id: '10',
      //     type: 'R',
      //     description:
      //       'หากปีที่แล้วท่านลงทุนไป 100,000 บาท ปีนี้ท่านพบว่ามูลค่าเงินลงทุนลดลงเหลือ 85,000 บาท ท่านจะทำอย่างไร',
      //     answerDataList: [
      //       { id: '37', description: 'ตกใจ และต้องการขายการลงทุนที่เหลือทิ้ง' },
      //       {
      //         id: '38',
      //         description:
      //           'กังวลใจ และจะปรับเปลี่ยนการลงทุนบางส่วนไปในทรัพย์สินที่เสี่ยงน้อย'
      //       },
      //       {
      //         id: '39',
      //         description: 'อดทนถือต่อไปได้ และรอผลตอบแทนปรับตัวกลับมา'
      //       },
      //       {
      //         id: '40',
      //         description:
      //           'ยังมั่นใจ เพราะเข้าใจว่าต้องลงทุนระยะยาว และจะเพิ่มเงินลงทุนในแบบเดิมเพื่อเฉลี่ยต้นทุน'
      //       }
      //     ],
      //     seq: '10'
      //   },
      //   {
      //     id: '11',
      //     type: 'R',
      //     description:
      //       'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลวท่านอาจจะสูญเงินลงทุนทั้งหมด  และอาจต้องลงเงินชดเชยเพิ่มบางส่วน  ท่านยอมรับได้เพียงใด',
      //     answerDataList: [
      //       { id: '41', description: 'ไม่ได้' },
      //       { id: '42', description: 'ได้บ้าง' },
      //       { id: '43', description: 'ได้' }
      //     ],
      //     seq: '11'
      //   },
      //   {
      //     id: '11',
      //     type: 'R',
      //     description:
      //       'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลวท่านอาจจะสูญเงินลงทุนทั้งหมด  และอาจต้องลงเงินชดเชยเพิ่มบางส่วน  ท่านยอมรับได้เพียงใด',
      //     answerDataList: [
      //       { id: '41', description: 'ไม่ได้' },
      //       { id: '42', description: 'ได้บ้าง' },
      //       { id: '43', description: 'ได้' }
      //     ],
      //     seq: '12'
      //   },
      //   {
      //     id: '11',
      //     type: 'R',
      //     description:
      //       'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลวท่านอาจจะสูญเงินลงทุนทั้งหมด  และอาจต้องลงเงินชดเชยเพิ่มบางส่วน  ท่านยอมรับได้เพียงใด',
      //     answerDataList: [
      //       { id: '41', description: 'ไม่ได้' },
      //       { id: '42', description: 'ได้บ้าง' },
      //       { id: '43', description: 'ได้' }
      //     ],
      //     seq: '13'
      //   },
      //   {
      //     id: '11',
      //     type: 'R',
      //     description:
      //       'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลวท่านอาจจะสูญเงินลงทุนทั้งหมด  และอาจต้องลงเงินชดเชยเพิ่มบางส่วน  ท่านยอมรับได้เพียงใด',
      //     answerDataList: [
      //       { id: '41', description: 'ไม่ได้' },
      //       { id: '42', description: 'ได้บ้าง' },
      //       { id: '43', description: 'ได้' }
      //     ],
      //     seq: '14'
      //   },
      //   {
      //     id: '11',
      //     type: 'R',
      //     description:
      //       'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลวท่านอาจจะสูญเงินลงทุนทั้งหมด  และอาจต้องลงเงินชดเชยเพิ่มบางส่วน  ท่านยอมรับได้เพียงใด',
      //     answerDataList: [
      //       { id: '41', description: 'ไม่ได้' },
      //       { id: '42', description: 'ได้บ้าง' },
      //       { id: '43', description: 'ได้' }
      //     ],
      //     seq: '15'
      //   },
      //   {
      //     id: '11',
      //     type: 'R',
      //     description:
      //       'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลวท่านอาจจะสูญเงินลงทุนทั้งหมด  และอาจต้องลงเงินชดเชยเพิ่มบางส่วน  ท่านยอมรับได้เพียงใด',
      //     answerDataList: [
      //       { id: '41', description: 'ไม่ได้' },
      //       { id: '42', description: 'ได้บ้าง' },
      //       { id: '43', description: 'ได้' }
      //     ],
      //     seq: '16'
      //   },
      //   {
      //     id: '11',
      //     type: 'R',
      //     description:
      //       'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลวท่านอาจจะสูญเงินลงทุนทั้งหมด  และอาจต้องลงเงินชดเชยเพิ่มบางส่วน  ท่านยอมรับได้เพียงใด',
      //     answerDataList: [
      //       { id: '41', description: 'ไม่ได้' },
      //       { id: '42', description: 'ได้บ้าง' },
      //       { id: '43', description: 'ได้' }
      //     ],
      //     seq: '17'
      //   },
      //   {
      //     id: '11',
      //     type: 'R',
      //     description:
      //       'หากการลงทุนในอนุพันธ์และหุ้นกู้อนุพันธ์ประสบความสำเร็จ ท่านจะได้รับผลตอบแทนในอัตราที่สูงมาก แต่หากการลงทุนล้มเหลวท่านอาจจะสูญเงินลงทุนทั้งหมด  และอาจต้องลงเงินชดเชยเพิ่มบางส่วน  ท่านยอมรับได้เพียงใด',
      //     answerDataList: [
      //       { id: '41', description: 'ไม่ได้' },
      //       { id: '42', description: 'ได้บ้าง' },
      //       { id: '43', description: 'ได้' }
      //     ],
      //     seq: '18'
      //   }
      // ];

      // const totalQuestion = testQuestionDetailList.length;

      // testQuestionDetailList.forEach((item, index) => {
      //   if (index !== 0 && index % 6 === 0) {
      //     question.push(list);
      //     list = [];
      //   }

      //   list.push(item);

      //   if (index + 1 === totalQuestion) {
      //     question.push(list);
      //     list = [];
      //   }
      // });
      // this block above is for test

      const totalQuestion = res.data.questionDetailList.length;
      console.log(
        'investment --- res.data.questionDetailList ->',
        res.data.questionDetailList
      );
      res.data.questionDetailList.forEach((item, index) => {
        if (index !== 0 && index % 6 === 0) {
          question.push(list);
          list = [];
        }

        list.push(item);

        if (index + 1 === totalQuestion) {
          question.push(list);
          list = [];
        }
      });

      if (question.length % 2 !== 0) {
        const handleItem = {
          id: '',
          type: '',
          description: '',
          answerDataList: [
            { id: '', description: '' },
            { id: '', description: '' },
            { id: '', description: '' },
            { id: '', description: '' }
          ],
          seq: ''
        };

        list.push(handleItem);
        question.push(list);

      }

      this.dataService.suitQuestion = question;
      return res;
    });
  }

  getTermMutualfund() {
    const json = {
      configCode: 'VIB-CFG-001'
    };
    const url = API.InquiryUtilityConfig;
    return this.apiService.postMfs(url, json);
  }

  getRiskTable() {
    const json = {
      configCode: 'VIB-CFG-002'
    };
    const url = API.InquiryUtilityConfig;
    return this.apiService.postMfs(url, json);
  }

  getSuitAnswer() {
    const userInfo = this.userService.getUser();
    const json = {
      card_no: userInfo.idNumber,
      cif_id: userInfo.kkcisid,
      id_type: userInfo.idType,
      suitability_code: '',
      version: ''
    };
    const url = API.GetSuitAnswer;
    return this.apiService.post(url, json);
  }

  submitSuitAnswer(answer) {
    const userInfo = this.userService.getUser();
    const json = {
      ott: this.dataService.tokenOtt,
      cifId: userInfo.kkcisid,
      idType: userInfo.idType,
      cardNo: userInfo.idNumber,
      suitabilityCode: '',
      byPass: 'N',
      createdBy: 'VIB',
      submitAnswers: answer
    };
    const url = API.SubmitSuitAnswer;
    return this.apiService.postMfs(url, json);
  }

  getSuitScore() {
    const userInfo = this.userService.getUser();
    const json = {
      card_id: userInfo.idNumber,
      id_type: userInfo.idType,
      cif_id: userInfo.kkcisid
    };
    const url = API.GetSuitScore;
    return this.apiService.post(url, json).map(response => {
      try {
        this.updateSuitScore(response.data.CUST_SUIT.CustSuitScore[0]);
      } catch (e) {
        console.log('exception get json from getSuitScore');
      }
      return response;
    });
  }

  getPortDetail() {
    const userInfo = this.userService.getUser();
    const json = {
      port_guid: userInfo.GUID
    };
    const url = API.GetPortDetail;
    return this.apiService.post(url, json);
  }

  getPortSummary() {
    const userInfo = this.userService.getUser();
    const json = {
      port_guid: userInfo.GUID
    };
    const url = API.GetPortSummary;
    return this.apiService.post(url, json);
  }

  GetFundFactByFundCode(fundCode) {
    const json = {
      fund_code: fundCode
    };
    const url = API.GetFundFactByFundCode;
    return this.apiService.post(url, json);
  }

  getPortTransaction(
    unitHolderNo = null,
    fundCode = null,
    pageNumber = 1,
    pageSize = 100
  ) {
    const userInfo = this.userService.getUser();
    const json = {
      port_guid: userInfo.GUID,
      fund_code: fundCode,
      unit_holde_no: unitHolderNo,
      page_number: pageNumber,
      page_size: pageSize
    };
    const url = API.GetPortTransaction;
    return this.apiService.post(url, json);
  }

  getOrderStatus() {
    const userInfo = this.userService.getUser();
    const json = {
      port_guid: userInfo.GUID
    };
    const url = API.GetOrderStatus;
    return this.apiService.post(url, json);
  }

  getBuyFundList() {
    return this.getFundList(this.fundlistMode.buy, '');
  }

  getNewFundList() {
    return this.getFundList(this.fundlistMode.new, '');
  }

  getRedeemFundList() {
    return this.getFundList(this.fundlistMode.redeem, '');
  }

  getSwitchInFundList(fundCode) {
    return this.getFundList(this.fundlistMode.switchIn, fundCode);
  }

  getSwitchOutFundList() {
    return this.getFundList(this.fundlistMode.switchOut, '');
  }

  getHolderList(fundCode = null) {
    const userInfo = this.userService.getUser();
    const json = {
      port_guid: userInfo.GUID,
      fund_code: fundCode
    };
    const url = API.GetHolderList;
    return this.apiService.post(url, json);
  }

  getFundSuitAndExchange(fundCode) {
    const json = {
      fund_code: fundCode
    };
    const url = API.GetFundSuitAndExchange;
    return this.apiService.post(url, json);
  }

  insertOrderBuyAndPrePayment(transaction) {
    const customerInfo = this.userService.getUser();
    const customerSuitScore = customerInfo.suitScore;
    const holder = transaction.selectedHolder;
    const fund = transaction.selectedFund;
    const {
      ExchangeFlag,
      FIFFlag,
      FundSuitLevel,
      LTFFlag
    } = transaction.fundSuitAndExchange;
    const {
      EstimateEffectiveDate,
      CutOffTime,
      OrderDate
    } = transaction.estimateEffectiveDate;
    const { accecptLTFCondition } = transaction;
    const unitHolderSuitLevel = customerSuitScore.CUST_SUIT_LEVEL;
    const unitHolderSuitFlag = 'Y';
    const accountFrom: BankAccount = transaction.from;
    const json = {
      unit_holder_no: holder.Unitholder,
      order_date: OrderDate,
      effective_date: EstimateEffectiveDate,
      fund_code: fund.FundCode,
      amount_baht: Utils.toStringNumber(transaction.amount),
      exchange_flag: transaction.fundSuitAndExchange.ExchangeFlag,
      unit_holder_suit_level: unitHolderSuitLevel,
      unit_holder_suit_flag: FundSuitLevel > unitHolderSuitLevel,
      bank_account_number: accountFrom.accountNumber,
      bank_name: accountFrom.bank.name,
      bank_branch: accountFrom.branchName,
      bank_branch_code: Utils.setPadZero(accountFrom.branchCode, 4),
      ltf_condition: accecptLTFCondition,
      refferral_no: '',
      agent_no: '',
      agent_name: '',
      agent_branch_no: '',
      pay_type: '01',
      ordering_branch: Environment.branchCode,
      ordering_bank_code: AppConstant.bankCode,
      sending_bank_code: accountFrom.bank.code,
      sending_account_no: accountFrom.accountNumber,
      sending_branch: Utils.setPadZero(accountFrom.branchCode, 4),
      sending_cheque_no: '',
      sending_pct_code: '',
      card_id: customerInfo.idNumber,
      cust_name: holder.UnitholderNameTH
    };
    const url = API.InsertOrderBuyAndPrePayment;
    return this.apiService.post(url, json);
  }

  insertOrderSell(transaction) {
    const customerInfo = this.userService.getUser();
    const customerSuitScore = customerInfo.suitScore;
    const holder = transaction.selectedHolder;
    const fund = transaction.selectedFund;
    const {
      EstimateEffectiveDate,
      CutOffTime,
      OrderDate
    } = transaction.estimateEffectiveDate;
    const {
      ExchangeFlag,
      FIFFlag,
      FundSuitLevel,
      LTFFlag
    } = transaction.fundSuitAndExchange;
    const unitHolderSuitLevel = customerSuitScore.CUST_SUIT_LEVEL;
    const accountTo: BankAccount = transaction.to;
    const json = {
      id_no: customerInfo.idNumber,
      id_type: customerInfo.idType,
      cust_tel_no: customerInfo.mobileNumber,
      cust_email: customerInfo.email,
      unit_holder_no: holder.Unitholder,
      order_date: OrderDate,
      effective_date: EstimateEffectiveDate,
      fund_code: fund.FundCode,
      cut_off_time: CutOffTime,
      amount_baht: '',
      amount_unit: Utils.toStringNumber(transaction.amount_unit),
      redeem_type: 'U',
      bank_account_number: accountTo.accountNumber,
      bank_name: accountTo.bank.name,
      bank_name_code: accountTo.bank.code,
      bank_branch: accountTo.branchName,
      bank_branch_code: Utils.setPadZero(accountTo.branchCode, 4),
      marketing_id: '',
      refferral_no: '',
      agent_no: '',
      agent_name: '',
      agent_branch_no: '',
      exchange_flag: isNullOrUndefined(ExchangeFlag) ? 'N' : ExchangeFlag,
      ltf_condtion: isNullOrUndefined(LTFFlag) ? 'N' : LTFFlag,
      foreign_flg: isNullOrUndefined(FIFFlag) ? 'N' : FIFFlag,
      accept_flg: 'Y',
      unit_holder_suit_level: unitHolderSuitLevel,
      unit_holder_flag: FundSuitLevel > unitHolderSuitLevel,
      ordering_branch_name: '',
      ordering_branch_code: Environment.branchCode
    };
    const url = API.InsertOrderSell;
    return this.apiService.post(url, json);
  }

  insertOrderSwitch(transaction) {
    const customerInfo = this.userService.getUser();
    const customerSuitScore = customerInfo.suitScore;
    const { selectedHolder, selectedFund } = transaction;
    const {
      ExchangeFlag,
      FIFFlag,
      FundSuitLevel,
      LTFFlag
    } = transaction.fundSuitAndExchange;
    const {
      EstimateEffectiveDate,
      CutOffTime,
      OrderDate
    } = transaction.estimateEffectiveDate;
    const {
      selectedFundSwitchIn,
      selectedHolderSwitch,
      accecptUnitHolderSuitFlag,
      accecptExchangeFlag,
      accecptLTFCondition
    } = transaction;
    const unitHolderSuitLevel = customerSuitScore.CUST_SUIT_LEVEL;
    const json = {
      id_no: customerInfo.idNumber,
      id_type: customerInfo.idType,
      cust_tel_no: customerInfo.mobileNumber,
      cust_email: customerInfo.email,
      unit_holder_no: selectedHolder.Unitholder,
      order_date: OrderDate,
      cut_off_time: CutOffTime,
      effective_date: EstimateEffectiveDate,
      fund_code_out: selectedFund.FundCode,
      fund_code_in: selectedFundSwitchIn.FundCode,
      amount_baht: selectedHolder.EstimateAmount,
      amount_unit: selectedHolder.AvailableUnit,
      switch_type: 'U', // U: Unit, B Baht
      exchange_flag: isNullOrUndefined(ExchangeFlag) ? 'N' : ExchangeFlag,
      ltf_condtion: isNullOrUndefined(LTFFlag) ? 'N' : LTFFlag,
      foreign_flg: isNullOrUndefined(FIFFlag) ? 'N' : FIFFlag,
      accept_flg: 'Y',
      unit_holder_suit_level: unitHolderSuitLevel,
      unit_holder_flag: FundSuitLevel > unitHolderSuitLevel,
      agent_name: '',
      ordering_branch_name: '',
      ordering_branch_code: Environment.branchCode,
      machine_id: Environment.machine_id
    };
    const url = API.InsertOrderSwitch;
    return this.apiService.post(url, json);
  }

  paymentAndUpdateStatus(transaction) {
    const customerInfo = this.userService.getUser();
    const customerSuitScore = customerInfo.suitScore;
    const { refName, profileCode, insertOrderBuyAndPrePayment } = transaction;
    const {
      EstimateEffectiveDate,
      CutOffTime,
      OrderDate
    } = transaction.estimateEffectiveDate;
    const {
      ExchangeFlag,
      FIFFlag,
      FundSuitLevel,
      LTFFlag
    } = transaction.fundSuitAndExchange;
    const holder = transaction.selectedHolder;
    const fund = transaction.selectedFund;
    const accountFrom: BankAccount = transaction.from;
    const unitHolderSuitLevel = customerSuitScore.CUST_SUIT_LEVEL;
    const json = {
      id_no: customerInfo.idNumber,
      id_type: customerInfo.idType,
      cust_tel_no: customerInfo.mobileNumber,
      cust_email: customerInfo.email,
      machine_id: Environment.machine_id,
      cut_off_time: CutOffTime,
      unit_holder_no: holder.Unitholder,
      transaction_id: insertOrderBuyAndPrePayment.REF1,
      addition_profile_code: insertOrderBuyAndPrePayment.ADDITION_PROFILE_CODE,
      company_code: insertOrderBuyAndPrePayment.COMPANY_CODE,
      service_code: insertOrderBuyAndPrePayment.SERVICE_CODE,
      subservice_code: insertOrderBuyAndPrePayment.SUBSERVICE_CODE,
      ref1: insertOrderBuyAndPrePayment.REF1,
      ref2: insertOrderBuyAndPrePayment.REF2,
      ref3:
        insertOrderBuyAndPrePayment.REF3 === undefined
          ? null
          : insertOrderBuyAndPrePayment.REF3,
      ref4:
        insertOrderBuyAndPrePayment.REF4 === undefined
          ? null
          : insertOrderBuyAndPrePayment.REF4,
      ref5:
        insertOrderBuyAndPrePayment.REF5 === undefined
          ? null
          : insertOrderBuyAndPrePayment.REF5,
      pay_amt: insertOrderBuyAndPrePayment.PAY_AMT,
      pay_type: '01', //01 = Transfer,	02 = Cash,15 = Internal Transfer
      fee_pay_type: '01',
      pay_effective_date: insertOrderBuyAndPrePayment.TOBE_EFFECTIVE_DATE,
      card_no: customerInfo.idNumber,
      cust_name: holder.UnitholderNameTH,
      duedate: EstimateEffectiveDate,
      ordering: {
        ordering_branch: Environment.branchCode,
        ordering_bank_code: AppConstant.bankCode
      },
      sending: {
        sending_bank_code: accountFrom.bank.code,
        sending_account_no: accountFrom.accountNumber,
        sending_bank_name: accountFrom.bank.name,
        sending_branch: Utils.setPadZero(accountFrom.branchCode, 4),
        cheque_no: '',
        pct_code: ''
      },
      remark: insertOrderBuyAndPrePayment.REMARK,
      reconfirm_flag: 'N',
      payment_ref_id: insertOrderBuyAndPrePayment.PAYMENT_REF_ID,
      fee_list: [
        {
          fee_code: insertOrderBuyAndPrePayment.FEE_LIST.FEE_INFO.FEE_CODE,
          fee_detail: insertOrderBuyAndPrePayment.FEE_LIST.FEE_INFO.FEE_DETAIL,
          cust_fee_amt:
            insertOrderBuyAndPrePayment.FEE_LIST.FEE_INFO.CUST_FEE_AMT,
          vat: insertOrderBuyAndPrePayment.FEE_LIST.FEE_INFO.VAT,
          tax: insertOrderBuyAndPrePayment.FEE_LIST.FEE_INFO.TAX,
          waive_flag: insertOrderBuyAndPrePayment.FEE_LIST.FEE_INFO.WAIVE_FLAG,
          sending: {
            sending_bank_code: accountFrom.bank.code,
            sending_account_no: accountFrom.accountNumber,
            sending_branch: Utils.setPadZero(accountFrom.branchCode, 4)
          }
        }
      ],
      exchange_flag: isNullOrUndefined(ExchangeFlag) ? 'N' : ExchangeFlag,
      ltf_condtion: isNullOrUndefined(LTFFlag) ? 'N' : LTFFlag,
      foreign_flg: isNullOrUndefined(FIFFlag) ? 'N' : FIFFlag,
      accept_flg: 'Y',
      unit_holder_suit_level: unitHolderSuitLevel,
      unit_holder_flag: FundSuitLevel > unitHolderSuitLevel,
      agent_name: '',
      ordering_branch_name: ''
    };
    const url = API.PaymentAndUpdateStatus;
    return this.apiService.post(url, json);
  }

  updateOrderCancel(unit_holder_no, transaction_id) {
    const json = {
      unit_holder_no: unit_holder_no,
      transaction_id: transaction_id,
      system_flag: 'N'
    };
    const url = API.UpdateOrderCancel;
    return this.apiService.post(url, json);
  }

  private getFundList(mode, fundCode = '') {
    const userInfo = this.userService.getUser();
    const json = {
      port_guid: userInfo.GUID,
      as_of: Utils.getCurrentDate('', 'dd/mm/yyyy'),
      mode: mode,
      fund_code_out: fundCode
    };
    const url = API.GetFundList;
    return this.apiService.post(url, json);
  }

  getTransactionEffectiveDate(fundCode, type) {
    const json = {
      fund_code: fundCode,
      order_date: Utils.getCurrentDate('', 'dd/mm/yyyy'),
      transaction_type_code: this.transactionType[type]
    };
    const url = API.GetTransactionEffectiveDate;
    return this.apiService.post(url, json);
  }

  // GET INQUIRY FUND LIST
  getInquiryFundList(paramType, swich_out_fundId = '') {
    const userInfo = this.userService.getUser();
    const url = API.GET_FUND_LIST;
    let request: any = [];
    if (paramType === 'SI') {
      request = {
        cifId: userInfo.kkcisid,
        requestType: paramType,
        fundId: Number(swich_out_fundId)
      };
    } else {
      request = {
        cifId: userInfo.kkcisid,
        requestType: paramType
      };
    }
    console.log('DATA REQ', request)
    return this.apiService.post(url, request);
  }

  // GET INQUIRY OUT STANDING
  getInquiryOutstanding(unitHolderId, fundId = '') {
    const userInfo = this.userService.getUser();
    const url = API.GetOutstandingList;
    const request = {
      cifId: userInfo.kkcisid,
      unitHolderId: unitHolderId,
      fundId: fundId
    };
    return this.apiService.postVIBWithHeader(url, request, false);
  }

  // GET INQUIRY OUT STANDING
  checkUnConsentByIDCard() {
    const userInfo = this.userService.getUser();
    const url = API.CheckUnConsentByIDCard;
    const request = {
      cardNo: userInfo.idNumber
    };
    return this.apiService.postVIBWithHeader(url, request, false);
  }

  // GET HREF LINK DOWLOAD PDF
  getHreflinkPDF(urls) {
    const url = urls;
    return this.apiService.getHrefLinkPDF(url);
  }

  // GET HREF LINK DOWLOAD PDF
  downloadFundFactSheet(urls, FundCode) {
    const url = urls;
    const request = {
      Symbol: FundCode
    }
    return this.apiService.downloadFundFactSheet(url, request);
  }

  // GET FUND CONDITION
  getFundCondition(fundSelect: any = [], requestType) {
    console.log('DATA SERVICE REQ', fundSelect)
    console.log('REQ TYPE', requestType)
    const url = API.GET_FUND_CONDITION;
    let overRiskFlag: string
    let derivativeFlag: string
    let ltfFlag: string
    let rmfFlag: string
    let fifFlag: string
    let fxRiskFlag: string
    let taxType: string
    if (requestType === 'BU' || requestType === 'SI') {
      const suitLevel = this.userService.getUser().suitScore.riskProfile.toString()
      const riskLevel = requestType === 'SI' ? fundSelect.fundRiskLevel.toString() : fundSelect[0].fundRiskLevel.toString()
      let fundRiskLevel = '';
      switch (true) {
        case (riskLevel === '1'):
          fundRiskLevel = '1'
          break;
        case (riskLevel >= '2' && riskLevel <= '4'):
          fundRiskLevel = '2'
          break;
        case (riskLevel === '5'):
          fundRiskLevel = '3'
          break;
        case (riskLevel >= '6' && riskLevel <= '7'):
          fundRiskLevel = '4'
          break;
        case (riskLevel === '8'):
          fundRiskLevel = '5'
          break;
        default:
          break;
      }

      overRiskFlag = suitLevel >= fundRiskLevel ? 'N' : 'Y'
      derivativeFlag = requestType === 'SI' ? fundSelect.derivativeFlag : fundSelect[0].derivativeFlag
      if (requestType === 'SI') {
        ltfFlag = fundSelect.taxType === null || fundSelect.taxType === 'RMF' ? 'N' : 'Y'
        rmfFlag = fundSelect.taxType === null || fundSelect.taxType === 'LTF' ? 'N' : 'Y'
        fifFlag = fundSelect.fifFlag
        fxRiskFlag = fundSelect.fxRiskFlag
        taxType = fundSelect.taxType;
      } else {
        ltfFlag = fundSelect[0].taxType === null || fundSelect[0].taxType === 'RMF' ? 'N' : 'Y'
        rmfFlag = fundSelect[0].taxType === null || fundSelect[0].taxType === 'LTF' ? 'N' : 'Y'
        fifFlag = fundSelect[0].fifFlag
        fxRiskFlag = fundSelect[0].fxRiskFlag
        taxType = fundSelect[0].taxType;
      }
    } else if (requestType === 'SE') {
      overRiskFlag = 'N'
      derivativeFlag = fundSelect.derivativeFlag
      ltfFlag = 'N'
      rmfFlag = 'N'
      fifFlag = fundSelect.fifFlag
      fxRiskFlag = fundSelect.fxRiskFlag
    } else if (requestType === 'CON') {
      overRiskFlag = 'Y'
      derivativeFlag = 'Y'
      ltfFlag = 'Y'
      rmfFlag = 'Y'
      fifFlag = 'Y'
      fxRiskFlag = 'Y'
    }

    const request = {
      requestType: requestType,
      overRiskFlag: overRiskFlag,
      derivativeFlag: derivativeFlag,
      ltfFlag: ltfFlag,
      rmfFlag: rmfFlag,
      fifFlag: fifFlag,
      fxRiskFlag: fxRiskFlag,
      taxType:taxType
    };
    console.log('DATA REQ', request)
    return this.apiService.post(url, request);
  }

  // GET PREPARE ORDER
  getPrepareOrder(fundTotalAmount = '', fundSelect: any = [], bankAccount: any = [], unitholderId: any = [], type = '', units = '', toFundSelect: any = []) {
    const userInfo = this.userService.getUser();
    const url = API.GET_PREPARE_ORDER;
    let accountNo: any = [];
    let bankCode: any = [];
    let fundId: any = [];
    let fundCode: any = [];
    let toFundId: any = [];
    let toFundCode: any = [];
    let amount: any = [];
    let unit: any = [];
    let acceptFundRisk: any = [];
    let acceptFxRisk: any = [];
    let paymentType: any = [];
    let branchCode: any = [];
    if (type === 'BU') {
      accountNo = bankAccount.accountNumber,
        bankCode = bankAccount.bank.code,
        branchCode = bankAccount.branchCode ? bankAccount.branchCode.padStart(4, '0') : '',
        fundId = fundSelect[0].fundId,
        fundCode = fundSelect[0].fundCode,
        toFundId = '',
        toFundCode = '',
        amount = Number(fundTotalAmount),
        unit = '',
        acceptFundRisk = 'Y',
        acceptFxRisk = 'Y',
        paymentType = '2'
    } else if (type === 'SE') {
      accountNo = bankAccount.accountNumber,
        bankCode = bankAccount.bank.code,
        branchCode = bankAccount.branchCode ? bankAccount.branchCode.padStart(4, '0') : '',
        fundId = fundSelect.fundId,
        fundCode = fundSelect.fundCode,
        toFundId = '',
        toFundCode = '',
        amount = fundTotalAmount === '' ? fundTotalAmount : Number(fundTotalAmount),
        unit = units === '' ? units : Number(units),
        acceptFundRisk = 'Y',
        acceptFxRisk = 'Y',
        paymentType = '2'
    } else if (type === 'SW') {
      accountNo = '',
        bankCode = '',
        branchCode = '',
        // fundId = '284',
        fundId = fundSelect.fundId,
        fundCode = fundSelect.fundCode,
        // toFundId = '284',
        toFundId = toFundSelect.fundId,
        toFundCode = toFundSelect.fundCode,
        amount = fundTotalAmount === '' ? fundTotalAmount : Number(fundTotalAmount),
        unit = units === '' ? units : Number(units),
        acceptFundRisk = 'Y',
        acceptFxRisk = 'Y',
        paymentType = '2'
    }
    const request = {
      ott: this.dataService.tokenOtt,
      cifId: userInfo.kkcisid,
      orderType: type,
      effectiveDate: Utils.getCurrentDate("", "yyyymmdd"),
      // effectiveDate: '20200114',
      unitholderId: unitholderId,
      userId: userInfo.kkcisid,

      accountNo: accountNo,
      bankCode: bankCode,
      branchCode: branchCode,
      // fundId: '284',
      fundId: fundId,
      fundCode: fundCode,
      // toFundId: '284',
      toFundId: toFundId,
      toFundCode: toFundCode,
      amount: amount,
      unit: unit,
      acceptFundRisk: acceptFundRisk,
      acceptFxRisk: acceptFxRisk,
      paymentType: paymentType
    };
    console.log('REQ', request)
    return this.apiService.post(url, request);
  }

  // CONFIRM ORDER
  confirmOrder(param) {
    const url = API.CONFIRM_ORDER;
    const request = {
      ott: this.dataService.tokenOtt,
      confirmType: 'NO',
      referenceNo: param.referenceNo,
      mutualFundRef: param.mutualFundRef,
      userId: this.userService.getUser().kkcisid
    };
    return this.apiService.post(url, request);
  }
  // GET UNITHOLDER
  getUnitholder() {
    const userInfo = this.userService.getUser();
    const url = API.GetMutualfundAccountList;
    const request = { cardId: userInfo.idNumber };
    return this.apiService.post(url, request);
  }

  // GET BANK ACCOUNT BY UNITHOLDER
  getBankAccountByUniholder(fundId) {
    const userInfo = this.userService.getUser();
    const url = API.InquiryUnitHolderByFund;
    const request = {
      cifId: userInfo.kkcisid,
      requestType: "SE",
      fundId: fundId
    };
    return this.apiService.post(url, request);
  }

  // GET CHECK VIB CONSENT BY CIF
  checkVIBConsentByCif(isAccepType = '', version = '') {
    let userInfo = this.userService.getUser();
    let url = '';
    let request = {};
    if (isAccepType === '') {
      url = API.CheckVIBConsentByCif
      request = {
        cifId: userInfo.kkcisid,
      };
    } else {
      url = API.SaveVIBConsent
      request = {
        cifId: userInfo.kkcisid,
        isAccept: isAccepType,
        version: version,
        acceptConsentDate: isAccepType === 'Y' ? Utils.getCurrentDate("", "dd/mm/yyyy") : '',
        idType: userInfo.idType,
        cardNo: userInfo.idNumber,
      };
    }
    return this.apiService.post(url, request);
  }

  // GET && SET FUND SELECT TO PURCASE FUND
  public set selectFund(data) {
    this.dataFund = data;
  }
  public get selectFund() {
    return this.dataFund;
  }
  // GET && SET FUND SELECT TO PURCASE FUND
  public set selectFundSwich_In(data) {
    this.dataFundSwich_In = data;
  }
  public get selectFundSwich_In() {
    return this.dataFundSwich_In;
  }
  // GET && SET FUND SELECT TO PURCASE FUND
  public set selectFundSwich_Out(data) {
    this.dataFundSwich_Out = data;
  }
  public get selectFundSwich_Out() {
    return this.dataFundSwich_Out;
  }
  // GET && SET FUND SELECT TO PURCASE FUND
  public set unitHolderId(data) {
    this.UNITHOLDER_ID = data;
  }
  public get unitHolderId() {
    return this.UNITHOLDER_ID;
  }
}
