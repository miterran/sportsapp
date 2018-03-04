import _ from 'lodash';
import moment from 'moment';
import BetOrder from '../../models/BetOrder';
import Player from '../../models/User.Player';
import Agent from '../../models/User.Agent';
import SystemLog from '../../models/SystemLog';
import settleBetOrder from '../../utils/functions/settleBetOrder';
import config from '../../config'

// import apnProvider from '../../apn'
// import apn from 'apn'

const updateBetOrderResult = async () => {
	// eslint-disable-next-line
	console.log('update bet order result')
	try {
		
		const betOrders = await BetOrder.find({ isClosed: false, status: 'Pending' }, 'Player Agent bet Picks')
		.populate({ path: 'Picks', select: 'status marked.oddLine' });

		if(_.isEmpty(betOrders)) return;

		for( let betOrder of betOrders ){
			let allPicksPending = _.every(betOrder.Picks, { status: 'Pending' });
			if(allPicksPending) continue;
			let update = settleBetOrder(betOrder);
			if(update.status === 'Pending') continue;
			
			let updatedBetOrder = await BetOrder.findOneAndUpdate({ _id: betOrder._id }, { $set: _.merge(update, { updatedAt: moment() }) }, { new: true }).populate('Agent').populate('Player');

			if(updatedBetOrder.status === 'Review'){
				await SystemLog.create({ title: 'BetOrder has Review', content: `${updatedBetOrder._id}`, status: 'danger'});
			}


			if(!updatedBetOrder.isClosed) continue;

			// const player = await Player.findOneAndUpdate({ _id: updatedBetOrder.Player }, {
			// 	'$inc': {
			// 		'credit.balance': Number(updatedBetOrder.resultAmount),
			// 		'credit.pending': -Number(updatedBetOrder.bet.atRisk),
			// 	},
			// 	'$set': {
			// 		'credit.updatedAt': moment()
			// 	}
			// });
			
			// const agent = await Agent.findOneAndUpdate({ _id: updatedBetOrder.Agent }, {
			// 	'$inc': {
			// 		'credit.balance': updatedBetOrder.status === 'Lost' ? Number(updatedBetOrder.resultAmount) : 0,
			// 		'credit.pending': -Number(updatedBetOrder.bet.atRisk)
			// 	},
			// 	'$set': {
			// 		'credit.updatedAt': moment()
			// 	}
			// }, {
			// 	new: true
			// });

			// if(updatedBetOrder.status === 'Lost'){
			// 	await Transaction.create({ 
			// 		Agent: agent._id,
			// 		ID: updatedBetOrder.ID,
			// 		type: 'BetOrder',
			// 		description: `(${player.username}) Lost a ${updatedBetOrder.title}`,
			// 		amount: Number(updatedBetOrder.resultAmount),
			// 		balance: agent.credit.balance
			// 	});
			// }


			// if(updatedBetOrder.Agent.notification.afterBetOrder){
			// 	const agentNotify = new apn.Notification({
			// 		sound: 'ping.aiff',
			// 		alert: `${updatedBetOrder.Player.username}'s ${updatedBetOrder.title} had ${updatedBetOrder.status} ${updatedBetOrder.resultAmount === 0 ? '' : updatedBetOrder.resultAmount}`,
			// 		topic: config.APN_TOPIC,
			// 		payload: { BetOrder: updatedBetOrder.BetOrder }
			// 	})
			// 	await apnProvider.send(agentNotify, updatedBetOrder.Agent.notification.deviceToken)
			// }

			// if(updatedBetOrder.Player.notification.afterBetOrder){
			// 	const playerNotify = new apn.Notification({
			// 		sound: 'ping.aiff',
			// 		alert: `Your ${updatedBetOrder.title} had ${updatedBetOrder.status} ${updatedBetOrder.resultAmount === 0 ? '' : updatedBetOrder.resultAmount}`,
			// 		topic: config.APN_TOPIC,
			// 		payload: { BetOrder: updatedBetOrder.BetOrder }
			// 	})
			// 	await apnProvider.send(playerNotify, updatedBetOrder.Player.notification.deviceToken)
			// }


			// apnProvider.shutdown();



		}

	} catch (e) {
		await SystemLog.create({ title: 'update bet order result failed', content: `${e}`, status: 'danger'});
	}
};

export default updateBetOrderResult;
