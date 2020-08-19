var express = require('express.io'),
	app = express(),
	multer = require('multer'),
    path = require('path'),
	helpers = require('./helpers'),
    express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	Chat = require('./models/chats'),
	User = require('./models/users'),
	Notification = require('./models/notifications'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose');
const axios = require('axios').default;
mongoose.set('useUnifiedTopology', true);
var mongoDB = 'mongodb://localhost/project';
mongoose.connect(mongoDB, { useNewUrlParser: true });
app.use(
	require('express-session')({
		secret: 'wassup! XD',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.http().io();
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/');
    },

    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
app.use(express.static(__dirname + '/public'));
app.use(
	require('express-session')({
		secret: 'i love trichy',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
var using;


////////-----------------------------------------------------------routes----------------------------//////////////
//-------------landing page--------------
app.get('/', function (req, res) {
	User.find({}, function (err, r) {
		res.render('login', { c: r });
	});
});

//-----------------------------
app.post('/upload', (req, res) => {

    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('upFile');
    console.log(req.file);
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
		var name = "" ;
		for (var i=6;i<req.file.path.length;i++){
			name = name + req.file.path[i];}
		User.findById(req.user._id,function(err,user){
			user.img = name;
			user.save();
			res.redirect("/userpage");
		})
		
    });
});
app.post('/uploadT', (req, res) => {
    // 'profile_pic' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('tFile');
    console.log(req.file);
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select --- an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
		var name = "" ;
		for (var i=6;i<req.file.path.length;i++){
			name = name + req.file.path[i];}
		User.findById(req.user._id,function(err,user){
			user.img = name;
			user.save();
			res.redirect("/userpage");
		})
		
    });
});

//-------------signup--------------
app.get('/signup', function (reeq, res) {
	res.render('signup');
});

app.post('/signup', function (req, res) {
	req.body.username;
	req.body.password;
	User.register(
		new User({ username: req.body.username, type: req.body.type }),
		req.body.password,
		function (err, user) {
			passport.authenticate('local')(req, res, function () {
				res.redirect('/home');
			});
		}
	);
});

//-------------login--------------
app.post('/login',passport.authenticate('local', {
		successRedirect: '/home',
		failureRedirect: '/',
	}),
	function (req, res) {
		req.body.username;
		req.body.password;
	}
);
//------------------------------
app.get('/userpage', islogin,function (req, res) {
	res.render('userpage',{user: req.user});
});


//-------------home--------------
app.get('/home', islogin, function (req, res) {
	using = req.user.username;
	User.find({}, function (err, r) {
		console.log(req.user.username);
		Notification.find({username:req.user.username},function(err,s){
			Notification.findOne({group: req.user.username},function(err,ss){
				if(ss === null){
					res.render('home',{user: req.user,notify: s,notif: "null"} );
				}
				else{
					setTimeout(deleten,20000)
					function deleten(){
						ss.status = "seen";
						ss.save();
					}
		     res.render('home',{user: req.user,notify: s,notif: ss} );		
				}
			})
		
		})  
	});
});

//-------------To add ppl in group chat--------------
app.post("/add",function(req,res){
	var x = req.body.peoples;
	Notification.create({username: req.user.username,type:"groupbox"},function(err,s){
		x.forEach(function(ss){
		s.group.push(ss);	
		})
		console.log(s.group);
		s.save();
		res.redirect("/scam/jkl/"+s._id)
	})
})

//-------------landing page for each feature--------------
app.get('/scam/:asd', islogin, function (req, res) {
	
	//----------for chat box----------------------
	if(req.params.asd === "asd"){
		User.find({}, function (err, r) {
		res.render('whatchat', { c: r, user: req.user, param : req.params.asd });
	});
	}
	
    //-------------for live box--------------
	else if(req.params.asd === "fgh"){
	User.find({}, function (err, r) {
		res.render('lblist', { c: r, param: req.params.asd ,user: req.user });
	});	
	}
	
	//-------------for group box--------------
	else if(req.params.asd === "jkl"){
	User.find({}, function (err, r) {
		res.render('gblist', { c: r, param: req.params.asd ,user: req.user });
	});	
	}
	
	//-------------for call box--------------
	else{
		User.find({}, function (err, r) {
		res.render('cblist', { c: r, user: req.user, param : req.params.asd });
	});
	}
	
})

//-------------main page for each page-------------------------------------------------------------------------------------------------------------
app.get('/scam/:asd/:id', islogin, function (req, res) {
	
	//-------------main page chat box--------------------------------------------------------------------------------
	if(req.params.asd === "asd"){
		User.find({},function(err,users){
			console.log("----------1");
			Chat.findOne({users:req.user.username+req.params.id}, function (err, r) {
				console.log("----------1");
				 console.log("----------2");
				if(r === null){
					console.log("----------3");
					Chat.findOne({users:req.params.id+req.user.username}, function (err, s) {
							console.log("----------4");
				          if(s === null){
							  console.log("----------5");
						      Chat.create({users:req.params.id+req.user.username},function(err,chat){
								  console.log("----------6");
								  res.render('chatbox', { c: users , chat: chat,user: req.user,him: req.params.id});
							  })	  
						  }
						  else{
							  res.render('chatbox', { c: users,chat:s,user: req.user,him: req.params.id});
						  }
					})
				}
				else{
					console.log(r.users);
					res.render('chatbox', { c: users,chat:r,user: req.user.username,him: req.params.id});
				}
		    });
	    })	
	}
	
	//-------------main page live box------------------------------------------------------------------------------
	else if(req.params.asd === "fgh"){
	Notification.findById(req.params.id,function(err,s){
				console.log(s+"-----------------");
				if(s === undefined){
		Notification.create({username:req.params.id,caller:req.user.username,creator:"1234"+Math.floor(Math.random()*420),type:"livebox"},function(err,sr){
						console.log(sr.creator);
						console.log(sr.username);
						res.render('livebox', {user: req.user , notify : sr});
					})
				}
				else{var a = setTimeout(sad,5000)
					function sad(){
						Notification.findById(req.params.id,function(err,del){
							del.status = "seen";
							del.save();
						});
						console.log("deleted");
						clearTimeout(a);
					}
					
					res.render('livebox', { user2: s.creator ,user: req.user , notify : s});
				}
			});	
	}
	
	//-------------main page group box------------------------------------------------------------------------------
	else if(req.params.asd === "jkl"){
		var shit = req.params.id + req.params.asd;
		console.log(req.params.id +"---------------"+shit );
	User.find({}, function (err, r) {
		console.log(req.params.id +"---------------" );
		Notification.findById(req.params.id,function(err,sr){
			console.log(sr);
		res.render('groupbox', { notify: sr,user: req.user });
		})
	});	
	}
	
	//-------------main page call box------------------------------------------------------------------------------
	else{
			Notification.findById(req.params.id,function(err,s){
				console.log(s+"-----------------");
				if(s === undefined){
		Notification.create({username:req.params.id,caller:req.user.username,creator:"1234"+Math.floor(Math.random()*420),type:"callbox"},function(err,sr){
						console.log(sr.creator);
						console.log(sr.username);
						res.render('callbox', {user: req.user , notify : sr});
					})
				}
				else{var a = setTimeout(sad,5000)
					function sad(){
						Notification.findById(req.params.id,function(err,del){
							del.status = "seen";
							del.save();
						});
						console.log("deleted");
						clearTimeout(a);
					}
					
					res.render('callbox', { user2: s.creator ,user: req.user , notify : s});
				}
			})
		

	}
});

//-------------when the person declines----------------------------------------------------------------------------------------------------------------
app.post("/decline",function(req,res){
	console.log("----x-x-x-x-x-x-x-x-x----"+req.body.id);
	Notification.findById(req.body.id,function(err,s){
		s.status = "seen";
		s.save();
	});
	
})

//-------------when the person doesnt attend the call--------------------------------------------------------------------------------------------------
app.post("/Decline",function(req,res){
	console.log("----x-x-x-x-x-x-x-x-x----"+req.body.id);
	Notification.findById(req.body.id,function(err,s){
		s.status = "seen";
		s.save();
	})
})

//------------------to add chats everytime in db------------------------------------------------------------------------------------------------------
app.post('/scam/:asd', islogin, function (req, res) {
        Chat.findOne({users:req.body.users},function(err,ch){
				var addChat = {Author: req.body.author,Chat: req.body.chat}
				ch.chat.push(addChat);
				ch.save();
				console.log(ch);
		})
});

//-------------logout--------------------------------------------------------------------------------------------------------------------
app.post('/logout', function (req, res) {
	var x = req.user.username;
	User.find({ username: req.user.username }, function (err, user) {
		if (err) {
			console.log('shit sorry');
		}
		user.forEach(function (usr) {
			console.log(usr.username);
			usr.status = 'offline';
			console.log(usr.status);
			usr.save();
		});
	});
	res.redirect('/logout');
});
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

//-------------------middleware to check if perosn is logged in---------------------------------------------------------------------------------------
function islogin(req, res, next) {
	if (req.isAuthenticated()) {
		User.find({ username: req.user.username }, function (err, user) {
			if (err) {
				console.log('shit sorry');
			}
			user.forEach(function (usr) {
				usr.status = 'online';
				usr.save();
			});
		});
		return next();
	} else {
		res.redirect('/');
	}
}

//----------------------use of initial signaling to set up webrtc-------------------------------------------------------------------------------------
//----------------------------------ready is emmitted---------------------------------------------------------
app.io.route('ready', function (req) {
	req.io.join(req.data.chat_room);
	req.io.join(req.data.signal_room);
	req.io.join(req.data.files_room);
	app.io.room(req.data).broadcast('arrival', {
		message: 'peer is cominggggggg' + req.data + ' here',
	});
});

//-----------------------------send is emitted--------------------------------------------------------------
app.io.route('send', function (req) {
	if(req.data.type === "group"){
		app.io.room(req.data.room).broadcast('message', {
		message: req.data.message,
		author: req.data.author,	
	});
	}
	else{
	app.io.room(req.data.room).broadcast('message', {
		message: req.data.message,
		author: req.data.author,	
	});
	}
});

//-----------------------------------signal is emitted--------------------------------------------------------
app.io.route('signal', function (req) {
	req.io.room(req.data.room).broadcast('signaling_message', {
		type: req.data.type,
		message: req.data.message,
	});
});

//------------------------------------------files is emited-------------------------------------------------
app.io.route('files', function (req) {
	req.io.room(req.data.room).broadcast('files', {
		filename: req.data.filename,
		filesize: req.data.filesize,
	});
});

//------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(3000, function () {
	console.log('Server Started XD');
});