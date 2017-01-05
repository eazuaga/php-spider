function loadXMLDoc(dname)
{
if (window.XMLHttpRequest)
  {
  xhttp=new XMLHttpRequest();
  }
else
  {
  xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhttp.open("GET",dname,false);
xhttp.send();
return xhttp.responseXML;
}

GetSettingXml = function (label) {
    var xmlDoc = loadXMLDoc("Settings.xml");
    console.log(xmlDoc);
    x = xmlDoc.getElementsByTagName(label);
    return x[0].childNodes[0].nodeValue;
    //for (i = 0; i < x.length; i++) {
    //    console.log(x[i].childNodes[0].nodeValue);
    //    console.log("<br>");
    //}
}
