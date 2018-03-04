import mongoose from 'mongoose';
import User from '../../../models/User';
import Agent from '../../../models/User.Agent';
import Player from '../../../models/User.Player';
import BetOrder from '../../../models/BetOrder'
import moment from 'moment';
import _ from 'lodash';
import SystemLog from '../../../models/SystemLog';

import getPlayerCurrentCredit from '../../../services/getUserCredit/player'

export const Query = {
	user(root, req, ctx){
		console.log('user')
		return User.findOne({ _id: mongoose.Types.ObjectId(ctx.user._id) });
	},
	agent(root, req, ctx){
		if(ctx.user && ctx.user.role !== 'Agent') return null;
		return Agent.findOne({ _id: mongoose.Types.ObjectId(ctx.user._id) });
	},
	player(root, req, ctx){
		if(ctx.user.role === 'Guest') return null;
		return Player.findOne({ _id: mongoose.Types.ObjectId(ctx.user._id) });
	},
	agentPlayers(root, req, ctx) {
		if(ctx.user.role !== 'Agent') return null;
		return Player.find({ Agent: mongoose.Types.ObjectId(ctx.user._id) });
	},
	agentPlayer(root, req, ctx){
		if(ctx.user.role !== 'Agent' || req.Player === '') return null;
		return Player.findOne({ _id: mongoose.Types.ObjectId(req.Player) });
	},

	async playerCurrentCredit(root, req, ctx){
		return getPlayerCurrentCredit(ctx.user._id)
	},

};

export const Mutation = {
	async switchPlayerActivate(root, req, ctx){
		if(ctx.user.role !== 'Agent') return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
		const player = await Player.findOneAndUpdate({ Agent: mongoose.Types.ObjectId(ctx.user._id), _id: mongoose.Types.ObjectId(req.Player) }, { $set: { isActivate: req.isActivate } }, { new: true });
		if(!player) return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
		return { title: player.username, content: player.isActivate, status: 'success' };
	},
	async playerMutation(root, req, ctx){
		try { 
			if(ctx.user.role !== 'Agent') return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
			if(_.isEmpty(req.Player)) return { title: 'Missing Player', content: 'Please try again.', status: 'warning' };
			if(_.isEmpty(req.passcode)) return { title: 'Missing Passcode', content: 'Please try again.', status: 'warning' };
			const agent = await Agent.findOne({ _id: mongoose.Types.ObjectId(ctx.user._id) }, 'passcode');
			if(agent.passcode !== req.passcode) return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
			const player = await Player.findOne({ Agent: mongoose.Types.ObjectId(ctx.user._id), _id: mongoose.Types.ObjectId(req.Player) });
			if(!player) return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };

			if(!_.isEmpty(req.newNickname)) { await Player.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.Player) }, { $set: { nickname: req.newNickname } }); }
			if(!_.isEmpty(req.newPassword)) { await Player.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.Player) }, { $set: { password: req.newPassword } }); }
			if(!_.isEmpty(req.newPasscode)) { await Player.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.Player) }, { $set: { passcode: req.newPasscode } }); }
			if(!_.isEmpty(req.newInitial)) { await Player.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.Player) }, { $set: { 'credit.initial': Number(req.newInitial) } }); }
			if(!_.isEmpty(req.newMaxWin)){ await Player.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.Player) }, { $set: { 'wagerLimit.maxWin': Number(req.newMaxWin) } }); }
			if(!_.isEmpty(req.newMinRisk)){ await Player.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.Player) }, { $set: { 'wagerLimit.minRisk': Number(req.newMinRisk) } }); }

			if(req.isSetNewWagerLimit){
				await Player.findOneAndUpdate( { _id: mongoose.Types.ObjectId(req.Player) }, { $set: { 
					'wagerLimit.parlay': req.newParlay,
					'wagerLimit.parlayTeam': req.newParlayTeam,
					'wagerLimit.basicTeaser': req.newBasicTeaser,
					'wagerLimit.basicTeaserTeam': req.newBasicTeaserTeam,
					'wagerLimit.specialTeaser': req.newSpecialTeaser,
					'wagerLimit.specialTeaserTeam': req.newSpecialTeaserTeam,
					'wagerLimit.bigTeaser': req.newBigTeaser,
					'wagerLimit.bigTeaserTeam': req.newBigTeaserTeam,
					'wagerLimit.superTeaser': req.newSuperTeaser,
					'wagerLimit.winReverse': req.newWinReverse,
					'wagerLimit.winReverseTeam': req.newWinReverseTeam,
					'wagerLimit.actionReverse': req.newActionReverse,
					'wagerLimit.actionReverseTeam': req.newActionReverseTeam,
					'wagerLimit.updatedAt': moment()
				}});
			}
			await SystemLog.create({ title: 'Updated Player', content: `${ctx.user.username} Updated Player ${player.username}`, status: 'success' });
			return { title: 'Edit', content: 'Successful', status: 'success' };
		} catch (e) {
			await SystemLog.create({ title: 'Update Player Failed', content: `${ctx.user.username} Updated Player Failed ${req.Player} ${e}`, status: 'danger' });
			return { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' };
		}
	},
	async switchUserNotification(root, req, ctx){
		if(ctx.user.role === 'Guest') return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
		const user = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(ctx.user._id) }, { $set: { ['notification.'+Object.keys(req)[0]]: req[Object.keys(req)[0]] } })
		if(!user) return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
		return { title: ctx.user.username, content: 'success', status: 'success' };
	}
};






