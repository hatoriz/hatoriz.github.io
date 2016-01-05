//var discus_url = 'http://dev.app.sanook.com/nego/';

var discus_url = 'http://apps.sanook.com/discussion/';

var discus_url_view = discus_url+'discus/view/';

var dicus_url_config = discus_url_view + 'get_theme_config/'+discus_app_id;

var dicus_url_theme = discus_url_view + 'get_theme/'+discus_app_id;

var dicus_url_data = discus_url_view + 'get_data/'+discus_app_id+'/'+discus_entry_id;

var dicus_url_replies = discus_url_view + 'get_replies/';

var dicus_url_stat = discus_url_view +'get_stat/'+discus_app_id+'/'+discus_entry_id;

var discus_config = Array();

var discus_template;

sc_rand = new Array();

sc_first = new Array();

var total_comments = 0;

var total_replies = 0;

var smiid = '';

var discus_lang = 'th';



$(document).ready(function(){

	$("#discus").html('<img src="http://p3.isanook.com/sh/0/di/discussion/loading.gif" alt="Please wait...">');

	param_page = get_url_param('page');

	dicus_url_data += '/' + param_page;

	setTimeout(get_theme, 1000);

});



function get_theme(){

	$.getJSON(dicus_url_theme+"?callback=?",  function(data) {

		discus_template = data;

		if(discus_template.theme_name == 'English'){

			discus_lang = 'en';

		}

		$('head').append(data.css);

		js_num = 0;

		for(i=0;i<data.js.length;i++){

			$.getScript(data.js[i], function(){

				js_num++;

				if(js_num == data.js.length){

					discuss_render_structure(discus_template);

					get_data();

					get_stat();

				}

			});

		}

		for(i=0;i<data.js_after.length;i++){

			$.getScript(data.js_after[i]);

		}

    });

}



function discuss_render_structure(data){

	$("#discus").html(data.html);

	if(discus_lang != 'en'){

		$('#header_title').html('ความคิดเห็นเกี่ยวกับ : '+pagetitle);

	}else{

		$('#header_title').html('Comments about : '+pagetitle);

	}

}

function get_stat(){

	$.getJSON(dicus_url_stat+"?callback=?",  function(data) {

	$('#total_comments').html(data.discus_cnt);

	});

}

function get_data(){

	$.getJSON(dicus_url_data+"?referer="+referer+"&callback=?",  function(data) {

    	discuss_render_data(data);

	});

}

function discuss_render_data(data) 

