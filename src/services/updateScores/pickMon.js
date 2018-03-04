import config from '../../config';
import Event from '../../models/Event';
import _ from 'lodash';
import xml2js from'xml2js-es6-promise';
import axios from 'axios';
import moment from 'moment';
import Provider from '../../models/Provider';
import SystemLog from '../../models/SystemLog';
import Pick from '../../models/Pick';

const pickMon = async () => {
	// eslint-disable-next-line
	console.log('update pick mon score');
	try {
		const pickMonSport = await Provider.findOne({ name: 'pm' }).then(res => res.options.join(','));
		const pickMonEventIDs = await Pick.find({ status: 'Pending' }, 'Event')
			.populate({ path: 'Event', match: { provider: 'pm', status: 'Pending', cutOffAt: { $lt: moment().subtract(1, 'h') } }, select: 'ID' }) // $lt moment(), query started game , filter after 2 hr
			.then(picks => _.uniqBy(_.compact(picks.map(pick => pick.Event )), 'ID')).map(event => event.ID);
		if(_.isEmpty(pickMonEventIDs)) return;
		const pickMonXML = await axios.get(`https://api.pickmonitor.com/lines.php?uid=${config.pickMon_UID}&key=${config.pickMon_Key}&sports=${pickMonSport}&graded=1&full_call=1`).then(res => res.data);
		const pickMonScores = await xml2js(pickMonXML, {explicitArray: false}).then(res => (res.hasOwnProperty('lines') && res.lines.hasOwnProperty('game')) ? res.lines.game : [] );
		if(_.isEmpty(pickMonScores)) return;
		for(let pickMonEventID of pickMonEventIDs){
			let eventScore = _.find(pickMonScores, { id: pickMonEventID });
			if(_.isEmpty(eventScore)) continue;
			let status = 'Review';
			let isFinished = false;
			let homeScore = null;
			let awayScore = null;
			if(eventScore.void === '0' && !_.isEmpty(eventScore.line.score.winner)){
				status = 'Finished';
				isFinished = true;
				homeScore = eventScore.line.score.team2;
				awayScore = eventScore.line.score.team1;
			}
			let update = {
				score : {
					away: awayScore,
					home: homeScore
				},
				isFinished: isFinished,
				status: status,
				updatedAt: moment()
			};
			const updatedEvent = await Event.findOneAndUpdate({ ID: pickMonEventID, provider: 'pm', status: 'Pending' }, { $set: update }, { new: true });

			if(updatedEvent.status === 'Review'){
				await SystemLog.create({ title: 'PickMon Event has Review', content: `${updatedEvent._id}`, status: 'danger'});
			}
			
		}
	} catch (e) {
		await SystemLog.create({ title: 'update pick mon score Failed', content: e, status: 'danger'});
	}
};

export default pickMon;