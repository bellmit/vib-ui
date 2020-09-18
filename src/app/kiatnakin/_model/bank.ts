import {isNullOrUndefined} from "util";
import {environment} from "../../../environments/environment"

/**
 * Created by imac on 5/15/2017 AD.
 */


export class Bank {

    name: string;
    shot_name: string;
    image: string;
    bg_color: string = '';
    font_color: string;
    code: string;
    bg_image: string = '';

    static paymentChannel(): Bank[] {

        const bankList = [
            {
                "image": "PromptPay.png",
                "name": "promt_pay",
                "shot_name": "promptPay",
                "font_color": '#000000',
                "bg_color": "#e6e7e8",
                "code": "099"
            },
            {
                "IMG_NAME": "KKB.png",
                "BANK_NAME": "ธ.เกียรตินาคิน",
                "shot_name": "KKBA",
                "FONT_COLOR": '#FFFFFF',
                "BG_COLOR": "#594F74",
                'BANK_CODE_INT': "069"
            },
            {
                "image": "BKB.png",
                "name": "bangkok",
                "shot_name": "BKBA",
                "font_color": '#FFFFFF',
                "bg_color": "#004a99",
                'code': "002"
            },
            {
                "image": "KBAN.png",
                "name": "kasikorn",
                "font_color": '#FFFFFF',
                "bg_color": "#138f2d",
                'code': "004"
            },
            {
                "image": "KTB.png",
                "name": "krung_thai",
                "font_color": '#FFFFFF',
                "bg_color": "#019bdb",
                'code': "006"
            },
            {
                "image": "RHKB.png",
                "name": "ocbc",
                "font_color": '#FFFFFF',
                "bg_color": "#ed1c24",
                'code': "009"
            },
            {
                "image": "BTMU.png",
                "name": "btmu",
                "font_color": '#FFFFFF',
                "bg_color": "#d80c18",
                'code': "010"
            },
            {
                "image": "TMB.png",
                "name": "tmb",
                "font_color": '#4A4A4A',
                "bg_color": "#e6e7e8",
                'code': "011"
            },
            {
                "image": "TPB.png",
                "name": "scb",
                "bg_color": "#4E2A82",
                "font_color": '#FFFFFF',
                'code': "014"
            }
            // ,
            // {
            //     "image": "SB.png",
            //     "name": "ธ.นครหลวงไทย ",
            //     "bg_color": "#019BDB",
            //     'code': "015"
            // }
            ,
            {
                "image": "CITI.png",
                "name": "citi",
                "bg_color": "#053C6E",
                "font_color": '#FFFFFF',
                'code': "017"
            },
            {
                "image": "SCBT.png",
                "name": "scbt",
                "font_color": '#000000',
                "bg_color": "#e6e7e8",
                'code': "020"
            },
            // {
            //     "image": "SB2.png",
            //     "name": "ธ.นครหลวงไทย (2)",
            //     "bg_color": "#FFFFFF",
            //     'code': "021"
            // },
            {
                "image": "CIMB.png",
                "name": "cimb",
                "font_color": '#FFFFFF',
                "bg_color": "#790007",
                'code': "022"
            },
            {
                "image": "UOBT.png",
                "name": "uobk",
                "font_color": '#000000',
                "bg_color": "#e6e7e8",
                'code': "024"
            },
            {
                "image": "KSA.png",
                "name": "ayud",
                "font_color": '#FFFFFF',
                "bg_color": "#FEC33A",
                'code': "025"
            },
            {
                "image": "MEGA.png",
                "name": "micb",
                "font_color": '#FFFFFF',
                "bg_color": "#88652f",
                'code': "026"
            },
            {
                "image": "GSB.png",
                "name": "aomsin",
                "font_color": '#FFFFFF',
                "bg_color": "#ec068d",
                'code': "030"
            },
            {
                "image": "GHB.png",
                "name": "ghb",
                "font_color": '#FFFFFF',
                "bg_color": "#f57d23",
                'code': "033"
            },
            {
                "image": "TKS.png",
                "name": "agr",
                "font_color": '#FFFFFF',
                "bg_color": "#140C7B",
                'code': "034"
            },
            {
                "image": "EXIM.png",
                "name": "exim",
                "font_color": '#4A4A4A',
                "bg_color": "#e6e7e8",
                'code': "035"
            },
            {
                "image": "TNC.png",
                "name": "tban",
                "font_color": '#4A4A4A',
                "bg_color": "#e6e7e8",
                'code': "065"
            },
            {
                "image": "ISBT.png",
                "name": "isbt",
                "font_color": '#FFFFFF',
                "bg_color": "#083e03",
                'code': "066"
            },
            {
                "image": "TISC.png",
                "name": "tisc",
                "font_color": '#4A4A4A',
                "bg_color": "#e6e7e8",
                'code': "067"
            },
            {
                "image": "ICBC.png",
                "name": "icbc",
                "font_color": '#4A4A4A',
                "bg_color": "#e6e7e8",
                'code': "070"
            },
            {
                "image": "TCRB.png",
                "name": "tcrb",
                "font_color": '#FFFFFF',
                "bg_color": "#0068b4",
                'code': "071"
            },
            {
                "image": "LHB.png",
                "name": "lh",
                "font_color": '#FFFFFF',
                "bg_color": "#6d6e71",
                'code': "073"
            }
        ];

        const paymentChannel = new Array();

        bankList.forEach(bank => {
            paymentChannel.push(new Bank(bank));
        });

        return paymentChannel
    }

    static getKKPaymentChannel(): Bank[] {
        const bank = Bank.paymentChannel().filter(data => data.code === "069");
        return bank;
    }

    public static parseJSONArray(data: any) {
        const bankList = data.data;
        const list = new Array();
        for (const bank of bankList) {
            list.push(new Bank(bank));
        }
        return list;
    }

    public static isKKbrownIcon() {
        const bank = Bank.paymentChannel().filter(data => data.code === "069");
        bank['image'] = './assets/kiatnakin/image/kk_brown.png';
        bank['bg_image'] = './assets/kiatnakin/image/KK_Cheque_card.png';
        return bank;
    }

    constructor(json: any) {

        if (!isNullOrUndefined(json)) {

            this.name = json.BANK_NAME;
            this.image = environment.domainNewApi + `/files/icon_bank/${json.IMG_NAME}`;
            this.font_color = json.FONT_COLOR;
            this.bg_color = json.BG_COLOR;
            this.code = json.BANK_CODE_INT;
        }

    }

    isKiatnakinBank() {
        return this.code === "069";
    }

    isPromptPay() {
        return this.code === "099";
    }

}