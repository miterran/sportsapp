//import { withFilter } from 'graphql-subscriptions';
import { pubsub } from '../../pubsub';

export const Subscription = {
	notificationAdded: {
		subscribe: () => pubsub.asyncIterator('NEW')
	}
};