{

	if($.cookie('cookie_post_id')){

		cookie_post_id = $.cookie('cookie_post_id');

	}else{

		var isDate = new Date();

		cookie_post_id = Math.ceil(isDate.getTime()/1000); + '_' + Math.floor(Math.random()*99999);

	}

	$.cookie('cookie_post_id', cookie_post_id, "{ path: '/', expires: 30 }");

	$('input[id^="cookie_post_id"]').val(cookie_post_id);

	

	smiid = '';

	if($.cookie('smimid')){

		smiid = $.cookie('smimid');

	}

	

	$('#pagination_top').append(data.pagination_top);

	$('#pagination_bottom').append(data.pagination_bottom);

	

	param_rid = get_url_param('rid');

	param_rname = get_url_param('rname');

	param_rmessage = get_url_param('rmessage');

	top_comments_cnt = data.top_comments.length;

	top_comments_reply_cnt = data.top_comments_reply.length;

	reply_cnt = data.reply.length;

	reply_no = 0;

	

	//start render top comments

	if(top_comments_cnt > 0) {

		$('#top_comments_list').html('<h4>Top Comments</h4>');

		var base_top_comments_view = discus_template.comment;

		var base_top_comments_view = base_top_comments_view.replace('form_reply_<!-- Comment_ID -->', 'form_top_comments_reply_<!-- Comment_ID -->');

		base_top_comments_view = base_top_comments_view.replace(/form_reply_/g, 'form_top_comments_reply_');

		for (j in data.top_comments){

					display_time = format_date(data.top_comments[j].comments.time);

					top_comments_view = base_top_comments_view;

					top_comments_view = top_comments_view.replace("/<!-- Head_Title -->/g", pagetitle);

					top_comments_view = top_comments_view.replace(/<!-- Comment_Number -->/g, data.top_comments[j].comments.discuss_id);

					top_comments_view = top_comments_view.replace(/<!-- SMIID -->/g, data.top_comments[j].comments.poster.smiid);

					top_comments_view = top_comments_view.replace(/<!-- Profile_Name -->/g, data.top_comments[j].comments.poster.name);

					top_comments_view = top_comments_view.replace(/<!-- Comment_Date -->/g, display_time);

					top_comments_view = top_comments_view.replace(/<!-- IPAddress -->/g, data.top_comments[j].comments.poster.ip);

					message = data.top_comments[j].comments.display_message;

					message = replace_emoticon(message);

					top_comments_view = top_comments_view.replace(/<!-- Message -->/g, message);

					top_comments_view = top_comments_view.replace(/<!-- Comment_ID -->/g, data.top_comments[j]._id.$id);

					top_comments_view = top_comments_view.replace(/<!-- Discus_ID -->/g, data.top_comments[j]._id.$id);

					top_comments_view = top_comments_view.replace(/<!-- Entry_ID -->/g, data.top_comments[j].entry_id);

					top_comments_view = top_comments_view.replace(/<!-- APP_ID -->/g, discus_app_id);

					top_comments_view = top_comments_view.replace(/<!-- Like_No -->/g, data.top_comments[j].comments.vote_score);

					top_comments_view = top_comments_view.replace(/<!-- Replies_No -->/g, data.top_comments[j].comments.replies ? data.top_comments[j].comments.replies+' Replies' : '');

					top_comments_view = top_comments_view.replace(/<!-- URL -->/g, referer);

					if(inArray(data.top_comments[j]._id.$id +'_'+smiid, data.user_like)){

						top_comments_view = top_comments_view.replace(/<!-- Like_Display -->/g, 'none');

						top_comments_view = top_comments_view.replace(/<!-- Unlike_Display -->/g, '');

					}else{

						top_comments_view = top_comments_view.replace(/<!-- Like_Display -->/g, '');

						top_comments_view = top_comments_view.replace(/<!-- Unlike_Display -->/g, 'none');

					}

					if(param_rid == data.top_comments[j]._id.$id){

						top_comments_view = top_comments_view.replace(/<!-- Reply_Message_Value -->/g, decodeURIComponent(param_rmessage));

						top_comments_view = top_comments_view.replace(/<!-- Reply_Name_Value -->/g, decodeURIComponent(param_rname));

						top_comments_view = top_comments_view.replace(/<!-- Reply_Display -->/g, '');

					}else{

						top_comments_view = top_comments_view.replace(/<!-- Reply_Message_Value -->/g, '');

						top_comments_view = top_comments_view.replace(/<!-- Reply_Name_Value -->/g, '');

						top_comments_view = top_comments_view.replace(/<!-- Reply_Display -->/g, 'none');

					}

					if((typeof data.top_comments[j].quote) != "undefined"){

						quote_view = discus_template.quote;

						quote_view = quote_view.replace(/<!-- Quote_Comment_Number -->/g, data.top_comments[j].quote.discuss_id);

						quote_message = replace_emoticon(data.top_comments[j].quote.message);

						quote_view = quote_view.replace(/<!-- Quote_Message -->/g, quote_message);

						top_comments_view = top_comments_view.replace(/<!-- Quote -->/g, quote_view);

					}

					if(top_comments_reply_cnt > 0) {

						top_comments_reply_id = 1;

						top_comments_reply_no = 0;

						while((top_comments_reply_no < top_comments_reply_cnt)){

							if(data.top_comments_reply[top_comments_reply_no].reply_id == data.top_comments[j]._id.$id){

								top_comments_reply_id++;

							}

							top_comments_reply_no++;

						}

					}else{

						top_comments_reply_id = 0;

					}

			$('#top_comments_list').append(top_comments_view);

			$('#top_comments_list div[class*="reply_all_"] > a.get_more_reply').addClass('top_comments');

			if(top_comments_reply_id > 1){

				$('.reply_all_'+data.top_comments[j]._id.$id).css('display','');

			}

		}

	}

	//end render top comments



	for (i in data){

		if(typeof data[i].comments != "undefined"){

			if((data[i].comments.status != 2) || (data[i].comments.poster.cookie_post_id != '' && data[i].comments.poster.cookie_post_id == cookie_post_id) || (data[i].comments.poster.smiid != '' && data[i].comments.poster.smiid == smiid) ){

				display_time = format_date(data[i].comments.time);

				temp_view = discus_template.comment;

				temp_view = temp_view.replace("/<!-- Head_Title -->/g", pagetitle);

				temp_view = temp_view.replace(/<!-- Comment_Number -->/g, data[i].comments.discuss_id);

				temp_view = temp_view.replace(/<!-- SMIID -->/g, data[i].comments.poster.smiid);

				temp_view = temp_view.replace(/<!-- Profile_Name -->/g, data[i].comments.poster.name);

				temp_view = temp_view.replace(/<!-- Comment_Date -->/g, display_time);

				temp_view = temp_view.replace(/<!-- IPAddress -->/g, data[i].comments.poster.ip);

				message = data[i].comments.display_message;

				message = replace_emoticon(message);

				temp_view = temp_view.replace(/<!-- Message -->/g, message);

				temp_view = temp_view.replace(/<!-- Comment_ID -->/g, data[i]._id.$id);

				temp_view = temp_view.replace(/<!-- Discus_ID -->/g, data[i]._id.$id);

				temp_view = temp_view.replace(/<!-- Entry_ID -->/g, data[i].entry_id);

				temp_view = temp_view.replace(/<!-- APP_ID -->/g, discus_app_id);

				temp_view = temp_view.replace(/<!-- Like_No -->/g, data[i].comments.vote_score);

				temp_view = temp_view.replace(/<!-- Replies_No -->/g, data[i].comments.replies ? data[i].comments.replies+' Replies' : '');

				temp_view = temp_view.replace(/<!-- URL -->/g, referer);

				if(inArray(data[i]._id.$id +'_'+smiid, data.user_like)){

					temp_view = temp_view.replace(/<!-- Like_Display -->/g, 'none');

					temp_view = temp_view.replace(/<!-- Unlike_Display -->/g, '');

				}else{

					temp_view = temp_view.replace(/<!-- Like_Display -->/g, '');

					temp_view = temp_view.replace(/<!-- Unlike_Display -->/g, 'none');

				}

				if(param_rid == data[i]._id.$id){

					temp_view = temp_view.replace(/<!-- Reply_Message_Value -->/g, decodeURIComponent(param_rmessage));

					temp_view = temp_view.replace(/<!-- Reply_Name_Value -->/g, decodeURIComponent(param_rname));

					temp_view = temp_view.replace(/<!-- Reply_Display -->/g, '');

				}else{

					temp_view = temp_view.replace(/<!-- Reply_Message_Value -->/g, '');

					temp_view = temp_view.replace(/<!-- Reply_Name_Value -->/g, '');

					temp_view = temp_view.replace(/<!-- Reply_Display -->/g, 'none');

				}

				if((typeof data[i].quote) != "undefined"){

					quote_view = discus_template.quote;

					quote_view = quote_view.replace(/<!-- Quote_Comment_Number -->/g, data[i].quote.discuss_id);

					quote_message = replace_emoticon(data[i].quote.message);

					quote_view = quote_view.replace(/<!-- Quote_Message -->/g, quote_message);

					temp_view = temp_view.replace(/<!-- Quote -->/g, quote_view);

				}

				total_comments = total_comments + 1;

				

				reply_id = 1;

				if(reply_cnt > 0) {

					while((reply_no < reply_cnt) && (data.reply[reply_no].reply_id == data[i]._id.$id) ){

						total_replies = total_replies + 1;

						display_time = format_date(data.reply[reply_no].comments.time);

						reply_view = discus_template.reply;

						reply_view = reply_view.replace(/<!-- Reply_No -->/g, reply_id);					

						reply_view = reply_view.replace(/<!-- Reply_Number -->/g, data.reply[reply_no].comments.discuss_id);						

						reply_view = reply_view.replace(/<!-- Reply_SMIID -->/g, data.reply[reply_no].comments.poster.smiid);

						reply_view = reply_view.replace(/<!-- Reply_Profile_Name -->/g, data.reply[reply_no].comments.poster.name);

						reply_view = reply_view.replace(/<!-- Reply_Comment_Date -->/g, display_time);

						reply_view = reply_view.replace(/<!-- Reply_IPAddress -->/g, data.reply[reply_no].comments.poster.ip);

						reply_view = reply_view.replace(/<!-- APP_ID -->/g, discus_app_id);

						reply_view = reply_view.replace(/<!-- Entry_ID -->/g, data.reply[reply_no].entry_id);

						reply_view = reply_view.replace(/<!-- Discus_ID -->/g, data.reply[reply_no]._id.$id);

						reply_view = reply_view.replace(/<!-- Comment_ID -->/g, data[i]._id.$id);

						reply_view = reply_view.replace(/<!-- Reply_ID -->/g, data.reply[reply_no]._id.$id);

						message = data.reply[reply_no].comments.display_message;

						message = replace_emoticon(message);

						reply_view = reply_view.replace(/<!-- Reply_Message -->/g, message);

						reply_view = reply_view.replace(/<!-- Like_No -->/g, data.reply[reply_no].comments.vote_score);

						if(inArray(data.reply[reply_no]._id.$id +'_'+smiid, data.user_like)){

							reply_view = reply_view.replace(/<!-- Like_Display -->/g, 'none');

							reply_view = reply_view.replace(/<!-- Unlike_Display -->/g, '');

						}else{

							reply_view = reply_view.replace(/<!-- Like_Display -->/g, '');

							reply_view = reply_view.replace(/<!-- Unlike_Display -->/g, 'none');

						}

						reply_view += '<!-- Reply -->';

						temp_view = temp_view.replace(/<!-- Reply -->/g, reply_view);

						reply_no++;

						reply_id++;

					}

				}

				$('#comment_list').append(temp_view);

				if(reply_id > 4){

					for(m=1;m<(reply_id-3);m++){

						$('.reply_'+data[i]._id.$id+'_' + m).remove();

					}

					$('.reply_all_'+data[i]._id.$id).css('display','');

				}

			}

		}

		

	}

	$('#discus_form_post').html(discus_template.form_post);

	

	param_name = get_url_param('name');

	param_message = get_url_param('message');

	document.discussionForm.post_name.value = decodeURIComponent(param_name);

	document.discussionForm.message.value = decodeURIComponent(param_message);

	

	if($.cookie('smimid')){

		document.getElementById('post_name').value= getsubcookie("smiservice", "NICKNAME");

		document.getElementById('post_name').readOnly = true;

		$('input[name="reply_name"]').val(document.discussionForm.post_name.value).attr('readOnly','true');

		$('[class*="icon-login-comment"]').remove();

		$('[class*="input-author"]').removeClass('input-author');

	}



	document.discussionForm.purl.value = referer.split("?")[0];

	document.discussionForm.appid.value = discus_app_id;

	document.discussionForm.eid.value = discus_entry_id;

	

	$('div[id^="comm-no-"]').mouseover(function(){

		id_target = this.id;

		id_target = id_target.split('-')[2];

		$('#reply_button_'+id_target).css("display", "");

	}).mouseout(function() {

		id_target = this.id;

		id_target = id_target.split('-')[2];

		$('#reply_button_'+id_target).css("display", "none");

	});

	$('a[class*="reply_link_"]').click(function() {

		id_target = this.id;

		id_target = id_target.split('_')[2];

		var current_display = $(this).parents('article').find('.reply_input_box').css("display");

		if(current_display == 'none'){

			$('.reply_input_box').css("display", "none");

			$(this).parents('article').find('.reply_input_box').css("display", "");

			if ( $('.nlpcaptcha').is("p") ) {
				// 1 get NLP captcha
				// 2 remove id "captchaDiv"
				// 3 add id "captchaDiv" to new target
				// 4 insert NLP captcha
				// 5 run js generate

				var nlpContent = $('#captchaDiv').html()
				$('.comment-captcha').removeAttr('id');
				$('.comment-captcha').empty();
				$(this).parents('article').find('.comment-captcha').attr("id", "captchaDiv").html(nlpContent);
				nlpAjaxCaptcha();
			}

		}else{

			$(this).parents('article').find('.reply_input_box').css("display", "none");

		}

		setTimeout(resizeIframe, 1000);

	});

	$('#discussionForm #message, #discussionForm #post_name').click(function() {
		if ( $('#discussionForm .comment-captcha').is(':empty') ) {
			var nlpContent = $('#captchaDiv').html()
			$('.comment-captcha').removeAttr('id');
			$('.comment-captcha').empty();
			$('#discussionForm').find('.comment-captcha').attr("id", "captchaDiv").html(nlpContent);
			nlpAjaxCaptcha();
		}
	});
	$('[name*="reply_msg"], [name*="reply_name"]').click(function(){
		if ( $(this).parents('form').find('.comment-captcha').is(':empty') ) {
			var nlpContent = $('#captchaDiv').html()
			$('.comment-captcha').removeAttr('id');
			$('.comment-captcha').empty();
			$(this).parents('form').find('.comment-captcha').attr("id", "captchaDiv").html(nlpContent);
			nlpAjaxCaptcha();
		}
	});

	$('[class*="div-comment"] nav[class*="pager"] a').each(function(){

		$(this).attr('target', '_parent');

	});

	//fb_initial();

	initialize();

}

