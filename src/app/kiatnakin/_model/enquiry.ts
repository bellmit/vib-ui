import {isNullOrUndefined} from "util";
import {Transaction} from "./transaction";

export class Enquiry extends Transaction {

    id: string;
    type: string;
    description: string;
    price: string;

}