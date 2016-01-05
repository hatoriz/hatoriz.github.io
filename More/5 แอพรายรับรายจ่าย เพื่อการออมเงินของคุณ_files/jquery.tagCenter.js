/*
 
 jQuery TagsCenter Kapook Plugin beta
 
 Copyright (c) 2011 XOXCO, Inc
 
 Documentation for this plugin lives here:
 http://xoxco.com/clickable/jquery-tags-input
 
 Licensed under the MIT license:
 http://www.opensource.org/licenses/mit-license.php
 
 ben@xoxco.com
 
 */

(function ($) {

    $.fn.tagsCenter = function (options) {
        var thisObj = this;
        var options = options;
        head.load(
                [
                    "http://my.kapook.com/jquery/plugin/bootstrap-tagsinput/bootstrap-tagsinput.js",
                    "http://my.kapook.com/jquery/plugin/bootstrap-tagsinput/typeahead.bundle.js",
                    "http://my.kapook.com/jquery/plugin/bootstrap-tagsinput/bootstrap-tagsinput.css"

                ], function () {
            // do something

            var engineData = new Bloodhound({
                datumTokenizer: function (datum) {
                    console.info(datum);
                    return Bloodhound.tokenizers.whitespace(datum.value);
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
//                    url: 'http://kapi.kapook.com/tag/tag/list_tag_by_keyword/%QUERY/?jsoncallback=?',
                    url: 'http://kapi.kapook.com/tag/search?txt=%QUERY&jsoncallback=?',
                    filter: function (jsonData) {
                        return $.map(jsonData, function (data) {
                            return {
                                id: data.tag_id,
                                value: data.keyword
                            };
                        });
                    }
                },
                limit: 15
            });

            engineData.initialize();
            console.log();

            thisObj.each(function () {
                var settings = jQuery.extend({
                    _id: '',
                    id: 0,
                    contentType: 0,
                    pageType: 0,
                    objectType: '',
                    itemValue: 'id',
                    itemText: 'value',
                    itemListURL: 'http://kapi.kapook.com/tag/content/save?jsoncallback=?',
                    itemAddedURL: 'http://kapi.kapook.com/tag/content/save?jsoncallback=?',
                    itemRemovedURL: 'http://kapi.kapook.com/tag/content/delete?jsoncallback=?',
                    purge_url: 'http://'+window.location.host+window.location.pathname,
                    oldItem: []
                }, options);

                console.info($('meta[property="og:title"]').attr('content'));
                console.info($('meta[property="og:description"]').attr('content'));
                console.info($('meta[property="og:image"]').attr('content'));
                console.info($('meta[property="og:url"]').attr('content'));
                $(this).tagsinput(
                        {
                            typeaheadjs: {
                                name: 'Data',
                                source: engineData.ttAdapter()
                            },
                            freeInput: false,
                            itemText: 'value',
                            itemValue: 'id'
                        }
                );
                var thisInput = this;
                if (settings.objectType != '') {
                    var list_url = 'http://kapi.kapook.com/tag/content/tag_obj?url=' + settings.url + '&jsoncallback=?';

                } else {
                    var list_url = 'http://kapi.kapook.com/tag/content/tag/' + settings.id + '/' + settings.portal + '?jsoncallback=?';
                }
                console.info(88);
                console.info(list_url);
                $.ajax({
                    dataType: "jsonp",
                    url: list_url,
                    data: {
                        id: settings.id
                    },
                    success: function (response) {
                        console.info(response);
                        console.log(9988);
                        if (typeof response.data != "undefined") {
                            console.log(9988);
                            var viewZone = [];
                            $.each(response.data, function (index, data) {
                                $(thisInput).tagsinput('add', {
                                    id: data['id'],
                                    value: data['value']
                                });

                                viewZone.push('<a target="_blank" href="http://cms.kapook.com/tagcontent/' + data['value'] + '">' + data['value'] + '</a>')
                            });

                            $('#viewZone').html(viewZone.join(' | '));


                        }
                        var title_d = decodeURIComponent(settings.title);
                        var display_success = '<br><div style="margin-top:10px; background:black; line-height:30px; color:white; text-align:center;">ตัวอย่าง Tag</div>' +
                                '<div style="border:1px solid grey;">' +
                                '<img src="' + settings.img + '" width="100%" />' +
                                '<p style="padding:5px;">Title : ' + title_d.replace(/\+/g, ' ') + '</p>' +
                                '<hr>' +
                                '<p style="padding:5px;">URL : ' + settings.url + '</p>' +
                                '</div>';
                        $('#viewZone').append(display_success);
                    },
                    error: function () {
                        console.log('err');
                    }
                }).done(function () {
                    console.info('done');
                    $(thisInput).on('itemAdded', function (event) {

                        $.ajax({
                            dataType: "jsonp",
                            url: settings.itemAddedURL,
                            data: {
                                //                                id: settings.id,
                                //                                pageType:settings.pageType,
                                //                                contentType:settings.contentType,
                                //                                tag:event.item,
                                //                                portal:settings.portal,

                                content_id: settings.id,
                                ccd: settings.ccd,
                                title: settings.title,
                                desc: settings.desc,
                                img: settings.img,
                                url: settings.url,
                                pageType: settings.pageType,
                                contentType: settings.contentType,
                                objectType: settings.objectType,
                                tag_id: event.item.id,
                                portal: settings.portal,
                                purge_url:settings.purge_url

                            },
                            success: function (data) {
                                console.info(data);
                            }
                        });
                        console.log('itemAdded::' + settings.itemAddedURL);
                    });

                    $(thisInput).on('itemRemoved', function (event) {
                        $.ajax({
                            dataType: "jsonp",
                            url: settings.itemRemovedURL,
                            data: {
                                content_id: settings.id,
                                pageType: settings.pageType,
                                contentType: settings.contentType,
                                objectType: settings.objectType,
                                tag_id: event.item.id,
                                portal: settings.portal,
                                url: settings.url,
                                purge_url:settings.purge_url
                            },
                            success: function (data) {
                                console.info(data);
                            }
                        });
                        console.log('itemRemoved::' + settings.itemRemovedURL);
                    });
                });





            });

            return thisObj;


        });

    };


})(jQuery);
