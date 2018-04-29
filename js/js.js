var s = document.getElementById("second");
var f = document.getElementById("first");
var mc = document.getElementById("more-content");

/**
 * Send Ajax
 * @param {{
*  type: {String},
*  url: {String},
*  [success]: {Function},
*  [error]: {Function},
*  [beforeSend]: {Function},
*  [cache]: {Boolean}
* }} params
 */
var MAX_XHR_WAITING_TIME = 5000;// in ms

var sendAjax = function (params) {
    var xhr = new XMLHttpRequest(),
        url = params.cache ? params.url + '?' + new Date().getTime() : params.url,
        timer = setTimeout(function () {// if xhr won't finish after timeout-> trigger fail
            xhr.abort();
            params.error && params.error();
            params.complete && params.complete();
        }, MAX_XHR_WAITING_TIME);
    xhr.open(params.type, url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            clearTimeout(timer);
            if (xhr.status === 200 || xhr.status === 0) {// 0 when files are loaded locally (e.g., cordova/phonegap app.)
                params.success && params.success(xhr.responseText);
                params.complete && params.complete();
            } else {
                params.error && params.error(xhr.responseText);
                params.complete && params.complete();
            }
        }
    };
    params.beforeSend && params.beforeSend(xhr);
    xhr.send();
};

/**
 * Get JSON by url
 @param {{
*  url: {String},
*  [success]: {Function},
*  [error]: {Function},
*  [complete]: {Function}
* }} params
 */
var getJSON = function (params) {
    sendAjax({
        type: 'get',
        url: params.url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json, text/javascript');
        },
        success: function (res) {
            params.success && params.success(JSON.parse(res));
        },
        error: params.error,
        complete: params.complete,
        cache: true
    });
};

// INVOKE


var miki = function (parametri) {

    counter = 0;
    function change() {
        counter++;
        if (counter >= 10) { // s.innerHTML.length
            counter = 0;
            s.style.fontSize = 10;
        } else {
            console.log(counter);
            let sumsize = counter + 10;
            s.style.fontSize = sumsize + "px";
        }
    }

    //console.log(parametri.data);
    var myObj = parametri.data;
    s.innerHTML = myObj.value;
    f.innerHTML = "CLICK AGAIN";


    var inst = setInterval(change, 1000);

    mc.style.display = "block";

}

var siki = function (params) {

    var bk = document.getElementById("blockquote");
    bk.innerHTML = params.data.value;
    bk.style.display = "block";

    init();
}

function first() {
    let contents = f.innerHTML;
    s.innerHTML = contents + " wait...";

    getJSON({
        //url: 'https://api.github.com/users/malyw',
        url: 'https://api.chucknorris.io/jokes/random',
        success: function (json) {
            //console.log('getJSON success');
            //console.log(json);
            miki({
                data: json
            });
        },
        error: function (error) {
            //console.error('An error occured');
            //console.erdieror(error);
            s.innerHTML = "An error occured + " + error;
        },
        complete: function () {
            //console.log('I\'m invoked in any case after success/error');
        }
    });
}

function newquote() {

    getJSON({
        url: 'https://api.chucknorris.io/jokes/random',
        success: function (json) {
            siki({
                data: json
            });
        },
        error: function (error) {
            s.innerHTML = "An error occured + " + error;
        },
        complete: function () {

        }
    });

}

