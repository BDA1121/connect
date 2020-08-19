var chatArea = document.querySelector("#chatArea");
	var we       = document.querySelectorAll(".right");
	var them       = document.querySelector(".left");
	setInterval(Reload,10000)
function Reload() {
    $.ajax({
        type: 'GET',
        url: "/scam/asd/124",
        success: function () {
   $("#nameSheet").load(" #status");}
        })
	$.ajax({
        type: 'GET',
        url: "/scam/asd/124",
        success: function () {
   $("#onlinePeople").load(" #status");}
        })
	$.ajax({
        type: 'GET',
        url: "/scam/asd/124",
        success: function () {
   $("#chatReload").load(" #spanReload");}
        })
    };
    
	var form = document.getElementById('form');
	if(form !== undefined ){
		 form.addEventListener('submit', function(evt){
	 evt.preventDefault();
	 var chatText = document.getElementById('chatInput').value
	 const username = document.getElementById('loggedinuser').value
	 const user = document.getElementById('loggeduser').value
	 displayMessage(chatText,"right");
	 axios({
  method: 'post',
  url: '/scam/asd',
  data: {
	  author: user,
	  users:username, 
	  chat: chatText,
  }});
		document.getElementById('chatInput').value	  = "";
	// axios.post('/asd', {dhanush: username,user1:username, chat: chatText})
 });
	}
	var chatReload= document.querySelector("#chatReload");
chatReload.scrollTop = chatReload.scrollHeight - chatReload.clientHeight;
function displayMessage(message,position) {var div = document.createElement("div");
				div.className = position;
                var x = "textBack";
				div.innerHTML =  "<span class=\""+x+"\">"+message+"</span>";
				chatReload.appendChild(div);
chatReload.scrollTop = chatReload.scrollHeight - chatReload.clientHeight;
			}

	
/*$(document).ready(function(){
setInterval(function(){
      $("#status").fadeOut(0).load("#status").fadeIn(0);
}, 5000);
});

$(document).ready(function() {

loopbox();
function done() {
		console.log("ndkf");
	$('#nameSheet').delay(5000).remove(function(){
	$('#nameSheet').load(location.href + " #nameSheet",function(){
		done();
		console.log("ndkf");
	})
})	;
	
	$('#nameSheet').fadeIn(10).delay(5000).fadeOut(10, function() {
        $('#nameSheet2').fadeIn(10).delay(4000).fadeOut(10,function() {                                
        loopbox();
        });
    });
	}

loopbox();

function loopbox() {
    $('#nameSheet').remove().delay(1000).fadeOut(100, function() {
      $('#nameSheet').load(location.href + "#nameSheet").fadeIn(100).delay(3000).fadeOut(100, function() {
        $('#nameSheet').fadeIn(100).delay(4000).fadeOut(100,function() {                                
        loopbox();
        });
      });
    });
  }
});*/