CSRF Attacker Page
==================
This is a web page that will send a request to
another page, performing a CSRF attack.

How to use
----------
Open the `webConfig.js` file in the `public` folder
and change the following values:
* `url` - the request url
* `verb` - GET, POST, PUT, PATCH, DELETE
* `params` - an array of key value pairs that will be passed in the form data 
   - `name` - name of the property
   - `value` - value of the property

For example, if you wanted to send a `POST` request to
`localhost:3000/transfer` which requires a `userId` and an `amount` in
the request body, your config file would look like this:

```js
var webConfig = {
   "url": "http://localhost:3000/transfer",
   "verb": "POST",
   "params": [
      { "name": "userId", "value": "1" },
      { "name": "amount", "value": "1000" }
   ]
};
```
You can run the app by typing `nom start` in the command prompt.

Each time you change the `webConfig.js` file, the server will restart,
so you will only need to refresh your page.
