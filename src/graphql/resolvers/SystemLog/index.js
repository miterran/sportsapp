import SystemLog from '../../../models/SystemLog';

export const Query = {
	systemLogs(root, req, ctx){
		return SystemLog.find({ status: req.status }).sort({ createdAt: 'descending' })
	}
};
