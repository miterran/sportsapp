import mongoose from 'mongoose';
import moment from 'moment';
const Schema = mongoose.Schema;

const CooldownSchema = new Schema({
	usage: { type: String, unique: true, required: true },
	sec: { type: Number, required: true },
	updatedAt: { type: Date, default: Date.now }
});

class CooldownClass {
	static async isActivate(usage){
		try {
			const cooldown = await this.findOne({ usage: usage });
			const is = moment().format('X') - moment(cooldown.updatedAt).format('X') > cooldown.sec;
			if(is) return await this.findOneAndUpdate({ usage: usage }, { $set: { updatedAt: moment() } }).then(() => true);
			return false;
		} catch (e) {
			throw new Error(__dirname + '\n' + e);
		}
	}
}

CooldownSchema.loadClass(CooldownClass);


const Cooldown = mongoose.model('Cooldown', CooldownSchema);

export default Cooldown;