function inArray(needle, haystack) {

    var length = haystack.length;

    for(var i = 0; i < length; i++) {

        if(haystack[i] == needle) return true;

    }

    return false;

}

function replace_emoticon(message){

	message = message.replace(/\[emo\=1\.gif\]/g, '<span class="discuss-e e-1">1</span>');

	message = message.replace(/\[emo\=2\.gif\]/g, '<span class="discuss-e e-2">2</span>');

	message = message.replace(/\[emo\=3\.gif\]/g, '<span class="discuss-e e-3">3</span>');

	message = message.replace(/\[emo\=4\.gif\]/g, '<span class="discuss-e e-4">4</span>');

	message = message.replace(/\[emo\=5\.gif\]/g, '<span class="discuss-e e-5">5</span>');

	message = message.replace(/\[emo\=6\.gif\]/g, '<span class="discuss-e e-6">6</span>');

	message = message.replace(/\[emo\=7\.gif\]/g, '<span class="discuss-e e-7">7</span>');

	message = message.replace(/\[emo\=8\.gif\]/g, '<span class="discuss-e e-8">8</span>');

	message = message.replace(/\[emo\=9\.gif\]/g, '<span class="discuss-e e-9">9</span>');

	message = message.replace(/\[emo\=10\.gif\]/g, '<span class="discuss-e e-10">10</span>');

	message = message.replace(/\[emo\=11\.gif\]/g, '<span class="discuss-e e-11">11</span>');

	message = message.replace(/\[emo\=12\.gif\]/g, '<span class="discuss-e e-12">12</span>');

	message = message.replace(/\[emo\=13\.gif\]/g, '<span class="discuss-e e-13">13</span>');

	message = message.replace(/\[emo\=14\.gif\]/g, '<span class="discuss-e e-14">14</span>');

	message = message.replace(/\[emo\=15\.gif\]/g, '<span class="discuss-e e-15">15</span>');

	message = message.replace(/\[emo\=16\.gif\]/g, '<span class="discuss-e e-16">16</span>');

	message = message.replace(/\[emo\=17\.gif\]/g, '<span class="discuss-e e-17">17</span>');

	message = message.replace(/\[emo\=18\.gif\]/g, '<span class="discuss-e e-18">18</span>');

	message = message.replace(/\[emo\=19\.gif\]/g, '<span class="discuss-e e-19">19</span>');

	message = message.replace(/\[emo\=20\.gif\]/g, '<span class="discuss-e e-20">20</span>');

	message = message.replace(/\[emo\=21\.gif\]/g, '<span class="discuss-e e-21">21</span>');

	message = message.replace(/\[emo\=22\.gif\]/g, '<span class="discuss-e e-22">22</span>');

	message = message.replace(/\[emo\=23\.gif\]/g, '<span class="discuss-e e-23">23</span>');

	message = message.replace(/\[emo\=24\.gif\]/g, '<span class="discuss-e e-24">24</span>');

	message = message.replace(/\[emo\=25\.gif\]/g, '<span class="discuss-e e-25">25</span>');

	message = message.replace(/\[emo\=26\.gif\]/g, '<span class="discuss-e e-26">26</span>');

	return message;

}



