import _ from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

import rootResolvers from './rootResolvers';
import rootTypeDefs from './rootTypeDefs';

import resolverScalar from './scalar';


const schema = makeExecutableSchema({ 
	typeDefs: rootTypeDefs,
	resolvers: _.merge(rootResolvers, resolverScalar)//_.merge(rootResolvers, resolverScalar)
});

export default schema;