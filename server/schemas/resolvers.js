const { AuthenticationError } = require('apollo-server-express');
const { User, Thought } = require('../models');
const { populate } = require('../models/User');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        // this will verify that the user has the JWT
        me: async (parent, args, context ) => {
            if(context.user){
                const userData = await User.findOne({})
                .select('-__v -password')
                .populate('thoughts')
                .populate('friends');

            return userData;
            }

            throw new AuthenticationError('Not logged in')
        },
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
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user }; 
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };

        },
        addThought: async (parent, args, context) => {
            //ensures user is logged in before allowing them to add a thought 
            if(context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username })

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: {thoughts: thought._id } },
                    { new: true }
                );

                return thought;
            }

            throw new AuthenticationError('You need to be logged in to add a thought.')
        },
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if(context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId }, 
                    { $push: { reactions: { reactionBody, username: context.user.username} } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in to react.');
        },
        addFriend: async (parent, { friendId }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id},
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in to add a friend.');
        }

    }
};

module.exports = resolvers;