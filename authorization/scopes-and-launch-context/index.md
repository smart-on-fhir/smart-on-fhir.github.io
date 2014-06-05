---
layout: main
title: "SMART on FHIR Authorization: Scopes and Launch Context"
---

# Scopes and Launch Context

SMART on FHIR's authorization scheme uses OAuth scopes to communicate (and
negotiate) access requirements. In general, we use scopes for three kinds of
data:

1. Clinical data
2. Contextual data
3. Identity data

Here's how these three aspects of authoriztion work.

## Scopes for clinical data

SMART on FHIR defines OAuth2 access scopes that correspond directly to FHIR
resource types. We define **read** and **write** permissions for
patient-specific and user-level access.

### Patient-specific scopes

Patient-specific scopes allow access to specific data about a single patient.
(You'll notice that we don't need to say *which* patient here: clinical data
scopes are all about "what" and not "who." We'll deal with "who" below!)
Patient-specific scopes take the form: `patient/:resourceType.(read|write)`.

Let's look at a few examples:

Goal | Scope | Notes
-----|-------|-----
Read all observations about a patient | `patient/Observation.read` | 
Read demographs about a patient | `patient/Patient.read` | Note the difference in capitalization between "patient" the permission type and "Patient" the resource.
Add new blood pressure readings for a patient| `patient/Observation.write`| Note that the permission is broader than our goal: with this scope, an app can add not only blood pressures, but other observations as well. Note also that write access does not imply read access.
Read all available data about a patient| `patient/*.read`||

### User-level scopes

User-level scopes allow access to specific data that a user can access. Note
that this isn't just data *about* the user; it's data *available to* that user.
User-level scopes take the form: `user/:resourceType.(read|write)`.

Let's look at a few examples:

Goal | Scope | Notes
-----|-------|-----
Read a feed of all new lab observations across a patient population: | `user/Observation.read` | 
Manage all appointments to which the authorizing user has access | `user/Appointment.read user/Appointment.write` | Note that `read` and `write` both need to be supplied. (Write access does not imply read access.)
Manage all resources on behalf ot he authorizing user| `user/*.read user/*.write `| Note that the permission is broader than our goal: with this scope, an app can add not only blood pressures, but other observations as well.


## Scopes for contextual data

Contextual scopes begin with `launch`, and are used to request access to
specific details about the EHR context in which an app is launched.

Apps that launch from the EHR will be passed an explicit `launch` parameter
that must be passed along in the form of a context scope in the authorization
request. If an app receives the paramter `launch=abc123`, then it must request the
scope `launch:abc123`.

Standalone apps that launch outside the EHR do not have any EHR context at the
outset. These apps must explicitly request EHR context by using the following
scopes:

#### Requesting context with scopes

Requested Scope | Meaning 
------|---------|-------------------
`launch/patient` | Need patient context at launch time (FHIR Patient resource)
`launch/encounter` | Need encounter context at launch time (FHIR Encounter resource)
`launch/location` | Need location context at launch time (FHIR Location resource)
(Others)| This list can be extended by any SMART EHR if additional context is requrireid.

#### Receiving context alongside the access token

Once an app is authorized, the token response will include any context data the
app requested -- as well as unsolicited context data if the EHR has any to
communicate. For example, EHRs may use launch context to communicate UX and UI
expectations to the app (see `need_patient_banner` below).

Launch context parameters come alongside the access token. So in an ["implicit" or "token" flow for public clients]({{site.baseur/}}authorization/public) they will appear as parameters in the hash:

    https://app/after-auth#access_token=secret-xyz&patient=123&...

And in a ["code" flow for confidential
clients]({{site.baseur/}}authorization/confidential) they will appear as JSON
parameters:

```
{
  access_token: "secret-xyz",
  patient: "123",
  ...
}
``` 
Here are the launch context paramaters to expect:

Launch context parameter | Example value | Meaning
------|---------|-------------------
`patient` | `123`| App was launched in the context of FHIR Patient 123. If the app has any patient-level scopes, they will be scoped to Patient 123.
`encounter` | `123`| App was launched in the context of FHIR Encounter 123. 
`location` | `123`| App was launched from the phyical place corresponding to FHIR Location 123. 
`need_patient_banner` | `true` or `false` | App was launched in a UX context where a patient banner is required (when true) or not required (when false). An app receiving a value of `false` should not take up screen real estate displaying a patient banner.


## Scopes for identity data

Some apps need to authenticate the clinical end-user. This can be accomplished
by requesting a pair of OpenID Connect scopes: `openid profile`.

When these scopes are requested (and the request is granted), the app will
receive two useful ways to authenticate the end-user:

1. An
[`id_token`](http://openid.net/specs/openid-connect-core-1_0.html#CodeIDToken)
that comes alongside the access token.  This token must be [validated according to the OIDC specification](http://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation).

2. Access to a `UserInfo` endpoint which can return a more complete set of
claims abuot the authenticated end-user. Details about OIDC's `UserInfo`
endpoitn are [provided
here](http://openid.net/specs/openid-connect-core-1_0.html#UserInfo). 

*TODO*:
describe discovery process by which apps can determine the URL of this
endpoint!
