import User from './User';
import moment from 'moment';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'role' };

const AgentSchema = new Schema({ 
	Players: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
	deletedPlayers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, options );

class AgentClass {}

AgentSchema.loadClass(AgentClass);

const Agent = User.discriminator('Agent', AgentSchema);

export default Agent;