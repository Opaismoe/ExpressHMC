# Express HMS API

RESTful Express API for Households on top of MongoDB.

## Authentication

Create a User with the following attributes:

| Attribute | Type   | Description   |
|-----------|--------|---------------|
| name      | string | Full name     |
| email     | string | Email address |
| password  | string | Password      |

Use the following endpoints to deal with initial authentication and the user.

| HTTP Verb | Path        | Description |
|-----------|-------------|--------------|
| `POST`    | `/users`    | Create a user account |
| `POST`    | `/sessions` | Log in with email and password, and retrieve a JWT token |
| `GET`     | `/users/me` | Retrieve own user data |

To authorize further requests, use Bearer authentication with the provided JWT token:

```
Authorization: Bearer <token here>
```

_**Note**: See `db/seed.js` for an example._

## Households

**Note:** See `models/household.js` for the Household schema attributes.

| HTTP Verb | Path | Description |
|-----------|------|--------------|
| `GET` | `/households` | Retrieve all households |
| `POST` | `/households` | Create a household* |
| `GET` | `/households/:id` | Retrieve a single household by it's `id` |
| `PUT` | `/households/:id` | Update a household with a specific `id`* |
| `PATCH` | `/households/:id` | Patch (partial update) a household with a specific `id`* |
| `DELETE` | `/households/:id` | Destroy a single household by it's `id`* |
| | | _* Needs authentication_ |

_**Note**: Run `yarn run seed` to seed some initial households._
