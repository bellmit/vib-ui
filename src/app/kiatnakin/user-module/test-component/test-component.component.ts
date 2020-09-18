import { Component, OnInit, AfterContentInit } from '@angular/core';
import { KeyboardService } from "../../_service/keyboard.service";

@Component({
  selector: 'test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.sass']
})
export class TestComponentComponent implements OnInit, AfterContentInit {

  public accountName: string
  public Modal: boolean = false;
  public hide: boolean = true;
  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {

    setTimeout(() => {
      KeyboardService.initKeyboardInputText();
    }, 500);
  }

  ShowLog(data) {
    this.accountName = data
    this.hide = false;
    this.Modal = true;
  }

  ShowLog2(data) {
    this.accountName = data
    this.hide = true;
    this.Modal = false;
  }

  getKeyboard() {
    KeyboardService.initKeyboardInputText();
  }

}
