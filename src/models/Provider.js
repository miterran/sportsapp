import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProviderSchema = new Schema({
	name: { type: String, required: true },
	options: [{}],
	api: { type: String, default: '/' },
	isActivate: { type: Boolean, default: false },
});

class ProviderClass {
	static isActivate(name){
		return this.findOne({ name: name }).then(provider => provider.isActivate).catch(e => { throw new Error(__dirname + '\n' + e); });
	}
}

ProviderSchema.loadClass(ProviderClass);


const Provider = mongoose.model('Provider', ProviderSchema);

export default Provider;