// Controll Ajax Queue
//var ajaxSending = false;
//$.ajaxSetup({
//	beforeSend: function(){
//		ajaxSending	=	true;
//	},
//	complete: function(){
//		// Handle the complete event
//		ajaxSending	=	false;
//	}
//});
// End controll Ajax
$(document).ready(function(){
	
	// คลิกปุ่ม "ลบรูป" จากการ upload ในหน้าต่าง tab แรก	
	// when user has selected a file already.
	$('#image_cancel').confirm_lightbox({
		width:400,
		success_callback : function(ele) {
			$.ajax({
				type: "POST",
				dataType:'json',
				url : '/image_gallery/del_pic_temp',
				data: "o=" + $.image_gallery.varUpload.path_o + "&m=" + $.image_gallery.varUpload.path_m,
				success : function(result) {
					if(result.error == true)
					{
						$.errorNotice.dialog(result.error_message);
						return false;
					}					
					$('#' + $.image_gallery.defaults.id_el_lb).html(result.form_upload);
					// when user has selected a file already.
					$('#img_input_file').on('change',$.image_gallery.ajaxFormUpload);

					return false;
				}
			}) // End ajax
			return false;
		}
	});
	

});

/*
 *-----------------------------------------------------------------
 * Begin : Plugin Image gallery
 *-----------------------------------------------------------------
 * @author : Tong
 * @version : 1.1
 * @file-request :
 *    - lastest_jquery_ui.js
 *    - lastest_jquery_ui.css
 *    - style.css
 *    - lastest_jquery.js
 *    - current_position_jquery.js //สำหรับ detect ตำแหน่งใน textarea
 *    - jquery.iframe-post-form.js // สำหรับ upload ajax

 * @return : void
 * @description : this plugin use for create a image gallery
 * @param {String} : title_lb ( title ของ ligthbox ใหญ่ )
 * @param {String} : label_btn ( label ของปุ่ม แทรกรูปลงกระทู้ )
 * @param {function} : callbackAfterUploaded
 *   ( ถ้ามีการใส่ฟังก์ชั่นมาด้วยจะทำการคืนค่า url ของรูปภาพกลับไปให้ยังฟังก์ชั่น ถ้ากำหนดฟังก์ชั่นนี้ตัวแปร inputUploaded นั้นจะไม่ทำงาน)
 * @param {element selector} : inputUploaded ( ถ้าไม่มีการกำหนดจะลงค่าไปยัง $('#detail') )
 * @warning :  *** this plugin CANNOT changing method ***
 * @example : การใช้นั้นจำเป็นต้องเรียกหลังจากตัว element นั้นถูกคลิกแล้วเช่น
 *<code>
 * $('#element').live('click',function(){
 *		$(this).image_gallery({
 *			'callbackAfterUploaded' : function(img_url) {(
 *			    console.log('tong');
 *			)}
 *		});
 *
 * });
 *</code>
 */
