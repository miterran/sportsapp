import { Seeder } from 'mongoose-data-seed';
import Table from '../src/models/Table';

const data = [{
	name: 'modify',
	sports: [{}]
},{
	name: 'standard',
	sports: [{}]
},{
	name: 'special',
	sports: [{}]
}];

class TablesSeeder extends Seeder {

  async shouldRun() {
    return Table.count().exec().then(count => count === 0);
  }

  async run() {
    return Table.create(data);
  }
}

export default TablesSeeder;
