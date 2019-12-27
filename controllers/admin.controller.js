const products =require('../model/products.model');
const categories =require('../model/categories.model');
const publishers =require('../model/publishers.model');
const admins = require('../model/admins.model');

const passport = require('passport');
const bcrypt = require('bcryptjs');
const handlebars= require('hbs');

const type = [{id: 1, name: 'Quản lý'},{id: 2, name: 'Thủ kho'},{id: 3, name: 'Bán hàng'}];

handlebars.registerHelper("type_select",(selectedType,type_list)=>{
	let html = "";
	type_list.forEach(function(item) { 
		if(item.id == selectedType)
		{
			html = html + '<option selected value="'+item.id+'">'+ item.name + '</option>';
		}
		else{
			html = html + '<option value="'+item.id+'">'+item.name+'</option>';
		} 
	});
	return new handlebars.SafeString(html);
});

module.exports.getLogin =  (req, res) => res.render('login', {title : 'Đăng nhập'});

module.exports.postLogin =  passport.authenticate('local', {
	successRedirect: '/account',
	failureRedirect: '/login',
	badRequestMessage: 'Bạn chưa điền đủ!',
	//nếu ko có sẽ mặc định hiện "Missing credentials" khi nhập thiếu
	failureFlash: true
});


module.exports.account = (req, res) =>{
	admins.find()
	.then(function(admin){
		res.render('account', {
			title : 'Tài khoản',
			admins: admin,
			user: res.locals.user,
			type
		});
	});
};

module.exports.employees = (req, res) =>{
	admins.find()
	.then(function(admin){
		if(req.user.type === 1){
			res.render('employees', {
				title : 'Tài khoản',
				admins: admin,
				user: res.locals.user
			});
		}else {
			req.flash('error_msg', 'Bạn không được phép truy cập vào đây!');
			res.redirect('/account');
		}
	});
};

module.exports.signup = (req, res) => {
	//console.log(req.user);
	if(req.user.type === 1){
		res.render('sign-up', {title : 'Tạo tài khoản', user: req.user, type});
	}else {
		req.flash('error_msg', 'Bạn không được phép truy cập vào đây!');
		res.redirect('/account');
	}
};

module.exports.insert = function (req, res, next) {
	const { name, email, password, password1, phone, address, type} = req.body;
	let err=[];
	//check requied fields
	if (!name || !email || ! password || !password1 || !phone || !address||!type) {
		err.push({msg: 'Bạn chưa điền hết thông tin yêu cầu!'});
		//console.log(err);
	} 
	//check email 
	else if (email.search("@") == -1) {
		err.push({msg: 'Email phải có ký tự "@"!'});
	} 
	//check password match
	else if (password !== password1) {
		err.push({msg: 'Mật khẩu nhập lại không đúng!'});
	}
	//check password length
	else if (password.length < 7) {
		err.push({msg: 'Mật khẩu phải trên 6 ký tự!'});
	} 
	//check phone number
	else if(parseInt(phone)<=0 || isNaN(parseInt(phone))){
		err.push("Số điện thoại không hợp lệ!");
		return false;
	}
	if (err.length > 0) {
		res.render('sign-up', {
			//save data khi nhập sai
			err,
			name, 
			email,
			phone, 
			address, 
			type
		});
	} else {
		//validation
		//email exists
		admins.findOne({email: email})
		.then(admin => {
			if (admin) {
				err.push({ msg: 'Email đã tồn tại!' });
				res.render('sign-up', {
					//save data khi nhập sai
					err,
					name,
					email,
					phone, 
					address, 
					type
				});
			} else {
				const newAdmin = new admins({
					name, 
					email,
					phone, 
					password,
					address, 
					type
				});
				//hash password 
				bcrypt.genSalt(10, (er, salt) => {
					bcrypt.hash(newAdmin.password, salt, (er, hash) => {
						if (er) throw er;
							//set password to hashed
							newAdmin.password = hash;
						//save admin
						newAdmin.save()
						.then(admin => {
							req.flash('success_msg', 'Bạn đã tạo tài khoản thành công hãy đăng nhập');
							res.redirect('/sign-up');
						})
						.catch(er => console.log(er));
					});
				});
			}
		});
	}
}

