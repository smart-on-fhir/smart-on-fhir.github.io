---
layout: main
title: SMART on FHIR Authorization
---

# Authorization Guide
test

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
EHR.  SMART does not specify a standards-based registration process, but we
encourage EHR implementers to consider the [OAuth 2.0 Dynamic Client
Registration Protocol](https://tools.ietf.org/html/draft-ietf-oauth-dyn-reg)
for an out-of-the-box solution.

No matter how an app registers with ah EHR, at registration time **every SMART app must**:

* Be hosted at a published, TLS-protected URL
* Register one or more fixed, fully-specified launch URL with the EHR
* Register a fixed, fully-specified `redirect_uri` with the EHR

## App launch and authorization: overview

In SMART's <span class="label label-primary">EHR launch</span> flow, a user has
established an EHR session, and then decides to launch an app. This could be a
single-patient app (which runs in the context of a patient record), or a
user-level app (like an appointment manager or a population dashboard). The EHR
initiates a "launch sequence" in which a new browser instance (or `iframe`) is
created, pointing to the app's registered launch URL and passing some context.
At this point, the app enters a standard OAuth2 authorization flow using an
Authorization Code Grant. Once the app is authorized, it knows about the
current EHR session and can access clinical data through the FHIR API.

Alternatively, in SMART's <span class="label label-primary">standalone
launch</span> flow, a user selects an app from outside of the EHR, for example
by tapping an app icon on a mobile phone home screen. This app declares its
context requirements to the EHR's authorization server, which allows the EHR to
gather launch context during the authorization process.

<img class="sequence-diagram-raw"  src="http://www.websequencediagrams.com/cgi-bin/cdraw?lz=bm90ZSBsZWZ0IG9mIEFwcDogVXNlciBoYXMgbGF1bmNoZWQgYXBwXG5mcm9tIGFuIEVIUlxub3Igc3RhbmRhbG9uZSBmbG93CgBEBXJpZ2gAQApSZXF1ZXN0IGF1dGhvcml6YXRpb24KQXBwLT4-RUhSIEF1dGggU2VydmVyOiAgUmVkaXJlY3QgdG8gABkFUzogAB4Fb3JpemUAUQ8ALhEAIAkgQXBwXG4obWF5IGluY2x1ZGUgZW5kLXVzZXIAew4pAIEfFCBPbiBhcHByb3ZhbAoAgRUPLT4-AB4GAIEeDGFwcDpyAIEzB191cmw_Y29kZT0xMjMmLi4uAE0VRXhjaGFuZ2UgY29kZSBmb3IgYWNjZXNzIHRva2VuCgCCGgYAgg0SUE9TVCAvAB8FAFsJAIFxJGVudGljYXRlIGFwcACCJSBDcmVhdGUAgQMGOlxue1xuAIEVBl8AgRYFPXNlY3JldC0AgSMFLXh5eiZcbnBhdGllbnQ9NDU2JlxuZXhwaXJlc19pbjogMzYwMFxuLi4uXG59AII4EgCEZQVbAIFtDCByZXNwb25zZV0AhDcUQQCCHQYAaAcgZGF0YSB2aWEgRkhJUiBBUEkAgiwKUmVzb3VyY2UAhFAJR0VUIC9maGlyL1AAgScGLzQ1NlxuAIRSCACFEAU6IEJlYXJlciAAgVMQAIRkEwBQEVJldHVybgCBBQZyAHYIAIQVBgCEPgUAgQMPAIF2B3sAIwhUeXBlOiAiAIEWByIsICJiaXJ0aERhdGUiOi4uLn0KCgoKCgoAAQU&s=default"/>

## SMART "launch sequence"

#### 1. EHR initiates launch sequence

Based on a clinical user's EHR session context, the EHR initiates a launch
sequence by opening a new browser widget, window, or `iframe` on the app's
launch URL. The following parameters are included:

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

To complete the following steps, the app discovers the server's OAuth
`authorize` and `token` endpoint URLs by <a
href="{{site.baseurl}}authorization/conformance-statement"> examining the EHR's
conformance statement</a>.


#### *For example*
A launch might cause the browser redirects to:

    Location: https://app/launch?iss=https%3A%2F%2Fehr%2Ffhir&launch=xyz123

On receiving the launch notification, the app would query the issuer's
`/metadata` endpoint:

    GET https://ehr/fhir/metadata
    Accept: application/json

The metadata response contains (among other details) the EHR's authorization
URL for use below. For details about how the EHR publishes the relevant OAuth URLs, <a href="{{site.baseurl}}authorization/conformance-statement">see here</a>.

*Note that apps using the <span class="label label-primary">standalone
launch</span> flow will launch from outside of the EHR, so no launch
notification is required. These apps will begin the process at step 2 below.*

<br><br>

#### 2. App asks for authorization

At launch time, the app redirect to the EHR's "authorize" endpoint with the following parameters:

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

Must describe the access that the app needs, including clincal data scopes like
<code>patient/*.read</code> and either:

<ul>
<li> a launch ID in
the form <code>launch:{id}</code> to bind to the current EHR context.</li>
<li> a set of launch context requirements in the form <code>launch/patient</code> the EHR to establish context on your behalf.</a>
</ul>

See <a href="{{site.baseurl}}authorization/scopes-and-launch-context">SMART on FHIR Access
Scopes</a> details.

      </td>
    </tr>
    <tr>
      <td><code>state</code></td>
      <td><span class="label label-default">recommended</span></td>
      <td>

An opaque value used by the client to maintain state between the request and
callback. The authorization server includes this value when redirecting the
user-agent back to the client. The parameter SHOULD be used for preventing
cross-site request forgery or session fixation attacks.

      </td>
    </tr>
  </tbody>
</table>


#### *For example*
An app that needs demographics and observations for a single
patient can request:

* `patient/Patient.read`
* `patient/Observation.read`

To this list of scopes, the app adds a `launch:xyz123` scope, binding to the
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
            state=98wrghuwuogerg97
```

<br><br>
#### 3. EHR evaluates authorization request, asking for end-user input

The authorization decision is up to the EHR system and the end-user. Based on
any available information including local policies and perhaps direct end-user
input, a decision is made to grant or deny access. This decision is
communicated to the app when the EHR redirects the browser to the app's
<code>redirect_uri</code>, with the following URL parameters:

<table class="table">
  <thead>
    <th colspan="3">Parameters</th>
  </thead>
  <tbody>
    <tr>
      <td><code>code</code></td>
      <td><span class="label label-success">required</span></td>

      <td>

The authorization code generated by the authorization server. The authorization
code *must* expire shortly after it is issued to mitigate the risk of leaks.

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
#### 4. App exchanges authorization code for access token

After obtaining an authorization code, the app trades the code for an access
token via HTTP `POS`T to the EHR's token URL, with content-type
`application/x-www-form-urlencoded`. 

For <span class="label label-primary">public apps</span>, no authentication is
required at this step. For <span class="label label-primary">confidential
apps</span>, an `Authorization` header using HTTP Basic authentication is
required, where the username is the app's `client_id` and the password is the
app's `client_secret` (see [example](./basic-auth-example)).


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
      <td><span class="label label-default">optional</span></td>
      <td>If present, must match the client_id found in the Authorization header.</td>
    </tr>
  </tbody>
</table>

The response is a JSON object containing the access token, with the following
keys:

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
      <td><code>intent</code></td>
      <td><span class="label label-info">optional</span></td>
      <td>A string value describing the intent of the application launch. Launch intent values are agreed upon in advance by both the SMART host and client.</td>
    </tr>
    <tr>
      <td><code>smart_style_url</code></td>
      <td><span class="label label-info">optional</span></td>
      <td>A URL where the host's style parameters can be retrieved (for apps that support <a href="../scopes-and-launch-context#styling">styling</a>).</td>
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
  </tbody>
</table>



#### *For example*
<a id="step-4"></a>
Given an authorization code, the app trades it for an access token via HTTP
POST.

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

At this point, **the launch flow is complete**. Follow steps below to work with data and refresh access tokens.

<br><br>
#### 5. App accesses clinical data via FHIR API

With a valid access token, the app can access protected EHR data by issuing a
FHIR API call to the EHR's FHIR endpoint. The request includes an
`Authorization` header that presents the `access_token` as "Bearer" token:

{% raw %}
    Authorization: Bearer {{access_token}}
{% endraw %}

(Note that in a real request, {%raw%}`{{access_token}}`{%endraw%} is replaced with the actual token value.)

#### For example
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

<br><br>
#### 6. (Later...) App uses a refresh token to obtain a new access token

You can use the `expires_in` field from the authorization response (see <a
href="#step-4">step 4</a>) to determine when your access token will expire.
After an access token expires, it may be possible to request an updated token
without user intervention, if the EHR supplied a `refresh_token` in the
authorization response.  To obtain a new access token, the app issues an HTTP
`POST` to the EHR authorization server's token URL, with content-type
`application/x-www-form-urlencoded`

For <span class="label label-primary">public apps</span>, no authentication is
required at this step. For <span class="label label-primary">confidential
apps</span>, an `Authorization` header using HTTP Basic authentication is
required, where the username is the app's `client_id` and the password is the
app's `client_secret` (see [example](./basic-auth-example)). 

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
The response is a JSON object containing the access token, with the following keys:

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
      <td><code>refresh_token</code></td>
      <td><span class="label label-info">optional</span></td>
      <td>The refresh token issued by the authorization server. If present, the app should discard any previosu <code>refresh_token</code> associated with this launch, replacing it with this new value.</td>
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
  "scope": "patient/Observation.read patient/Patient.read"
}
```
