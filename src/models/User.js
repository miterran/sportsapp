import Notification from './User.Notification'
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'role' };

const UserSchema = new Schema({
	portrait: { type: String, default: '/', required: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	passcode: { type: String, required: true },
	email: { type: String },
	lastOnlineAt: { type: Date, default: Date.now, required: true },
	updatedAt: { type: Date, default: Date.now, required: true },
	createdAt: { type: Date, default: Date.now, required: true },
	notification: Notification,
}, options );

const User = mongoose.model('User', UserSchema);

export default User;