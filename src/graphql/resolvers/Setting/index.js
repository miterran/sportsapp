import mongoose from 'mongoose';
import yup from 'yup';
import User from '../../../models/User';
import Agent from '../../../models/User.Agent';
import SystemLog from '../../../models/SystemLog';

const passcodeSchema = yup.object().shape({
	newPasscode: yup.string().matches(/^[0-9]+$/, 'New Passcode format is invalid.').min(4).max(4).required()
});

export const Mutation = {
	async changePassword(root, { password, newPassword, confirmNewPassword }, ctx){
		if(ctx.user._id === '') return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
		if(newPassword.length < 4 || confirmNewPassword.length < 4) return { title: 'New Password Invalid', content: 'requires 4 characters', status: 'warning' };
		if(newPassword !== confirmNewPassword) return { title: 'New Password Not Match', content: 'Please try again.', status: 'warning' };
		const user = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(ctx.user._id), password: password }, { $set: { password: newPassword } });
		if(!user) return { title: 'Current Password Incorrect', content: 'Please try again.', status: 'warning' };
		await SystemLog.create({ title: 'User Changed Password', content: `${user.username} Changed Password`, status: 'success' });
		return { title: 'Completed', content: 'Your Password has been changed!', status: 'success' };
	},
	async changePasscode(root, { password, newPasscode, confirmNewPasscode }, ctx){
		if(ctx.user._id === '') return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
		if(newPasscode !== confirmNewPasscode) return { title: 'New Passcode Not Match', content: 'Please try again.', status: 'warning' };
		const isNewPasscodeValid = await passcodeSchema.isValid({newPasscode: newPasscode});
		if(!isNewPasscodeValid) return { title: 'New Passcode Invalid', content: await passcodeSchema.validate({newPasscode: newPasscode}).catch(err => err.message), status: 'warning' };
		const user = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(ctx.user._id), password: password }, { $set: { passcode: newPasscode } });
		if(!user) return { title: 'Password Incorrect', content: 'Please try again.', status: 'warning' };
		await SystemLog.create({ title: 'User Changed Passcode', content: `${user.username} Changed Passcode`, status: 'success' });
		return { title: 'Completed', content: 'Your Passcode has been changed!', status: 'success' };
	},

	async changeEmail(root, { passcode, email }, ctx){
		if(ctx.user.role === 'Guest') return { title: 'Not Authenticated', content: 'Please try again.', status: 'warning' };
		const user = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(ctx.user._id), passcode: passcode }, { $set: { email: email } });
		if(!user) return { title: 'Warning', content: 'Passcode Incorrect.', status: 'warning' };
		await SystemLog.create({ title: 'Agent Changed Email', content: `${ctx.user.username} Changed Email`, status: 'success' });
		return { title: 'Completed', content: 'New Email: ' + email, status: 'success' };
	}

};
