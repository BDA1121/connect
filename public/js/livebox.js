var emojiStore         = document.querySelector("#emojiStore"),
    emojis             = document.querySelector("#emojis"),
    addEmoji           = document.querySelectorAll(".addEmoji"),
	vid                = document.querySelector("#vid"),
	wait               = document.querySelector("#wait"),
	whatIf             = document.querySelector("#whatIf"),
	idAxios            = document.querySelector("#idAxios"),
    texter             = document.querySelector("#texter"),
	create             = document.querySelector("#creator"),
	googleStun      = {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302'}]},
    message            = document.querySelector("#message"),
    sendMessage        = document.querySelector("#sendMessage"),
    chatArea           = document.querySelector("#chatArea"),
    sendFile           = document.querySelector("input#sendFile"),
    fileProgress       = document.querySelector("progress#fileProgress"),
    downloadLink       = document.querySelector('a#receivedFileLink'),
    room               = create.value + "'s room",
    signalRoom         = create.value + "'s signalRoom",
    filesRoom          = create.value + "'s filesRoom",
    dcDictionary = {ordered: false,maxRetransmitTime: 1000,},
	dataChannel,
	rtcPeerConn,
	receivedFileName,
	receivedFileSize,
	fileBuffer = [],
	fileSize = 0;


//-------------------------------------if the person doesnot pickup--------------------------------------------------
wait.classList.add("displayNone");
//console.log("------------"+idAxios.value+"----------------");
wait.style.opacity = "0";
setTimeout(attend,20000)
function attend(){
	//console.log("------------"+idAxios.value+"----------------");
	if(wait.style.opacity === "0"){
		axios({
  method: 'post',
  url: '/decline',
  data: {
	  id: idAxios.value,
  }});
		whatIf.innerHTML = "<h1>person busy</h1></br>Go to <a href=\"/home\" class=\"aTag\">home</a></br>message him on<a href=\"/scam/asd\" class=\"aTag\">chatbox</a>"
		
	}
	
}


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
//----------------------------------the fun part webrtc and sockets------------------------------------------------------------------------------
			

            io = io.connect();

//---------------------------------------defining the rooms---------by emiting ready---------------------------------------------			
			io.emit('ready', {"chat_room": room, "signal_room": signalRoom, "files_room": filesRoom});
			
//-----------------------------------   ------------------------------------------
			io.emit('signal',{"type":"user_here", "message":"bored", "room":signalRoom});

//----------------------------everytime my emitted signal works-----------------------------------------
			io.on('signaling_message', function(data) {
			    connectionError("Signal received: " + data.type);
				
//----------------------------yaaaay the person arrived-------------------------------------------
			io.on('arrival', function(data) {
				connectionError(data.message);
			});
//----------------------------------------------------------------------------------------------------------------------	
				if(data.type === "SDP"){
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
				connectionError(texter.value+" is sending you " + receivedFileName + " (" + receivedFileSize + ")");
			});
			

			function startSignaling() {
				
				connectionError("the other person came");
				//-------------------creating a new connection between us using google stun server
				rtcPeerConn = new webkitRTCPeerConnection(googleStun, null);
				
				//---------------creating a channel to transimt our datas mentioning a human readable channel name and dictionary or dc configs-----
				dataChannel = rtcPeerConn.createDataChannel('textMessages', dcDictionary);
				
				dataChannel.onopen = dataChannelStateChanged;
				rtcPeerConn.ondatachannel = receiveDataChannel;
				
//-------------------------event handler used by our ice agent to send ice candidate to the other person using signal server-------------------------
				rtcPeerConn.onicecandidate = function (evt) {
					if (evt.candidate)
						io.emit('signal',{"type":"ice candidate", "message": JSON.stringify({ 'candidate': evt.candidate }), "room":signalRoom});
					connectionError("ice candidate woohooo");
				};
				
//----------------------event handler triggered when negotiation is req here i use it to create an offer to the peer-----------------------
				rtcPeerConn.onnegotiationneeded = function () {
					connectionError("negotiation  needed");
					//-----creation of sdp offer to create webrtc connection-----------------------------
					rtcPeerConn.createOffer(sendLocalDesc, logError);
				}
			}
			
			function dataChannelStateChanged() {
				if (dataChannel.readyState === 'open') {
					connectionError("dc state open");
					dataChannel.onmessage = receiveDCMessage;
				}rece
			}

			function receiveDataChannel(event) {
				connectionError("dc is being received");
				dataChannel = event.channel;
				dataChannel.onmessage = receiveDCMessage;
			}

			function receiveDCMessage(event) {
				displayMessage("From DataChannel: " + event.data);
				fileBuffer.push(event.data);
				fileSize += event.data.byteLength;
				fileProgress.value = fileSize;
				if (fileSize === receivedFileSize) {
					//-----------we use blob here cause it allows raw data to be turned readable stream inorder tp process data ---------------
					var received = new window.Blob(fileBuffer);
					fileBuffer = [];

					downloadLink.href = URL.createObjectURL(received);
					downloadLink.download = receivedFileName;
					downloadLink.appendChild(document.createTextNode(receivedFileName));
				}
				
			}
			
//----------------to set the local description that specifies the properties of the remote end of the connection---------------------------
			function sendLocalDesc(desc) {
				rtcPeerConn.setLocalDescription(desc, function () {
					connectionError("sending local description");
					io.emit('signal',{"type":"SDP", "message": JSON.stringify({ 'sdp': rtcPeerConn.localDescription }), "room":signalRoom});
				}, logError);
			}
			
//---------------------if error occurs in --------------------
			function logError(error) {
				connectionError(error.name + ': ' + error.message);
			}


//-------------------to get the vakues of author and message to be diplayed----------------------------			
			io.on('message', function(data) {
				if(data.message !==""){
				if(data.author === texter.value){displayMessage(data.message,"right");}
				else{displayMessage(data.message);
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
			
			function connectionError(message) {
	//---------------------------------------only use it when u face an error or your console will be filled XD--------------------------------
				//console.log("check this",message) ;
			}

//-------to send messages -----------------------------------------------
			sendMessage.addEventListener('click', function(ev){
				io.emit('send', {"author":texter.value, "message":message.value, "room":room});
				message.value = "";
				ev.preventDefault();
			}, false);

//----------------to send files--------------------------------------------------
			sendFile.addEventListener('change', function(ev){
				
				//---to send only the first file he sends ------------------
				var file = sendFile.files[0];
				connectionError(file.name + " (" + file.size + ")");
				
				//------------to let the other know that file is being sent so that hell start processing the file-----------------
				io.emit('files',{"filename":file.name, "filesize":file.size, "room":filesRoom});
                
				//---to give the progress an end value----------------
				fileProgress.max = file.size;
				//---------it breaks file into parts of 16bytes so we use this to update value in if ---------------------
				var chunkSize = 16384;
				
				//------ sending file---------------------
				var sliceFile = function(offset) {
					
					//------filereader helps to asynchronously read the contents of file from computer------------------------------
					var reader = new window.FileReader();
					reader.onload = (function() {
						
						//---to upload the file into the data channel 16byte at a time --------------
						return function(e) {
							dataChannel.send(e.target.result);
							
                        //condition to check if the file has been completely uploaded-------------------
							if (file.size > offset + e.target.result.byteLength) {
								
					    //------------calling back the function with updated offset----------------
								window.setTimeout(sliceFile, 0, offset + chunkSize);
								}
							
							fileProgress.value = offset + e.target.result.byteLength;
						};
					})(file);
					var slice = file.slice(offset, offset + chunkSize);
					
					//-----------this starts reading the contents of blob and when it is completed it give arraybuffer of file--------
					reader.readAsArrayBuffer(slice);
				};
				sliceFile(0);		
			
			}, false);
console.log("hi");