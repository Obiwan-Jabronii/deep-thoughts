const { User, Thought } = require('../models');

const resolvers = {
    Query: {
        //get all thoughts
        thoughts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Thought.find(params).sort({ createdAt: -1 });
        },
        //find a single thought by id 
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id});
        },
        //get all users 
        users: async () => {
            return User.find()
            //the -__v -password indicates not to return the users password 
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        },
        //find one user with the username
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('friends')
            .populate('thoughts');
        }
    }
};

module.exports = resolvers;