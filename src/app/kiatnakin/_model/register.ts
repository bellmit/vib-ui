import { Address, IdCardInfo, Gender } from "./idCardInfo";
import { debug } from "util";
import { DataService } from "app/kiatnakin/_service";
import { environment } from "../../../environments/environment"

export let SubscriptionType = {
    newTD: "newTD",
    newSA: "newSA"
}

export class Register {
    businessTypeList: any;
    careerList: any[];
    ssu: SSU = new SSU();
    temp: SSU = new SSU();
    fatca: FATCA = new FATCA();
    mypin: MyPin = new MyPin();
    subscription: Subscription = new Subscription();
    subscriptionService: SubscriptionService = new SubscriptionService();
    Realation: Realation = new Realation();
    ThaiTxT = 'ไทย';
    accountNumber: string;
    accountName: string;
    sanction_list: string;
    KKCISID: string;
    CISID: string;
    job_id: string;
    job_id_ib: string;
    job_id_sms: string;
    job_id_lock: string;
    job_id_atm: string;
    chipNo: string;
    requestNo: string;
    birthdate: string;
    subscription_id: string;
    laser_no: string;
    AnyIdType: string;
    E_name: string;
    E_lastname: string;
    haveIB: string;
    haveIVR: string;
    haveMyPin: string;
    haveSMS = new Array();
    AuthenMyPIN: string;
    laser_no1: string = '';
    laser_no2: string = '';
    laser_no3: string = '';
    account_no: string;
    account_no_interest: string;
    idType: string = "N";
    haveFD: string;
    id13orPhoneNo: string;
    smsServiceChecked: boolean = false;
    phoneServiceChecked: boolean = false;
    atmServiceChecked: boolean = false;
    otp_no: string = "";
    ReferenceNo: string;
    TokenUUID: string;
    atmList = new Array();
    TermAndCon: TermAndCon = new TermAndCon();
    Product251: string = "251 - KK Savings Plus Individual";
    search_by: string = '';
    isTellerApproved: boolean = false;
    domainAPI: string = environment.domainNewApi;
    flag_open_account_service: string = 'N';
    onStatus: string = '';

    constructor(idCardInfo: IdCardInfo) {
    }

    updateUserInfo(idCardInfo: IdCardInfo) {

        this.ssu.cardInfo.titleTH = idCardInfo.titleTH;
        this.ssu.cardInfo.titleEN = idCardInfo.titleEN;
        this.ssu.cardInfo.nameTH = idCardInfo.nameTH;
        this.ssu.cardInfo.surnameTH = idCardInfo.surnameTH;
        this.ssu.cardInfo.nameEN = idCardInfo.nameEN;
        this.ssu.cardInfo.surnameEN = idCardInfo.surnameEN;
        this.ssu.cardInfo.idCardNumber = idCardInfo.idCardNumber;
        this.ssu.cardInfo.idCardNumbertxt = idCardInfo.idCardNumbertxt;
        this.ssu.cardInfo.birthdate.sum = idCardInfo.birthdate.sum;
        this.ssu.cardInfo.birthdate.day = idCardInfo.birthdate.day;
        this.ssu.cardInfo.birthdate.mounth = idCardInfo.birthdate.mounth;
        this.ssu.cardInfo.birthdate.mounthEN = idCardInfo.birthdate.mounthEN;
        this.ssu.cardInfo.birthdate.year = idCardInfo.birthdate.year;
        this.ssu.cardInfo.birthdate.yearEN = idCardInfo.birthdate.yearEN

        this.ssu.cardInfo.expireDate = idCardInfo.expireDate;
        this.ssu.cardInfo.expireDate.mounthEN = idCardInfo.expireDate.mounthEN;
        this.ssu.cardInfo.expireDate.yearEN = idCardInfo.expireDate.yearEN
        this.ssu.cardInfo.issueDate = idCardInfo.issueDate;
        this.ssu.cardInfo.issueDate.mounthEN = idCardInfo.issueDate.mounthEN;
        this.ssu.cardInfo.issueDate.yearEN = idCardInfo.issueDate.yearEN
        this.ssu.cardInfo.nation = idCardInfo.nation;
        this.ssu.cardInfo.idType = idCardInfo.idType;
        this.ssu.cardInfo.gender = idCardInfo.gender;
        this.ssu.cardInfo.image = idCardInfo.image;

        this.ssu.cardInfo.address.no = idCardInfo.address.no;
        this.ssu.cardInfo.address.moo = idCardInfo.address.moo;
        this.ssu.cardInfo.address.alley = idCardInfo.address.alley;
        this.ssu.cardInfo.address.street = idCardInfo.address.street;
        this.ssu.cardInfo.address.country = idCardInfo.address.country;
        this.ssu.cardInfo.address.province = idCardInfo.address.province;
        this.ssu.cardInfo.address.locality = idCardInfo.address.locality;
        this.ssu.cardInfo.address.district = idCardInfo.address.district;
        this.ssu.cardInfo.address.AddressFull = idCardInfo.address.AddressFull;

        this.chipNo = idCardInfo.chipNo;
        this.requestNo = idCardInfo.requestNo;
        this.birthdate = idCardInfo.birthdate.year + idCardInfo.birthdate.mounthNumber + idCardInfo.birthdate.day;
    }

