/**
 * Created by imac on 1/19/2017 AD.
 */
var socket;
var drag;
var syncInput = true;
var touchDrag;
var touchCoordinate = {};
var startTime = new Date().getTime();
var elementIndex = 0;
var htmlChanged = false;
var Remote;
var host = '';
// var host = "https://vib-videocall.palomarsystems.com/urs_evnets"
var SlyOption = {};
var mutationObserver 
(function () {
 
    Remote = class {
        constructor(){}
    }

    Remote.startPublic = function () {
        window.isRemote = false;
        socket = io.connect(host, {transports: ['polling']});
        socket.once("connection", function(){
            console.log("startPublic connectef")
        })
        addMutationObserver();
    }

    Remote.startSubscript = function () {
        window.isRemote = true;
        socket = io.connect(host, {transports: ['polling']});
        $(document).on("click", function(e){ 
            e.preventDefault()
        })
        startRemote();
        setTimeout(function () {
            getOrigin();
        }, 500)
    }

    Remote.stopPublic = function () {
        if (mutationObserver != undefined){
            mutationObserver.disconnect();
        }
        if (socket != null){
            socket.disconnect();
            socket = null;
        }
    }

    Remote.stopSubscript = function () { 
        socket.disconnect();
        socket = null;
    }

})();
(function($){
    $.fn.setCursorToTextEnd = function() {
        $initialVal = this.val();
        this.val($initialVal + ' ');
        this.val($initialVal);
    };
})(jQuery);

function addMutationObserver() {

    startRemote();
    window.isRemote = false;
    var insertedNodes = [];
    mutationObserver = new MutationObserver(function (mutations) {
        
        htmlChanged = true;
        console.log("htmlChanged")
        setId();
        
    });

    if (!window.isRemote) {
        var config = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true,
            attributeOldValue: true
        };
        mutationObserver.observe(document, config);
    }

    setInterval(function () {
        if (htmlChanged){
           shareHTML();
           htmlChanged = false;
        }
    }, 1000)

}

function getOrigin() {
    if (socket != undefined ){
        socket.emit('html_sync_init');
    }

}

