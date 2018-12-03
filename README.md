# SimpleBudget

## Getting Started 
1. clone this repo
2. download a database browser like [Sqlite browser](https://sqlitebrowser.org/)
3. download [postman](https://www.getpostman.com/)
4. download [nvm](https://github.com/creationix/nvm)
5. download [yarn](https://yarnpkg.com/en/)
6. get latest stable node `nvm install v10.13.0` (important to use this version to avoid bcrypt error)

#### Server
1. nav to server root `cd simple/server`
2. run `yarn install`
3. run `yarn add sqlite3` idk why it forces this manually
4. copy `.env.exmaple` in the root dir and rename the new file `.env`
  - jwt secret can be anything you want
  - get the plaid keys from the plaid account (should be an invite in your email)
  - plaid env should be `sandbox` to use made up transactions, or `development` for using live credentials
  - webhook URL can be ignored for now, part of localtunnel.me
5. run `yarn start`
6. your server should be running, move onto client

#### Client
7. nav to `cd simple/client`
8. run `yarn install`
9. run `yarn start`
10. a client should popup on http://localhost:3000

#### Site
11. visit `http://localhost:3000/signup` and create a new user
  - check the db browser to confirm you can see this new user in the user table
12. you should now be seeing the simplebudget homepage, including a blank budget, transactions,etc
13. try adding a budget for the fuck of it. this should work
14. connect to plaid using the "open link" button 
  - use username=user_good and password=pass_good per the [plaid docs](https://plaid.com/docs/quickstart/)
15. go back to the db brower and find the plaidItem `itemId` associated with your new user
16. use postman to send the following request to your server running on port 4000:

method=POST

URL=`http://localhost:4000/webhook`

type = raw, applicaion/JSON

body:
```
{
  "item_id": "YOUR_ITEMID_HERE",
  "new_transactions": 13,
  "webhook_code": "HISTORICAL"
}
```
17. chill out for a sec and re-read the [plaid quickstart docs](https://plaid.com/docs/quickstart/). it can take plaid some time to get the txns for a new item id. if you dont get the transactions list loaded into the db after this request, wait a bit and try again
18. click the 'refresh' transactions button. you should now have all the transaction data loaded into simplebudget :^)

## Authentication
TLDR version, detailed version to come.

1. auth starts with the first request made to the server. on /login or /signup, the server will create a JWT - [JSON Web Token](https://github.com/auth0/express-jwt) using the new user's ID. once the user is created, we send this JWT (token) back to the client
```javascript
// signup mutation in resolvers.js
const signupUser = await User.create(user);
await signupUser.createBudget();
const token = jwt.sign({ id: signupUser.id }, JWT_SECRET);
return {
  token: token
}
```

2. the client form that sent the request to the server awaits the response containing the newly signed JWT, which it then stores in the browser as a cookie, using [jsCookie](https://github.com/js-cookie/js-cookie)
```javascript
// handleSubmit in SignupForm.js
const result = await signup({
  variables: {
    user: {
      email,
      password
    }
  }
});
const { data: { signup: { token } } } = result;
jsCookie.set('token', token);
```

3. The client uses jsCookie to pull the token out of the browser and inject it into the header of a request. We do this in the `networkInterface` middlewear, so the token is injected into every request that the client makes
```javascript
// client/index.js
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }
    const token = jsCookie.get(token);
    if (!_.isEmpty(token)) {
      req.options.headers.Authorization = `Bearer ${token.token}`
    }
    next();
  }
}]);
```

4. With every request to the /graphql server, the JWT authentication middleware authenticates callers using a JWT. If the token is valid, req.user will be set with the JSON object decoded to be used by later middleware for authorization and access control. We then pull the user id out of the requests and use it to set the graphQL context
```javascript
// server/index.js
server.use(
  '/graphql',
  jwt({
      secret: JWT_SECRET,
      credentialsRequired: false
  }),
  graphqlExpress(req => ({ 
    schema,
    context: {
      user: req.user
    },
  }))
);
```

5. We use this context in our server resolvers to find the relevant user data
```javascript
// createBudget in resolvers.js
createBudget: async (root, { budget }, context) => {
  const days = moment().day() - moment().day(1).day();
  const user = await User.findOne({ where: { id: context.user.id } });
```