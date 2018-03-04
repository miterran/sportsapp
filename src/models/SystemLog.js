import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const SystemLogSchema = new Schema({
	title: { type: String },
	content: { type: String },
	status: { type: String, enum: ['success', 'warning', 'danger'] },
	createdAt: { type: Date, default: Date.now }
});

class SystemLogClass {}

SystemLogSchema.loadClass(SystemLogClass);

const SystemLog = mongoose.model('SystemLog', SystemLogSchema);

export default SystemLog;