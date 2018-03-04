import LogoCollect from '../../../models/LogoCollect';

export const Query = {
	logos(root, req){
		return LogoCollect.find(req);
	},
};