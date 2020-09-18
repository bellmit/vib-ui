import { ToStringNumberPipe } from "../_pipe/toStringNumber.pipe";
import { Modal } from "../_share/modal-dialog/modal-dialog.component";
import { Utils } from "../../share/utils";
import { isNullOrUndefined } from "util";

export class Keyboard {

    static setKeyboardInit() {

        let onShowModal: boolean = false;

        VKI.imageURI('');
        const inputElems = [
            $('input:not(.dp-picker-input,.none-keyboard)'),
            $('textarea:not(.dp-picker-input)')
        ];

        $.each(inputElems, function (index, element) {

            $.each(element, function (index2, object) {
                if (object.getAttribute('readonly') !== "" && object.getAttribute('readonly') !== "readonly") {
                    if (object.nodeName === "TEXTAREA" || object.type === "text" || object.type === "password") {
                        VKI.attach(object);
                    }
                }
            });

        });

        $('[data-max-decimal]').on('input', function (e) {

            const $input = $(this);
            let digit = $input.attr("data-max-decimal");
            digit = (digit.length === 0) ? 2 : digit;
            let invalid = false;
            let stringValue = $input.val();
            const lastValueLength = stringValue.length;
            stringValue = stringValue.split(',').join('');
            const value: number = Number(stringValue);
            const matcher = new RegExp("^\\s*-?\\d+(\\.\\d{0," + digit + "})?\\s*$");
            let caret = $input.caret();

            if (isNaN(value)) {
                invalid = true;
            }

            if (!matcher.test(stringValue)) {// Check number has 0 to ? (depend on digit variable)
                invalid = true;
            }

            if (invalid) {// Remove 1 char at current caret
                stringValue = $input.val().substr(0, caret - 1) + "" + $input.val().substr(caret);

                caret = caret - 1;
            }
            const digitAmount = stringValue.split('.')[1];
            const newDigit = Utils.getCountDigit(stringValue);
            let toStringNumber = new ToStringNumberPipe().transform(stringValue, newDigit);
            if (digitAmount === "") {
                toStringNumber = toStringNumber + ".";
            }

            caret = caret + (toStringNumber.length - lastValueLength);

            $input.val(toStringNumber);

            if (invalid && toStringNumber.length !== 0) { //rebinding model value
                const evt = document.createEvent('Event');
                evt.initEvent('input', true, false);
                document.getElementById($input.attr('id')).dispatchEvent(evt);
            }

            this.selectionStart = caret;
            this.selectionEnd = caret;
        });

        // Prevent input Alphabet
        $('[keyboard="currency"],[keyboard="number"]').keydown(function (event) {
            // prevent using shift with numbers
            if (event.shiftKey === true) {
                event.preventDefault();
            }

            if (!((event.keyCode === 190) ||
                Keyboard.checkEventKey(event.keyCode) ||
                event.keyCode === 8 || event.keyCode === 9 ||
                event.keyCode === 37 || event.keyCode === 39 ||
                event.keyCode === 46 || event.keyCode === 13)
            ) {
                console.log(event.keyCode)
                event.preventDefault();
            }
        });

        $('[keyboard="email"]').blur(function (e) {
            const $input = $(this);

            const data = Utils.checkIsEmail(e.target.value) === true ? 'Y' : 'N';
            $('#' + $input.attr('id')).attr('ValidateValue', data);
            if (!isNullOrUndefined(e.target.value) && !Utils.checkIsEmail(e.target.value)
            && e.target.value !== '' && onShowModal === false) {
                // $input.val(null);
                // Modal.showAlert('ท่านระบุ อีเมลไม่ถูกต้อง');
                onShowModal = true;
                const evt = document.createEvent('Event');
                evt.initEvent('input', true, false);
                document.getElementById($input.attr('id')).dispatchEvent(evt);

            } else {
                onShowModal = false;
            }


        });

        $('[alphapet]').on('input', function (e) {
            const $input = $(this);
            const inputText = $input.val();
            const caret = $input.caret();
            const re = new RegExp("^([ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZๅภถุึคตจขชๆไำพะัีรนยบลฃฟหกดเ้่าสวงผปแอิืทมใฝู฿ฎฑธํ๊ณฯญฐฅฤฆฏโฌ็๋ษศซฉฮฺ์ฒฬฦ])+$", "g");
            if (!re.test(inputText)) {
                $input.val(inputText.replace(/[^ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZๅภถุึคตจขชๆไำพะัีรนยบลฃฟหกดเ้่าสวงผปแอิืทมใฝู฿ฎฑธํ๊ณฯญฐฅฤฆฏโฌ็๋ษศซฉฮฺ์ฒฬฦ]/gi, ''));
                const pos = caret - 1;
                this.selectionStart = pos;
                this.selectionEnd = pos;
            }
        });

        $('[alphapetNumber]').on('input', function (e) {
            const $input = $(this);
            const inputText = $input.val();
            const caret = $input.caret();
            const re = new RegExp("^([ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789])+$", "g");
            if (!re.test(inputText)) {
                $input.val(inputText.replace(/[^ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]/gi, ''));
                const pos = caret - 1;
                this.selectionStart = pos;
                this.selectionEnd = pos;
            }
        });

        $('[Number]').on('input', function (e) {
            const $input = $(this);
            const inputText = $input.val();
            const caret = $input.caret();
            const re = new RegExp("^([1234567890])+$", "g");
            if (!re.test(inputText)) {
                $input.val(inputText.replace(/[^ 1234567890]/gi, ''));
                const pos = caret - 1;
                this.selectionStart = pos;
                this.selectionEnd = pos;
            }
        });



        $('.select').mobileSelect('destroy');
        $('.mobileSelect-container').remove();
        $('.select').mobileSelect();

    }

    static setKeyboardHide() {
        VKI.close();
    }

    static checkEventKey(keyCode) {
        if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
            return true;
        }
    }
}
