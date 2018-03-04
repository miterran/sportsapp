import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	_id: false,
	deviceToken: { type: String, default: '' },
	afterWager: { type: Boolean, default: false },
	afterPick: { type: Boolean, default: false },
	afterBetOrder: { type: Boolean, default: false },
});

export default NotificationSchema;