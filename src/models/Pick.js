import mongoose from 'mongoose';
import Note from './Note';
const Schema = mongoose.Schema;

const PickSchema = new Schema({
	ID: { type: String, required: true }, // singlePickID
	Player: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	Agent: { type: Schema.Types.ObjectId, ref: 'User' },
	BetOrder: { type: Schema.Types.ObjectId, ref: 'BetOrder', required: true },
	Event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
	marked: {
		oddLine: { type: Number },
		oddPoint: { type: Number },
		oddTarget: { type: String, enum: [ 'Home', 'Away', 'Over', 'Under', null ] },
		oddType: { type: String, enum: [ 'MLine', 'Spread', 'Total', 'Draw' ] },
		oddLineTarget: { type: String, enum: [ 'awayMoneyLine', 'homeMoneyLine', 'awaySpreadLine', 'homeSpreadLine', 'totalOverLine', 'totalUnderLine', 'drawLine', null ] },
		oddPointTarget: { type: String, enum: [ 'awaySpreadPoint', 'homeSpreadPoint', 'totalOverPoint', 'totalUnderPoint', null ] },
	},
	isClosed: { type: Boolean, required: true },
	status: { type: String, enum: [ 'Pending', 'Won', 'Won Half', 'Lost', 'Lost Half', 'Push', 'Closed', 'Cancelled', 'Postponed', 'Review' ], default: 'Pending' },
	note: Note,
	updatedAt: { type: Date, default: Date.now },
	createdAt: { type: Date, default: Date.now }
});

class PickClass {
	get closedAt () { if(this.isClosed) return this.updatedAt; return null; }
}

PickSchema.loadClass(PickClass);

const Pick  = mongoose.model('Pick', PickSchema);

export default Pick;