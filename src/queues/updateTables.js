import Cooldown from '../models/Cooldown';
import updateTable from '../services/updateTables';
import queue from 'queue';
const updateQueue = queue();

const startQueue = (queue) => new Promise((resolve, reject) => queue.start(error => error ? reject(error) : resolve()));
const updateTables = async () => {
	try {
		if(await Cooldown.isActivate('updateTable')){
			updateQueue.push(
				async () => await updateTable(),
			);
		}

		await startQueue(updateQueue);
	} catch (e) {
		throw new Error(__dirname + '\n' + e);
	}
};
export default updateTables;

