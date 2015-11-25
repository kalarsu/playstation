var isIE8 = window.XDomainRequest ? true : false;
var invocation = createCrossDomainRequest();
var url;

function createCrossDomainRequest(url, handler) {
  var request;
  if (isIE8) {
    request = new window.XDomainRequest();
  }else {
    request = new XMLHttpRequest();
  }
  return request;
}

function request() {
  var keyword = document.getElementById("keyword"); 
  url = "https://api.twitch.tv/kraken/search/streams?q="+keyword.value;

  if (invocation) {
    if(isIE8) {
      invocation.onload = outputResult; 
      invocation.open("GET", url, true);
      invocation.send();
    }else {
      invocation.open('GET', url, true);
      invocation.onreadystatechange = handler;
      invocation.send();
    }
  }else {
    var text = "No result.";
    var textNode = document.createTextNode(text);
    var textDiv = document.getElementById("feed");
    textDiv.appendChild(textNode);
  }
}

function handler(evtXHR) {
  if (invocation.readyState == 4)
  {
    if (invocation.status == 200) {
        var data = JSON.parse(invocation.responseText);
        outputResult(data);
        //console.log('XHR');
    }else {
      jsonpRequest();
    }
  }
}

function outputResult(_data) {
  //var data =  JSON.parse(invocation.responseText);
  var dataArr = _data;
  var output="";
  var dataLen = dataArr["streams"].length;
  output +="Total results: " + dataLen;
  output += "<table>";
  for(i = 0; i < dataLen ; i++) {
      var img   = dataArr["streams"][0].preview.small;
      var title = dataArr["streams"][0].channel.display_name;
      var game  = dataArr["streams"][0].channel.game;
      var views  = dataArr["streams"][0].channel.views;
      var status  = dataArr["streams"][0].channel.status;
      output += "<tr><td><img src=" + img + "></td><td><div class='search-title'>"+title+"</div><div class='search-content'>"+game+" - " + views + " viewers<br>" + status;
      output += "</div></td></tr>";
  }
  output+= "</table>";
  document.getElementById("feed").innerHTML = output;

}

//JSONP-----------------------------------------
function requestServerCall(url) {
  var head = document.head;
  var script = document.createElement("script");

  script.setAttribute("src", url);
  head.appendChild(script);
  head.removeChild(script);
}
 
function jsonpCallback(_data) {
  //console.log('XHR');
  outputResult(_data);
}

function jsonpRequest() {
  url+= "&callback=jsonpCallback";
  requestServerCall(url);
}  