    updateSubscriptionInfo(idCardInfo: IdCardInfo) {

        this.subscription.account.ACCOUNT_NAME = idCardInfo.ACCOUNT_NAME;
        this.subscription.cardInfo.idCardNumber = idCardInfo.idCardNumber;
        this.subscription.cardInfo.idCardNumbertxt = idCardInfo.idCardNumbertxt;
        this.subscription.cardInfo.titleTH = idCardInfo.titleTH;
        this.subscription.cardInfo.nameTH = idCardInfo.nameTH;
        this.subscription.cardInfo.surnameTH = idCardInfo.surnameTH;
        this.subscription.cardInfo.titleEN = idCardInfo.titleEN;
        this.subscription.cardInfo.nameEN = idCardInfo.nameEN;
        this.subscription.cardInfo.surnameEN = idCardInfo.surnameEN;
    }

    getFullName() {
        return this.ssu.cardInfo.nameTH + " " + this.ssu.cardInfo.surnameTH;
    }

    resetSubscriptionCurrent() {
        this.ssu.current.address = new Address();
    }

    resetSubscriptionOffice() {
        console.log(this.ssu.office.address);
        this.ssu.office.address = new Address();
    }

    resetSubscriptionTrans() {
        this.subscription.address = new Address();
    }

    setProduct(data: DataService) {
        this.subscription.account.PROD_CODE = data.selectedProduct.PROD_CODE;
        this.subscription.account.PROD_DESC = data.selectedProduct.PROD_DESC;
        this.subscription.account.PROD_TYPE = data.selectedProduct.PROD_TYPE;
        this.subscription.account.PROD_TYPE_DESC = data.selectedProduct.PROD_TYPE_DESC;
    }

}

class TermAndCon {
    Account_Term: string = "./assets/kiatnakin/termAndconditions/Account_Term.txt";
    Electronics_Term: string = "./assets/kiatnakin/termAndconditions/Electronics_Term.txt";
    PromtPay_Term: string = "./assets/kiatnakin/termAndconditions/PromtPay_Term.txt";
}

class Realation {
    realation1: any[];
    realation2: any[];
}

class SSU {
    cardInfo: IdCardInfo = new IdCardInfo();
    current: Current = new Current();
    office: Office = new Office();
    spouse: Spouse = new Spouse();
    property: Property = new Property();
    business: Business = new Business();
    relationship: Relationship = new Relationship();
    career: Career = new Career();
    position: Position = new Position();
    primary: Selected = new Selected();
    income: Selected = new Selected();
    Contryincome: Selected = new Selected();
    ban: Selected = new Selected();
    launder: Selected = new Selected();
    politic: Selected = new Selected();
    interest: Selected = new Selected();
    education = null;
    kyc: Selected = new Selected();
    SANCTION_FLAG: string = '';
    contact: ContactInfo = new ContactInfo();
}

class FATCA {
    status: string;
    usCitizen: string;
    usCard: string;
    usLocation: string;
    usTerritory: string;
    usTransfer: string;
    usSignatory: string;
    usContact: string;
    usAddress: string;
    usTelephone: string;
}

class Subscription {
    cardInfo: IdCardInfo = new IdCardInfo();
    current: Current = new Current;
    Type: string;
    address: Address = new Address();
    office: Office = new Office();
    contact: Contact = new Contact();
    accountType: string;
    account: Account = new Account();
}

class SubscriptionService {
    service: Service = new Service();
    contact: Contact = new Contact();
}

class Current {
    address: Address = new Address();
    contact: Contact = new Contact();
    Type: string = "";
}

class Office {
    address: Address = new Address();
    contact: Contact = new Contact();
    Type: string = "";
}

export class Selected {
    Select: string;
    Value: string;
    Desc: string;
}

class Contact {
    email: string = "";
    office_phone: string = "";
    moblie_phone: string = "";
    home_phone: string = "";
    fax_phone: string = "";
}

export class Property {
    Value: string;
    Id: string;
}

