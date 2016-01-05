var clickHeatGroup='';var clickMapSite='';var clickHeatServer='';
var clickHeatLastIframe=-1;var clickHeatTime=0;var clickHeatQuota=-1;var clickHeatBrowser='';var clickHeatDocument='';var clickHeatWait=500;var clickHeatLocalWait=0;var clickHeatDebug=(window.location.href.search(/debugclickheat/) !== -1);
function showClickHeatDebug(str){if(clickHeatDebug === true){document.getElementById('clickHeatDebuggerSpan').innerHTML=str;document.getElementById('clickHeatDebuggerDiv').style.display='block';}}
function catchClickHeat(e){

try{
//showClickHeatDebug('Gathering click data...');

if(clickHeatQuota === 0){
	//showClickHeatDebug('Click not logged: quota reached');
	return true;}
if(e === undefined){e=window.event;c=e.button;element=e.srcElement;}
else{c=e.which;element=null;}
if(c === 0){//showClickHeatDebug('Click not logged: no button pressed');
return true;}
if(element !== null&&element.tagName.toLowerCase() === 'iframe'){
	if(element.sourceIndex === clickHeatLastIframe){
	//showClickHeatDebug('Click not logged: same iframe (a click on iframe opens a popup and popup is closed => iframe gets the focus again)');
	return true;}
	clickHeatLastIframe=element.sourceIndex;
}else{clickHeatLastIframe=-1;}
var x=e.clientX;var y=e.clientY;var w=clickHeatDocument.clientWidth !== undefined?clickHeatDocument.clientWidth:window.innerWidth;var h=clickHeatDocument.clientHeight !== undefined?clickHeatDocument.clientHeight:window.innerHeight;var scrollx=window.pageXOffset === undefined?clickHeatDocument.scrollLeft:window.pageXOffset;var scrolly=window.pageYOffset === undefined?clickHeatDocument.scrollTop:window.pageYOffset;
if(x>w||y>h){
	//showClickHeatDebug('Click not logged: out of document (should be a click on scrollbars)');
return true;}
clickTime=new Date();
if(clickTime.getTime()-clickHeatTime<1000){
	//showClickHeatDebug('Click not logged: at least 1 second between clicks');
return true;}
clickHeatTime=clickTime.getTime();if(clickHeatQuota>0){clickHeatQuota=clickHeatQuota-1;}
params='s='+clickMapSite+'&g='+clickHeatGroup+'&x='+(x+scrollx)+'&y='+(y+scrolly)+'&w='+w+'&b='+clickHeatBrowser+'&c='+c+'&random='+Date();
//showClickHeatDebug('Ready to send click data...');
var sent=false;
clickHeatServer='http://hits.truehits.in.th/click.php';
/*if(clickHeatServer.substring(0, 4) !== 'http'){
var xmlhttp=false;
	try{xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");}
	catch (er){
		try{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
		catch (oc){xmlhttp=null;}
	}

if(!xmlhttp&&typeof XMLHttpRequest !== undefined){xmlhttp=new XMLHttpRequest();}

if(xmlhttp){
	if(clickHeatDebug === true){
		xmlhttp.onreadystatechange=function(){
			if(xmlhttp.readyState === 4){
				if(xmlhttp.status === 200){
				//showClickHeatDebug('Click recorded at '+clickHeatServer+' with the following parameters:<br />x='+(x+scrollx)+' ('+x+'px from left+'+scrollx+'px of horizontal scrolling)<br />y='+(y+scrolly)+' ('+y+'px from top+'+scrolly+'px of vertical scrolling)<br />width='+w+'<br />browser='+clickHeatBrowser+'<br />click='+c+'<br />site='+clickMapSite+'<br />group='+clickHeatGroup+'<br /><br />Server answer: '+xmlhttp.responseText);
				}
				else if(xmlhttp.status === 404){
				//	showClickHeatDebug('click.php was not found at: '+(clickHeatServer)+'  please set clickHeatServer value');		
				}
				else{
			//		showClickHeatDebug('click.php returned a status code '+xmlhttp.status+' with the following error: '+xmlhttp.responseText);
				}
			clickHeatLocalWait=0;}
		};
	}
	xmlhttp.open('GET', clickHeatServer+'?'+params, true);xmlhttp.setRequestHeader('Connection', 'close');xmlhttp.send(null);sent=true;
}//if(xmlhttp)

}//clickHeatServer.substring
*/
if(sent === false){
//	document.getElementById('clickHeatDebuggerDivTruehits').innerHTML='<iframe src="'+clickHeatServer+'?'+params+'" width="0" height="0"></iframe>';

var _i=new Image();
_i.src=clickHeatServer+'?'+params;
_i.onload=function(){ return; };

}

var now=new Date();clickHeatLocalWait=now.getTime()+clickHeatWait;
while (clickHeatLocalWait>now.getTime()){now=new Date();}

}//try
catch(err){showClickHeatDebug('An error occurred while processing click (Javascript error): '+err.message);}
return true;
}//function

function initClickMap(){
	document.write('<div id="clickHeatDebuggerDivTruehits" style="display:none;position:absolute;top:10px;left:10px;"></div>');
if(document.addEventListener){document.addEventListener('mousedown', catchClickHeat, false);}
else if(document.attachEvent){document.attachEvent('onmousedown', catchClickHeat);}
/*iFrames=document.getElementsByTagName('iframe');
for (i=0;i<iFrames.length;i++){
	if(document.addEventListener){iFrames[i].addEventListener('focus', catchClickHeat, false);}
	else if(document.attachEvent){iFrames[i].attachEvent('onfocus', catchClickHeat);}
}*/
clickHeatDocument=(document.documentElement !== undefined&&document.documentElement.clientHeight !== 0)?document.documentElement:document.body;
var b=navigator.userAgent !== undefined?navigator.userAgent.toLowerCase().replace(/-/g, ''):'';clickHeatBrowser=b.replace(/iceweasel/, 'firefox').replace(/^.*(firefox|kmeleon|safari|msie|opera).*$/, '$1');if(b === clickHeatBrowser||clickHeatBrowser === ''){clickHeatBrowser='unknown';}
}
initClickMap();