function startRemote() {

    socket.once("connect", function () {
        console.log("user event connect");
    });

    socket.on("error", function (error) {
        console.log(error);
    });
// Listen to user input events (keyboard and mouse events)
    $(document).on('input', function (e) {
        if (syncInput ) {
            emitEvent('input message');
        }
        syncInput = true;

    }).on('mousedown', function (e) {
        drag = false;
        // console.log("mousedown: ("+event.pageX+", "+event.pageY+")");
        emitMouseEvent('mouse down');

    }).on('mousemove', function (e) {
        drag = true;
        // emitMouseEvent('mouse moved');
        // console.log("mousemove: ("+event.pageX+", "+event.pageY+")");

    }).on('mouseup', function (e) {
        // console.log("mouseup: ("+event.pageX+", "+event.pageY+")");
        if (drag == false) {
            emitMouseEvent('mouse clicked');
        }
        else {
            emitMouseEvent('mouse dragged');
        }
    }).on('change', function (e) {
        // if (syncInput ) {
        //     emitEvent('input message');
        // }
        // syncInput = true;
    }).on('keydown', function (e) {
        var keyCode = e.keyCode;
        console.log(keyCode);
        if (keyCode == 9){// Tab
            emitKeyEvent(keyCode);
        }
    })

  function emitEvent(eventName) {
        if(socket == null){
            return
        }
        var input_type = $(event.target).attr('type');
        switch (input_type){
            case "text":
            {
                $(event.target).attr("value", event.target.value);
            }
            break;
            case "radio":
            {

                // var model =  $(event.target).attr("ng-reflect-model");
                // var value =  $(event.target).attr("ng-reflect-value");
                // if (model == value){
                //     $(event.target).attr("checked", true);
                // }
                // else{
                //     $(event.target).attr("checked", false);
                // }
            }
                break;
            default:
                break;
        }

        socket.emit('usr_event', {
            eventName: eventName,
            domIdLen: event.target.id.length,
            domId: event.target.id,
            domVal: event.target.value
        });
    };

    function emitMouseEvent(eventName) {
        if(socket == null){
            return
        }
        var data =   {
            eventName: eventName,
            domIdLen: event.target.id.length,
            domId: event.target.id,
            domVal: event.target.value,
            x: event.pageX,
            y: event.pageY
        }
        socket.emit('usr_event', data);


    };

    function emitKeyEvent(keyCode) {
        if(socket == null){
            return
        }

        var data =   {
            eventName: "keydown",
            keyCode: keyCode,
            domId: event.target.id,
            domVal: event.target.value,
            x: event.pageX,
            y: event.pageY
        }
        socket.emit('usr_event', data);

    }

    document.addEventListener('touchstart', function (event) {
        // console.log("touch start");

        // touchDrag = false;

        if (event.targetTouches.length === 1) {
            touchDrag = false;
        }

    }, false);

    document.addEventListener('touchmove', function (event) {
        // console.log(event.targetTouches);

        // touchDrag = true;
        if(socket == null){
            return
        }
        if (event.targetTouches.length === 1) {
            touchDrag = true;

            var touch = event.targetTouches[0];
            touchCoordinate.x = touch.pageX;
            touchCoordinate.y = touch.pageY;

            socket.emit('usr_event', {
                eventName: 'touch move',
                x: touchCoordinate.x,
                y: touchCoordinate.y
            });
        }

        // var touchesData = [];

        // for (var i = 0; i < event.targetTouches.length; i++) {
        //   var touch = event.targetTouches[i];
        //   touchData = {
        //     domId   : touch.target.id,
        //     domVal  : touch.target.value,
        //     x       : touch.pageX,
        //     y       : touch.pageY
        //   };
        //   touchesData.push(touchData);
        // }

        // socket.emit('touchmove', touchesData);

    }, false);

    document.addEventListener('touchend', function (event) {
        // console.log("touch end");
        if(socket == null){
            return
        }

        if (touchDrag == false) {
            console.log("TOUCH TAP");

        }
        else {
            console.log("TOUCH DRAGGED");

            socket.emit('usr_event', {
                eventName: 'touch dragged',
                x: touchCoordinate.x,
                y: touchCoordinate.y
            });
        }

    }, false);


    socket.on("usr_event_receive", function (msg) {
        var str = JSON.stringify(msg);
        console.log(str);
        var eventName = msg.eventName;
        var id = msg.domId;
        var element = (id !== undefined && id !== "") ? document.getElementById(id) : null;
        switch (eventName) {
            case "mouse clicked": {
                console.log("click"+ id);
                console.log("element", element);

                if (element != null) {
                    $(element).trigger("click");
                }

                break;
            }
            case "mouse moved": {
                // if (element != null) {
                //     $(element).trigger("click");
                // }
                break;
            }
            case "input message": {
                if (element != null) {
                    $(element).val(msg.domVal);

                    syncInput = false;
                    var evt = document.createEvent('Event');
                    evt.initEvent('input', true, false);
                    element.dispatchEvent(evt)

                }
                break;
            }
            case "keydown": {
                var keyCode = msg.keyCode;

                if (keyCode != undefined && keyCode == 9){
                    // var press = jQuery.Event("keypress");
                    // press.ctrlKey = false;
                    // press.which = keyCode;
                    // $(window.document).trigger(press);
                    //
                    // if(!window.isRemote){
                    //     shareHTML();
                    // }
                }

                break;
            }
                break;
            default:
                break;
        }
    })

    socket.on("html_sync_receive", function (msg) {
        var path = window.location.href;
        if (path.indexOf("remote") !== -1) {
            
            var decodedString = atob(msg.html);
            decodedString = decodeURI(decodedString);
            document.body.innerHTML = decodedString;
            console.log("end decode", new Date().toLocaleString());
            // var frame = $('#frame').clone();
            //
            // var sly = new Sly('#frame',msg.SlyOption)
            // console.log(sly.initialized)
            // sly.init();
            // $('#frame').html(frame.html());
            //
            // sly.init();

            if (msg.focusedId != undefined){
                const object = $("#" + msg.focusedId)
                object.focus();
                var val = object.val();
                object.val(val);
                object.setCursorToTextEnd();

            }
        }
    });

    socket.on("html_sync_init", function () {
        console.log("html_sync_init");
        shareHTML();
    });
}


function shareHTML() {
    if (socket != undefined ){
        console.log("sync");
        var html = takeSnapshot();
        var focusedId = $(document.activeElement).attr('id');
    
        socket.compress(true).emit('html_sync', {
            html:  html,
            SlyOption: SlyOption,
            focusedId: focusedId
        });
    }
}

function takeSnapshot() {

    var screenshot = document.documentElement.cloneNode(true);

    var inputs = screenshot.getElementsByTagName("input");
    for(var i = 0; i < inputs.length; i++) {
        if (inputs[i].type=="checkbox" ) {
            if (inputs[i].checked){
                inputs[i].setAttribute("checked", inputs[i].checked);
            }
            else{
                inputs[i].removeAttribute("checked");
            }
        }
        else {
            if (inputs[i].type=="radio" && inputs[i].checked) {
                inputs[i].setAttribute("checked", inputs[i].checked);
            }
            else if (inputs[i].type=="radio" && !inputs[i].checked) {
                inputs[i].removeAttribute("checked");
            }
            else {
                inputs[i].setAttribute("value", inputs[i].value);
            }
        }
    }
    var selects = screenshot.getElementsByTagName("select");
    for(var i = 0; i < selects.length; i++) {
        // console.log("SELECT "+selects[i].name+" = "+selects[i].value);
    }
    var txtarea = screenshot.getElementsByTagName("textarea");
    for(var i = 0; i < txtarea.length; i++) {
        inputs[i].setAttribute("value", inputs[i].value);
    }
 

    let s = screenshot.innerHTML.replace(/\n\s+|\n/g, "")
    s = s.replace(/animated/g, "")
    screenshot = encodeURI(s);
    
    var encodedString = btoa(screenshot);
    return encodedString;
}

function setId() {

    $('body *:not(script, style, noscript)').each(function( index ) {

        var element = $(this);
        if (element.attr('id') === undefined){
            element.attr('id', elementIndex);
            elementIndex++;
        }
    });
}

