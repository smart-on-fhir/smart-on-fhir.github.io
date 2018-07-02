# Experimental draft for feedback

## Additional use case: access "on behalf of"

(See discussion at [https://github.com/smart-on-fhir/fhir-bulk-data-docs/issues/44](https://github.com/smart-on-fhir/fhir-bulk-data-docs/issues/44).)

The primary use case for [Backend Services](https://github.com/smart-on-fhir/fhir-bulk-data-docs/blob/master/authorization.md) is to enable a client to connect to
a FHIR server and access data "as itself", rather than connecting on behalf of a specific end-user.
If a client needs to act on behalf of a specific end-user (e.g., it wants to issue requests that are
limited only to data that the specific end-user is allowed to see), it can use this "Backend Services On
Behalf Of" module to convey this information in the access token request.

#### Technical Approach
To make a request "on behalf of" a specifc end-user, the client should:

* Change the `grant_type` URL parameter's value from `client_credentials` to `urn:ietf:params:oauth:grant-type:jwt-bearer`
* Add an `assertion` URL parameter whose value is an appropriate Authorization JWT (see below)

#### 4.5.3 Authorization JWT

To convey that an access token request is "on behalf of" a specific end-user, the  client creates
an authorization JWT with the details the server will need to know in order to make an access
control decision.


Example:
```
POST body: 
grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&
assertion={signed authorization JWT}&
client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&
client_assertion+{signed authentication JWT}
```

The Authorization JWT MUST be digitally signed by the client using the same approach
as for the Authentication JWT (described in [Backend Services](./authorization.md)),
or signed by another issuer that the server accepts.

The Authorization JWT SHALL contain claims relating to the resource being requested
(e.g., FHIR patient resource, data scope, requesting practitioner, reason)
and claims necessary to help ensure the security of the exchange (expiration time, issuer,
subject, a token identifier; see [RFC7523](https://tools.ietf.org/html/rfc7523) for details):

|Claim |Priority |Description |
|------|----------|------------|
iss |REQUIRED | Requesting client's issuer URI.
sub |REQUIRED | Requesting client's id for the user on whose behalf this request is being made. Matches `requesting_user.id` if present
aud|REQUIRED| Server's `token_URL` (the URL to which this authorization JWT will be posted)
requesting_user_fhir | OPTIONAL | FHIR Practitioner, Patient, RelatedPerson, or Person resource representing the user on whose behalf the request is being made
requesting_user_oidc | OPTIONAL | Array of OIDC tokens representing the authenticated end-user on whose behalf the request is being made. Note that further details about OIDC token claims, signature methods, audiences, etc. are out of scope for this specification.
allowed_scopes| OPTIONAL | Space-separated string representing OAuth scopes that this Authorization JWT is designated to allow.
exp|REQUIRED| requesting_practitioner | OPTIONAL | FHIR practitioner resource making the request
kid | REQUIRED | See [Backend Services](./authorization.md)
jti|REQUIRED| See [Backend Services](./authorization.md)
iat | REQUIRED | See [Backend Services](./authorization.md)

##### Example

```
{
  "iss": "https://client.example.com",
  "sub": "128641521",
  "aud": "https://server.example.com/token",
  "jit": "some-nonce-abc",
  "iat": 1418698788,
  "exp": 1422568860,
  "requested_scopes": "patient/*.read",
  "requesting_user_fhir": {
    "resourceType": "Practitioner",
    "id": "128641521",
    "identifier": [{
      "system": "https://ehr-a.com",
      "value": "123"
    },{
      "system": "https://nppes.cms.hhs.gov/",
      "value": "1770589525"
    }],
    "name": {
      "text": "Juri van Gelder"
    },
    "practitionerRole": [{
      "role": {
        "coding": [{
          "system": "http://snomed.info/sct",
          "code": "36682004",
          "display": "Physical therapist"
        }]}}]}}
```
