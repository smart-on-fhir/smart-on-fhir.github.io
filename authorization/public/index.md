---
layout: main
title: "SMART on FHIR Authorization: Public clients"
---

# Public clients

#### **Use this profile** when all of the following conditions apply:

* Your app runs while the user is signed into the EHR
* Your app runs directly on an end-user's device (HTML5/JS in-browser; native iOS or Windows app)
* Your app is unable to protect a "client secret"

#### **Do not use this profile** if any of the following conditions apply:
* Your app has server-side business logic (e.g. using PHP, Python, Ruby, .NET, etc.)
* Your app needs long-lived access tokens
* Your app is able to protect a "client secret"

#### At registration time, **your app must**:
* Be hosted at a published, TLS-protected URL
* Register a fixed, fully-specified launch URL with the EHR
* Register a fixed, fully-specified `redirect_uri` with the EHR

## Overview of authorization workflow

*Note: We'll focus on the scenario where an app launches from inside an
existing EHR session. But don't worry: apps can also launch from outside of the
EHR. Look for <span class="label label-info">standalone</span> tags throughout
this document for details about how.*

Within an EHR session, a user decides to launch an app. This could be a
single-patient app (which runs in the context of a patient record), or a
user-level app (like an appointment manager or a population dashboard). The EHR
initiates a "launch sequence" in which a new browser instance (or `iframe`) is
created, pointing to the app's registered launch URL and passing some context.
At this point, the app enters a standard OAuth2 authorization flow using an
Implicit Grant. Once the app is authorized, it knows about the current EHR
session and can access clinical data through the FHIR API.

<img class="sequence-diagram-raw"  src="http://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgRUhSIGFwcCB1c2luZyBjbGllbnQtc2lkZSBicm93c2VyIHRlY2hub2xvZ3kKCk5vdGUgIGxlZnQgb2YgRUhSOiBVc2VyIGxhdW5jaGVzIGFwcApFSFItPj5BcHA6IFJlZGlyZWN0IHRvIGFwcDoAIgYAQQZyaWdoAEIFACMHcXVlc3QgYXV0aG9yaXphdGlvbgpBcHAtPj4AYwUAPwxlaHI6ACEIZQCBARRPbiBhcHByb3ZhbABzHHIAgRgHX3VyaSNhY2Nlc3NfdG9rZW49c2VjcmV0LQAIBS14eXomLi4uAIEjFEEAMAUgcGF0aWVudCBkYXRhXG52aWEgRkhJUiBBUEkAgT0GAIIlBUdFVCAvZmhpci9QACkGLzEyM1xuQQCBZgw6IEJhc2ljIABwEACCUAUtAIJPBntyZXNvdXJjZVR5cGU6ICIARwciLCAiYmlydGhEYXRlIjogLi4ufQo&s=default"/> 
## Example "launch sequence"

#### 1. EHR initiates launch sequence

EHR launches a new browser widget, window, or `iframe` on the app's **launch
URL** with two URL parameters:

* `iss` FHIR base URL of EHR responsible for "issuing" the launch notification
* `launch` Unique string identifying this specific launch context notification

So the browser redirects to:

    Location: https://app/launch?iss=https%3A%2F%2Fehr%2Ffhir&launch=xyz123

On receiving the launch notification, App uses AJAX to query the issuer's
`/metadata` endpoint:

    GET https://ehr/fhir/metadata
    Accept: application/json

The metadata response contains (among other details) the EHR's authorization
URL for use below.

*If your app is a <span class="label label-info">standalone</span> app that
launches from outside of the, EHR, you won't receive a launch notification.
Your authorization process will begin at step two below.*


#### 2. Apps asks EHR for authorization

The app prepares a list of required access scopes. For example, an app that
needs demographics and observations for a single patient can request:

* `patient/Patient.read`
* `patient/Observation.read`

To this list of scopes, the app adds a `launch:xyz123` scope, binding to the
existing EHR context of this launch notification.

*If your app is a <span class="label label-info">standalone</span> app that
launches from outside of the, EHR, you won't have a `launch` id at this point.
Never fear: you can declare your launch context requirements by adding specific
scopes to your request: for example, `launch/patient` to indicate that you need
to know a patient ID, or `launch/encounter` to indicate you need an encounter.
The EHR's "authorize" endpoint will take care of acquiring the context you need
(and then making it available to you).  For example, the EHR may provide the
end-user with a patient selection widget.  For full details, see <a
href="{{site.baseurl}}authorization/scopes-and-launch-context">SMART launch context
parameters</a>.*


The app then redirects the browser to the EHR's **authorization URL** as
determined above:

```
Location: https://ehr/authorize?
            response_type=token&
            client_id=app-client-id&
            redirect_uri=https%3A%2F%2Fapp%2Fafter-auth&
            scope=launch:xyz123+patient%2FObservation.read+patient%2FPatient.read&
            state=98wrghuwuogerg97
```

#### 3. EHR evaluates authorization request

Based on the `client_id`, current EHR user, local policy, and (optionally!)
user input, the EHR makes a decision to approve or deny access.  This decision
is communicated to the app by redirection to the app's registered
`redirect_uri`:

```
Location: https://app/after-auth#
  access_token=kjqwr8wjoiernwinfwo8th4iutwbiug4o8ilfunwawf&
  token_type=bearer&
  expires_in=300&
  scope=patient%2FObservation.read+patient%2FPatient.read&
  state=98wrghuwuogerg97&
  patient=123&
  encounter=456
```

With this response, the app knows which patient is in-context, and has an
OAuth2 bearer-type access token that can be used to fetch clinical data:

```
GET https://ehr/fhir/Patient/123
Authorization: Bearer 98wrghuwuogerg97

{
  "resourceType": "Patient",
  "birthTime": ...
}
```

## Details of authorization process

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

      Opaque identifier for ths specific launch, and any EHR context associated
with it. This parameter must be communicated back to the app as a<code>launch:</code> 
scope at authorization time.

      </td>
    </tr>
  </tbody>
</table>

#### 2. App asks EHR for authorization
<table class="table">
  <thead>
    <th colspan="3">Parameters</th>
  </thead>
  <tbody>
    <tr>
      <td><code>response_type</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Fixed value: <code>token</code>. </td>
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

#### 3. EHR evaluates authorization request

The decision process itself is up to the EHR system. Based on any available
information including local policies and (optionally!) end-user input, a
decision is made to grant or deny access. This decision is communicated to the
app by when the EHR redirects the browser to the app's <code>redirect_uri</code>, with the
following parameters embedded in the URI's #fragment component.


<table class="table">
  <thead>
    <th colspan="3">Parameters</th>
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
      <td>The lifetime in seconds of the access token. For public clients, this value SHOULD BE short (e.g. 300 for five minutes).</td>
    </tr>
    <tr>
      <td><code>scope</code></td>
      <td><span class="label label-success">required</span></td>
      <td>Scope of access authorized. Note that this can be different from the scopes requested by the app.</td>
    </tr>
    <tr>
      <td><code>state</code></td>
      <td><span class="label label-success">required</span></td>
      <td> The exact value received from the client.</td>
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