function format_date(targettime){

	var targettime = parseInt(targettime) * 1000;

	if(discus_lang != 'en'){

		var m_names = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม");

	}else{

		var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

	}

	var d = new Date(targettime);

	var curr_date = ('0' + d.getDate()).slice(-2);

	var curr_month = d.getMonth();

	if(discus_lang != 'en'){

		var curr_year = d.getFullYear() + 543;

	}else{

		var curr_year = d.getFullYear();

	}

	var curr_hour = ('0' + d.getHours()).slice(-2);

	var curr_min = ('0' + d.getMinutes()).slice(-2);

	if(discus_lang != 'en'){

		var output = curr_date + " " + m_names[curr_month] + " " + curr_year + " - " + curr_hour + ":" + curr_min + " น.";

	}else{

		var output = curr_date + " " + m_names[curr_month] + " " + curr_year + " - " + curr_hour + ":" + curr_min;

	}

	return output;

}



function find_date_dif(timenow, targettime){

	second_ext = ' วินาที ';

	minute_ext = ' นาที ';

	hour_ext = ' ชั่วโมง ';

	day_ext = ' วัน ';

	month_ext = ' เดือน ';

	year_ext = ' ปี ';

	

	second_time = '';

	minute_time = '';

	hour_time = '';

	day_time = '';

	month_time = '';

	year_time = '';

	display_time = '';

	

	dif_time = timenow - targettime;

	second_time = dif_time;

	if(dif_time >= 60){

		second_time = Math.floor(dif_time % 60);

		dif_time = Math.floor(dif_time / 60);

		minute_time = dif_time;

	}

	if(dif_time >= 60 && minute_time != ''){

		minute_time = Math.floor(dif_time % 60);

		dif_time = Math.floor(dif_time / 60);

		hour_time = dif_time;

	}

	if(dif_time >= 24 && hour_time != ''){

		hour_time = Math.floor(dif_time % 24);

		dif_time = Math.floor(dif_time / 24);

		day_time = dif_time;

	}

	if(dif_time >= 30 && day_time != ''){

		day_time = Math.floor(dif_time % 30);

		dif_time = Math.floor(dif_time / 30);

		month_time = dif_time;

	}

	if(dif_time >= 12 && month_time != ''){

		month_time = Math.floor(dif_time % 12);

		dif_time = Math.floor(dif_time / 12);

		year_time = dif_time;

	}

	

	if(second_time != '' && hour_time == '' && day_time == ''){

		second_time += second_ext;

	}else{

		second_time = '';

	}

	if(minute_time != '' && day_time == ''){

		minute_time += minute_ext; 

	}else{

		minute_time = '';

	}

	if(hour_time != '' && month_time == ''){

		hour_time += hour_ext;

	}else{

		hour_time = '';

	}

	if(day_time != '') day_time += day_ext;

	if(month_time != '') month_time += month_ext;

	if(year_time != '') year_time += year_ext;

	

	display_time = year_time + month_time + day_time + hour_time + minute_time + second_time + ' ที่แล้ว';

	return display_time;

}

