# metero-api

> Metero api client.

[![NPM](https://img.shields.io/npm/v/metero-api.svg)](https://www.npmjs.com/package/auth-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
```bash
npm install --save metero-api
```

## Documentation
This just a client. [API Documentation](https://api.metero.pp.ua/)

### ApiClient

You can create new api client instance with
```js
const client = new ApiClient({
  format: 'json',
  accessToken: '[Access token]'
})
```
or
```js
const client = new ApiClient()
```

**format** - *'json'|'jsonld'* - 'json' matches 'application/json' mime type. 'jsonld' matches 'application/ld+json' mime type. For more details see the api docs.

**accessToken** - *string|null* - use to authorize to api.

### .setFormat
```js
client.setFormat('json')
```
Sets or changes format.

**format** - *'json'|'jsonld'* - 'json' matches 'application/json' mime type. 'jsonld' matches 'application/ld+json' mime type. For more details see the api docs.

### .setAccessToken
```js
client.setAccessToken('[Access token]')
```
Sets or changes access token.

**accessToken** - *string|null* - use to authorize to api.

### .getUsers
```js
client.getUsers(queryParameters).then(users => {
  // do something
}).catch(error => {
  // do something
})
```
Fetches multiple users.

*queryParameters* - *object* - url parameters. In docs marked with '(query)'. Optional.

> Note: after second version all method except deletePost, setFormat and setAccessToken supports typescript generics

### .getUser
```js
client.getUser(username).then(user => {
  // do something
}).catch(error => {
  // do something
})
```
Fetches a single user.

**username** - *string* - Username of user.

### .updateUser
```js
client.updateUser(username, body).then(user => {
  // do something
}).catch(error => {
  // do something
})
```
Partially updates the user.

**username** - *string* - Username of user.
**body** - *object* - Fields to be updated.

### .getPosts
```js
client.getPosts(queryParameters).then(posts => {
  // do something
}).catch(error => {
  // do something
})
```
Fetches multiple posts.

*queryParameters* - *object* - Url parameters. In docs marked with '(query)'. Optional.

### .createPost
```js
client.createPost(data).then(post => {
  // do something
}).catch(error => {
  // do something
})
```

Creates new post.

**body** - *object* - Body of new post.

### .getPost
```js
client.getPost(id).then(post => {
  // do something
}).catch(error => {
  // do something
})
```
Fetches a single post.

**id** - *number* - Id of post.

### .replacePost
```js
client.replacePost(id, body).then(post => {
  // do something
}).catch(error => {
  // do something
})
```

Replaces old post values with new values.

**id** - *number* - Id of post.

**body** - Fields to be replaced.

### .deletePost
```js
client.deletePost(id).then(() => {
  // do something
}).catch(error => {
  // do something
})
```

Deletes post.

**id** - *number* - Id of post.

### .updatePost
```js
client.updatePost(id, body).then(post => {
  // do something
}).catch(error => {
  // do something
})
```
Partially updates the post.

**id** - *number* - Username of user.

**body** - *object* - Fields to be updated.

## License

MIT © [ArtemGolovko](https://github.com/ArtemGolovko)