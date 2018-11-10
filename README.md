# SimpleBudget

1. clone this repo
2. download a database browser like [Sqlite browser](https://sqlitebrowser.org/)
3. download [postman](https://www.getpostman.com/)
4. download [nvm](https://github.com/creationix/nvm)
5. download [yarn](https://yarnpkg.com/en/)
6. get latest stable node `nvm install v10.13.0` (important to use this version to avoid bcrypt error)

### Server
1. nav to server root `cd simple/server`
2. run `yarn install`
3. run `yarn add sqlite3` idk why it forces this manually
4. copy `.env.exmaple` in the root dir and rename the new file `.env`
  - jwt secret can be anything you want
  - get the plaid keys from the plaid account (should be an invite in your email)
  - plaid env should be `sandbox`
  - webhook URL can be ignored for now, part of localtunnel.me
5. run `yarn start`
6. your server should be running, move onto client

### Client
7. nav to `cd simple/client`
8. run `yarn install`
9. run `yarn start`
10. a client should popup on http://localhost:3000

### Site
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