function fb_initial(){

	/*$('#fb-connect-txt').html('แชร์ไป Facebook');*/

	/*

	FB.init({

		appId : '156775971014419',

		status : true,

		cookie : true,

		xfbml : true

	});

	FB.getLoginStatus(function(response) {

		if(response.status == 'connected') {

			$.ajax({

				url: discus_url+'discus/post/getMyFBProfile/',

				dataType: "jsonp",

				jsonp: true,

				jsonpCallback: _parseJSONFromMyFBProfile

			});

		}

	});

	*/

}

function initialize(){

	var iframe_height = $('#discus').height();

	socket = new easyXDM.Socket({

	    local: discus_url+'js/easyXDM/name.html',

	    swf: discus_url+'js/easyXDM/easyxdm.swf',

	    onReady: function() {

	        socket.postMessage(iframe_height);

	    }

	});

	setTimeout(resizeIframe, 3000);

}

function resizeIframe(){

	var iframe_height = $('#discus').height();

	socket.postMessage(iframe_height);

}

function _parseJSONFromMyFBProfile(data){

	var fb_n = data.first_name+" "+data.last_name;

	$('#fb-connect-txt').html('แชร์ไป Facebook ด้วย (' + fb_n + ')');

	disable_fb_bubble();

}

function send_notify(comment_no, app_id, entry_id, discuss_id) {

	notify_save(app_id, entry_id, discuss_id, 'คุณต้องการแจ้งลบความคิดเห็นที่ '+comment_no);

}

function send_notify_reply(comment_no, app_id, entry_id, discuss_id){

	notify_save(app_id, entry_id, discuss_id, 'คุณต้องการแจ้งลบความคิดเห็นที่ '+comment_no);

}

function notify_save(app_id, entry_id, discuss_id, msg){

		$.ajax({

			url: discus_url+'discus/inform/',

			dataType: "jsonp",

			data : {app_id: app_id,entry_id: entry_id,discuss_id: discuss_id},

			context: this,

			jsonp: false,

			jsonpCallback: return_notify

		});

}

function send_notify_cancel(app_id, entry_id, discuss_id){

	$.ajax({

		url: discus_url+'discus/inform/cancel',

		dataType: "jsonp",

		data : {app_id: app_id,entry_id: entry_id,discuss_id: discuss_id},

		context: this,

		jsonp: false,

		jsonpCallback: return_notify

	});

}

function send_like(app_id, entry_id, discuss_id) {

	if(chk_login()){

		$.ajax({

			url: discus_url+'discus/post/like/',

			dataType: "jsonp",

			data : {app_id: app_id,entry_id: entry_id,discuss_id: discuss_id},

			context: this,

			jsonp: false,

			jsonpCallback: return_like

		});

	}else{

		xdm_login();

	}

}

function send_unlike(app_id, entry_id, discuss_id) {

	if(chk_login()){

		$.ajax({

			url: discus_url+'discus/post/unlike/',

			dataType: "jsonp",

			data : {app_id: app_id,entry_id: entry_id,discuss_id: discuss_id},

			context: this,

			jsonp: false,

			jsonpCallback: return_like

		});

	}else{

		xdm_login();

	}

}

function return_like(data){

	if(data.status == 'ok') {

		disable_like_button(data);

	}

}

function disable_like_button(data){

	if(data.module == 'like'){

		$('.like_link_'+data.commentid).css('display','none');

		$('.like_unlink_'+data.commentid).css('display','');

	}else{

		$('.like_unlink_'+data.commentid).css('display','none');

		$('.like_link_'+data.commentid).css('display','');

	}

	$('.like_no_'+data.commentid).html(data.like_cnt+' Likes');

}

function return_notify(data){

	if(data.status == 'ok') {

		if(discus_lang != 'en'){

			xdm_alert('คุณแจ้งลบความคิดเห็นนี้เรียบร้อยแล้วค่ะ');

		}else{

			xdm_alert('You\'ve reported to remove this comment.');

		}

	}

}

function genSC(id) {

	if(typeof sc_first[id] == 'undefined') {

		sc_rand[id] = 0;

		genCaptcha(id);

		sc_first[id] = true;

		sc_rand[id] = 0;

	}

}

function genCaptcha(id){

	if(sc_rand[id] == 0) {

		sc_rand[id] = Math.floor(Math.random()*1000000000000);

		var sc = sc_rand[id] + '_' + id;

		$('input[class*="sc_password_"]').val(sc);

		sc_first[id] = '1';

	}

	$('.imgVerify').attr('src', discus_url+'discus/post/captcha/?sc=' + sc_rand[id] + '_'+ id +'&' + Math.random());

}

function quoteDiscussion(msgId,text)

{

	var str='';

	str+= '[quote id=' + msgId + ']';

	str+= text;

	str+= '[/quote]\n';	

	replaceTextArea(str);

}

function replaceTextArea(text)

{

	var inputTextarea = $('#discussionForm textarea#message');

	var message = inputTextarea.val();

	message = message.replace(/\[quote id=([0-9]+)\](.+)\[\/quote\]\n/, '');

	message = message.replace(/\s+$/, '');

	var final_message = text + message; 

	inputTextarea.val(final_message);

	inputTextarea.focus();

}

function replaceText(text, textarea)

