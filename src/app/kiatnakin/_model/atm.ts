import { isNullOrUndefined } from "util";
import { environment } from "../../../environments/environment"

export class ATMCard {

    name: string;
    image: string;
    filePart: string;

    constructor(json: any) {

        if (!isNullOrUndefined(json)) {

            this.name = json.ATM_NAME;
            this.image = environment.domainNewApi + `/files/atm_card/${json.IMG_NAME}`;

            // this.font_color = json.FONT_COLOR;
            // this.bg_color = json.BG_COLOR;
            // this.code = json.BANK_CODE_INT;
        }

    }
}