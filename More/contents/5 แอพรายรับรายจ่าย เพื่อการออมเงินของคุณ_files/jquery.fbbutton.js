/*
 
 jQuery TagsCenter Kapook Plugin beta
 */
//console.info("AAAA");
var _data = new Array();
(function ($) {

    $.fn.FBbtn = function () {

        var obj_array = new Array();
        var obj_array_link = new Array();
        var self = this;
        this.each(function () {
            var obj = $(this);
            if (obj_array_link[obj.attr('data-url')] == undefined) {
                obj_array_link[obj.attr('data-url')] = 1;
                obj_array.push(obj.attr('data-url'));
            }

            console.info(11);
        });
//        console.info(obj_array);

        $.each(obj_array, function (key, link)

        {
            var getData = 1;
            var obj_this_link = self.filter('*[data-url="' + link + '"]');
            var sessionStorage_key = 'fb_' + link; // name of sessionStorage for this link
            if (typeof (sessionStorage) !== "undefined") {
                var total_count = sessionStorage.getItem(sessionStorage_key);
                if (total_count != null) {
                    obj_this_link.find('.boxCount').text(total_count);
                    getData = 0;
                    var v = link.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&")
//                    console.info('sessionStorage');
                }
            }


            $.each(obj_this_link.find('.btnClick'),
                    function (btnKey, btnData)
                    {
                        if ($(btnData).data('eventClick') == 1) {
                            return true;
                        }
                        $(btnData).data('eventClick', 1);
                        $(btnData).click(function () {
                            FB.ui(
                                    {
                                        method: 'share',
                                        display: 'popup',
                                        href: link
                                    },
                            function (response) {
                            }
                            );
                            return false;
                        });
                    }
            );



            if (getData == 1) {
                var key_fb = new Array();
                key_fb[0] = '222400011275296|668e04dcb5543692e87188b1e4d8c92f';
                key_fb[1] = '202448483157364|c15ae7c5286458dc791580390b9757ec';
                key_fb[2] = '452827751424938|6eab01322e63a612a3f9b87637f47408';
                key_fb[3] = '232676246813772|2882e0c5f3bc9930ce25cb5019b6db61';
                key_fb[4] = '263986800436638|5882cb894fa2b90cf4aed89557a1736a';
                key_fb[5] = '370377049760317|319b3e98932ed33ff3315808c9b53879';
                key_fb[6] = '151319091604448|2f8024f220a578442240ea85d5cc5370';
                key_fb[7] = '829539400456880|db519c3b94755cc4b4bceeb97629748a'; // ton1
                key_fb[8] = '820003068081647|a9fa58437ca19ddc5312bf75771803ee'; // ton2
                key_fb[9] = '1386277301594652|586f0c3b15c5e859a61aa49a132b52a8'; // ton3
                var randomnumber = Math.floor(Math.random() * 10);
                console.log('https://graph.facebook.com/v2.3/?id=' + link + '&access_token=' + key_fb[randomnumber]);
                $.ajax({
//                url  : "https://api.facebook.com/method/links.getStats?urls="+obj.attr('data-url')+"&format=json",
                    url: 'https://graph.facebook.com/v2.3/?id=' + link + '&access_token=' + key_fb[randomnumber],
                    type: "GET",
                    dataType: "jsonp",
                    success: function (data)
                    {
//                        console.info('L:' + link);
                        if(typeof data.share == "undefined") {
                            total_count = 0;
                        }else if (data.share.share_count >= 1000) {
//                        total_count = Math.floor(data.share.share_count/1000)+'K';
                            total_count = data.share.share_count;
                        } else {
                            total_count = data.share.share_count;
                        }

                        total_count = total_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                        sessionStorage.setItem(sessionStorage_key, total_count);
                        obj_this_link.find('.boxCount').text(total_count);
                    },
                    error: function ()
                    {
                        console.error("Error : Facebook Share count.");
                    }
                });
            }



        });
    };
    $.fn.Twitbtn = function () {
        //return;
        //        var thisObj = this;
        //        var options = options


        var obj_array = new Array();
        var obj_array_link = new Array();
        var self = this;
        this.each(function () {
            var obj = $(this);
            if (obj_array_link[obj.attr('data-url')] == undefined) {
                obj_array_link[obj.attr('data-url')] = 1;
                obj_array.push(obj.attr('data-url'));
            }
        });
//        console.info('----- Twitbtn -----');
//        console.info(obj_array);

        $.each(obj_array, function (key, link)
        {
            var getData = 1;
            var obj_this_link = self.filter('*[data-url="' + link + '"]');
            var sessionStorage_key = 'tw_' + link; // name of sessionStorage for this link
            console.info(sessionStorage_key);
            if (typeof (sessionStorage) !== "undefined") {
                var total_count = sessionStorage.getItem(sessionStorage_key);
                if (total_count != null) {
//                    obj_this_link.find('.boxCount').text(total_count);
                    obj_this_link.find('.boxCount').text('');
                    getData = 0;
//                    console.info('tw_sessionStorage');
                }
            }
            
            obj_this_link.find('.boxCount').text('?');



            $.each(obj_this_link.find('.btnClick'),
                    function (btnKey, btnData)
                    {
                        if ($(btnData).data('eventClick') == 1) {
                            return true;
                        }
                        $(btnData).data('eventClick', 1);
                        $(btnData).click(function () {
                            var windowFeatures = "status=no,height=" + 368 + ",width=" + 700 + ",resizable=no,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
                            u = location.href;
                            t = document.title;
                            window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(link) + '&text=' + encodeURIComponent(document.title) + '&via=kapookdotcom', '', windowFeatures);
                            return false;
                        });
                    }
            );

           /* if (getData == 1) {
                $.ajax({
                    url: "http://urls.api.twitter.com/1/urls/count.json?url=" + link,
                    type: "GET",
                    dataType: "jsonp",
                    success: function (data)
                    {
                        if (data.count >= 1000) {
//                            total_count = Math.floor(data.count / 1000) + 'K';
                            total_count = data.count;
                        } else {
                            total_count = data.count;
                        }
                        obj_this_link.find('.boxCount').text('');
                        total_count = total_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
//                        obj_this_link.find('.boxCount').text(total_count);
                        sessionStorage.setItem(sessionStorage_key, total_count);
                    },
                    error: function ()
                    {
                        obj_this_link.find('.boxCount').text('');
                        console.error("Error : Twitter count.");
                    }
                });
            }*/
        });
    };
    $.fn.Gplusbtn = function () {
        //        var thisObj = this;
        //        var options = options;

        var obj_array = new Array();
        var obj_array_link = new Array();
        var self = this;
        this.each(function () {
            var obj = $(this);
            if (obj_array_link[obj.attr('data-url')] == undefined) {
                obj_array_link[obj.attr('data-url')] = 1;
                obj_array.push(obj.attr('data-url'));
            }
        });
//        console.info('----- Gplusbtn -----');
//        console.info(obj_array);
        $.each(obj_array, function (key, link)
        {
            var getData = 1;
            var obj_this_link = self.filter('*[data-url="' + link + '"]');
            var sessionStorage_key = 'gp_' + link; // name of sessionStorage for this link
//            console.info(sessionStorage_key);

            if (typeof (sessionStorage) !== "undefined") {
                var total_count = sessionStorage.getItem(sessionStorage_key);
                if (total_count != null) {
                    obj_this_link.find('.boxCount').text(total_count);
                    getData = 0;
//                    console.info('gp_sessionStorage');
                }
            }

            obj_this_link.find('.btnClick').click(function () {
                var windowFeatures = "status=no,height=" + 368 + ",width=" + 700 + ",resizable=no,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
                window.open('https://plus.google.com/share?url=' + encodeURIComponent(link), '', windowFeatures);
                return false;
                return false;
            });
            if (getData == 1) {
//                $.ajax({
//                    url: "http://kapi.kapook.com/googleplus/get?url=" + obj.attr('data-url') + '&jsoncallback=?',
//                    type: "GET",
//                    dataType: "jsonp",
//                    success: function (data)
//                    {
//                        if (data.count >= 1000) {
////                            total_count = Math.floor(data.count / 1000) + 'K';
//                            total_count = data.count;
//                        } else {
//                            total_count = data.count;
//                        }
//                        
//                        total_count = total_count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
//                        obj_this_link.find('.boxCount').text(total_count);
//                        sessionStorage.setItem(sessionStorage_key, total_count);
//
////                        obj_this_link.find('.boxCount').text(total_count);
//                    },
//                    error: function ()
//                    {
//                        console.error("Error : Gplus count.");
//                    }
//                });

                var total_count = 0;
                obj_this_link.find('.boxCount').text(total_count);
                sessionStorage.setItem(sessionStorage_key, total_count);
            }

        });
    };
})(jQuery);
console.log('load');