module.exports.update = function (req, res, next) {
	const { name, email, password, password1, password2, phone, address, type} = req.body;
	let err=[];

	//user hiện tại
	let user = res.locals.user;
	//console.log(user);
	//console.log("email old"+user.email);

	//check requied fields 
	if (!name || !email || !password || !phone || !address ||!type) {
		err.push({msg: 'Bạn chưa điền hết thông tin yêu cầu!'});
		console.log(err);
	} 
	//check email 

	else if (email.search("@") == -1) {
		err.push({msg: 'Email phải có ký tự "@"!'});
	} 

	//check phone number
	else if(parseInt(phone)<=0 || isNaN(parseInt(phone))){
		err.push({msg: 'Số điện thoại không hợp lệ!'});
	}
	if (err.length > 0) {
		res.render('account', {
			//save data khi nhập sai
			err,
			name, 
			email,
			phone, 
			address, 
			type
		});
	} 

	//not change password
	if (!password1 && !password2) {
		admins.findOne({email: email})
		.then(check_email => {
			//console.log(email+" 1");//email
			//console.log(user.email+" 2");//email local
			//nếu email khác với email trong local mà khi kiểm tra nó thấy tồn tại trong database thì email đó đã tồn tại 
			if (email !== user.email && check_email) {
				//console.log(check_email);
				err.push({ msg: 'Email đã tồn tại!' });
			}	
			if (err.length > 0) {
				res.render('account', {
					//save data khi nhập sai
					err,
					name, 
					email,
					phone, 
					address, 
					type
				});
			} 
			else{
       	 		// Match password
       	 		bcrypt.compare(password, user.password, (err1, isMatch) => {
       	 			if (err1) throw err1;
       	 			if (!isMatch) {
       	 				err.push({msg: 'Mật khẩu không đúng!'});
       	 				res.render('account', {
							//save data khi nhập sai
							err,
							name,
							email,
							phone, 
							address, 
							type
						});
       	 			} else {
       	 				user.name = name;
       	 				user.email = email;
       	 				user.phone = phone; 
       	 				user.address = address; 
       	 				user.type = type ;
       	 				//bỏ qua password
       	 				user.save()
       	 				.then(admin => {
       	 					req.flash('success_msg', 'Bạn đã cập nhật tài khoản thành công');
       	 					res.redirect('/account');
       	 				})
       	 				.catch(er => console.log(er));
       	 			}
       	 		});
       	 	}
       	 });
	} 

	//check all fields change password 
	if ( (!password1 && password2) || (!password2 && password1) ) {
		err.push({msg: 'Nếu bạn muốn đổi mật khẩu thì phải nhập đủ tất cả thông tin yêu cầu!'});
	}
	else if( password2 && password1){
		//check password match
		if (password === password1) {
			err.push({msg: 'Mật khẩu mới phải khác mật khẩu hiện tại!'});
		}
		//check password length
		if (password1.length < 7) {
			err.push({msg: 'Mật khẩu mới phải trên 6 ký tự!'});
		} 
		//check password2 match password1
		if (password2 !== password1) {
			err.push({msg: 'Mật khẩu mới nhập lại không đúng!'});
		}
		if (err.length > 0) {
			res.render('account', {
				//save data khi nhập sai
				err,
				name, 
				email,
				phone, 
				address, 
				type
			});
		} 

		else {
			//validation
			//check password hiện tại
			admins.findOne({email: user.email})
			.then(check_email => {
				//nếu email khác với email trong local mà khi kiểm tra nó thấy tồn tại trong database thì email đó đã tồn tại 
				if (email !== user.email && check_email) {
					err.push({ msg: 'Email đã tồn tại!' });
				}
				if (err.length > 0) {
					res.render('account', {
						//save data khi nhập sai
						err,
						name, 
						email,
						phone, 
						address, 
						type
					});
				}
				else{

       	 			// Match password
       	 			bcrypt.compare(password, user.password, (err1, isMatch) => {
       	 				if (err1) throw err1;
       	 				if (!isMatch) {
       	 					err.push({msg: 'Mật khẩu không đúng!'});
       	 					res.render('account', {
								//save data khi nhập sai
								err,
								name,
								email,
								phone, 
								address, 
								type
							});
       	 				} else {
       	 					user.name = name;
       	 					user.email = email;
       	 					user.phone = phone; 
       	 					user.address = address; 
       	 					user.type = type ;
       	 					bcrypt.genSalt(10, (er, salt) => {
       	 						bcrypt.hash(password1, salt, (er, hash) => {
       	 							if (er) throw er;
										//set password to hashed
										user.password = hash;
									//save admin
									user.save()
									.then(admin => {
										req.flash('success_msg', 'Bạn đã cập nhật tài khoản thành công');
										res.redirect('/account');
									})
									.catch(er => console.log(er));
								});
       	 					});
       	 				}
       	 			});
       	 		}
       	 	});
		}
	}
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success_msg', 'Bạn đã đăng xuất');
	res.redirect('/login');
};

module.exports.forgetPassword = (req, res, next) => {
	res.render('forget-password', {title : 'Quên mật khẩu'});
};

module.exports.showUser =  (req, res, next) => {
	admins.findById(req.query.id, function (err, userData) {
		//console.log(userData);
		if (err) {
			console.log("Can't show data\n");
			res.sendStatus(500);
		} else {
			res.render('show-user', {title : 'Thông tin nhân viên', data: userData, type});
		}
	})
}

module.exports.editEmployee =  (req, res, next) => {
	admins.findById(req.query.id, (err, user) => {
		if (err) {
			console.error('error, no entry found');
		}
		// console.log(user.type);
		// console.log(req.body.type);
		user.type = req.body.type;
		// console.log(user.type);
		user.save();
	});
	res.redirect('/employees');
};