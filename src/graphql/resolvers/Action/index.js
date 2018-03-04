import config from '../../../config'
import Table from '../../../models/Table';
import Event from '../../../models/Event';
import Agent from '../../../models/User.Agent';
import Player from '../../../models/User.Player';
import Pick from '../../../models/Pick';
import BetOrder from '../../../models/BetOrder';
import moment from 'moment';
import mongoose from 'mongoose';
import _ from 'lodash';
import uniqid from 'uniqid';

import generateAtRiskToWin from '../../../utils/functions/generateAtRiskToWin';
import renameActionToTable from '../../../utils/functions/renameActionToTable';
import renameActionFullName from '../../../utils/functions/renameActionFullName';
import sportTypes from '../../../utils/lists/sportTypes';
import periodTypes from '../../../utils/lists/periodTypes';

import minActionTeams from '../../../utils/objects/minActionTeams';

import updateEvents from '../../../queues/updateEvents';
import updateTables from '../../../queues/updateTables';
import SystemLog from '../../../models/SystemLog';

import getPlayerCurrentCredit from '../../../services/getUserCredit/player'
// import Transaction from '../../../models/Transaction';
// import PriceRate from '../../../models/PriceRate';

// import apnProvider from '../../../apn'
// import apn from 'apn'

export const Query = {
	async table(root, req) {
		// await updateEvents()
		await updateTables();
		let table = await Table.findOne({ name: renameActionToTable(req.action) });
		table.sports.sort((a, b) => sportTypes.indexOf(a.name) - sportTypes.indexOf(b.name));
		table.sports.map(sport => sport.leagues.map(league => league.periods.sort((a, b) => periodTypes.indexOf(a.name) - periodTypes.indexOf(b.name))));
		return table;
	},
	async actionEvents(root, { action, tablePicks }) {
		if(_.isEmpty(tablePicks)) return [];
		//		await updateEvents()
		return Event.find({ $or: tablePicks, cutOffAt: { $gte: moment() }, status: 'Pending', isFinished: false }).sort({ cutOffAt: 1 })
			.then(events => _.compact(events.map(event => { event.action = action; if(event.isActionOddActivate) { return event; } else { return null; } })));
	},
	async wagerPicks(root, { action, eventOddPicks }) {
		if(_.isEmpty(eventOddPicks)) return [];
		//		await updateEvents()
		const eventIDs = _.uniqBy(eventOddPicks.map(pick => ({ _id: mongoose.Types.ObjectId(pick.Event) })), '_id');
		const events = await Event.find({ $or: eventIDs }).then(events => events.map(event => { event.action = action; return event; } ));
		return eventOddPicks.map(pick => {
			let event = _.find(events, event => event._id.toString() === pick.Event );
			return {
				ID: pick.ID,
				Event: event,
				marked: {
					oddLine: event.actionOdd[pick.marked.oddLineTarget] || null,
					oddPoint: event.actionOdd[pick.marked.oddPointTarget] || null,
					oddTarget: pick.marked.oddTarget,
					oddType: pick.marked.oddType,
					oddLineTarget: pick.marked.oddLineTarget,
					oddPointTarget: pick.marked.oddPointTarget,
				}
			};
		});
	}
};

