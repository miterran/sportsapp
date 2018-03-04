import config from '../../config';
import Event from '../../models/Event';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import Pick from '../../models/Pick';
import SystemLog from '../../models/SystemLog';

const axiosJsonOdd = axios.create({ headers: {'x-api-key': config.jsonOddApiKey}});

const jsonOdd = async () => {
	// eslint-disable-next-line
	console.log('update json odd score');
	try {
		const pickJsonOddIDs = await Pick.find({ status: 'Pending' }, 'Event')
			.populate({ path: 'Event', match: { isPicked: true, provider: 'jo', status: 'Pending', matchTime: { $lt: moment().subtract(10, 'm') } }, select: 'ID' }) 
			.then(picks => _.uniqBy(_.compact(picks.map(pick => pick.Event )), 'ID')).map(event => event.ID);
		if(_.isEmpty(pickJsonOddIDs)) return;
		for(let pickJsonOddID of pickJsonOddIDs){
			const latestJsonOddScore = await axiosJsonOdd.get(`https://jsonodds.com/api/results/${pickJsonOddID}`).then(async res => {
				if(res.data.length === 1) return res.data[0];
				if(res.data.length > 1) {
					await SystemLog.create({ title: 'json odd score result has 2 object', content: `https://jsonodds.com/api/results/${pickJsonOddID}`, status: 'warning'});
					return {};
				}
				if(_.isEmpty(res.data)) {
					await SystemLog.create({ title: 'json odd score result empty ', content: `https://jsonodds.com/api/results/${pickJsonOddID}`, status: 'warning'});
					return {};
				}
			});
			if(_.isEmpty(latestJsonOddScore)) continue;
			let status = '';
			switch(latestJsonOddScore.FinalType){
			case 'NotFinished':
				status = 'Pending';
				break;
			case 'Finished':
				status = 'Finished';
				break;
			case 'Postponed':
				status = 'Postponed';
				break;
			case 'Abandoned':
			case 'Canceled':
			case 'Retired':
				status = 'Cancelled';
				break;
			default:
				await SystemLog.create({ title: 'update json odd score has Review', content: `${JSON.stringify(latestJsonOddScore)}`, status: 'warning'});
				status = 'Review';
				break;
			}
			const update = {
				score : {
					away: Number(latestJsonOddScore.AwayScore),
					home: Number(latestJsonOddScore.HomeScore)
				},
				isFinished: latestJsonOddScore.Final,
				status: status,
				updatedAt: moment()
			};
			const updatedEvent = await Event.findOneAndUpdate({ ID: pickJsonOddID, provider: 'jo', status: 'Pending' }, { $set: update }, { new: true });

			if(updatedEvent.status === 'Review'){
				await SystemLog.create({ title: 'JsonOdd Event has Review', content: `${updatedEvent._id}`, status: 'danger'});
			}

		}
	} catch (e) {
		await SystemLog.create({ title: 'update json odd score Failed', content: `${e}`, status: 'danger'});
	}
};

export default jsonOdd;

