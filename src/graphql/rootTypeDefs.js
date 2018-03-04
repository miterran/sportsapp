import modelTypeDefs from './modelTypeDefs';

import * as Sign from './resolvers/Sign/typeDefs';
import * as User from './resolvers/User/typeDefs';
import * as Action from './resolvers/Action/typeDefs';
import * as BetOrder from './resolvers/BetOrder/typeDefs';
import * as Setting from './resolvers/Setting/typeDefs';
import * as Event from './resolvers/Event/typeDefs';
//import * as Notification from './resolvers/Notification/typeDefs';
import * as LogoCollect from './resolvers/LogoCollect/typeDefs';
import * as SystemLog from './resolvers/SystemLog/typeDefs';
import * as Pick from './resolvers/Pick/typeDefs';

const type = `
	type BooleanType {
		boolean: Boolean
	}
`

const schemaType = `
	scalar Date
	schema {
		query: RootQuery
		mutation: RootMutation
	}
`;
//		subscription: RootSubscription
const rootQuery = `
	type RootQuery {
		${Sign.Query}
		${User.Query}
		${Action.Query}
		${BetOrder.Query}
		${Event.Query}
		${LogoCollect.Query}
		${SystemLog.Query}
		${Pick.Query}
	}
`;
const rootMutation = `
	type RootMutation {
		${Sign.Mutation}
		${Action.Mutation}
		${Setting.Mutation}
		${User.Mutation}
		${Event.Mutation}
	}
`;
// const rootSubscription = `
// 	type RootSubscription {
// 	}
// `;

// 		${
// //			Notification.Subscription
// 		}

const rootTypes = [ 
	schemaType,
	rootQuery,
	rootMutation,
//	rootSubscription
]
	.concat(modelTypeDefs)
	.concat(BetOrder.type)
//	.concat(Notification.type)
	.concat(Action.Input)
	.concat(type)

export default rootTypes;