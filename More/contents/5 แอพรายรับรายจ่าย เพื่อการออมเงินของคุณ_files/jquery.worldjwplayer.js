/*
 
 jQuery TagsCenter Kapook Plugin beta
 */

function getYoutubeID(text) {
    var reg = new RegExp('(?:https?://)?(?:www\\.)?(?:youtu\\.be/|youtube\\.com(?:/embed/|/v/|/watch\\?v=))([\\w-]{10,12})', 'g');
    //get matches found for the regular expression
    var matches = reg.exec(text);
    //check if we have found a match for a YouTube video
    //will support legacy code, shortened urls and
    if (matches) {
        //found a video so get the video id
        var videoId = matches[1];
        return videoId;
        //run code to upload the video id to the server here
    }
    else {
        return false;
        //no match was returned so we run error feedback to the user
    }
}
(function ($) {

    $.fn.worldJWplayer = function () {
        //        var thisObj = this;
        //        var options = options;
        this.each(function () {
            
            var obj = $(this);
            var baseURL_flashplayer = 'http://my.kapook.com/javascript/jwplayer6.10/';
            var OVA_URL = 'http://ads.kapook.com/adshow_vast.php?zid=377';
            var w = obj.attr('data-width');
            var h = obj.attr('data-height');
//            var url = 'http://cache.world.kapook.com/world/content/get_relate_by_tag/'+ obj.attr('data-id') + "?jsoncallback=?";
            var url = 'http://kapi.kapook.com/world/content/get_content/' + obj.attr('data-id') + "?jsoncallback=?";
            obj.html('Loading Video...');
            $.ajax({
                url: url,
                type: "GET",
                dataType: "jsonp",
                success: function (response)
                {
//                    console.info(response['contents']['0']['subject']);
//                    if (response['contents']['0']['dl_video']) {
//                        var video_path = response['contents']['0']['dl_video']['path'] + '/' + response['contents']['0']['dl_video']['320'];
//                    } else {
//                        var video_path = 'http://www.youtube.com/v/' + response['contents']['0']['id'];
//                    }
                    if(typeof response.error_code != "undefined") {
                        return;
                    }
                    var video_path = 'http://www.youtube.com/v/' + response['contents']['0']['id'];
                    
                    if (response.skip_ad) {
                        if (response.skip_ad == 1) {
                            OVA_URL = '';
                        }
                    }
//                    console.info(video_path);
                    obj.show();
                    jwplayer(obj.attr('id')).setup({
                        title: response['contents']['0']['subject'],
                        file: video_path,
                        image: response['contents']['0']['thumb'],
//                        width: "100%",
                        width: w,
                        height: h,
                        aspectratio: "4:3",
                        primary:'flash',
                        //dimensions: '300x200',
                        ga: {
                            'idstring': "title",
                            'trackingobject': "pageTracker"
                        },
                        advertising: {
                            client: 'vast',
                            skipoffset: 7,
                            skiptext: 'ข้ามโฆษณา',
                            tag: OVA_URL
                        }
                    });
                },
                error: function ()
                {
                    obj.html("Error Loading Video !");
                    console.error("Error Loading Video !");
                }
            });
        });
    };
})(jQuery);

head.load(
        ["http://my.kapook.com/javascript/jwplayer6.10/jwplayer.js"],
        function () {
            console.log('---- 99999999 ----');
            jwplayer.key = "wzpTiYWnWAEedn9I2xL8mcw0U5eJo3VO/q0rww==";
            $('.worldJWplayer').worldJWplayer();
        }
);
console.log('load');
