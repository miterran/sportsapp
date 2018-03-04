import _ from 'lodash';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
	_id: false,
	title: { type: String },
	content: { type: String },
	status: { type: String, enum: ['success', 'warning', 'danger'] },
});

class NoteClass {}

NoteSchema.loadClass(NoteClass);

export default NoteSchema;
