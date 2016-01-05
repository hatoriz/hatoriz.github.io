

var s = skrollr.init({
    easing: {
    	WTF: Math.random,
        inverted: function(p) {
        	return 1 - p;
        }
    }
});

$('.fb-btn').FBbtn();
$('.tw-btn').Twitbtn();
$('.gp-btn').Gplusbtn();

$(document).bind("mobileinit", function(){
	$.mobile.pushStateEnabled = true;
});

var menuStatus;
var menuslide;
var loginStatus;
var loginslide;
var loginnow;
var loginnows;
$(function(){			
			// Show menu
			$("a.topnav").click(function(){
				if(menuStatus != true){	
				menuslide = true;			
				$(".topupmenu").animate({
					height: "160px",
				  }, 300, function(){menuStatus = true});
				  return false;
				  } else {
					  menuslide = true;
					$(".topupmenu").animate({
					height: "0px",
				  }, 300, function(){menuStatus = false});
					return false;
				  }
			});
			
			// Show login
			$("a.btnlogin").click(function(){
				if(loginStatus != true){	
				loginslide = true;			
				$(".loginbox").animate({
					height: "220px",
				  }, 300, function(){loginStatus = true});
				  return false;
				  } else {
					  loginslide = true;
					$(".loginbox").animate({
					height: "0px",
				  }, 300, function(){loginStatus = false});
					return false;
				  }
			});
			
			// Show loginnow
			$("a.btnloginnow").click(function(){
				if(loginnow != true){	
				loginnows = true;			
				$(".loginnow").animate({
					height: "160px",
				  }, 300, function(){loginnow = true});
				  return false;
				  } else {
					  loginnows = true;
					$(".loginnow").animate({
					height: "0px",
				  }, 300, function(){loginnow = false});
					return false;
				  }
			});
});