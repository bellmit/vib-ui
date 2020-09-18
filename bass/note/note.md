READ_ME
---
my_saving.png => selectBankAccountComp => AccountService.getAccountList => url:postVIBWithHeader
my_invest.png => termMutualFundComp => onClickAcceptTerm() => investmentService.getGUID() => url:


test cases for suitability
---
this.userLogin.idCard = "0606448325667";    // no suit score
this.userLogin.pin = "123456";              // no suit score
this.userLogin.idCard = "2391444010950";    // have suit score
this.userLogin.pin = "121212";              // have suit score
this.userLogin.idCard = "5429345890979";    // can't use this one
this.userLogin.pin = "121212";              // can't use this one

credential for mfs
---
card id : 2391444010950, "CIF_ID":"3219100161", PIN: 121212 
card id : 5429345890979, "CIF_ID":"2163700110", PIN: 121212

how to deploy on SIT
  - upload my resource zip file to SVN // DEV > VIB > 7-Source Code > NewCBS > tag > 2.1.0.1
  - backup file // (D:) > new-vib > Backup
  - login to VisualSVN then download the zip file
  - extract the files to the folder // (D:) > new-vib > Deploy-SIT
  - copy and paste the extracted files to the deploy folder // (D:) > new-vib > VIB-UI-SIT
  - check and fix the main.bundle file if necessary // the config is in (D:) > new-vib > Backup
  - login teller 2 times with different account 
    // username: cbs003s011
    // username: cbs003s018
    // password: Password1
  - now VIB-UI is ready to use 
    // username: fcsit004
    // password: P@ssw0rd
  
response from server
---
    {responseStatus: {httpStatus: null, responseCode: "VIB-E-ERR999",…}, language: null,…}
        language: null
        responseStatus: {httpStatus: null, responseCode: "VIB-E-ERR999",…}
            developerMessage: "Customer does not exists."
            httpStatus: null
            responseCode: "VIB-E-ERR999"
            responseMessage: "VIB Service Failure , Please contact bank."
            responseNamespace: null
        value: {resultCode: "VIB-E-ERR002", resultDescription: "Call external service fail",…}
            currentCustSuitScoreData: null
            resultCode: "VIB-E-ERR002" <!-- use this key -->
            resultCodeOriginal: "MFS-E-ERR0004" <!-- use this value -->
            resultDescription: "Call external service fail"
            resultDescriptionOriginal: "Customer does not exists."

suitabiltiy.html
---
    <div id="suit_not_found_container" >
        <div  class="text-center container popup-container">
            <div style="margin-top: 200px !important" class="p-4">
                <img src="./assets/kiatnakin/image/investment/icon_calendar.png"  />
            </div>
            <div *ngIf="currentCustomerSuitScore" class="display-2 text-bold text-italic">ไม่พบคะแนน Suitability ของมิง</div>
            <br/>
            <!-- <div *ngIf="currentCustomerSuitScore" class="display-2 text-red text-italic">เมื่อ {{currentCustomerSuitScore.EXPIRY_DATE}} </div> -->
            <div class="display-2"> กรุณาเปิดบัญชี ก่อนทำการซื้อกองทุน</div>
        </div>
        <div class="footer text-center">
            <button class="button-purple" (click)="onClickBackToTransactiontype()">
                <h2> ตกลง </h2>
            </button>
        </div>
    </div>
    <div *ngIf="currentCustomerSuitScore" id="suit_expired_container" >
        <div  class="text-center body">
            <div>
                <img src="./assets/kiatnakin/image/investment/icon_calendar.png"  />
            </div>
            <div class="display-2 text-bold text-italic"> คะแนน Suitability ของคุณหมดอายุ</div>
            <div class="display-2 text-red text-italic"> เมื่อ {{currentCustomerSuitScore.EXPIRY_DATE}} </div>
            <div class="display-2"> กรุณาทำ Suitability ก่อนทำการซื้อกองทุน </div>
        </div>
        <div class="footer text-center">
            <button class="button-purple" (click)="onClickAcceptTodoSuit()">
                <h2> ตกลง </h2>
            </button>
        </div>
    </div>

$purple-fund-inactive: #C4C3E1
$purple-fund: #7C78B5 //purple lighter
$purple: #7270B3 //purple darker
$purple_light: #d3d1ff
$purple_white: #EEEDF5
    
 \\FSSSRVP02B\ShareProjectK\BIPI_IT\3 Platforms\Channel
 \\FSSSRVP02B\ShareProjectK\BIPI_IT\3 Platforms\Channel\VIB\IT_Implementation\1_Requirement\Screen_portfolio

my id: 112482

// -----------------------proxy.conf-------------------------------
{
    "/VIB/*":{
        // "target": "http://10.202.104.236:8081/VIB_R2",
        "target": "http://localhost:8081/VIB",
        "secure":false,
        "pathRewrite":{
            "^/VIB":""
        },
        "logLevel":"debug",
        "changeOrigin": true
    },
    "/vib-mfs-service/*":{
        "target": "http://10.202.104.236:8081/vib-mfs-service",
        "secure":false,
        "pathRewrite":{
            "^/vib-mfs-service":""
        },
        "logLevel":"debug",
        "changeOrigin": true
    }
}

 checkExistingCustomerAndSanctionList() // this is the function that exceute an order to VIB-Teller
 onSendTellerApproveSubscription() // this is the function that exceute an order to VIB-Teller

 *.css, *.scss, *.sass, *.ts, *.html

 lib*ts, *.svn

const startTime = new Date().getTime();
const interval = setInterval(function() {
      if (new Date().getTime() - startTime > 60000) { // 1 min timeout
          clearInterval(interval);
          return console.log('onSendTellerApproveSubscription', 'onGetApproveStatus have been stopped');
      }
      console.log('onSendTellerApproveSubscription', 'onGetApproveStatus have been started');
}, 2000)