{

	// Attempt to create a text range (IE).

	if (typeof(textarea.caretPos) != "undefined" && textarea.createTextRange)

	{

		var caretPos = textarea.caretPos;

		caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? text + ' ' : text;

		caretPos.select();

	}

	  // Mozilla text range replace.

	  else if (typeof(textarea.selectionStart) != "undefined")

	  {

	  var begin = textarea.value.substr(0, textarea.selectionStart);

	  var end = textarea.value.substr(textarea.selectionEnd);

	  var scrollPos = textarea.scrollTop;

	 

	  textarea.value = begin + text + end;

	 

	  if (textarea.setSelectionRange)

	  {

		  textarea.focus();

		  textarea.setSelectionRange(begin.length + text.length, begin.length + text.length);

	  }

	  textarea.scrollTop = scrollPos;

	  }

	  // Just put it on the end.

	  else

	  {

		  textarea.focus();

		  textarea.value += text;

		  textarea.focus(textarea.value.length - 1);

	  }

 }

function validatePostForm(){

	var objForm = document.discussionForm;

	if(objForm.post_name.value.length == 0){

		if(discus_lang != 'en'){

			xdm_alert('กรุณากรอก ชื่อ ด้วยค่ะ');

		}else{

			xdm_alert('Please input your NAME');

		}

		objForm.post_name.focus();

	}else if(objForm.message.value.length == 0){

		if(discus_lang != 'en'){

			xdm_alert('กรุณากรอก ข้อความ ด้วยค่ะ');

		}else{

			xdm_alert('Please input your MESSAGE');

		}

		objForm.message.focus();

	}else if(substr_count(objForm.message.value, '[emo=') > 3){

		if(discus_lang != 'en'){

			xdm_alert('คุณใช้ภาพอีโมติคอนเกิน 3 ภาพ กรุณาแก้ไขก่อนส่งค่ะ');

		}else{

			xdm_alert('You have put more than 3 emoticons, please adjust your comment before submit.');

		}

		objForm.message.focus();

	}else if(objForm.capcha.value.length == 0){

		if(discus_lang != 'en'){

			xdm_alert('กรุณากรอก รหัสตรวจสอบ ด้วยค่ะ');

		}else{

			xdm_alert('Please fill in the verification code.');

		}

		objForm.capcha.focus();

	}else{

		var sc_id = objForm.sc_id.value;

		var sc = objForm['sc_'+sc_id].value;

		var capcha = objForm.capcha.value;

		var url = discus_url+'discus/post/VerifyCaptcha/?sc='+sc+'&capcha='+capcha+'&jsoncallback=?';



		$.getJSON(url, function(response) {

			if(response.data == 'false'){

				if(discus_lang != 'en'){

					xdm_alert('กรอกรหัสไม่ถูกต้อง');

				}else{

					xdm_alert('Please re-enter the verification codes');

				}

				objForm.capcha.focus();

			}else{

				var post_name = objForm.post_name.value;

				previewComment(post_name, objForm.message.value);

			}

		});

	}

}

function validatePostFormNLP(){

	if ( $('#discussionForm .comment-captcha').is(':empty') ) {
		var nlpContent = $('#captchaDiv').html()
		$('.comment-captcha').removeAttr('id');
		$('.comment-captcha').empty();
		$('#discussionForm').find('.comment-captcha').attr("id", "captchaDiv").html(nlpContent);
		nlpAjaxCaptcha();
	}

	var objForm = document.discussionForm;

	if(objForm.post_name.value.length == 0){
		xdm_alert('กรุณากรอก ชื่อ ด้วยค่ะ');
		objForm.post_name.focus();
	}else if(objForm.message.value.length == 0){
		xdm_alert('กรุณากรอก ข้อความ ด้วยค่ะ');
		objForm.message.focus();
	}else if(substr_count(objForm.message.value, '[emo=') > 3){
		xdm_alert('คุณใช้ภาพอีโมติคอนเกิน 3 ภาพ กรุณาแก้ไขก่อนส่งค่ะ');
		objForm.message.focus();
	}else if(objForm.nlpAnswer.value.length == 0){
		xdm_alert('กรุณากรอก รหัสตรวจสอบ ด้วยค่ะ');
		objForm.nlpAnswer.focus();
	}else{

		var nlpIdentifier = $("#nlpIdentifier").val();
		var nlpAnswer = $("#nlpAnswer").val();

		$.ajax({
			url: discus_url+'discus/post/VerifyCaptchaNLP',
			jsonp: "jsoncallback",
			dataType: "jsonp",
			data: {
				nlpIdentifier:nlpIdentifier,
				nlpAnswer: nlpAnswer,
				format: "json"
			},
			success: function( response ) {
				if (response.status == false)
				{
					xdm_alert('กรอกรหัสไม่ถูกต้อง');
					objForm.nlpAnswer.focus();
					nlpAjaxCaptcha();
				} else {
					var post_name = objForm.post_name.value;
					previewComment(post_name, objForm.message.value);
					$('#captchaDiv').hide();
				}
			}
		});
	}
}

function substr_count(string,substring,start,length){

 	var c = 0;

 	if(start) { string = string.substr(start); }

 	if(length) { string = string.substr(0,length); }

 	for (var i=0;i<string.length;i++){

  		if(substring == string.substr(i,substring.length))

  			c++;

 	}

 	return c;

}

function previewComment(post_name, message){

	$('[class*="additional-adv"]').show();

	$('[class*="comment-preview"]').addClass('preview-on');

	var $container = $('[class*="comment-preview"]');

	$('[class*="div-comment"] form input#preview_post_name').val(post_name).attr('readonly', 'true');

	message = replace_emoticon(message);

	message = message.replace(/\n/g, "<br />");

	$('[class*="div-comment"] form p#preview_message').html(message);

	if(chk_login()){

		$('.preview-instruction').hide();

	}

	$container.show();

}

