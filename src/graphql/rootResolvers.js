import _ from 'lodash';
import * as Sign from './resolvers/Sign';
import * as User from './resolvers/User';
import * as Action from './resolvers/Action';
import * as BetOrder from './resolvers/BetOrder';
import * as Setting from './resolvers/Setting';
import * as Event from './resolvers/Event';
//import * as Notification from './resolvers/Notification';
import * as LogoCollect from './resolvers/LogoCollect';
import * as SystemLog from './resolvers/SystemLog';
import * as Pick from './resolvers/Pick';

const rootResolvers = {
	RootQuery: _.merge(
		Sign.Query,
		User.Query,
		Action.Query,
		BetOrder.Query,
		Event.Query,
		LogoCollect.Query,
		SystemLog.Query,
		Pick.Query
	),
	RootMutation: _.merge(
		Sign.Mutation,
		Action.Mutation,
		Setting.Mutation,
		User.Mutation,
		Event.Mutation
	),
// 	RootSubscription: _.merge(
// //		Notification.Subscription
// 	)
};

export default rootResolvers;