(function($){
	
	$.image_gallery = {};
	
	$.image_gallery.init	=	function()
	{		
		
		$.image_gallery.varWarehouse.click_edit_onetime = true;
		var div_image_gallery = '<div id="image_lb_process" class="lightbox-hide"></div>';
		$('div:last').append(div_image_gallery);
		var windowHeight = parseInt(windowSize() - 20);
		
		// call dialog
		$.ajax({
			type: "POST",
			dataType:'html json',
			url: $.image_gallery.defaults.lb_frame_url,
			async: false,
			success: function(result){
				if(result.error == true)
				{
					$.errorNotice.dialog(result.error_message);
					return false;
				}
				//console.log('ajax send success');
				// Call lightbox 3 tabs
				$('#' + $.image_gallery.defaults.id_el_lb)
				.dialog({
					width: 720,
					height: windowHeight,
					title: $.image_gallery.defaults.title_lb,
					modal: true,
					resizable: false,
					draggable: false,
					close: function()
					{								
						$('#' + $.image_gallery.defaults.id_el_lb).dialog('destroy');
						$('#' + $.image_gallery.defaults.id_el_lb).remove();
					}
				})
				.html(result.form_upload);
				
				// when user has selected a file already.
				$('#img_input_file').on('change',$.image_gallery.ajaxFormUpload);
				// detect ถ้า user กดเลือก tab แรก
				$('#' + $.image_gallery.defaults.id_el_lb).on('click','#img_upload,#img_url,#img_warehouse',loadpage);
				return false;
			} // End Success
		}); // Edn ajax()

		return false;
	}

	
	$.image_gallery.ajaxFormUpload = function()
	{	
		//console.log('aaaa');
		$('#upload form').iframePostForm({
			json : true,
			post : function ()
			{
				//console.log('bbbb');
				$('#loading').html('<span class="loading-txt small-txt">กำลังอัปโหลดไฟล์รูปภาพ โปรดรอสักครู่</span>');
			},
			complete : function (response)
			{
				//console.log(response);
				// Notification Error
				if (!response.success)
				{
					var txt_error = '';
					if(response.error == 'type_error')
					{
						txt_error = 'กรุณาเลือกไฟล์นามสกุล gif, jpg หรือ png';
					}
					else if(response.error == 'size_error')
					{
						txt_error = 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 700K';
					}
					else if(response.error == 'size_type_error')
					{
						txt_error = 'กรุณาเลือกไฟล์นามสกุล gif, jpg หรือ png และมีขนาดไม่เกิน 700K';
					}
					$('#loading').html('<span class="error-txt small-txt">'+txt_error+'</span>');
					return false;
				}
				else
				{
					// Success !!
					$('#loading').html('');
					var url = response.upload.url_s;
					var filename	=	response.upload.only_name;
					$.ajax({
						type: "POST",
						dataType: 'json',
						url: "/image_gallery/lb_image",
						data: "url="+url,
						async: false,
						success: function(result){
							if(result.error == true)
							{
								$.errorNotice.dialog(result.error_message);
								return false;
							}	
							$('#image_load').html(result.form_upload);
							$('#image_confirm').find('em').html('ใส่รูปภาพลงในข้อความ');
							// edit by tong
							$('#input_image_url').val(filename).select();
							var varObj	=	{
								img_showing_path	:	response.upload.url_o,
								path_o	:	response.upload.del_o,
								path_m	:	response.upload.del_s,
								name_img_o	:	response.upload.name_o,
								name_img_m	:	response.upload.name_s
							}
							$.extend($.image_gallery.varUpload,varObj);							
							$('#image_confirm').one('click',imgUpload_insert_upload_image);
						
							return false;
						}
					});
				}
				return false;
			} // End : complete
		});
		$('#forum_form').submit();
		return false;
	}
	
	$.image_gallery.image_upload_page = function() 
	{		
		// แสดงรายละเอียดของเมนูแทบแรก image upload
		if(ajaxSending == false)
		{
			$.ajax({
				type: "POST",
				dataType:'json',
				url: '/image_gallery/lb_image',
				async: false,
				success: function(result){
					if(result.error == true)
					{
						$.errorNotice.dialog(result.error_message);
						return false;
					}					
					$('#' + $.image_gallery.defaults.id_el_lb).html(result.form_upload);
					$('#img_input_file').on('change',$.image_gallery.ajaxFormUpload);
				}
			});
		}
	}
	
	$.image_gallery.image_url_page = function()
	{
		// แสดงรายละเอียดของเมนูแทบที่สอง url
		if(ajaxSending == false)
		{
			$.ajax({
				type: "POST",
				url: "/image_gallery/lb_image_url",
				data: "",
				success: function(result){
					$('#image_load').html(result);
					$('#image_confirm_url').find('em').html('ใส่รูปภาพลงในข้อความ');
					$('#input_image').focus();
					$('#input_image').on('keyup', imgUrl_check_url);
					$('#image_cancel_url').on('click keydown',imgUrl_cancel_url);
					$('#image_confirm_url').on('click',imgUrl_put_url); // End image_confirm_url live.click
					return false;
				}
			});
		} // End ajaxSending == false
		
		
	}
	
	$.image_gallery.image_warehouse_page = function()
	{
		// แสดงรายละเอียดของเมนูแทบที่สาม image warehouse
		if(ajaxSending == false)
		{
			var d = new Date();
			$.ajax({
				type: "POST",
				dataType: 'json',
				url: "/image_gallery/lb_image_warehouse?t=" + d.getTime(),
				success: function(result)
				{
					if(result.error == true)
					{
						$.errorNotice.dialog(result.error_message);
						return false;
					}		
					$('#image_load').html(result.form_werehouse);
					/*
					 * Get image data thumbnail
					 */
					$.getJSON('/image_gallery/get_photos/1', function(data)
					{
						if(data != 'null')
						{
							var item	=	[];
							var amount_page;
							totalPages	=	data.total_pages;
							current_page	=	1;

							if(totalPages >= 5)
							{
								amount_page = 5;
							}
							else
							{
								amount_page = totalPages;
							}
							if(totalPages > 1)
							{
								$('ul.media-library-pagination.small-txt li:last').show();
							}


							var $i;
							var first_round = true;
							for($i= 1; $i <= amount_page; $i++)
							{
								if(first_round)
								{
									$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertBefore('ul.media-library-pagination.small-txt li:last');
									first_round = false;
								}
								else
								{
									$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertBefore('ul.media-library-pagination.small-txt li:last');
								}
							}

//							$.each(data.images,function(key,val)
//							{
//								var div = '<div class="media-library-thumbnail-item" id="picture-' + val._id + '">'
//								+ '<div class="media-library-thumbnail">'
//								+ '<div class="media-library-thumbnail-edit-bg">'
//								+ '</div>'
//								+ '<div class="media-library-thumbnail-edit-wrapper">'
//								+ '<div class="media-library-thumbnail-edit">'
//								+ '<a class="edit-title-image-button" href="javascript:void(0);">'
//								+ 'แก้ไขชื่อ'
//								+ '</a>'
//								+ ' | <a href="javascript:void(0);" class="error-txt">ลบ</a>'
//								+ '</div>'
//								+ '<div class="media-library-thumbnail-add">'
//								+ '<a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);">'
//								+ '<span><em>แทรกรูปลงกระทู้</em></span>'
//								+ '</a>'
//								+ '</div>'
//								+ '</div>'
//								+ '<img src="' + val.url_pic + '" width="200"/>'
//								+ '</div>'
//								+ '<p class="media-library-thumbnail-title">' + val.title + '</p>'
//								+ '</div>';
//								$(div).appendTo('#image_load');
//								$('#picture-' + val._id).data("id" , val._id );
////								$.data($('#picture-' + val._id),'id' , val._id);
//								
//							}); //End each
							insert_images(data.images);
							//call all function event with warehouse
							warehouse_bundle()
							
						} // End data != null
					}); // End getJSON
				} // End success
			}); // End ajax
		} // End ajaxSending == false
	}
		
	/************************************* Private Function *******************************/
	function loadpage()
	{		
		if(ajaxSending == false)
		{
			var id_current	=	toggleCurrent($(this));			
			if(id_current == 'img_upload')
			{
				$.image_gallery.image_upload_page();
			}
			else if(id_current == 'img_url')
			{
				$.image_gallery.image_url_page();
			}
			else if(id_current == 'img_warehouse')
			{
				$.image_gallery.image_warehouse_page();
			}
		}		
	}
	
	
	function toggleCurrent(ele_selector)
	{
		$('#img_url').removeClass('current');
		$('#img_warehouse').removeClass('current');
		$('#img_upload').removeClass('current');
		ele_selector.addClass('current');
		return ele_selector.attr('id');
	}
	/*
	 *----------------------------------------------------------------------------
	 *|					Begin: Controll File from user's computer				 |
	 *----------------------------------------------------------------------------
	 */

	function imgUpload_submit_upload () 
	{
		var varUpload	=	$.image_gallery.varUpload;
		var title_image	=	$('#input_image_url').val();
		//console.log('submit_upload');

		//send ajax
		$.ajax({
			url : '/image_gallery/insert_image',
			type : "POST",
			dataType:'json',
			data : "o=" + varUpload.path_o 
				+ "&m=" + varUpload.path_m 
				+ "&title=" + title_image 
				+ "&name_img_o=" + varUpload.name_img_o 
				+ "&name_img_m=" + varUpload.name_img_m,
			success : function(result){
				if(result.error == true)
				{
					$.errorNotice.dialog(result.error_message);
					return false;
				}		
				if(typeof($.image_gallery.defaults.callbackAfterUploaded) !== 'function')
				{
					//console.log('b');
					var fill_input = function(link_url)
					{	
						$($.image_gallery.defaults.inputUploaded).replaceSelectedText('[img]' + link_url + '[/img]');						
					}
					fill_input(result.path);
				}
				else
				{
					//console.log('a');
					$.image_gallery.defaults.callbackAfterUploaded(result.path);
				}
				set_var_default();
				$('#' + $.image_gallery.defaults.id_el_lb).dialog('destory');
				$('#' + $.image_gallery.defaults.id_el_lb).remove()
				return false;
			}
			,error : function(jqXHR,exception){
					$.errorNotice.dialog('มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้ง',{
						title : 'แจ้งเตือน',
						btn_close:'ดำเนินการต่อ'
					});
			}
		})
		// End ajax
		return false;
	} // End submit_upload

	// ปุ่มแทรกลงกระทู้ ของ image upload
	function imgUpload_insert_upload_image(e)
	{
		e.preventDefault();
		e.stopPropagation();

		imgUpload_submit_upload();
		$('#' + $.image_gallery.defaults.id_el_lb).dialog('destroy');
		$('#' + $.image_gallery.defaults.id_el_lb).remove();
		return false;
	}
	/*
	 *----------------------------------------------------------------------------
	 *|					End: Controll File from user's computer					 |
	 *----------------------------------------------------------------------------
	 */
	
	
	/*
	 *----------------------------------------------------------------------------
	 *|					Controll URL 3rd API									 |
	 *----------------------------------------------------------------------------
	 */
	function imgUrl_check_url(e)
	{
		if(e.which == 13)
		{
			// for push enter button
			$('#image_confirm_url').trigger('click');
			return false;
		}
		else
		{
			$('#error_image').html('');
			if($('#input_image').val() == '')
			{
				$('#error_image').html('<span class="error-txt small-txt">*กรุณาใส่ลิงก์รูปภาพที่ต้องการ</span>');
				$('#error_image').val('false');
			}
			else
			{
				if(!$('#input_image').val().match(/flickr\.com.|multiply\.com.|ptcdn\.info./))
				{
					$('#error_image').html('<span class="error-txt small-txt">*ไม่สามารถดึงรูปภาพได้ กรุณาเลือกรูปภาพจากเว็บที่รองรับ</span>');
					$('#error_image').val('false');
				}
				else
				{
					$('#error_image').val('true');
				//$('#error_image').html('<span class="success-txt small-txt">*ลิงก์ถูกต้อง</span>');
				}
			}
		}
	}
	

	
	function imgUrl_put_url()
	{
		var tag = '';
		var tag_without_img = '';
		if($('#error_image').val() == 'false')
		{
			$('#input_image').focus();
		}
		else
		{			
			if($('#input_image').val().match(/flickr\.com.|multiply\.com.|ptcdn\.info./))
			{
				tag_without_img = $('#input_image').val();
				tag = '[img]'+$('#input_image').val()+'[/img]\n';
			}
			else
			{
				$('#input_image').focus();
				$('#error_image').html('<span class="error-txt small-txt">*ไม่สามารถดึงรูปภาพได้ กรุณาเลือกรูปภาพจากเว็บที่รองรับ</span>');
			}
		}
		//แทรก tag in input name=detail
		if(tag != '')
		{
			if(typeof($.image_gallery.defaults.callbackAfterUploaded) === 'function')
			{
				$.image_gallery.defaults.callbackAfterUploaded(tag_without_img);
			}
			else
			{
				var fill_input_url = function(link_url)
				{
					$($.image_gallery.defaults.inputUploaded).surroundSelectedText(link_url, '', true);
				}
				fill_input_url(tag);
			}
			$('#image_lb_process').dialog('destroy');
			$('#image_lb_process').remove();
		}
		else
		{
			$('#input_image').focus();
		}
		set_var_default();
	}
	function imgUrl_cancel_url(e)
	{
		if(e.shiftKey && e.keyCode == 9)
		{
			return true;
		}
		else if (e.keyCode == 9)
		{
			$('#input_image').select();
			return false;
		}
		else if (e.keyCode == 16)
		{
			return false;
		}
		$('#image_lb_process').dialog('destroy');
		$('#image_lb_process').remove();
	}
	/*
	 *----------------------------------------------------------------------------
	 *|					End: Controll URL 3rd API								 |
	 *----------------------------------------------------------------------------
	 */
	
	/*
	 * ------------------------------------------------------------------------------
	 *					Controll werehouse image
	 * ------------------------------------------------------------------------------
	 */
	
	function warehouse_bundle()
	{
		$('.insert_link_image').on('click',warehouse_put_image);
		$('.media-library-pagination a[class!=next][class!=prev]').on('click',warehouse_number_pagination_click);
		$('.prev,.next').on('click',warehouse_prev_next_pagination);		
		$('.edit-title-image-button').on('click',warehouse_edit_title_clicked);	
		
		/*
		 * toggle edit,del,insert
		 */
		$(".media-library-thumbnail-item").on('mouseover mouseout', function(event) {
			if (event.type == 'mouseover') {
				$(this).addClass("hover");
			} else {
				$(this).removeClass("hover");
			}
		});
		$('.media-library-thumbnail-edit-wrapper').on('click',function(){
			$('.media-library-thumbnail-edit-wrapper').removeClass("image_gallery_active");
			$(this).addClass("image_gallery_active");
		});
		
	}
	
	// ปุ่มแทรกลงกระทู้สำหรับเวลาเลือกใน werehouse
	function warehouse_put_image()
	{
		var src = $(this).parents('.media-library-thumbnail-edit-wrapper').next().attr('src');
		var url_iamge = src.replace(/s\.(jpg|jpeg|gif|png)$/i,"o.$1");
		if(typeof($.image_gallery.defaults.callbackAfterUploaded) === 'function')
		{
			$.image_gallery.defaults.callbackAfterUploaded(url_iamge);
		}
		else
		{
			var get_picture_url = function(link_url)
			{				
				$($.image_gallery.defaults.inputUploaded).replaceSelectedText('[img]' + link_url + '[/img]');
			}
			get_picture_url(url_iamge);
		}
		set_var_default();
		$('#image_lb_process').dialog('destroy');
		$('#image_lb_process').remove();
	}
	
	
	
	function warehouse_del_image_gallery() 
	{		
		if(ajaxSending == false)
		{
			var id  = $('.image_gallery_active').parents('.media-library-thumbnail-item').data('id');
			var src	= $('.image_gallery_active').next().attr('src');
			$.ajax({
				url: "/image_gallery/del_pic",
				type: "POST",
				dataType:'json',
				data : "id=" + id + "&src=" + src ,
				success: function(result){
					if(result.error == true)
					{
						$.errorNotice.dialog(result.error_message);
						return false;
					}		
					// Check ajax status sending or not ?
					ajaxSending = false;
					// Delete that image in showing window
					$('.image_gallery_active').parents('.media-library-thumbnail-item').remove();
						var new_total_photos	=	parseInt($('#total_photos').text()) - 1;
						$('#total_photos').html(new_total_photos);
					// ถ้าจำนวนทั้งหมดถูกลบในหน้าที่แสดง 9 รูป					
					if($('.media-library-thumbnail-item').length == 0)
					{						
						var chk_next	=	 $('.media-library-pagination a.current').parent().next().children('[class!=next]').length;
						var chk_prev	=	 $('.media-library-pagination a.current').parent().prev().children('[class!=prev]').length;
						// ถ้ามีเป็นหน้าตรงกลางที่ยังมีปุ่น next , prev อยู่
						if(chk_next == 1 && chk_prev == 1)
						{						
							$('.media-library-pagination a[class=current]').removeClass('current').trigger('click');
						}
						else if(current_page == 1)
						{						
							// ถ้าเป็นหน้าแรก
							$('.media-library-pagination a[class=current]').removeClass('current').trigger('click');
						}
						else
						{							
							// ถ้าเป็นหน้าสุดท้าย
							$('.media-library-pagination a[class=prev]').trigger('click');
						}
					}
				}
			});
		} // end ajaxSending
	};
	
	/*---------------------------------------------------------------
	 *|				 when user click prev,next button				|
	 *---------------------------------------------------------------
	 */
	
	
	function warehouse_prev_next_pagination()
	{
		if($(this).attr('class') == 'next')
		{
			if(ajaxSending == false)
			{
				// reset global value
				$.image_gallery.varWarehouse.old_data = new Array();
				click_edit_onetime	= $.image_gallery.varWarehouse.click_edit_onetime;
				// end reset global value
				var page_num	=	$('.current').text();
				var next_page	=	parseInt(current_page) + 1;
				var next_el		=	$('.current').parent().next().children();
				
				$.image_gallery.varWarehouse.next_page_group	=	next_page + 4;
				if($.image_gallery.varWarehouse.next_page_group >= totalPages)
				{
					$.image_gallery.varWarehouse.next_page_group = totalPages;
				}
				// กด next ถึงตัวสุดท้ายแล้วเราจะทำการลบตัวเดิม page เดิมออกใส่ชุดใหม่เข้าไป
				if(current_page%$.image_gallery.varWarehouse.limit == 0)
				{
					$.image_gallery.varWarehouse.first_number_current_page_of_group	=	parseInt(current_page) + 1;

					// ลบของเดิมก่อน
					$('.media-library-pagination a[class!=next][class!=prev]').parent().remove();
					var $i;
					var first_round = true;
					for($i= parseInt(current_page) + 1; $i <= $.image_gallery.varWarehouse.next_page_group; $i++)
					{
						if(first_round)
						{
							$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertBefore('ul.media-library-pagination.small-txt li:last');
							first_round = false;
						}
						else
						{
							$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertBefore('ul.media-library-pagination.small-txt li:last');
						}
					}

					next_el	=	$('.current');
				}
				$('.media-library-pagination a').removeClass('current');
				next_el.addClass('current');



				// get images data and show
				$.getJSON('/image_gallery/get_photos/' + next_page, function(data)
				{
					var item	=	[];
					totalPages	=	data.total_pages;
					current_page	=	next_page;
					if(totalPages >= 1)
					{
						if(next_page != 1)
						{
							$('ul.media-library-pagination.small-txt li:first').show();
						}
						else
						{
							$('ul.media-library-pagination.small-txt li:first').hide();
						}

						if(next_page == totalPages)
						{
							$('ul.media-library-pagination.small-txt li:last').hide();
						}
						else
						{
							$('ul.media-library-pagination.small-txt li:last').show();
						}
					}
					$('#image_load .media-library-thumbnail-item').remove();
					insert_images(data.images);
//					$.each(data.images,function(key,val){
//						var div = '<div class="media-library-thumbnail-item"><div class="media-library-thumbnail"><div class="media-library-thumbnail-edit-bg"></div><div class="media-library-thumbnail-edit-wrapper"><div class="media-library-thumbnail-edit"><a class="edit-title-image-button" href="javascript:void(0);">แก้ไขชื่อ</a> | <a href="javascript:void(0);" class="error-txt">ลบ</a></div><div class="media-library-thumbnail-add"><a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);"><span><em>แทรกรูปลงกระทู้</em></span></a></div></div><img src="' + val.url_pic + '" width="200"/></div><p class="media-library-thumbnail-title">' + val.title + '</p></div>';
//						$('#image_load').append(div);
//					});
					//call all function event with warehouse
					warehouse_bundle();
				});
			}
		}
		else
		{
			// Prev
			if(ajaxSending == false && current_page != 1)
			{
				// reset global value
				$.image_gallery.varWarehouse.old_data = new Array();
				click_edit_onetime	= true;
				// end reset global value
				var page_num	=	$('.current').text();
				var prev_page	=	parseInt(current_page) - 1;
				var prev_el		=	$('.media-library-pagination .current').parent().prev().children();
				$.image_gallery.varWarehouse.prev_page_group	=	prev_page - 4;

				// กด prev ถึงตัวสุดท้ายแล้วเราจะทำการลบตัวเดิม page เดิมออกใส่ชุดใหม่เข้าไป
				if(current_page%$.image_gallery.varWarehouse.limit == 1)
				{
					$.image_gallery.varWarehouse.first_number_current_page_of_group	=	$.image_gallery.varWarehouse.prev_page_group;
					// ลบของเดิมก่อน
					$('.media-library-pagination a[class!=next][class!=prev]').parent().remove();
					var $i;
					var first_round = true;
					for($i= parseInt(current_page) - 1; $i >= $.image_gallery.varWarehouse.prev_page_group; $i--)
					{
						if(first_round)
						{
							$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
							first_round = false;
						}
						else
						{
							$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
						}

					}
					prev_el	=	$('.media-library-pagination .current');
				}
				$('.media-library-pagination a').removeClass('current');
				prev_el.addClass('current');



				$.getJSON('/image_gallery/get_photos/' + prev_page, function(data)
				{
					var item	=	[];
					totalPages	=	data.total_pages;
					current_page	=	prev_page;

					//alert('current_page=' + current_page + ' totalPages=' + totalPages);
					/*
					 *  เงื่อนไขนี้ใช้สำหรับเวลาลบทุก record ภาพแล้วเป็นหน้าสุดท้ายตัวแรกซึ่งต้องขึ้นแถวใหม่เช่นหน้า 6 ต้องกลับไปหน้า 1 - 5
					 *  จะทำการลบหน้าที่ไม่มีอยู่จริงออก
					 */

					if(current_page == totalPages)
					{
						// กด ตัวเลขหน้าเพจ แล้วต้องเช็คว่าจำนวนหน้าเพจเปลี่ยนจริงๆหรือเปล่า

						// ลบของเดิมก่อน
						$('.media-library-pagination a[class!=next][class!=prev]').parent().remove();
						var $i;
						var first_round = true;
						var first_page_section	=	$.image_gallery.varWarehouse.first_number_current_page_of_group;

						for($i= parseInt(current_page); $i >= parseInt(first_page_section); $i--)
						{
							if(first_round)
							{
								$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
								first_round = false;
							}
							else
							{
								$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
							}
						}
					}
					if(totalPages >= 1)
					{
						if(prev_page != 1)
						{
							$('ul.media-library-pagination.small-txt li:first').show();
						}
						else
						{
							$('ul.media-library-pagination.small-txt li:first').hide();
						}

						if(prev_page == totalPages)
						{
							$('ul.media-library-pagination.small-txt li:last').hide();
						}
						else
						{
							$('ul.media-library-pagination.small-txt li:last').show();
						}


					}
					$('#image_load .media-library-thumbnail-item').remove();
					insert_images(data.images);
//					$.each(data.images,function(key,val){
//						var div = '<div class="media-library-thumbnail-item"><div class="media-library-thumbnail"><div class="media-library-thumbnail-edit-bg"></div><div class="media-library-thumbnail-edit-wrapper"><div class="media-library-thumbnail-edit"><a class="edit-title-image-button" href="javascript:void(0);">แก้ไขชื่อ</a> | <a href="javascript:void(0);" class="error-txt">ลบ</a></div><div class="media-library-thumbnail-add"><a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);"><span><em>แทรกรูปลงกระทู้</em></span></a></div></div><img src="' + val.url_pic + '" width="200"/></div><p class="media-library-thumbnail-title">' + val.title + '</p></div>';
//						$('#image_load').append(div);
//					});
					//call all function event with warehouse
					warehouse_bundle();
				});
			}
		}
	}
	
	/*
	 * detect click on number page
	 */
	
	function warehouse_number_pagination_click(e)
	{
		e.preventDefault();
		e.stopPropagation();
		
		if(ajaxSending == false)
		{
			var el_class = $(this).attr('class');
			var page_num	=	$(this).text();
			var el		=	$(this);
			// reset global value		
			$.image_gallery.varWarehouse.old_data = new Array();
			$.image_gallery.varWarehouse.click_edit_onetime	= true;
			// end reset global value
			if(el_class != 'current')
			{
				$('.media-library-pagination a').removeClass('current');
				el.addClass('current');
				$.getJSON('/image_gallery/get_photos/' + page_num, function(data)
				{
					if(data != "null")
					{
						var item	=	[];
						totalPages	=	data.total_pages;
						current_page	=	page_num;
						if(current_page >= totalPages)
						{
							// กด ตัวเลขหน้าเพจ แล้วต้องเช็คว่าจำนวนหน้าเพจเปลี่ยนจริงๆหรือเปล่า

							// ลบของเดิมก่อน
							$('.media-library-pagination a[class!=next][class!=prev]').parent().remove();
							var $i;
							var first_round = true;

							for($i= parseInt(current_page); $i >= $.image_gallery.varWarehouse.first_number_current_page_of_group; $i--)
							{
								if(first_round)
								{
									$('<li><a href="javascript:void(0);" class="current">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
									first_round = false;
								}
								else
								{
									$('<li><a href="javascript:void(0);">' + $i + '</a></li>').insertAfter('ul.media-library-pagination.small-txt li:first');
								}
							}
						}
						if(totalPages >= 1)
						{
							if(page_num != 1)
							{
								$('ul.media-library-pagination.small-txt li:first').show();
							}
							else
							{
								$('ul.media-library-pagination.small-txt li:first').hide();
							}

							if(page_num == totalPages)
							{
								$('ul.media-library-pagination.small-txt li:last').hide();
							}
							else
							{
								$('ul.media-library-pagination.small-txt li:last').show();
							}
						}
						$('#image_load .media-library-thumbnail-item').remove();
						insert_images(data.images);
//						$.each(data.images,function(key,val){
//							var div = '<div class="media-library-thumbnail-item"><div class="media-library-thumbnail"><div class="media-library-thumbnail-edit-bg"></div><div class="media-library-thumbnail-edit-wrapper"><div class="media-library-thumbnail-edit"><a class="edit-title-image-button" href="javascript:void(0);">แก้ไขชื่อ</a> | <a href="javascript:void(0);" class="error-txt">ลบ</a></div><div class="media-library-thumbnail-add"><a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);"><span><em>แทรกรูปลงกระทู้</em></span></a></div></div><img src="' + val.url_pic + '" width="200"/></div><p class="media-library-thumbnail-title">' + val.title + '</p></div>';
//							$('#image_load').append(div);
//							$('#picture-' + val._id).data("id" , val._id );
//						});			
						//call all function event with warehouse
						warehouse_bundle();
					}
				});
			}
		}
	}
	
	function insert_images(data_images)
	{
		$.each(data_images,function(key,val){
			var div = '<div class="media-library-thumbnail-item" id="picture-' + val._id + '">'
			+ '<div class="media-library-thumbnail">'
			+ '<div class="media-library-thumbnail-edit-bg">'
			+ '</div>'
			+ '<div class="media-library-thumbnail-edit-wrapper">'
			+ '<div class="media-library-thumbnail-edit">'
			+ '<a class="edit-title-image-button" href="javascript:void(0);">'
			+ 'แก้ไขชื่อ'
			+ '</a>'
			+ ' | <a href="javascript:void(0);" class="error-txt">ลบ</a>'
			+ '</div>'
			+ '<div class="media-library-thumbnail-add">'
			+ '<a tabindex="3" class="button letdo-butt insert_link_image"  href="javascript:void(0);">'
			+ '<span><em>แทรกรูปลงกระทู้</em></span>'
			+ '</a>'
			+ '</div>'
			+ '</div>'
			+ '<img src="' + val.url_pic + '" width="200"/>'
			+ '</div>'
			+ '<p class="media-library-thumbnail-title">' + val.title + '</p>'
			+ '</div>';
			$(div).appendTo('#image_load');
			$('#picture-' + val._id).data("id" , val._id );
		});
	}

	// ปุ่มแก้ไข	
	function warehouse_edit_title_clicked()
	{
		var p_tag	=	$(this).parents('.media-library-thumbnail').next();
		var all_p_tag	=	$('.edit-title-image-button').parents('.media-library-thumbnail').next();

		if(p_tag.has('input').length == 0)
		{
			$.image_gallery.varWarehouse.data_for_input	=	p_tag.text();
		}

		if($.image_gallery.varWarehouse.click_edit_onetime == true)
		{
			$.each($('.media-library-thumbnail-title'),function(index,el){
				$.image_gallery.varWarehouse.old_data.push($(el).text());
			});

			$.image_gallery.varWarehouse.old_data.reverse()
			$.image_gallery.varWarehouse.click_edit_onetime = false;
			$.image_gallery.varWarehouse.data_for_input	=	p_tag.text();
		}

		// ทำให้ทุก p tag คืนค่าเดิมก่อนที่จะทำการกด edit btn
		$.each(all_p_tag,function(index,ele)
		{
			$(ele).html($.image_gallery.varWarehouse.old_data[index]);
		});
		p_tag.html('<input type="text" class="text with-button" value="'+$.image_gallery.varWarehouse.data_for_input+'"/><a tabindex="3" class="button letdo-butt small-button save-edit-title-image" href="javascript:void(0);"><span><em>บันทึก</em></span></a>');
		//hilight ข้อความให้
		p_tag.find('input').select();
		// ใน input box ถ้า user กด enter จะทำการคลิกปุ่ม บันทึกให้ทันที
		$('.media-library-thumbnail-title').find('input:focus').on('keydown',function(e){			
			var input	=	$(this);
			if(e.which == 13)
			{
				input.next().trigger('click');
			}
		});

		$('.save-edit-title-image').on('click',warehouse_save_title);
	}



	// ปุ่ม บันทึก	
	function warehouse_save_title()
	{	
		//$(this).parent().html('ไปเที่ยวเชียงใหม่มาเมื่อวาน');
		// เอาค่าที่แก้ไขใหม่ส่ง ajax
		var input_val	=	$(this).prev().val();
//		var url_path	=	$(this).parents('.media-library-thumbnail-title').prev().find('img').attr('src');
		var input		=	$(this).parent();
		var id			=	$(this).parents('.media-library-thumbnail-item').data('id');
		$.ajax({
			url: "/image_gallery/title_image_update",
			type: "POST",
			dataType:'json',
			data : "title=" + input_val + "&id=" + id,
			success: function(result){
				if(result.error == true)
				{
					$.errorNotice.dialog(result.error_message);
					return false;
				}		
				input.html(result.new_title);
				$.image_gallery.varWarehouse.click_edit_onetime = true;
				$.image_gallery.varWarehouse.old_data = new Array();
				
			},
			error : function (jqXHR,setting,thrownError) {
				$.errorNotice.dialog('เกิดข้อผิดพลาดลองส่งใหม่อีกครั้ง');
				return false;
			}
		});		
	}

	// ปุ่มลบใน image
	$('.media-library-thumbnail-edit-wrapper').find('.error-txt').confirm_lightbox({
		width : 300,
		bubble_event : true,
		success_callback : warehouse_del_image_gallery
		
	})

	/*
	 * ------------------------------------------------------------------------------
	 *					End: Controll werehouse image
	 * ------------------------------------------------------------------------------
	 */
	function windowSize() {
		var myWidth = 0, myHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}
		return myHeight;
	}
	
	function set_var_default()
	{
//		console.log('set_var_default');
		$.image_gallery.defaults = {
			lb_frame_url : '/image_gallery/lb_image',
			id_el_lb : 'image_lb_process',
			title_lb : 'ใส่รูปภาพลงในข้อความ',
			callbackAfterUploaded : '',
			label_btn : 'ใส่รูปภาพลงในข้อความ',
			inputUploaded : ''
		};
		$.image_gallery.varUpload = {
			img_showing_path : '',
			name_img_m : '',
			name_img_o : '',
			path_m : '',
			path_o : ''		
		}
		
		$.image_gallery.varWarehouse = {
			click_edit_onetime : true,
			old_data : new Array(),
			data_for_input : '',
			limit : 5,
			current_page : 0,
			first_number_current_page_of_group : 1,
			next_page_group : '',
			prev_page_group : '',
			id : 0
		}
		return false;
	}
	
	
	/************************************* Defaults Param ********************************/
	$.image_gallery.defaults = {
		lb_frame_url : '/image_gallery/lb_image',
		id_el_lb : 'image_lb_process',
		title_lb : 'ใส่รูปภาพลงในข้อความ',
		callbackAfterUploaded : '',
		label_btn : 'ใส่รูปภาพลงในข้อความ',
		inputUploaded : ''
	};
	
	$.image_gallery.varUpload = {
		img_showing_path : '',
		name_img_m : '',
		name_img_o : '',
		path_m : '',
		path_o : ''		
	}
	
	$.image_gallery.varWarehouse = {
		click_edit_onetime : true,
		old_data : new Array(),
		data_for_input : '',
		limit : 5,
		current_page : 0,
		first_number_current_page_of_group : 1,
		next_page_group : '',
		prev_page_group : ''
	}
})(jQuery);



