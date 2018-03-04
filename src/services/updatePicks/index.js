
import _ from 'lodash';
import moment from 'moment';
import Pick from '../../models/Pick';
import SystemLog from '../../models/SystemLog';
import mongoose from 'mongoose';
import determinePickResult from '../../utils/functions/determinePickResult';
import config from '../../config'
// import apnProvider from '../../apn'
// import apn from 'apn'


const updatePickResult = async () => {
	// eslint-disable-next-line
	console.log('update pick result')
	try {
		const picks = await Pick.find({ isClosed: false }, 'Event marked')
			.populate({ path: 'Event', select: 'isFinished sport score status' })
			.then(picks => _.compact(picks.map(pick => pick.Event.isFinished ? pick : null)) );

 		if(_.isEmpty(picks)) return;

		for( let pick of picks ){
			let { Event: { status: eventStatus, score: { home: homeScore, away: awayScore } }} = pick;
			let pickStatus = eventStatus;
			let isClosed = true;
			if(eventStatus === 'Finished' && ( homeScore >= 0 && awayScore >= 0 )) {
				pickStatus = determinePickResult(pick);
			}
			if(eventStatus === 'Review'){
				isClosed = false;
			}

			const updatedPick = await Pick.findOneAndUpdate({ 
				_id: mongoose.Types.ObjectId(pick._id), status: 'Pending', isClosed: false 
			}, {
				$set: { isClosed: isClosed, status: pickStatus, updatedAt: moment() } 
			}, {
				new: true 
			}).populate('Event').populate('Agent').populate('Player');


			if(updatedPick.status === 'Review'){
				await SystemLog.create({ title: 'Pick has Review', content: `${updatedPick._id}`, status: 'danger'});
			}


			if(!isClosed) continue

			// if(updatedPick.Agent.notification.afterPick){
			// 	const agentNotify = new apn.Notification({
			// 		sound: 'ping.aiff',
			// 		alert: `${updatedPick.Player.username}'s Pick had ${updatedPick.status}, ${updatedPick.Event.team.away} vs ${updatedPick.Event.team.home}`,
			// 		topic: config.APN_TOPIC,
			// 		payload: { BetOrder: updatedPick.BetOrder }
			// 	})
			// 	await apnProvider.send(agentNotify, updatedPick.Agent.notification.deviceToken)
			// }

			// if(updatedPick.Player.notification.afterPick){
			// 	const playerNotify = new apn.Notification({
			// 		sound: 'ping.aiff',
			// 		alert: `Your Pick had ${updatedPick.status}, ${updatedPick.Event.team.away} vs ${updatedPick.Event.team.home}`,
			// 		topic: config.APN_TOPIC,
			// 		payload: { BetOrder: updatedPick.BetOrder }
			// 	})
			// 	await apnProvider.send(playerNotify, updatedPick.Player.notification.deviceToken)
			// }


//			apnProvider.shutdown();

		}
		
	} catch (e) {
		await SystemLog.create({ title: 'update picks result failed', content: `${e}`, status: 'danger'});
	}
};
export default updatePickResult;
