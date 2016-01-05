/*
 
 jQuery  Kapook Tracker
 */
//(function (d) {
//    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//    if (d.getElementById(id)) {
//        return;
//    }
//    js = d.createElement('script');
//    js.id = id;
//    js.async = false;
//    js.src = "http://my.kapook.com/javascript/fb_all.js#xfbml=1&appId=306795119462&version=v2.3";
//    ref.parentNode.insertBefore(js, ref);
//}(document));


(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.3&appId=306795119462";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


window.fbAsyncInit = function () {
    FB.init({
        appId: '306795119462', // App ID
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true, // parse XFBML
        version: 'v2.3'
    });
    
    check_login_fb(CONTENT_ID, SUBDOMAIN);
};


var kp_tracker = {
    tracking: [],
    subdomain: SUBDOMAIN,
    content_id: CONTENT_ID,
    getCateID: GET_CATEID,
    init: function () {
        var tmp_browser = kp_tracker.get_browser_info();
        var tracking = new Array();
        kp_tracker.tracking['content_id'] = kp_tracker.content_id;
        kp_tracker.tracking['url'] = document.location.origin + document.location.pathname;
        kp_tracker.tracking['cat'] = parseInt(kp_tracker.getCateID());
        kp_tracker.tracking['subdomain'] = parseInt(kp_tracker.subdomain);
        kp_tracker.tracking['ref'] = document.referrer;
        kp_tracker.tracking['agent'] = navigator.userAgent;
        kp_tracker.tracking['browser'] = kp_tracker.isBrowser();
        kp_tracker.tracking['browser_version'] = parseInt(tmp_browser.version);
        kp_tracker.tracking['os'] = kp_tracker.get_platform_info();
        kp_tracker.tracking['device'] = kp_tracker.detectDevice();
//        console.info('---------Track 5-------------');
//        console.info(kp_tracker.tracking);
//        console.info('---------End Track 5-------------');
//        console.info(window.fbAsyncInit);
        var oldCB = window.fbAsyncInit;
        window.fbAsyncInit = function () {

//            console.info('fbAsyncInit');
            if (typeof oldCB === 'function') {
                oldCB();
            } else {
//                FB.init({
//                    appId: '306795119462', // App ID
//                    status: true, // check login status
//                    cookie: true, // enable cookies to allow the server to access the session
//                    xfbml: true,  // parse XFBML
//                    version : 'v2.3'
//                });
            }

            FB.getLoginStatus(function (response) {
//                console.info('TRACKER');
                kp_tracker.sendTracking(response);
//                statusChangeCallback(response);
            });
            //Do Something else here
        };
    },
    isBrowser: function () {
        var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
        var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
        var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        // At least Safari 3+: "[object HTMLElementConstructor]"
        var isChrome = !!window.chrome && !isOpera; // Chrome 1+
        var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

        if (isOpera == true)
            return 5;
        if (isFirefox == true)
            return 2;
        if (isSafari == true)
            return 4;
        if (isChrome == true)
            return 1;
        if (isIE == true)
            return 3;
    },
    get_platform_info: function () {
        var OSName = "Unknown OS";
        if (navigator.appVersion.indexOf("Win") != -1) {
            OSName = 1;
        } else if (navigator.appVersion.indexOf("Mac") != -1) {
            OSName = 2;
        } else if (navigator.appVersion.indexOf("X11") != -1) {
            OSName = 3;
        } else if (navigator.appVersion.indexOf("Linux") != -1) {
            OSName = 4;
        } else {
            OSName = 5;
        }

        return OSName;
    },
    get_browser_info: function () {
        var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {name: 'IE ', version: (tem[1] || '')};
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\bOPR\/(\d+)/)
            if (tem != null) {
                return {name: 'Opera', version: tem[1]};
            }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }
        return {
            name: M[0],
            version: M[1]
        };
    },
    sendTracking: function (response) {
        if (response.status === 'connected') {
//            console.info('me 3');
            kp_tracker.tracking['fbid'] = response.authResponse.userID;
            var url = 'http://202.183.165.223/tracker/?callback=?&' + kp_tracker.EncodeQueryData(kp_tracker.tracking);
//            console.info(url);
            $.ajax({
                url: url,
                dataType: "jsonp"
            }).done(function (response) {
//                console.info('Tracking Done');
//                console.info(response);
            }).error(function () {
//                console.info('error');
            });
        } else {
//            console.info('Not Connect Facebook');
        }
    },
    EncodeQueryData: function (data)
    {
        var ret = [];
        for (var d in data)
            ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        return ret.join("&");
    },
    detectDevice: function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return 2;
        } else {
            return 1;
        }
    }
}

if (!window.jQuery) {
    var jq = document.createElement('script');
    jq.type = 'text/javascript';
    // Path to jquery.js file, eg. Google hosted version
    jq.src = 'http://cms.kapook.com/js/jquery-core/jquery-1.9.1.min.js';
    document.getElementsByTagName('head')[0].appendChild(jq);
    done = false;
    jq.onload = jq.onreadystatechange = function () {
//        console.info(this.readyState);
        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {

            done = true;
            // callback function provided as param
//            console.info(this.readyState);
//            console.info(99);
//            kp_tracker.init();
        }
    };
} else {
//    kp_tracker.init();
}

