import { Seeder } from 'mongoose-data-seed';
import Cooldown from '../src/models/Cooldown';
import moment from 'moment';

const data = [{
	usage: 'updateEventOdd',
	sec: 180,
	updatedAt: moment()
},{
	usage: 'updateTable',
	sec: 20,
	updatedAt: moment()
},{
	usage: 'updateResult',
	sec: 600,
	updatedAt: moment()
}];

class CooldownsSeeder extends Seeder {
	async shouldRun() {
		return Cooldown.count().exec().then(count => count === 0);
	}
	async run() {
		return Cooldown.create(data);
	}
}

export default CooldownsSeeder;
