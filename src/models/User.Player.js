import User from './User';
import BetOrder from './BetOrder'
import moment from 'moment';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'role' };

const PlayerSchema = new Schema({
	weekNum: { type: Number, default: 0, required: true },
	isActivate: { type: Boolean, default: true, required: true },
	isDeleted: { type: Boolean, default: false, required: true },
	Agent: { type: Schema.Types.ObjectId, ref: 'User' },
	wagerLimit: {
		initialCredit: { type: Number, min: 0, max: 999999, default: 1000, required: true },
		straight: { type: Boolean, default: true, required: true },
		parlay: { type: Boolean, default: true, required: true },
		basicTeaser: { type: Boolean, default: true, required: true },
		specialTeaser: { type: Boolean, default: true, required: true },
		bigTeaser: { type: Boolean, default: true, required: true },
		superTeaser: { type: Boolean, default: true, required: true },
		actionReverse: { type: Boolean, default: true, required: true },
		winReverse: { type: Boolean, default: true, required: true },
		maxWin: { type: Number, min: 1, max: 999999, default: 200, required: true },
		minRisk: { type: Number, min: 10, max: 1000, default: 10, required: true },
		straightTeam: { type: Number, enum: [ 1 ], default: 1, required: true },
		parlayTeam: { type: Number, enum: [ 2, 3, 4, 5, 6, 7, 8 ], default: 8, required: true },
		basicTeaserTeam: { type: Number, enum: [ 2, 3, 4, 5, 6, 7, 8 ], default: 8, required: true },
		specialTeaserTeam: { type: Number, enum: [ 2, 3, 4, 5, 6, 7, 8 ], default: 8, required: true },
		bigTeaserTeam: { type: Number, enum: [ 2, 3, 4, 5, 6, 7, 8 ], default: 8, required: true },
		superTeaserTeam: { type: Number, enum: [ 3 ], default: 3, required: true },
		actionReverseTeam: { type: Number, enum: [ 2, 3, 4 ], default: 4, required: true },
		winReverseTeam: { type: Number, enum: [ 2, 3, 4 ], default: 4, required: true },
		updatedAt: { type: Date, default: Date.now, required: true },
	},
}, options );

class PlayerClass { 
	get isUnderAgent() { 
		return this.Agent ? true : false
	}
	static resetWeeklyBalanceToZero(){
		return this.update({ weekNum: { $ne: moment().isoWeek() } }, { $set: { weekNum: moment().isoWeek(), 'credit.balance': 0 }}, { multi: true });
	}
}

PlayerSchema.loadClass(PlayerClass);

const Player = User.discriminator('Player', PlayerSchema);

export default Player;