function validateReplyForm(objForm, commentid){

	if(objForm.reply_name.value.length == 0){

		if(discus_lang != 'en'){

			xdm_alert('กรุณากรอก ชื่อ ด้วยค่ะ');

		}else{

			xdm_alert('Please input your NAME');

		}

		objForm.reply_name.focus();

	}else if(objForm.reply_msg.value.length == 0){

		if(discus_lang != 'en'){

			xdm_alert('กรุณากรอก ข้อความ ด้วยค่ะ');

		}else{

			xdm_alert('Please input your MESSAGE');

		}

		objForm.reply_msg.focus();

	}else if(substr_count(objForm.reply_msg.value, '[emo=') > 3){

		if(discus_lang != 'en'){

			xdm_alert('คุณใช้ภาพอีโมติคอนเกิน 3 ภาพ กรุณาแก้ไขก่อนส่งค่ะ');

		}else{

			xdm_alert('You have put more than 3 emoticons, please adjust your comment before submit.');

		}

		objForm.reply_msg.focus();

	}else if(objForm['reply_captcha_'+commentid].value.length == 0){

		if(discus_lang != 'en'){

			xdm_alert('กรุณากรอก รหัสตรวจสอบ ด้วยค่ะ');

		}else{

			xdm_alert('Please fill in the verification code.');

		}

		objForm['reply_captcha_'+commentid].focus();

	}else{

		var sc_id = objForm.sc_id.value;

		var sc = objForm['sc_'+sc_id].value;

		var capcha = objForm['reply_captcha_'+commentid].value;

		

		var url = discus_url+'discus/post/VerifyCaptcha/?sc='+sc+'&capcha='+capcha+'&jsoncallback=?';

		$.getJSON(url, function(response) {

			if(response.data == 'false'){

				if(discus_lang != 'en'){

					xdm_alert('กรอกรหัสไม่ถูกต้อง');

				}else{

					xdm_alert('Please re-enter the verification codes');

				}

				objForm['reply_captcha_'+commentid].focus();

			}else{

				discussion_success(objForm.name, 'reply', 5000);

			}

		});

	}

}

function validateReplyFormNLP(objForm, commentid)
{
	if ( $(objForm).find('.comment-captcha').is(':empty') ) {
		var nlpContent = $('#captchaDiv').html()
		$('.comment-captcha').removeAttr('id');
		$('.comment-captcha').empty();
		$(objForm).find('.comment-captcha').attr("id", "captchaDiv").html(nlpContent);
		nlpAjaxCaptcha();
		xdm_alert('กรุณากรอก รหัสตรวจสอบ ด้วยค่ะ');
		objForm.nlpAnswer.focus();
	}

	if(objForm.reply_name.value.length == 0){
		if(discus_lang != 'en'){
			xdm_alert('กรุณากรอก ชื่อ ด้วยค่ะ');
		}else{
			xdm_alert('Please input your NAME');
		}

		objForm.reply_name.focus();
	}else if(objForm.reply_msg.value.length == 0){
		if(discus_lang != 'en'){
			xdm_alert('กรุณากรอก ข้อความ ด้วยค่ะ');
		}else{
			xdm_alert('Please input your MESSAGE');
		}
		objForm.reply_msg.focus();
	}else if(substr_count(objForm.reply_msg.value, '[emo=') > 3){
		if(discus_lang != 'en'){
			xdm_alert('คุณใช้ภาพอีโมติคอนเกิน 3 ภาพ กรุณาแก้ไขก่อนส่งค่ะ');
		}else{
			xdm_alert('You have put more than 3 emoticons, please adjust your comment before submit.');
		}

		objForm.reply_msg.focus();
	/*
	}else if(objForm['reply_captcha_'+commentid].value.length == 0){
		if(discus_lang != 'en'){
			xdm_alert('กรุณากรอก รหัสตรวจสอบ ด้วยค่ะ');
		}else{
			xdm_alert('Please fill in the verification code.');
		}

		objForm['reply_captcha_'+commentid].focus();
	*/
	}else if(objForm.nlpAnswer.value.length == 0){
		xdm_alert('กรุณากรอก รหัสตรวจสอบ ด้วยค่ะ');
		objForm.nlpAnswer.focus();
	}else{
		var nlpIdentifier = $("#nlpIdentifier").val();
		var nlpAnswer = $("#nlpAnswer").val();

		$.ajax({
			url: discus_url+'discus/post/VerifyCaptchaNLP',
			jsonp: "jsoncallback",
			dataType: "jsonp",
			data: {
				nlpIdentifier:nlpIdentifier,
				nlpAnswer: nlpAnswer,
				format: "json"
			},
			success: function( response ) {
				if (response.status == false)
				{
					xdm_alert('กรอกรหัสไม่ถูกต้อง');
					objForm.nlpAnswer.focus();
					nlpAjaxCaptcha();
				} else {
					// var post_name = objForm.post_name.value;
					// previewComment(post_name, objForm.message.value);
					// $('#captchaDiv').hide();
					discussion_success(objForm.name, 'reply', 5000);
				}
			}
		});
	}
}

function discussion_success(form_name, type, delay){

	if(chk_login()){

		if(discus_lang != 'en'){

			var feedback = '<span>ข้อความของคุณจะแสดงในหน้าเว็บทันทีค่ะ</span>';

		}else{

			var feedback = '<span>Your message will be displayed immediately.</span>';

		}

	}else{

		if(discus_lang != 'en'){

			var feedback = '<span>ข้อความของคุณจะแสดงในหน้าเว็บทันที</span><span>หลังจากผ่านการตรวจสอบจากทีมงานสนุก! ค่ะ</span>';

		}else{

			var feedback = '<span>Your comment will be displayed after our approval.</span>';

		}

	}

	$('.comment-success ._self-mg_b30x').html(feedback);

	$('[class*="comment-success"]').addClass('success-on');

	$('[class*="additional-adv"]').hide();

	setTimeout(function(){document[form_name].submit();}, delay);

	if(type == 'reply'){	

		$('a.btn-ok').remove();

		$('.comment-success').append('<a href="javascript:void(0);" class="btn-ok _self-dp_block" onclick="return discussion_success(\''+form_name+'\', \'\', 0);">ตกลง</a>');

		var offset = $('#comment > .comment-form').offset().top;

		xdm_reply_success(offset);

	}else{

		return false;

	}

		

}

