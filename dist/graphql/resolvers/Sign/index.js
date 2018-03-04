'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Mutation = exports.Query = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _yup = require('yup');

var _yup2 = _interopRequireDefault(_yup);

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _User = require('../../../models/User');

var _User2 = _interopRequireDefault(_User);

var _User3 = require('../../../models/User.Agent');

var _User4 = _interopRequireDefault(_User3);

var _User5 = require('../../../models/User.Player');

var _User6 = _interopRequireDefault(_User5);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _SystemLog = require('../../../models/SystemLog');

var _SystemLog2 = _interopRequireDefault(_SystemLog);

var _uniqid = require('uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
//import Transaction from '../../../models/Transaction';

//import PriceRate from '../../../models/PriceRate';


var transporter = _nodemailer2.default.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: _config2.default.GMAIL, // generated ethereal user
		pass: _config2.default.GPASSWORD // generated ethereal password
	}
});

var forgotPasswordSchema = _yup2.default.object().shape({
	email: _yup2.default.string().email().required(),
	passcode: _yup2.default.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4).max(4).required()
});

var agentRegisterSchema = _yup2.default.object().shape({
	username: _yup2.default.string().matches(/^\w+$/, 'Username format is invalid.').min(4).max(10).required(),
	email: _yup2.default.string().email().required(),
	password: _yup2.default.string().min(4).max(12).required(),
	passcode: _yup2.default.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4).max(4).required(),
	deviceToken: _yup2.default.string()
});

var playerRegisterSchema = _yup2.default.object().shape({
	playerUsername: _yup2.default.string().matches(/^\w+$/, 'Username format is invalid.').min(4 | null, 'Username at least 4 characters.').max(10).required('Username required'),
	playerNickname: _yup2.default.string().matches(/^\w+$/, 'Nickname format is invalid.').max(10).required('Nickname required'),
	playerPassword: _yup2.default.string().min(4 | null, 'Password at least 4 characters.').max(12).required('Password required'),
	playerPasscode: _yup2.default.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4 | null, 'Passcode requires 4 digits.').max(4).required('Passcode required'),
	initial: _yup2.default.number().integer().min(0).max(999999).required(),
	minRisk: _yup2.default.number().integer().positive().min(10 | null, 'Minimun Risk must greater then 10.').max(999999).required(),
	maxWin: _yup2.default.number().integer().min(0).max(999999).required(),
	parlay: _yup2.default.boolean(),
	basicTeaser: _yup2.default.boolean(),
	specialTeaser: _yup2.default.boolean(),
	bigTeaser: _yup2.default.boolean(),
	superTeaser: _yup2.default.boolean(),
	winReverse: _yup2.default.boolean(),
	actionReverse: _yup2.default.boolean(),
	parlayTeam: _yup2.default.number().integer().positive().min(2).max(8).required(),
	basicTeaserTeam: _yup2.default.number().integer().positive().min(2).max(8).required(),
	specialTeaserTeam: _yup2.default.number().integer().positive().min(2).max(8).required(),
	bigTeaserTeam: _yup2.default.number().integer().positive().min(2).max(8).required(),
	winReverseTeam: _yup2.default.number().integer().positive().min(2).max(4).required(),
	actionReverseTeam: _yup2.default.number().integer().positive().min(2).max(4).required(),
	passcode: _yup2.default.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4).max(4).required()
});

var userRegisterSchema = _yup2.default.object().shape({
	username: _yup2.default.string().matches(/^\w+$/, 'Username format is invalid.').min(4).max(10).required(),
	email: _yup2.default.string().email().required(),
	password: _yup2.default.string().min(4).max(12).required(),
	passcode: _yup2.default.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4).max(4).required()
});

var Query = exports.Query = {};

