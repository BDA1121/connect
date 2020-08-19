var idAxios = document.querySelector("#idAxios"),
	canvas  = document.querySelector("#processTake"),
	dpVideo = document.querySelector("#takePic"),
	cxt     = canvas.getContext('2d'),
	img     = document.querySelector("#editPic"),
	takenPic;
canvas.width = 460;
canvas.height = 460;
$(document).ready(function(){
  $("#decline").click(function(){
    axios({
  method: 'post',
  url: '/Decline',
  data: {
	  id: idAxios.value,
  }});
	  Reload();
  });

	
	$("#uploadOne").click(function(){
      $("#mainInfo").fadeTo("fast",0.2,function(){
		$("#uploadDiv").addClass("display");
		$("#uploadDiv").removeClass("displayNone");
	})
  });

	$("#takeOne").click(function(){
      $("#mainInfo").fadeTo("fast",0.2,function(){
		 
		takeVideo();  
	    	  
		$("#takeDiv").addClass("display");
		$("#takeDiv").removeClass("displayNone");
	})
  });		

	$("#cancel").click(function(){
      $("#mainInfo").fadeTo("fast",1,function(){
		$("#uploadDiv").removeClass("display");
		$("#uploadDiv").addClass("displayNone");
	})
  });

	$("#favX").click(function(){
      $("#mainInfo").fadeTo("fast",1,function(){
		$("#takeDiv").removeClass("display");
		$("#takeDiv").addClass("displayNone");
	})
  });

	$("#favCircle").click(function(){
			cxt.drawImage(dpVideo, 0, 0, 460, 460);
			takenPic = canvas.toDataURL('image/png');
			img.setAttribute('src', takenPic);
		let dataUrl = document.getElementById("editPic").src.split(',')
let base64 = dataUrl[1];
let mime = dataUrl[0].match(/:(.*?);/)[1];
let bin = atob(base64);
let length = bin.length;
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
let buf = new ArrayBuffer(length);
let arr = new Uint8Array(buf);
bin
  .split('')
  .forEach((e,i)=>arr[i]=e.charCodeAt(0));
  
let f = new File([buf],'filename',{type:"png"});
		var xs =f ;
		console.log(xs);
			document.querySelector("#imgT").setAttribute("src", takenPic);
      $("#mainInfo").fadeTo("fast",0.2,function(){
		$("#takeDiv").removeClass("display");
		$("#takeDiv").addClass("displayNone");
		$("#editDiv").removeClass("displayNone");
		$("#editDiv").addClass("display");
		
	})
  });
$("#done").click(function(){
    axios({
  method: 'post',
  url: '/userpage',
  data: {
	  id: idAxios.value,
  }});
	  Reload();
  });
		
		
	setInterval(Reload,10000);
	function Reload() {
    $.ajax({
        type: 'GET',
        url: "/home",
        success: function () {
   $("#reloadN").load(" #reloadNs");}
        })
    };	
	function takeVideo(){
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
				navigator.getUserMedia({
					 'audio':true,
					'video': true
				}, function (stream) {
					console.log("got my media");
					dpVideo.srcObject = stream;
					dpVideo.muted = true;
					dpVideo.play();
				}, logError);
		console.log("%%%%%b ")
	}
   function logError(error) {
				console.log(error.name + ': ' + error.message);
			}
});