function getsubcookie(cookiename,cookiesubname){

	var cookiestring=""+document.cookie;

	var index1=cookiestring.indexOf(cookiename+'=');

	if(index1==-1||cookiename=="")return"";

	var index2=cookiestring.indexOf(';',index1);

	if(index2==-1)index2=cookiestring.length;

	var unescapevalue=unescape(cookiestring.substring(index1+cookiename.length+1,index2));

	if(cookiesubname!=""){

		var subcookieindex1=unescapevalue.indexOf(cookiesubname);

		if(subcookieindex1==-1||cookiesubname=="")return"";

		var subcookieindex2=unescapevalue.indexOf('&',subcookieindex1);

		if(subcookieindex2==-1)subcookieindex2=cookiestring.length;

		var cookievalue=unescapevalue.substring(subcookieindex1+cookiesubname.length+1,subcookieindex2);

		return cookievalue;

	}else{

		return unescapevalue;

	}

}

function chk_login(){

	if($.cookie('smimid')){

		return true;

	} else {

		return false;

	}

}

function xdm_login(){	

	socket.postMessage('_login');

	return false;

}

function xdm_register(){	

	socket.postMessage('_register');

	return false;

}

function xdm_reply_success(offset){	

	var message = '_reply_success:'+offset;

	socket.postMessage(message);

	return false;

}

function xdm_alert(msg){	

	var message = '_alert:'+msg;

	socket.postMessage(message);

	return false;

}

function get_url_param( name ){

	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

	var regexS = "[\\?&]"+name+"=([^&#]*)";

	var regex = new RegExp( regexS );

	var results = regex.exec( window.location.href );

	if( results == null )

		return "";

	else

		return results[1];

}

function showall_reply(obj, comment_id){

	var obj = $(obj);

	var message = obj.html();

	

	if(obj.hasClass('top_comments')){

		getMoreReplies(obj, comment_id);

	}else{

		var loaded_replies = obj.parents('article').find('.comment-body > .comment-reply > article').length;

		if(loaded_replies > 0){

			obj.parents('article').find('.comment-body > .comment-reply > article').each(function(index){

				if(index == 0){

					var last_id = $(this).attr('data-id');

					obj.data('last_id', last_id);

					getMoreReplies(obj, comment_id);

				}

			});

		}else{

			getMoreReplies(obj, comment_id);

		}

	}

	obj.attr('title', 'hide');

	if(message != 'View More'){

		obj.data('html', message);

	}

	obj.html('View More');

	obj.parents('article').find('.hide_reply').show();

}

function hide_reply(obj){

	var obj = $(obj);

	obj.parent().find('.get_more_reply').data('last_id', '');

	var message = obj.parent().find('.get_more_reply').data('html');

	obj.parent().find('.get_more_reply').html(message);

	obj.parent().find('.get_more_reply').show();

	obj.parents('article').find('article[class*="reply_"]').remove();

	obj.hide();

	setTimeout(resizeIframe, 1000);

}

function getMoreReplies(obj, comment_id, limit){

	var last_id = $(obj).data('last_id')||'';

	var limit = limit||3;

	$.getJSON(dicus_url_replies+"?comment_id="+comment_id+"&last_id="+last_id+"&limit="+limit+"&callback=?",  function(data) {

	    var output = render_replies(data);

	    $(obj).parents('article').find('.comment-body > .comment-reply').prepend(output);

	    $(obj).parents('article').find('.get_more_reply').data('last_id', data.last_id);

	    if(data.done == 'true'){

	    	$(obj).parents('article').find('.get_more_reply').hide();

	    }

	    setTimeout(resizeIframe, 1000);

	});

}

function render_replies(data){

	var output = '';

	for(i in data){

		if(typeof data[i].comments != "undefined"){

			total_replies = total_replies + 1;

			top_comments_reply_view = discus_template.reply;

			display_time = format_date(data[i].comments.time);						

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Reply_No -->/g, i+1);					

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Reply_Number -->/g, data[i].comments.discuss_id);						

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Reply_SMIID -->/g, data[i].comments.poster.smiid);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Reply_Profile_Name -->/g, data[i].comments.poster.name);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Reply_Comment_Date -->/g, display_time);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Reply_IPAddress -->/g, data[i].comments.poster.ip);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- APP_ID -->/g, discus_app_id);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Entry_ID -->/g, data[i].entry_id);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Discus_ID -->/g, data[i]._id.$id);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Comment_ID -->/g, data[i].reply_id);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Reply_ID -->/g, data[i]._id.$id);

			message = data[i].comments.display_message;

			message = replace_emoticon(message);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Reply_Message -->/g, message);

			top_comments_reply_view = top_comments_reply_view.replace(/<!-- Like_No -->/g, data[i].comments.vote_score);

			

			if(inArray(data[i]._id.$id +'_'+smiid, data.user_like)){

				top_comments_reply_view = top_comments_reply_view.replace(/<!-- Like_Display -->/g, 'none');

				top_comments_reply_view = top_comments_reply_view.replace(/<!-- Unlike_Display -->/g, '');

			}else{

				top_comments_reply_view = top_comments_reply_view.replace(/<!-- Like_Display -->/g, '');

				top_comments_reply_view = top_comments_reply_view.replace(/<!-- Unlike_Display -->/g, 'none');

			}

			output = output +top_comments_reply_view;

		}

		i++;

	}			

	return output;

}