var Mutation = exports.Mutation = {
	playerAloneRegister: function playerAloneRegister(root, req) {
		var _this = this;

		return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
			var isReqValid, isUserExisted, newPlayer, newPlayerSaved;
			return regeneratorRuntime.wrap(function _callee$(_context) {
				while (1) {
					switch (_context.prev = _context.next) {
						case 0:
							_context.prev = 0;

							console.log(req.username);
							_context.next = 4;
							return userRegisterSchema.isValid(req);

						case 4:
							isReqValid = _context.sent;

							if (isReqValid) {
								_context.next = 10;
								break;
							}

							_context.next = 8;
							return userRegisterSchema.validate(req).catch(function (err) {
								return err.message;
							});

						case 8:
							_context.t0 = _context.sent;
							return _context.abrupt('return', {
								title: 'Please try again.',
								content: _context.t0,
								status: 'warning'
							});

						case 10:
							_context.next = 12;
							return _User2.default.findOne({ $or: [{ username: new RegExp('\\b' + req.username + '\\b', 'i') }, { email: new RegExp('\\b' + req.email + '\\b', 'i') }] });

						case 12:
							isUserExisted = _context.sent;

							if (!isUserExisted) {
								_context.next = 15;
								break;
							}

							return _context.abrupt('return', { title: req.username, content: 'Username or Email has already been taken.', status: 'warning' });

						case 15:
							newPlayer = new _User6.default({
								portrait: '/',
								username: req.username,
								password: req.password,
								passcode: req.passcode,
								email: req.email,
								lastOnlineAt: (0, _moment2.default)(),
								updatedAt: (0, _moment2.default)(),
								createdAt: (0, _moment2.default)(),
								notification: {
									deviceToken: '',
									afterWager: false,
									afterPick: false,
									afterBetOrder: false
								},
								weekNum: (0, _moment2.default)().isoWeek(),
								isActivate: true,
								isDeleted: false,
								Agent: null,
								wagerLimit: {
									initialCredit: 10000,
									straight: true,
									parlay: true,
									basicTeaser: true,
									specialTeaser: true,
									bigTeaser: true,
									superTeaser: true,
									actionReverse: true,
									winReverse: true,
									maxWin: 999999,
									minRisk: 10,
									straightTeam: 1,
									parlayTeam: 8,
									basicTeaserTeam: 8,
									specialTeaserTeam: 8,
									bigTeaserTeam: 8,
									superTeaserTeam: 3,
									actionReverseTeam: 4,
									winReverseTeam: 4,
									updatedAt: (0, _moment2.default)()
								}
							});
							_context.next = 18;
							return newPlayer.save();

						case 18:
							newPlayerSaved = _context.sent;
							_context.next = 21;
							return _SystemLog2.default.create({ title: 'New Player Create Success', content: req.username, status: 'success' });

						case 21:
							return _context.abrupt('return', { title: 'New Player Registed', content: _jsonwebtoken2.default.sign(_lodash2.default.pick(newPlayerSaved, ['_id', 'role', 'username', 'isUnderAgent']), _config2.default.jwtSecret), status: 'success' });

						case 24:
							_context.prev = 24;
							_context.t1 = _context['catch'](0);
							_context.next = 28;
							return _SystemLog2.default.create({ title: 'New Player Create Failed', content: req.username + ' ' + _context.t1, status: 'danger' });

						case 28:
							return _context.abrupt('return', { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' });

						case 29:
						case 'end':
							return _context.stop();
					}
				}
			}, _callee, _this, [[0, 24]]);
		}))();
	},
	playerLogin: function playerLogin(root, req) {
		var _this2 = this;

		return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
			var player, token;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							_context2.prev = 0;
							_context2.next = 3;
							return _User6.default.findOne({ username: new RegExp('\\b' + req.username + '\\b', 'i'), password: req.password });

						case 3:
							player = _context2.sent;

							if (player) {
								_context2.next = 6;
								break;
							}

							return _context2.abrupt('return', { title: 'Login Failed', content: 'Username or Password is incorrect', status: 'warning' });

						case 6:
							token = _jsonwebtoken2.default.sign(_lodash2.default.pick(player, ['_id', 'role', 'username', 'isUnderAgent']), _config2.default.jwtSecret);
							return _context2.abrupt('return', { title: 'PlayerNavigator', content: token, status: 'success' });

						case 10:
							_context2.prev = 10;
							_context2.t0 = _context2['catch'](0);
							return _context2.abrupt('return', { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' });

						case 13:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, _this2, [[0, 10]]);
		}))();
	}

	// async agentRegister(root, req) {
	// 	try {
	// 		const isReqValid = await agentRegisterSchema.isValid(req);
	// 		if(!isReqValid) return { title: 'Please try again.', content: await agentRegisterSchema.validate(req).catch(err => err.message), status: 'warning' };
	// 		const isUserExisted = await User.findOne({ username: new RegExp('\\b' + req.username + '\\b', 'i') });
	// 		if(isUserExisted) return { title: req.username, content: 'Username has already been taken.', status: 'warning' };
	// 		const isEmailExisted = await User.findOne({ email: new RegExp('\\b' + req.email + '\\b', 'i') });
	// 		if(isEmailExisted) return { title: req.email, content: 'Email has already been taken.', status: 'warning' };

	// 		const newAgentBonus = await PriceRate.findOne({ item: 'NewAgentBonus' })

	// 		const agent = new Agent({
	// 			username: req.username,
	// 			email: req.email,
	// 			password: req.password,
	// 			passcode: req.passcode,
	// 			weekNum: moment().isoWeek(),
	// 			credit: { 
	// 				balance: newAgentBonus.credit
	// 			},
	// 			notification: {
	// 				deviceToken: req.deviceToken
	// 			},
	// 			Players: [],
	// 			deletedPlayers: [],
	// 		});
	// 		const newAgent = await agent.save();
	// 		console.log(newAgent.notification)
	// 		await Transaction.create({ 
	// 			Agent: newAgent._id,
	// 			ID: uniqid.process(),
	// 			type: 'Bonus',
	// 			description: 'New Agent Bonus',
	// 			amount: newAgentBonus.credit,
	// 			balance: newAgent.credit.balance
	// 		});
	// 		await SystemLog.create({ title: 'New Agent Created', content: req.username, status: 'success' });
	// 		await SystemLog.create({ title: 'New Agent Bonus ' + newAgentBonus.credit, content: req.username, status: 'success' });
	// 		return { title: 'Created New Agent', content: jwt.sign(_.pick(newAgent, ['_id', 'role', 'username']), config.jwtSecret), status: 'success' };
	// 	} catch(e) {
	// 		await SystemLog.create({ title: 'New Agent Failed', content: `${req.username} ${e}`, status: 'danger' });
	// 		return { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' };
	// 	}
	// },

	// async login(root, req) {
	// 	try {

	// 		const deviceToken = req.deviceToken ? { $set: { 'notification.deviceToken': req.deviceToken } } : null

	// 		const user = await User.findOneAndUpdate({ username: new RegExp('\\b' + req.username + '\\b', 'i'), password: req.password }, deviceToken);

	// 		if(!user) return { title: 'Login Failed', content: 'Username or Password is incorrect', status: 'warning' };

	// 		const token = jwt.sign(_.pick(user, ['_id', 'role', 'username']), config.jwtSecret);
	// 		return { title: `${user.role}Navigator`, content: token, status: 'success' };
	// 	} catch(e) {
	// 		return { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' };
	// 	}
	// },

	// async playerRegister(root, req, ctx) {
	// 	try {
	// 		if(ctx.user.role !== 'Agent') return { title: 'Not Authenticated', content: 'Please try again.', status: 'danger' };
	// 		const agent = await Agent.findOne({ _id: mongoose.Types.ObjectId(ctx.user._id), passcode: req.passcode });
	// 		if(!agent) return { title: 'Passcode Not Match', content: 'Please try again.', status: 'warning' };
	// 		const isReqValid = await playerRegisterSchema.isValid(req);
	// 		if(!isReqValid) return { title: 'Please try again.', content: await playerRegisterSchema.validate(req).catch(err => err.message), status: 'warning' };
	// 		const isUserExisted = await User.findOne({ username: new RegExp('\\b' + req.playerUsername + '\\b', 'i') }, '_id');

	// 		if(isUserExisted) return { title: req.playerUsername, content: 'Username has already been taken.', status: 'warning' };

	// 		const player = new Player({
	// 			portrait: '/',
	// 			username: req.playerUsername,
	// 			nickname: req.playerNickname,
	// 			password: req.playerPassword,
	// 			passcode: req.playerPasscode,
	// 			Agent: ctx.user._id,
	// 			weekNum: moment().isoWeek(),
	// 			isActivate: true,
	// 			isDeleted: false,
	// 			credit: {
	// 				initial: Number(req.initial),
	// 			},
	// 			notification: {},
	// 			wagerLimit: {
	// 				parlay: req.parlay,
	// 				basicTeaser: req.basicTeaser,
	// 				specialTeaser: req.specialTeaser,
	// 				bigTeaser: req.bigTeaser,
	// 				superTeaser: req.superTeaser,
	// 				actionReverse: req.actionReverse,
	// 				winReverse: req.winReverse,
	// 				maxWin: Number(req.maxWin),
	// 				minRisk: Number(req.minRisk),
	// 				parlayTeam: req.parlayTeam,
	// 				basicTeaserTeam: req.basicTeaserTeam,
	// 				specialTeaserTeam: req.specialTeaserTeam,
	// 				bigTeaserTeam: req.bigTeaserTeam,
	// 				actionReverseTeam: req.actionReverseTeam,
	// 				winReverseTeam: req.winReverseTeam,
	// 			}
	// 		});

	// 		const newPlayer = await player.save();

	// 		const newPriceCost = await PriceRate.findOne({ item: 'NewPlayerCost' })

	// 		const agentUpdated = await Agent.findOneAndUpdate({ 
	// 			_id: mongoose.Types.ObjectId(ctx.user._id) 
	// 		}, { 
	// 			$push: { Players: newPlayer._id }, 
	// 			$inc: { 'credit.balance': newPriceCost.credit }, 
	// 			$set: { 'credit.updatedAt': moment() } 
	// 		}, { new: true });

	// 		await Transaction.create({
	// 			Agent: ctx.user._id,
	// 			ID: uniqid.process(),
	// 			type: 'CreatePlayer',
	// 			description: `New Player ${newPlayer.username} (${newPlayer.nickname})`,
	// 			amount: newPriceCost.credit,
	// 			balance: agentUpdated.credit.balance
	// 		});

	// 		await SystemLog.create({ title: 'New Player Created', content: `${agentUpdated.username} created a new player ${newPlayer.username} (${newPlayer.nickname})`, status: 'success'});
	// 		return { title: 'New Player', content: newPlayer.username, status: 'success' };
	// 	} catch(e) {
	// 		await SystemLog.create({ title: 'New Player Create Failed', content: `${ctx.user.username} create player ${req.playerUsername} failed ${e}`, status: 'danger'});
	// 		return { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' };
	// 	}

	// },
	// async forgotPassword(root, req){
	// 	try {
	// 		const isReqValid = await forgotPasswordSchema.isValid(req);
	// 		if(!isReqValid) return { title: 'Please try again.', content: await forgotPasswordSchema.validate(req).catch(err => err.message), status: 'warning' };
	// 		const tempPassword = uniqid.process().substring(0, 6);
	// 		const agent = await Agent.findOneAndUpdate({ email: req.email, passcode: req.passcode }, { $set: { password: tempPassword }});
	// 		if(!agent) return { title: 'ERROR.', content: 'Email or Passcode incorrect', status: 'danger' };

	// 		const mailOptions = {
	// 		    from: config.GMAIL, // sender address
	// 		    to: agent.email, // list of receivers
	// 		    subject: 'SPORTS AGENT APP PASSWORD RESET', // Subject line
	// 		    text: `Sports Agent App \n username: ${agent.username} \n temporary password: ${tempPassword} \n Please set up a new password after login.`, // plain text body
	// 		};

	// 		await transporter.sendMail(mailOptions);
	// 		return { title: 'SUCCESS', content: agent.email, status: 'success' };


	// 	} catch(e) {
	// 		await SystemLog.create({ title: 'Agent Reset Password Error', content: `${req.email} ${req.passcode} failed ${e}`, status: 'danger'});
	// 		return { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' };
	// 	}

	// }

};
//# sourceMappingURL=index.js.map