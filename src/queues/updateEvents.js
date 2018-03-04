import Cooldown from '../models/Cooldown';
import updateEventOddFromPickMon from '../services/updateEvents/pickMon';
import updateEventOddFromJsonOdd from '../services/updateEvents/jsonOdd';
import queue from 'queue';
const updateQueue = queue();
const startQueue = (queue) => new Promise((resolve, reject) => queue.start(error => error ? reject(error) : resolve()));
const updateEvents = async () => {
	try {
		if(await Cooldown.isActivate('updateEventOdd')){
			updateQueue.push(
				async () => await updateEventOddFromJsonOdd(),
				async () => await updateEventOddFromPickMon(),
			);
		}
		await startQueue(updateQueue);
	} catch (e) {
		throw new Error(__dirname + '\n' + e);
	}
};
export default updateEvents;