export const Mutation = {
	async createBetOrder(root, { action, passcode, betType, betAmount, atRisk, toWin, picks }, ctx) {
		try {
		//validation
			const player = await Player.findOne({ _id: mongoose.Types.ObjectId(ctx.user._id), passcode: passcode });
			if(!player) return { title: 'Passcode Not Match', content: 'Please try again.', status: 'warning' };

			if(player.isUnderAgent && !player.isActivate) return { title: 'Account Has Deactivated', content: 'Please contact Agent.', status: 'warning' };


			const { atRisk: recalAtRisk, toWin: recalToWin } = generateAtRiskToWin( action, betType, betAmount, picks );

			if( atRisk !== Number(recalAtRisk) || toWin !== Number(recalToWin) ) return { title: 'Bet Amount Error', content: 'Please try again.', status: 'warning' };

			const { available } = await getPlayerCurrentCredit(ctx.user._id)

			if( atRisk > available ) return { title: 'You Have Not Enough Credit', content: available, status: 'warning' };

			if( picks.length > player.wagerLimit[action+'Team'] ) return { title: renameActionFullName(action) + ' Teams Over Wager Limit', content: 'Please try again.', status: 'warning' };
			if( picks.length < minActionTeams[action] ) return { title: renameActionFullName(action) + ' Teams Under ' + minActionTeams[action], content: 'Please try again.', status: 'warning' };
			if( toWin > player.wagerLimit.maxWin ) return { title: 'Win Amount Over Wager Limit ' + player.wagerLimit.maxWin, content: 'Please try again or contact Agent.', status: 'warning' };
			if( atRisk < player.wagerLimit.minRisk ) return { title: 'Risk Amount Under ' + player.wagerLimit.minRisk, content: 'Please try again or contact Agent.', status: 'warning' };
			//

			//check duplicate order
			const pickIDs = picks.map(pick => pick.ID);
			const existedOpenBets = await BetOrder.find({ Player: mongoose.Types.ObjectId(ctx.user._id), 'bet.action': action, isClosed: false }, 'ID Picks createdAt').populate({ path: 'Picks', select: 'ID' }).then(betOrders => betOrders.map(betOrder => ({ ID: betOrder.ID, createdAt: betOrder.createdAt, Picks: betOrder.Picks.map(Pick => Pick.ID)}) ));
			for(let existedOpenBet of existedOpenBets){
				if(_.isEqual(pickIDs, existedOpenBet.Picks)) {
					return { 
						title: 'Order Duplicated', 
						content: `#${existedOpenBet.ID.toUpperCase()} Submitted On:, ${moment(existedOpenBet.createdAt).format('ddd MMM DD - hh:mm A')}`, 
						status: 'warning' 
					}; 
				}
			}
			//

			// check latest odd
//			await updateEvents();

			const uniqEventIDs = _.uniqBy(picks.map(pick => pick.Event));
			const mongooseEventIDs =  uniqEventIDs.map(eventID => ({ _id: mongoose.Types.ObjectId(eventID) }));
			const latestEvents = await Event.find( { $or: mongooseEventIDs }).then(events => events.map(event => { event.action = action; return event; }));
			for( let pick of picks){
				let latestEvent = _.find(latestEvents, { _id: mongoose.Types.ObjectId(pick.Event) });
				if(!latestEvent) return { title: 'Event Error', content: 'Please pick other event.', status: 'warning' };
				let { sport, league, period, cutOffAt,team: { away, home } } =  latestEvent;
				let eventDetail = `${sport} ${league} ${period},${away} vs ${home}`;
				if(latestEvent.isOddExpired) return { title: `Odd Expired ${moment(cutOffAt).format('hh:mm A')}`, content: eventDetail, status: 'warning' };
				if(!latestEvent.isActionOddActivate) return { title: 'Event Not Available', content: eventDetail, status: 'warning' };
				let latestOddPoint = latestEvent.actionOdd[pick.marked.oddPointTarget] || null;
				let latestOddLine = latestEvent.actionOdd[pick.marked.oddLineTarget] || null;
				let pickOddPoint = pick.marked.oddPoint || null;
				let pickOddLine = pick.marked.oddLine || null;
				let oddUpdatedDetail = `${pick.marked.oddType} ${pick.marked.oddTarget} ${ pickOddPoint ? `( ${pickOddPoint} ) ` : '' }${pickOddLine} to ${ latestOddPoint ? `( ${latestOddPoint} ) ` : '' }${latestOddLine}`;
				if(latestOddPoint !== pickOddPoint || latestOddLine !== pickOddLine) return { title: 'Odd Has Update', content: `${eventDetail}, ${oddUpdatedDetail}`, status: 'warning' };
			}
			//
		
			await Event.update({ $or: mongooseEventIDs }, { $set: { isPicked: true } }, { multi: true });

			const newBetOrder = new BetOrder({
				ID: uniqid.process(),
				Player: ctx.user._id,
				Agent: player.Agent || null,
				bet: {
					action: action,
					type: betType,
					amount: betAmount,
					toWin: toWin,
					atRisk: atRisk,
				},
				resultAmount: null,
				isClosed: false,
				status: 'Pending',
				note: {},
				updatedAt: moment(),
				createdAt: moment()
			});
			const savedBetOrder = await newBetOrder.save();
			const newPicks = picks.map(pick => {
				return new Pick({
					ID: pick.ID,
					Player: ctx.user._id,
					Agent: player.Agent || null,
					BetOrder: savedBetOrder._id,
					Event: pick.Event,
					marked: pick.marked,
					isClosed: false,
					status: 'Pending',
					note: {},
					updatedAt: moment(),
					created: moment(),
				});
			});

			const savedPickIDs = await Pick.insertMany(newPicks).then(picks => picks.map(pick => pick._id));
			const theBetOrder = await BetOrder.findOneAndUpdate({ _id: mongoose.Types.ObjectId(savedBetOrder._id) }, { $set: { Picks: savedPickIDs } }, { new: true });

			// const actionFee = await PriceRate.findOne({ item: 'PlayerActionFee' })

			// await Player.findOneAndUpdate({ _id: mongoose.Types.ObjectId(ctx.user._id) }, { $inc: { 'credit.pending': atRisk }, $set: { 'credit.updatedAt': moment() } });
			// const agent = await Agent.findOneAndUpdate({_id: mongoose.Types.ObjectId(player.Agent) }, { $inc: { 'credit.pending': atRisk, 'credit.balance': actionFee.credit }, $set: { 'credit.updatedAt': moment() } }, { new: true });

			

			// await Transaction.create({ 
			// 	Agent: agent._id,
			// 	ID: savedBetOrder.ID,
			// 	type: 'ActionFee',
			// 	description: `(${ctx.user.username}) Transaction (Bet) Fee`,
			// 	amount: actionFee.credit,
			// 	balance: agent.credit.balance
			// });

			// await SystemLog.create({ title: 'New Open Bet Order', content: `${ctx.user.username} created a open bet ${theBetOrder.title}`, status: 'success' });

			// if(agent.notification.afterWager){
			// 	const agentNotify = new apn.Notification({
			// 		sound: 'ping.aiff',
			// 		alert: `${player.username} had submitted a ${theBetOrder.title}, At Risk: ${theBetOrder.bet.atRisk}, To Win: ${theBetOrder.bet.toWin}`,
			// 		topic: config.APN_TOPIC,
			// 		payload: { BetOrder: theBetOrder._id }
			// 	})

			// 	await apnProvider.send(agentNotify, agent.notification.deviceToken)
			// 	apnProvider.shutdown();
			// }

			return { title: 'SUCCESS', content: `#${savedBetOrder.ID.toUpperCase()} CREATED`, status: 'success' };
		} catch (e) {
			console.log(e)
			await SystemLog.create({ title: 'New Open Bet Order Failed', content: `${ctx.user.username} created a open bet Failed ${e}`, status: 'danger'});
			return { title: 'Unknow Error', content: 'Please try again later!', status: 'danger' };
		}
	}
};
