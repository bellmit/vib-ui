import {Keyboard} from "./keyboard.greywyvern";


export class KeyboardService extends Keyboard {

    static initKeyboardInputText() {
        setTimeout(() => {
            this.setKeyboardInit();
        }, 150);
    }

    static hide() {
        this.setKeyboardHide();
    }

}
