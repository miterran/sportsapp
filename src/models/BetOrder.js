import mongoose from 'mongoose';
import Note from './Note';
import renameActionFullName from '../utils/functions/renameActionFullName';

const Schema = mongoose.Schema;

const BetOrderSchema = new Schema({
	ID: { type: String, required: true, unique: true }, // generate by unique time
	Player: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	Agent: { type: Schema.Types.ObjectId, ref: 'User' },
	Picks: [{ type: Schema.Types.ObjectId, ref: 'Pick', required: true }],
	bet: {
		action: { type: String, enum: ['straight', 'parlay', 'basicTeaser', 'specialTeaser', 'bigTeaser', 'superTeaser', 'winReverse', 'actionReverse'], required: true },
		type: { type: String, enum:[ 'wager', 'risk' ], required: true },
		amount: { type: Number, required: true },
		toWin: { type: Number, required: true },
		atRisk: { type: Number, required: true },
	},
	resultAmount: { type: Number },
	isClosed: { type: Boolean, required: true },
	status: { type: String, enum: [ 'Won', 'Lost', 'Push', 'Pending', 'Cancelled', 'Review' ], default: 'Pending', required: true },
	note: Note,
	updatedAt: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now }
});

class BetOrderClass {
	get closedAt () { if(this.isClosed) return this.updatedAt; return null; }
	get title () {
		return `${this.Picks.length} Team${this.Picks.length > 1 ? 's' : ''} ${renameActionFullName(this.bet.action)}`;
	}
}

BetOrderSchema.loadClass(BetOrderClass);


const BetOrder  = mongoose.model('BetOrder', BetOrderSchema);

export default BetOrder;