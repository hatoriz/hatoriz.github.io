// ดึงค่า FX Rate จากไฟล์ XML

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.open("GET","http://www.scb.co.th/scb_api/xml/MjAxMjA2MTIxNjI1NTg=.xml",false); //http://www.scb.co.th/scb_api/xml/MjAxMjA2MTIxNjI1NTg=.xml
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;


fx=xmlDoc.getElementsByTagName("curcode")[0].childNodes[0].nodeValue.split('#');

date=xmlDoc.getElementsByTagName("lastupdate")[0].childNodes[0].nodeValue;
var replacedDate = date.replace('at','ณ');

var currentCode = new Array();
var sell = new Array();
var buy = new Array();
var sellBefore = new Array();
var sellAfter = new Array();
var sellFinish = new Array();
var buyBefore = new Array();
var buyAfter = new Array();
var buyFinish = new Array();

// วนลูปแบ่งตัวแปร
for (i=0;i<5;i++) {
	c = fx[i].split(',');
	currentCode.push([c[0]]);
	sell.push([c[1]]);
	buy.push([c[2]]);
}

// วนลูปแบ่งเลขทศนิยมหน้าและหลังจุดทศนิยม-SELL
for (i=0;i<5;i++) {
	var myNum = sell[i];
	var myString = myNum.toString();
	cc = myString.split(".");
	sellBefore.push([cc[0]]);
	sellAfter.push([cc[1]]);
}

// วนลูปตัดทศนิยมหลังจุดทศนิยมให้เป็น2หลัก ไม่ปัดเศษ-SELL
for (i=0;i<5;i++) {
	var myNum = sellAfter[i];
	var myString = myNum.toString();
	if (myString.length>2) {
		myString=myString.substr(0,2);
	}  else if (myString.length==1) {
		myString=myString+"0";
	}
	cc[0] = myString;
	sellFinish.push([cc[0]]);
}

// วนลูปแบ่งเลขทศนิยมหน้าและหลังจุดทศนิยม-BUY	
for (i=0;i<5;i++) {
	var myNum = buy[i];
	var myString = myNum.toString();
	cc = myString.split(".");
	buyBefore.push([cc[0]]);
	buyAfter.push([cc[1]]);
}

// วนลูปตัดทศนิยมหลังจุดทศนิยมให้เป็น2หลัก ไม่ปัดเศษ-BUY
for (i=0;i<5;i++) {
	var myNum = buyAfter[i];
	var myString = myNum.toString();
	if (myString.length>2) {
		myString=myString.substr(0,2);
	} else if (myString.length==1) {
		myString=myString+"0";
	}
	cc[0] = myString;
	buyFinish.push([cc[0]]);
	
	/*document.write(currentCode[i]);
	document.write("<br>");
	document.write(sellBefore[i]+"."+sellFinish[i]);
	document.write("<br>");
	document.write(buyBefore[i]+"."+buyFinish[i]);
	document.write("<br><br>");*/
}



// ดึงอัตราดอกเบี้ยเงินฝากจากไฟล์ XML

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.open("GET","http://www.scb.co.th/scb_api/xml/deposit/source.xml",false); //http://www.scb.co.th/scb_api/xml/deposit/source.xml
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;



date2=xmlDoc.getElementsByTagName("lastupdate")[0].childNodes[0].nodeValue;
var replacedDate2 = date2.replace('at','ณ');


var depositName = new Array();
var depositRate = new Array();

// วนลูปดึงค่าอัตราดอกเบี้ยเงินฝาก
for (i=0;i<6;i++) {
	d=xmlDoc.getElementsByTagName("dtype")[i].childNodes[0].nodeValue.split(" ");
	e=xmlDoc.getElementsByTagName("drate")[i].childNodes[0].nodeValue.split(" ");
	
	depositName.push([d[0]]);
	depositRate.push([e[0]]);
	
	/*document.write([depositName[i]]);
	document.write("<br>");
	document.write([depositRate[i]]);
	document.write("<br><br>");*/
}



// ดึงอัตราดอกเบี้ยเงินกู้จากไฟล์ XML

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.open("GET","http://www.scb.co.th/scb_api/xml/deposit/source.xml",false); //http://www.scb.co.th/scb_api/xml/deposit/source.xml
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;

var loanName = new Array();
var loanRate = new Array();

// วนลูปดึงค่าอัตราดอกเบี้ยเงินกู้
for (i=0;i<3;i++) {
	m=xmlDoc.getElementsByTagName("ltype")[i].childNodes[0].nodeValue.split(" ");
	n=xmlDoc.getElementsByTagName("lrate")[i].childNodes[0].nodeValue.split(" ");
	loanName.push([m[0]]);
	loanRate.push([n[0]]);
	
	/*document.write([loanName[i]]);
	document.write("<br>");
	document.write([loanRate[i]]);
	document.write("<br><br>");*/
}