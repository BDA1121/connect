var emojiStore         = document.querySelector("#emojiStore"),
    emojis             = document.querySelector("#emojis"),
    addEmoji           = document.querySelectorAll(".addEmoji"),
	vid                = document.querySelector("#vid"),
	wait               = document.querySelector("#wait"),
	whatIf             = document.querySelector("#whatIf"),
	idAxios            = document.querySelector("#idAxios"),
    texter             = document.querySelector("#texter"),
    message            = document.querySelector("#message"),
    sendMessage        = document.querySelector("#sendMessage"),
    chatArea           = document.querySelector("#chatArea"),
    sendFile           = document.querySelector("input#sendFile"),
    fileProgress       = document.querySelector("progress#fileProgress"),
    downloadLink       = document.querySelector('a#receivedFileLink'),
    room               = idAxios.value + "'s room",
    signalRoom         = idAxios.value + "'s signalRoom",
    filesRoom          = idAxios.value + "'s filesRoom",
    configuration      = {
				          'iceServers': [{
					         'url': 'stun:stun.l.google.com:19302'
				                        }]
			             },
    dataChannelOptions = {
				ordered: false,  
				maxRetransmitTime: 1000, 
			},
	dataChannel,
	rtcPeerConn,
	receivedFileName,
	receivedFileSize,
	fileBuffer = [],
	fileSize = 0;
//-------------------------------------------------------
console.log("------------"+idAxios.value+"----------------");
setTimeout(attend,20000)
function attend(){
	console.log("------------"+idAxios.value+"----------------");
		axios({
  method: 'post',
  url: '/decline',
  data: {
	  id: idAxios.value,
  }});
	
}
whatIf.style.opacity = "0";
//------------------------------------for adding emojis-----------------------------------------------------
emojiStore.classList.add("displayNone");
emojis.addEventListener("click",function(){
    emojiStore.classList.toggle("display");	
    emojiStore.classList.toggle("displayNone");
})
for(var i = 0;i<100;i++){
    addEmoji[i].addEventListener("click",function(){
		message.value = message.value + this.textContent;
	})
}
			 io = io.connect();
			
			io.emit('ready', {"chat_room": room, "signal_room": signalRoom, "files_room": filesRoom});
			
			io.emit('signal',{"type":"user_here", "message":"Are you ready for a call?", "room":signalRoom});
			io.on('signaling_message', function(data) {
				displaySignalMessage("Signal received: " + data.type);
				if(data.message === "b&w"){
					theirVideoArea.classList.toggle("bw");
				    console.log("---------------bw------------")
				   }
				if(data.type === "SDP"){
					x=1;
					console.log("---------------basasasw------------");
					wait.classList.add("display");
					wait.style.opacity = "1";
					wait.classList.remove("displayNone");
					whatIf.style.opacity = "0";
				}
				//Setup the RTC Peer Connection object
				if (!rtcPeerConn)
					startSignaling();
					
				if (data.type != "user_here") {
					var message = JSON.parse(data.message);
					if (message.sdp) {
						rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
							// if we received an offer, we need to answer
							if (rtcPeerConn.remoteDescription.type == 'offer') {
								rtcPeerConn.createAnswer(sendLocalDesc, logError);
							}
						}, logError);
					}
					else {
						rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
					}
				}
				
			});
			
			io.on('files', function(data) {
				receivedFileName = data.filename;
				receivedFileSize = data.filesize;
				displaySignalMessage("websockets says the file on it's way is " + receivedFileName + " (" + receivedFileSize + ")");
			});
			
			function startSignaling() {
				displaySignalMessage("starting signaling...");
				
				rtcPeerConn = new webkitRTCPeerConnection(configuration, null);
				dataChannel = rtcPeerConn.createDataChannel('textMessages', dataChannelOptions);
				
				dataChannel.onopen = dataChannelStateChanged;
				rtcPeerConn.ondatachannel = receiveDataChannel;
				
				// send any ice candidates to the other peer
				rtcPeerConn.onicecandidate = function (evt) {
					if (evt.candidate)
						io.emit('signal',{"type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate }), "room":signalRoom});
					displaySignalMessage("completed that ice candidate...");
				};
				
				// let the 'negotiationneeded' event trigger offer generation
				rtcPeerConn.onnegotiationneeded = function () {
					displaySignalMessage("on negotiation called");
					rtcPeerConn.createOffer(sendLocalDesc, logError);
				}
			}
			
			function dataChannelStateChanged() {
				if (dataChannel.readyState === 'open') {
					displaySignalMessage("Data Channel open");
					dataChannel.onmessage = receiveDataChannelMessage;
				}
			}
			
			function receiveDataChannel(event) {
				displaySignalMessage("Receiving a data channel");
				dataChannel = event.channel;
				dataChannel.onmessage = receiveDataChannelMessage;
			}
			
			function receiveDataChannelMessage(event) {
				displaySignalMessage("Incoming Message");
				displayMessage("From DataChannel: " + event.data);
				
				//This is where we process incoming files
				fileBuffer.push(event.data);
				fileSize += event.data.byteLength;
				fileProgress.value = fileSize;
				
				//Provide link to downloadable file when complete
				if (fileSize === receivedFileSize) {
					var received = new window.Blob(fileBuffer);
					fileBuffer = [];

					downloadLink.href = URL.createObjectURL(received);
					downloadLink.download = receivedFileName;
					downloadLink.appendChild(document.createTextNode(receivedFileName + "(" + fileSize + ") bytes"));
				}
				
			}
			
			function sendLocalDesc(desc) {
				rtcPeerConn.setLocalDescription(desc, function () {
					displaySignalMessage("sending local description");
					io.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription }), "room":signalRoom});
				}, logError);
			}
			
			function logError(error) {
				displaySignalMessage(error.name + ': ' + error.message);
			}
			
			io.on('announce', function(data) {
				displaySignalMessage(data.message);
			});
			
			io.on('message', function(data) {
				if(data.message !==""){
				if(data.author === texter.value){displayMessage(data.message,"right");}
				else{displayMessage(data.author+":"+data.message);
					}
				}
			});
			
			function displayMessage(message,position) {var div = document.createElement("div");
				div.className = position;
                var x = "textBack";
				div.innerHTML =  "<span class=\""+x+"\">"+message+"</span>";
				chatArea.appendChild(div);
chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
			}
			
			function displaySignalMessage(message) {
				console.log("feeling lonely? check this out -->",message) ;
			}
			
			sendMessage.addEventListener('click', function(ev){
				io.emit('send', {"author":texter.value, "message":message.value, "room":room, "type": "group"});
				message.value = "";
				ev.preventDefault();
			}, false);
			
			sendFile.addEventListener('change', function(ev){
				var file = sendFile.files[0];
				displaySignalMessage("sending file " + file.name + " (" + file.size + ") ...");
				
				io.emit('files',{"filename":file.name, "filesize":file.size, "room":filesRoom});
				
				fileProgress.max = file.size;
				var chunkSize = 16384;
				var sliceFile = function(offset) {
					var reader = new window.FileReader();
					reader.onload = (function() {
						return function(e) {
							dataChannel.send(e.target.result);
							if (file.size > offset + e.target.result.byteLength) {
								window.setTimeout(sliceFile, 0, offset + chunkSize);
								}
							fileProgress.value = offset + e.target.result.byteLength;
						};
					})(file);
					var slice = file.slice(offset, offset + chunkSize);
					reader.readAsArrayBuffer(slice);
				};
				sliceFile(0);		
			
			}, false);
console.log("hi");