const express = require('express');
//import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth')
const path = require('path');

//import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create a new Apollo server and pass in our schema data 
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // ensure that every request performs an auth check, updated object passed to the resolvers as the context(3rd) parameter
  context: authMiddleware
});


const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create ja new instance of an Apollo server with the Graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
// intergrate our Apollo Server with the Express application  as middleware
server.applyMiddleware({ app });

//Server up the static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API 
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};


// call the async function to start the server 
startApolloServer(typeDefs, resolvers);