export class Business {
    Type: string;
    Id: string;
    DESC: string;
    business_type: string;
}

class Relationship {
    title1: Language = new Language();
    name1: Language = new Language();
    surname1: Language = new Language();
    contact1: Contact = new Contact();
    Type1: string;
    Other1: string;
    Data1: string = '';
    gender1: Gender = new Gender();

    title2: Language = new Language();
    name2: Language = new Language();
    surname2: Language = new Language();
    contact2: Contact = new Contact();
    Type2: string;
    Other2: string;
    Data2: string = '';
    gender2: Gender = new Gender();
}

class Career {
    Data: string;
    Id: string;
    DESC: string;
    workplace: string;
    position: string;
}

class Position {
    Data: string;
    Id: string;
    DESC: string;
    workplace: string;
    position: string;
}

class MyPin {
    pin: string;
    pin_confirm: string;
}

export class Spouse {
    status: string;
    title: Language = new Language();
    name: Language = new Language();
    surname: Language = new Language();
    gender: Gender = new Gender();
}

class Language {
    TH: string;
    TH_Id: string;
    EN: string;
    EN_Id: string;
    titleFullTH: string;
    titleFullEN: string;
}

class Info {
    titleTH: string;
    titleEN: string;
    nameTH: string;
    surnameTH: string;
    nameEN: string;
    surnameEN: string;
    idCardNumber: number;
    idCardNumbertxt: string;
}

export class Account {
    interest: string;
    interestData: string;
    flg_psbook: string;
    PROD_CODE: string;
    PROD_DESC: string;
    PROD_TYPE: string;
    PROD_TYPE_DESC: string;
    SYSPRODUCT_GROUP: string;
    SYSSUBSCR_ID: string;
    CURSTATUS: string;
    ACCOUNT_NAME: string;
    ACCOUNT_NO: string;
    ACCOUNT_TYPE: string;
    INTPATTYPE: string //Default value = '4'
    PMT_COND: string; //ประเภทเงื่อนไขการสั่งจ่าย
    PMT_OTH: string; //รายละเอียดเงื่อนไขการสั่งจ่ายอื่นๆ (กรณี PMT_COND = 0 'อื่นๆ')
    PMT_DESC: string; //รายละเอียดเงื่อนไขของการสั่งจ่าย (Ex: ลงนามสั่งจ่ายคนเดียว)
    PMT_ID: string;
    PAY_INT_CHN: string; //ช่องทางการรับดอกเบี้ย A: โอนเข้าบัญชี, C เชค
    OBJ: OBJ = new OBJ();
    OBJ1: string; // ออมเงิน 'Y'/'' ( use '' instead N)
    OBJ2: string; // เพื่อลงทุน 'Y'/'' ( use '' instead N)
    OBJ3: string; // เพื่อหมุนเวียนทางธุรกิจ 'Y'/'' ( use '' instead N)
    OBJ4: string; // ชำระสินค้า/บริการ 'Y'/'' ( use '' instead N)
    OBJ5: string; // บัญชีเงินเดือน 'Y'/'' ( use '' instead N)
    OBJ6: string; //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ 'Y'/'' ( use '' instead N)
    OBJ_OTH: string = ""; //วัตถุประสงค์ในการเปิดบัญชี อื่นๆ (กรณี OBJ6 = 'Y')
    OBJ_DESC: string; //รายละเอียดวัตถุประสงค์ในการเปิดบัญชี (Ex: ออมเงิน)
    radioAddress: string
}

class OBJ {
    Data: string;
    Id: string;
}

class Date {
    day: string;
    mounth: string;
    year: string;
    sum: string;
}

class Service {
    card_type: string;
    ATM_NO: string;
    ATM_NO_STATUS: string;
    bin_code: string;
    sms: SMS = new SMS();
    phone: Phone = new Phone();
    internet: InternetBanking = new InternetBanking();
}

class Phone {
    TXN_LEVEL: string;
    VERIFY_LEVEL: string;
}

class InternetBanking {
    WEBSERVICE: string;
    CALLEDCAA: string;
    AccountNoFeeSMS_DATA: string;
    AccountNoFeeSMS: string;
}

class SMS {
    SMS_LANG: string;
    SMS_LANG_CODE: string;
    ACC_NO_FEE: string;
    ACTIVE_DATE: string;
}

export class ContactInfo {
    EMAIL_SEQ:  string;
    EMAIL: string;
    FAX_NO_SEQ: string;
    FAX_NO: string;
    HOME_TEL_NO_SEQ: string;
    HOME_TEL_NO: string;
    MOBILE_NO_SEQ: string;
    MOBILE_NO: string;
}

