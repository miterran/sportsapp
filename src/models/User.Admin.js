import User from './User';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'role' };

const AdminSchema = new Schema({}, options );

const Admin = User.discriminator('Admin', AdminSchema);

export default Admin;