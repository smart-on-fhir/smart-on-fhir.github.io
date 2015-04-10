---
layout: main
title: SMART on FHIR Authorization
---

# Authorization Guide

SMART on FHIR provides reliable, secure authorization for a variety of app
architectures with a consistent, easy-to-implement set of building blocks.
Because different app architectures bring different security considerations to
the table, we've organized authorization profiles by one key question:

## Support for "public" and "confidential" apps

Pure client-side apps (for example, HTML5/JS browser-based apps, iOS mobile
apps, or Windows desktop apps) can provide adequate security -- but they can't
"keep a secret" in the OAuth2 sense. That is to say, any "secret" key, code, or
string that's embedded in the app can potentially be extracted by an end-user
or attacker. So security for these apps can't depend on secrets embedded at
install-time. Instead, security comes from being hosted at a trusted URL.

#### Use the <span class="label label-primary">confidential app</span> profile when all of the following apply:
* App has server-side business logic (e.g. using PHP, Python, Ruby, .NET, etc.)
* App is *able to protect* a `client_secret`


#### Use the <span class="label label-primary">public app</span> profile when all of the following apply:

* App runs while the user is signed into the EHR
* App runs entirely on an end-user's device (e.g. HTML5/JS in-browser; native iOS or Windows)
* App is *unable to protect* a `client_secret`

## Registering a SMART App with an EHR

