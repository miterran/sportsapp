import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import yup from 'yup';
import config from '../../../config';
import User from '../../../models/User';
import Agent from '../../../models/User.Agent';
import Player from '../../../models/User.Player';
import moment from 'moment';
import _ from 'lodash';
//import Transaction from '../../../models/Transaction';
import SystemLog from '../../../models/SystemLog';
import uniqid from 'uniqid';
//import PriceRate from '../../../models/PriceRate';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
    auth: {
        user: config.GMAIL, // generated ethereal user
        pass: config.GPASSWORD // generated ethereal password
    }
});

const forgotPasswordSchema = yup.object().shape({
	email: yup.string().email().required(),
	passcode: yup.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4).max(4).required()
});

const agentRegisterSchema = yup.object().shape({
	username: yup.string().matches(/^\w+$/, 'Username format is invalid.').min(4).max(10).required(),
	email: yup.string().email().required(),
	password: yup.string().min(4).max(12).required(),
	passcode: yup.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4).max(4).required(),
	deviceToken: yup.string()
});

const playerRegisterSchema = yup.object().shape({
	playerUsername: yup.string().matches(/^\w+$/, 'Username format is invalid.').min(4 | null, 'Username at least 4 characters.').max(10).required('Username required'),
	playerNickname: yup.string().matches(/^\w+$/, 'Nickname format is invalid.').max(10).required('Nickname required'),
	playerPassword: yup.string().min(4 | null, 'Password at least 4 characters.').max(12).required('Password required'),
	playerPasscode: yup.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4 | null, 'Passcode requires 4 digits.').max(4).required('Passcode required'),
	initial: yup.number().integer().min(0).max(999999).required(),
	minRisk: yup.number().integer().positive().min(10 | null, 'Minimun Risk must greater then 10.').max(999999).required(),
	maxWin: yup.number().integer().min(0).max(999999).required(),
	parlay: yup.boolean(),
	basicTeaser: yup.boolean(),
	specialTeaser: yup.boolean(),
	bigTeaser: yup.boolean(),
	superTeaser: yup.boolean(),
	winReverse: yup.boolean(),
	actionReverse: yup.boolean(),
	parlayTeam: yup.number().integer().positive().min(2).max(8).required(),
	basicTeaserTeam: yup.number().integer().positive().min(2).max(8).required(),
	specialTeaserTeam: yup.number().integer().positive().min(2).max(8).required(),
	bigTeaserTeam: yup.number().integer().positive().min(2).max(8).required(),
	winReverseTeam: yup.number().integer().positive().min(2).max(4).required(),
	actionReverseTeam: yup.number().integer().positive().min(2).max(4).required(),
	passcode: yup.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4).max(4).required()
});

const userRegisterSchema = yup.object().shape({
	username: yup.string().matches(/^\w+$/, 'Username format is invalid.').min(4).max(10).required(),
	email: yup.string().email().required(),
	password: yup.string().min(4).max(12).required(),
	passcode: yup.string().matches(/^[0-9]+$/, 'Passcode format is invalid.').min(4).max(4).required()
});


export const Query = {

};

export const Mutation = {

	async playerAloneRegister(root, req){
		try {
			console.log(req.username)
			const isReqValid = await userRegisterSchema.isValid(req);
			if(!isReqValid) return { title: 'Please try again.', content: await userRegisterSchema.validate(req).catch(err => err.message), status: 'warning' };
			const isUserExisted = await User.findOne({ $or: [ { username: new RegExp('\\b' + req.username + '\\b', 'i') }, { email: new RegExp('\\b' + req.email + '\\b', 'i') } ]});
			if(isUserExisted) return { title: req.username, content: 'Username or Email has already been taken.', status: 'warning' };
			const newPlayer = new Player({
				portrait: '/',
				username: req.username,
				password: req.password,
				passcode: req.passcode,
				email: req.email,
				lastOnlineAt: moment(),
				updatedAt: moment(),
				createdAt: moment(),
				notification:{
					deviceToken: '',
					afterWager: false,
					afterPick: false,
					afterBetOrder: false,
				},
				weekNum: moment().isoWeek(),
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
					updatedAt: moment(),
				},
			})
			const newPlayerSaved = await newPlayer.save()
			await SystemLog.create({ title: 'New Player Create Success', content: req.username, status: 'success' });
			return { title: 'New Player Registed', content: jwt.sign(_.pick(newPlayerSaved, ['_id', 'role', 'username', 'isUnderAgent']), config.jwtSecret), status: 'success' };
		}catch(e){
			await SystemLog.create({ title: 'New Player Create Failed', content: `${req.username} ${e}`, status: 'danger' });
			return { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' };
		}

	},

	async playerLogin(root, req) {
		try {
			const player = await Player.findOne({ username: new RegExp('\\b' + req.username + '\\b', 'i'), password: req.password });
			if(!player) return { title: 'Login Failed', content: 'Username or Password is incorrect', status: 'warning' };
			const token = jwt.sign(_.pick(player, ['_id', 'role', 'username', 'isUnderAgent']), config.jwtSecret);
			return { title: `PlayerNavigator`, content: token, status: 'success' };
		} catch(e) {
			return { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' };
		}
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