Before a SMART app can run against an EHR, the app must be registered with that
EHR's authorization service.  SMART does not specify a standards-based registration process, but we
encourage EHR implementers to consider the [OAuth 2.0 Dynamic Client
Registration Protocol](https://tools.ietf.org/html/draft-ietf-oauth-dyn-reg)
for an out-of-the-box solution.

No matter how an app registers with an EHR's authorization service, at registration time **every SMART app must**:

* Register one or more fixed, fully-specified launch URL with the EHR's authorization server
* Register one or more, fixed, fully-specified `redirect_uri`s with the EHR's authorization server

## SMART authorization & FHIR access: overview

An app (confidential or public) can launch from within an existing EHR session,
which is known as an EHR launch.  Alternatively, it can launch as a standalone
app.

In an <span class="label label-primary">EHR launch</span>, an opaque handle to
the EHR context is passed along to the app as part of the launch URL.  The app
later will include this context handle as a scope parameter when it requests
authorization to access resources.  Note that the complete URLs of all apps
approved for use by users of this EHR will have been registered with the EHR
authorization server.

Alternatively, in a <span class="label label-primary">standalone launch</span>,
when the app launches from outside an EHR session, the app can request context
from the EHR authorization server during the authorization process described
below.

Once the app is launched, it requests authorization to access a FHIR resource
by redirecting its authorization request to the EHR’s authorization server.
Based on pre-defined rules and possibly end-user authorization, the EHR
authorization server either grants the request by returning an
authorization code to the app’s redirect URL, or denies the request.
The app then exchanges the authorization code for an access token, which
the app presents to the EHR’s resource server to obtain the FHIR resource.
If a refresh token is returned along with the access token, the app may
use this to request a new access token, with the same scope, once
the access token expires.

## SMART "launch sequence"

The two alternative launch sequences are described below.

### EHR launch sequence

<img class="sequence-diagram-raw"  src="http://www.websequencediagrams.com/cgi-bin/cdraw?lz=RUhSIFNlc3Npb24gLT4-IEFwcDogUmVkaXJlY3QgdG8gaHR0cHM6Ly97YXBwIGxhdW5jaF91cml9P1xuAAgGPTEyMyZcbmlzcz0AIwlmaGlyIGJhc2UgdXJsfQpBcHAgLT4gRUhSIEZISVIgU2VydmVyOiBHRVQgL21ldGFkYXRhCgAQDyAtAIEHB1tDb25mb3JtYW5jZSBzdGF0ZW1lbnQgaW5jbHVkaW5nIE9BdXRoIDIuMCBlbmRwb2ludCBVUkxzXQBxBwBzBkF1dGh6AHEJAIFNFWVociBhdXRob3JpegCBNAY_c2NvcGU9AIFxBjoxMjMmAHsFPWFiYyYuLi4K&s=default"/>

In SMART's <span class="label label-primary">EHR launch</span> flow (shown above), 
a user has established an EHR session, and then decides to launch an app. This 
could be a single-patient app (which runs in the context of a patient record), or 
a user-level app (like an appointment manager or a population dashboard). The EHR
initiates a "launch sequence" by opening a new browser instance (or `iframe`) 
pointing to the app's registered launch URL and passing some context.

The following parameters are included:

<table class="table">
  <thead>
    <th colspan="3">Parameters</th>
  </thead>
  <tbody>
    <tr>
      <td><code>iss</code></td>
      <td><span class="label label-success">required</span></td>
      <td>

Identifies the EHR's FHIR endpoint, which the app can use to obtain
additional details about the EHR, including its authorization URL.

      </td>
    </tr>
    <tr>
      <td><code>launch</code></td>
      <td><span class="label label-success">required</span></td>
      <td>

      Opaque identifier for this specific launch, and any EHR context associated
with it. This parameter must be communicated back to the EHR  at authorization
time by creating a <code>launch:[id]</code> scope (like <code>launch:123</code>).

      </td>
    </tr>
  </tbody>
</table>


#### *For example*
A launch might cause the browser to redirect to:

    Location: https://app/launch?iss=https%3A%2F%2Fehr%2Ffhir&launch=xyz123

On receiving the launch notification, the app would query the issuer's
`/metadata` endpoint:

    GET https://ehr/fhir/metadata
    Accept: application/json

The metadata response contains (among other details) the EHR's 
<a href="{{site.baseurl}}authorization/conformance-statement">
conformance statement</a> identifying the OAuth `authorize` and `token`
endpoint URLs for use in requesting authorization to access FHIR 
resources. 

Later, when the app prepares a list of access scopes to request from
the EHR authorization server, it will bind to the existing EHR context by
including the launch notification in the scope.

### Standalone launch sequence

<img class="sequence-diagram-raw"  src="http://www.websequencediagrams.com/cgi-bin/cdraw?lz=CkFwcCAtPiBFSFIgRkhJUiBTZXJ2ZXI6IEdFVCAvbWV0YWRhdGEKABAPIC0-IEFwcDogW0NvbmZvcm1hbmNlIHN0YXRlbWVudCBpbmNsdWRpbmcgT0F1dGggMi4wIGVuZHBvaW50IFVSTHNdAHEHAHMGQXV0aHoAcQlSZWRpcmVjdCB0byBodHRwczovL3tlaHIgYXV0aG9yaXplIHVybH0_c2NvcGU9bGF1bmNoOjEyMyYAewU9YWJjJi4uLgo&s=default"/>

Alternatively, in SMART's <span class="label label-primary">standalone
launch</span> flow (shown above), a user selects an app from outside the EHR, 
for example by tapping an app icon on a mobile phone home screen. This app 
will launch from its registered URL without a launch id.   

In order to obtain launch context and request authorization to access FHIR 
resources, the app discovers the EHR authorization server's OAuth
`authorize` and `token` endpoint URLs by querying the FHIR endpoint
for the <a
href="{{site.baseurl}}authorization/conformance-statement"> 
EHR's conformance statement</a>.  

The app then can declare its launch context requirements
by adding specific scopes to the request it sends to the EHR's authorization
server.  The `authorize` endpoint 
will acquire the context the app needs and make it available.

#### *For example:*

If the app needs patient context, the EHR's authorization server 
may provide the end-user with a
patient selection widget.  For full details, see <a href="{{site.baseur1}}authorization/scopes-and-launch-context">SMART launch context parameters</a>.

*	launch/patient - to indicate that the app needs to know a patient ID
*	launch/encounter - to indicate the app needs an encounter

<br><br>

## SMART authorization and resource retrieval

#### First, a word about app protection...

The app is responsible for protecting itself from potential misbehaving or
malicious values passed to its redirect URL (e.g., values injected with
executable code, such as SQL) and for protecting authorization codes, access
tokens, and refresh tokens from unauthorized access and use.  The app
developer must be aware of potential threats, such as malicious apps running
on the same platform, counterfeit authorization servers, and counterfeit
resource servers, and implement countermeasures to help protect both the app
itself and any sensitive information it may hold. For background, see the
[OAuth 2.0 Thread Model and Security
Considerations](https://tools.ietf.org/html/rfc6819).

* Apps MUST assure that sensitive information (authentication secrets,
authorization codes, tokens) is transmitted ONLY to authenticated servers,
over TLS-secured channels.

* Apps MUST generate an unpredictable `state` parameter for each user
session.  An app MUST validate the `state` value for any request sent to its
redirect URL; include `state` with all authorization requests; and validate
the `state` value included in access tokens it receives.

* An app should NEVER treat any inputs it receives as executable code.

* An app MUST NOT forward values passed back to its redirect URL to any
other arbitrary or user-provided URL (a practice known as an “open
redirector”).

* An app should NEVER store bearer tokens in cookies that are transmitted
in the clear.

* Apps should persist tokens and other sensitive data in app-specific
storage locations only, not in system-wide-discoverable locations.

#### *SMART authorization sequence* 

<img class="sequence-diagram-raw" src="http://www.websequencediagrams.com/cgi-bin/cdraw?lz=bm90ZSBvdmVyIEFwcDogUmVxdWVzdCBhdXRob3JpemF0aW9uCkFwcC0-PkVIUiBBdXRoIFNlcnZlcjogIFJlZGlyZWN0IGh0dHBzOi8ve2VocgAzCWUgdXJsfT8uLi4KAFwKADQRQQAlCUFwcFxuKE1heSBpbmNsdWRlIGVuZC11c2UASQoAgQoFXG5hbmQABRcpAE8cIE9uIGFwcHJvdmFsCgCBPw8tPj4AgXwFAIFBE2FwcCByAIFjB191cml9P2NvZGU9MTIzJgCBTg4AOwZFeGNoYW5nZSBjb2RlIGZvciBhY2Nlc3MgdG9rZW4KAIJHBgCCOhJQT1NUAII-CgAnBQCCOwVcbmdyYW50X3R5cGU9AIMKDV9jb2RlJgCBBAgAgkQgZW50aWNhdGUgYQCCYgVJZiBjb25maWRlbnRpYWwgY2xpZW50AIIiHUlzc3VlIG5ldwCBRAYgd2l0aCBjb250ZXh0Olxue1xuIgCBZAZfAIFlBSI6ICJzZWNyZXQtAIF1BS14eXoiLFxuImV4cGlyZXNfaW4iOiAzNjAwLFxuInBhdGllbnQiOiAiNDU2Iixcbi4uLlxufQCDFhIAhSMFWwCCSAwgcmVzcG9uc2VdCgoKCg&s=">

<a id="step-1"></a>
#### 1. App asks for authorization

At launch time, the app constructs a request for authorization by adding the
following parameters to the query component of the EHR’s "authorize" endpoint
URL using the "application/x-www-form-urlencoded" format:

<table class="table">
  <thead>
    <th colspan="3">Parameters</th>
  </thead>
  <tbody>
    <tr>
      <td><code>response_type</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Fixed value: <code>code</code>. </td>
    </tr>
    <tr>
      <td><code>client_id</code></td>
      <td><span class="label label-success">required</span></td>
      <td>The client's identifier. </td>
    </tr>
    <tr>
      <td><code>redirect_uri</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Must match one of the client's pre-registered redirect URIs.</td>
    </tr>
    <tr>
      <td><code>scope</code></td>
      <td><span class="label label-success">required</span></td>
      <td>

Must describe the access that the app needs, including clinical data scopes like
<code>patient/*.read</code>, <code>openid</code> and <code>profile</code> (if app 
needs authenticated patient identity) and either:

<ul>
<li> a launch ID in
the form <code>launch:{id}</code> to bind to the current EHR context.</li>
<li> a set of launch context requirements in the form <code>launch/patient</code> 
the EHR to establish context on your behalf.</a>
</ul>

See <a href="{{site.baseurl}}authorization/scopes-and-launch-context">SMART on FHIR Access
Scopes</a> details.

      </td>
    </tr>
    <tr>
      <td><code>state</code></td>
      <td><span class="label label-sucess">required</span></td>
      <td>

An opaque value used by the client to maintain state between the request and
callback. The authorization server includes this value when redirecting the
user-agent back to the client. The parameter SHOULD be used for preventing
cross-site request forgery or session fixation attacks.

      </td>
    </tr>
     <tr>
      <td><code>aud</code></td>
      <td><span class="label label-success">required</span></td>
      <td>

URL of the EHR resource server from which the app wishes to retrieve FHIR data.
This parameter prevents leaking a genuine bearer token to a counterfeit
resource server. (Note: in the case of an <span class="label label-primary">EHR launch</span>
flow, this <code>aud</code> value is the same as the launch's <code>iss</code> value.)

      </td>
    </tr>
  </tbody>
</table>

The app MUST use an unpredictable value for the state parameter
with at least 128 bits of entropy. The app MUST validate the value
of the state parameter upon return to the redirect URL and MUST ensure
that the state value is securely tied to the user’s current session
(e.g., by relating the state value to a session identifier issued
by the app). The app SHOULD limit the grants, scope, and period of
time requested to the minimum necessary.

If the app needs to authenticate the identity of the end-user, it should
include two OpenID Connect scopes:  `openid` and `profile`.   When these scopes
are requested, and the request is granted, the app will receive an id_token
along with the access token.  For full details, see [SMART launch context
parameters](./scopes-and-launch-context).

#### *For example*
An app that needs demographics and observations for a single
patient, and also wants information about the current logged-in user, the app  can request:

* `patient/Patient.read`
* `patient/Observation.read`
* `openid profile`

If the app was launched from an EHR, the app adds a `launch:xyz123` scope, binding to the
existing EHR context of this launch notification.

*Apps using the <span class="label label-primary">standalone launch</span> flow
won't have a `launch` id at this point.  These apps can declare launch context
requirements by adding specific scopes to the authorization request: for
example, `launch/patient` to indicate that you need to know a patient ID, or
`launch/encounter` to indicate you need an encounter.  The EHR's "authorize"
endpoint will take care of acquiring the context you need (and then making it
available to you).  For example, if your app needs patient context, the EHR may
provide the end-user with a patient selection widget.  For full details, see <a
href="{{site.baseurl}}authorization/scopes-and-launch-context">SMART launch
context parameters</a>.*


The app then redirects the browser to the EHR's **authorization URL** as
determined above:

```
Location: https://ehr/authorize?
            response_type=code&
            client_id=app-client-id&
            redirect_uri=https%3A%2F%2Fapp%2Fafter-auth&
            scope=launch:xyz123+patient%2FObservation.read+patient%2FPatient.read&
            openid&profile&state=98wrghuwuogerg97
```

<br><br>


<a id="step-2"></a>
#### 2. EHR evaluates authorization request, asking for end-user input

The authorization decision is up to the EHR authorization server,
which may request authorization from the end-user. The EHR authorization
server will enforce access rules based on local policies and optionally direct
end-user input.  If an EHR launches the app for an authenticated user who has
explicitly requested the launch, asking for the end user's authorization is
optional; else the user's authorization SHOULD be requested.  The user
should be given information regarding the client requesting the access,
the request, the scope, and the time access is needed.

The EHR decides whether to grant or deny access.  This decision is
communicated to the app when the EHR authorization server returns an
authorization code.  Authorization codes are short-lived, usually expiring
within around one minute.  The code is sent when the EHR authorization server
redirects the browser to the app's <code>redirect_uri</code>, with the
following URL parameters:

<table class="table">
  <thead>
    <th colspan="3">Parameters</th>
  </thead>
  <tbody>
    <tr>
      <td><code>code</code></td>
      <td><span class="label label-success">required</span></td>

      <td>

	The authorization code generated by the authorization server. The
authorization code *must* expire shortly after it is issued to mitigate the
risk of leaks.

      </td>
    </tr>
    <tr>
      <td><code>state</code></td>
      <td><span class="label label-success">required</span></td>
      <td>The exact value received from the client.</td>
    </tr>
  </tbody>
</table>

#### *For example*

Based on the `client_id`, current EHR user, configured policy, and perhaps
direct user input, the EHR makes a decision to approve or deny access.  This
decision is communicated to the app by redirection to the app's registered
`redirect_uri`:

```
Location: https://app/after-auth?
  code=123abc&
  state=98wrghuwuogerg97
```

<br><br>

<a id="step-3"></a>
#### 3. App exchanges authorization code for access token

After obtaining an authorization code, the app trades the code for an access
token via HTTP `POST` to the EHR authorization server's token endpoint URL,
using content-type `application/x-www-form-urlencoded`.

For <span class="label label-primary">public apps</span>, authentication is not
possible (and thus not required), since the app cannot be trusted to protect a
secret.  For <span class="label label-primary">confidential apps</span>, an
`Authorization` header using HTTP Basic authentication is required, where the
username is the app's `client_id` and the password is the app's `client_secret`
(see [example](./basic-auth-example)).


<table class="table">
  <thead>
    <th colspan="3">Parameters</th>
  </thead>
  <tbody>
    <tr>
      <td><code>grant_type</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Fixed value: <code>authorization_code</code></td>
    </tr>
    <tr>
      <td><code>code</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Code that an app can exchange for an access token</td>
    </tr>
    <tr>
      <td><code>redirect_uri</code></td>
      <td><span class="label label-success">required</span></td>
      <td>The same redirect_uri used in the initial authorization request</td>
    </tr>
    <tr>
      <td><code>client_id</code></td>
      <td><span class="label label-info">optional</span></td>
      <td>If present, must match the client_id found in the Authorization header.</td>
    </tr>
  </tbody>
</table>

The response is a JSON Web Token (JWT) bearer token, with the following
claims:

<table class="table">
  <thead>
    <th colspan="3">JSON Object property name</th>
  </thead>
  <tbody>
    <tr>
      <td><code>access_token</code></td>
      <td><span class="label label-success">required</span></td>
      <td>The access token issued by the authorization server.</td>
    </tr>
    <tr>
      <td><code>token_type</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Fixed value: <code>bearer</code>.</td>
    </tr>
    <tr>
      <td><code>expires_in</code></td>
      <td><span class="label label-success">required</span></td>
      <td>The lifetime in seconds of the access token. For example, the value "3600" denotes that the access token will expire in one hour from the time the response was generated.</td>
    </tr>
    <tr>
      <td><code>scope</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Scope of access authorized. Note that this can be different from the scopes requested by the app.</td>
    </tr>
    <tr>
      <td><code>patient</code>, etc.</td>
      <td><span class="label label-info">optional</span></td>
      <td>

When an app is launched with patient context, these parameters communicate the
context values. For example, a parameter like <code>patient=123</code> would
indicate the FHIR resource <code>https://[fhir-base]/Patient/123</code>. Other
context parameters may also be available. For full details see <a
href="{{site.baseurl}}authorization/scopes-and-launch-context">SMART launch
context parameters</a>.

      </td>
    </tr>
    <tr>
      <td><code>ID_token</code></td>
      <td><span class="label label-info">optional</span></td>
      <td>Authenticated patient identity and profile, if requested.</td>
    </tr>
    <tr>
      <td><code>refresh_token</code></td>
      <td><span class="label label-info">optional</span></td>
      <td>Credential used to request new access token after token expires.</td>
      </tr>
  </tbody>
</table>

The EHR authorization server decides what `expires_in` value to assign to an
access token and whether to issue a refresh token along with the access token.
If the app receives a refresh token along with the access token, it can
exchange this refresh token for a new access token when the current access
token expires (see step 5 below).  A refresh token should be bound to the
same `client_id` and should contain the same set of claims as the access
token with which it is associated.

Apps SHOULD store tokens in app-specific storage locations only, not in
system-wide-discoverable locations.  Access tokens SHOULD have a valid
lifetime no greater than one hour, and refresh tokens (if issued) SHOULD
have a valid lifetime no greater than twenty-four hours.  Confidential
clients may be issued longer-lived tokens than public clients.

Depending upon applicable policy, access tokens and refresh tokens
MAY be signed by the EHR authorization server using JSON Web Signature
(JWS).


#### *For example*
<a id="step-4"></a>
Given an authorization code, the app trades it for an access token via HTTP
`POST`.

##### Request for
```
POST /token HTTP/1.1
Host: ehr
Authorization: Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz
Content-Type: application/x-www-form-urlencoded/token?

grant_type=authorization_code&
code=123abc&
redirect_uri=https%3A%2F%2Fapp%2Fafter-auth
```

##### Response
```
{
  "access_token": "i8hweunweunweofiwweoijewiwe",
  "token_type": "bearer",
  "expires_in": "3600",
  "scope": "patient/Observation.read patient/Patient.read",
  "intent": "client-ui-name",
  "patient":  "123",
  "encounter": "456"
}
```

At this point, **the authorization flow is complete**. Follow steps below to work with
data and refresh access tokens, as shown in the following sequence diagram.

<img class="sequence-diagram-raw"
src="http://www.websequencediagrams.com/cgi-bin/cdraw?lz=bm90ZSBvdmVyIEFwcDogQWNjZXNzIHBhdGllbnQgZGF0YSAKQXBwLT5FSFIgRkhJUiBTZXJ2ZXI6IEdFVCBodHRwczovL3tmaGlyIGJhc2UgdXJsfS9QADoGLzEyMwoAWAoAMhFSZXR1cm4AUQZyZXNvdXJjZSB0byBhcHAKAGEPLT4AgRsFeyIAIAhUeXBlIjogIgBkByIsICJiaXJ0aERhdGUiOi4uLn0AbwsAgVAMdG9rZW4gZXhwaXJlcy4uLgAXEC4uLiBzbyByZXF1ZXN0IGEgbmV3AC8GAIF_CkF1dGh6AIIBCSBQT1MAggELAFsGdXJsfVxuZ3JhbnRfdHlwZT1yZWZyZXNoXwB7BSZcbgADDT1hYmMAghsSAFkOQXV0aGVudGljYXRlIGFwcFxuKGlmIGNvbmZpZGVudGlhbCBjbGllbnQpCk4ALBtJc3N1ZQCBSwpcbntcbiJhAINzBQCBFgYiOiAic2VjcmV0LQCCJwUteHl6IixcbiIAgi0HX2luIjogMzYwMCxcbiIAgUoNIjogIm5leHQtAIFmBy0xMjMiXG4uLi5cbn0KfQoAg1EFAIIxDACDUAdbAHoGAIMVB3Jlc3BvbnNlXQoKCgoKCgABBQo&s=">



<br><br>
#### 4. App accesses clinical data via FHIR API

With a valid access token, the app can access protected EHR data by issuing a
FHIR API call to the FHIR endpoint on the EHR's resource server. The request includes an
`Authorization` header that presents the `access_token` as a "Bearer" token:

{% raw %}
    Authorization: Bearer {{access_token}}
{% endraw %}

(Note that in a real request, {%raw}`{{access_token}}`{%endraw%}is replaced
with the actual token value.)

#### *For example*
With this response, the app knows which patient is in-context, and has an
OAuth2 bearer-type access token that can be used to fetch clinical data:

```
GET https://ehr/fhir/Patient/123
Authorization: Bearer i8hweunweunweofiwweoijewiwe

{
  "resourceType": "Patient",
  "birthTime": ...
}
```

The EHR's FHIR resource server validates the access token and ensures that it
has not expired and that its scope covers the requested FHIR resource.  The
resource server also validates that the `aud` parameter associated with the
authorization (see <a href="#step-1">above</a>) matches the resource server's own FHIR
endpoint.  The method used by the EHR to validate the access token is beyond
the scope of this specification but generally involves an interaction or
coordination between the EHR’s resource server and the authorization server.

On occasion, an app may receive a FHIR resource that contains a “reference” to
a resource hosted on a different resource server.  The app SHOULD NOT blindly
follow such references and send along its access_token, as the token may be
subject to potential theft.   The app SHOULD either ignore the reference, or
initiate a new request for access to that resource.
<br><br>

#### 5. (Later...) App uses a refresh token to obtain a new access token

The app can use the `expires_in` field from the authorization response (see <a
href="#step-3">step 3</a>) to determine when its access token will expire.
After an access token expires, it may be possible to request an updated token
without user intervention, if the EHR supplied a `refresh_token` in the
authorization response.  To obtain a new access token, the app issues an HTTP
`POST` to the EHR authorization server's token URL, with content-type
`application/x-www-form-urlencoded`

For <span class="label label-primary">public apps</span>, authentication is not
possible (and thus not required). For <span class="label
label-primary">confidential apps</span>, an `Authorization` header using HTTP
Basic authentication is required, where the username is the app's `client_id`
and the password is the app's `client_secret` (see
[example](./basic-auth-example)).

The following request parameters are defined:

<table class="table">
  <thead>
    <th colspan="3">Parameters</th>
  </thead>
  <tbody>

    <tr>
      <td><code>grant_type</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Fixed value: <code>refresh_token</code>. </td>
    </tr>
    <tr>
      <td><code>refresh_token</code></td>
      <td><span class="label label-success">required</span></td>
      <td>The refresh token from a prior authorization response</td>
    </tr>
    <tr>
      <td><code>scope</code></td>
      <td><span class="label label-info">optional</span></td>
      <td>
The scopes of access requested. If present, this value must be a strict sub-set
of the scopes granted in the original launch (no new permissions can be
obtained at refresh time). A missing value indicates a request for the same
scopes granted in the original launch.
      </td>
    </tr>
  </tbody>
</table>
The response is a JSON object containing a new access token, with the following claims:

<table class="table">
  <thead>
    <th colspan="3">JSON Object property name</th>
  </thead>
  <tbody>
    <tr>
      <td><code>access_token</code></td>
      <td><span class="label label-success">required</span></td>
      <td>New access token issued by the authorization server.</td>
    </tr>
    <tr>
      <td><code>token_type</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Fixed value: bearer</td>
    </tr>
    <tr>
      <td><code>expires_in</code></td>
      <td><span class="label label-success">required</span></td>
      <td>The lifetime in seconds of the access token. For example, the value "3600" denotes that the access token will expire in one hour from the time the response was generated.</td>
    </tr>
    <tr>
      <td><code>scope</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Scope of access authorized. Note that this will be the same as the scope of the original access token, and it can be different from the scopes requested by the app.</td>
    </tr>
    <tr>
      <td><code>refresh_token</code></td>
      <td><span class="label label-info">optional</span></td>
      <td>The refresh token issued by the authorization server. If present, the app should discard any previosu <code>refresh_token</code> associated with this launch, replacing it with this new value.</td>
    </tr>
    <tr>
      <td><code>patient, etc.</code></td>
      <td><span class="label label-success">optional</span></td>
      <td>When an app is launched with patient context, these parameters communicate the context values. For example, a parameter like patient=123 would indicate the FHIR resource https://[fhir-base]/Patient/123. Other context parameters may also be available. For full details see SMART launch context parameters.</td>
    </tr>
  </tbody>
</table>

#### *For example*
If the EHR supports refresh tokens, an app may be able to replace an expired
access token programatically, without user interaction:

##### Request

```
POST /token HTTP/1.1
Host: ehr
Authorization: Basic bXktYXBwOm15LWFwcC1zZWNyZXQtMTIz
Content-Type: application/x-www-form-urlencoded/token?

grant_type=refresh_token&
refresh_token=a47txjiipgxkvohibvsm
```

##### Response

```
{
  "access_token": "m7rt6i7s9nuxkjvi8vsx",
  "token_type": "bearer",
  "expires_in": "3600",
  "scope": "patient/Observation.read patient/Patient.read",
  "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA"
}
```
