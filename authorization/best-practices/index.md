---
layout: main
title: "SMART on FHIR Authorization: Best Practices"
---

# Best Practices in Authorization for SMART on FHIR EHRs

This page catalog best practices in developing secure SMART on
FHIR EHR implementations. As such, these considerations don't directly affect
interoperability; rather, they describe pracical implications of security
decisions. This page is a work in progress; we anticipate describing details
such as the entropy required in generating access tokens.

## Please contribute suggestions!

Please use the link at the top of this page to suggest additions to our best
practices list.

## 1. Best Practices for Organizational Policy

### 1.1.  Transport Security

1.1.1 All transmissions that involve the exchange of sensitive information
(e.g., end-user credential, client credential, authorization code, access
token, refresh token, FHIR resource) are required to be conducted over links
that have been secured using Transport Layer Security (TLS).  For maximal
security and interoperability, the latest, widely deployed version of TLS,
configured with cipher suites recommended by [NIST FIPS SP 140-2, Annex
A](http://csrc.nist.gov/publications/fips/fips140-2/fips1402annexa.pdf), should
be used.  At this time, this version is [RFC5246](
https://tools.ietf.org/html/rfc5246), The Transport Layer Security (TLS)
Protocol, Version 1.2.  The server involved in the exchange MUST authenticate
its own identity to the client and set up the secure channel.  Depending upon
organizational policy, authentication of the client may also be required.  

## 2. Best Practices for Authorization Servers

### 2.1 OAuth Grant Models

2.1.1 [RFC 6749](https://tools.ietf.org/html/rfc6749), The OAuth 2.0
Authorization Framework, defines four types of "authorization grants" that a
client can exchange for an access token. The Authorization Code Grant (section
4.1 of RFC6749) provides the distinct advantages of 1) enabling the end-user to
authenticate directly to the authorization server, avoiding having to share
credentials with the client; and 2) enabling the authorization server to
transmit the access token directly to the client, rather than exposing it to
the user-agent (e.g., browser). The authorization code grant model supports
both access tokens and refresh tokens, and is the preferred model for
authorizing an external client to access FHIR resources.

2.1.2 If the requesting client is a registered partner organization with whom
the FHIR resource-holder has an agreement to share resources, then the Client
Credentials Grants model (section 4.4 of RFC6749) may be used.  In such case,
the use of signed JSON Web Tokens for transmitting the authorization request
and authentication information, as described in [RFC7523](
https://tools.ietf.org/html/rfc7523) is recommended.

2.1.3 To discourage online guessing of authorization codes, authorization
servers should limit the number of times, within an established time period, a
client may submit an invalid code to exchange for an access token.

### 2.2 End-User Authorization

2.2.1  Whether the authorization server needs to ask for user authorization
before authorizing access to a resource is determined by the security policy of
the organization holding the resource.  When the authorization server requests
user authorization, the end user should be provided information important in
making this decision, such as the name of the client, the resources for which
access is requested, the scope of access requested, and the period of time for
which the access may be authorized. Authorization servers may provide end-users
with the ability to accept or reject individual scopes of access, resulting
in an approval that carries fewer scopes than the client requested.

### 2.3 Refresh Tokens

2.3.1 The use of refresh tokens eliminates the need for the authorization
server to issue an access token with a long lifetime, thus reducing the risk of
undesired access and use.  Instead of issuing a single, long-term access token,
issuing a long-term refresh token along with a short-term access token is
recommended.  However, because a refresh token provides extended access to a
resource, they may be issued only through the use of the Authorization Code
Grant model.   It is the authorization server’s responsibility to ensure that
refresh tokens cannot be generated, modified, or guessed by an interloper, and
to assure that refresh tokens are protected in transit and during storage.

2.3.2 [RFC6749]( https://tools.ietf.org/html/rfc6749) requires that the
authorization server maintain the binding between a refresh token and the
client to whom it was issued, and that the authorization server verify that
binding when the refresh token is presented.  Because only confidential clients
are capable of authenticating their own identity, it is recommended that
refresh tokens be issued only to confidential clients.  If the authorization
server’s policy allows issuance of refresh tokens to public clients, then the
authorization server should use some other means of protecting against misuse,
such as issuing a new refresh token with every access-token refresh response
and retaining the used refresh token. If a refresh token is compromised and
subsequently used by both the attacker and the legitimate client, one of them
will present an invalidated refresh token, which will inform the authorization
server of the breach.

2.3.3  The [SMART on FHIR Scopes and Launch Contexts](
http://docs.smarthealthit.org/authorization/scopes-and-launch-context) define
two ways of asking for refresh tokens: requesting a refresh token using the
`online_access` scope results in a refresh token that remains valid only while
the end-user remains online; whereas requesting a refresh token using the
`offline_access` scope results in a refresh token that remains valid even after
the end-user is no longer online.  In order to enforce `online_access`, the
authorization server needs to implement some means of determining whether the
user is still online.  For example, the server may implement user sessions with
automatic timeouts and automated session extension whenever the user shows
signs of activity.  Because of the increased risk presented by long-term,
`offline_access`, the default for refresh tokens should be `online_access`.  In
addition, some means should be provided for a user to revoke `offline_access`
(such as a permissions management web page or API).

2.3.4 If a user device known to have held a refresh token for an app is stolen,
an authorization server should revoke access by refusing to refresh when a
refresh token for that user is presented.

### 2.4 Token Lifetimes

2.4.1  Authorization servers should issue access tokens with lifetimes as short
as is practical and reasonable, based on risk.  The lifetimes of access tokens
should be shorter than those for refresh tokens (e.g., 1 hour vs. 1 year).  The
lifetimes for access tokens issued to confidential clients may be longer than
those issued to public clients.

### 2.4 Cross-Site Request Forgery (CSRF)

2.4.1 Cross-site request forgery (CSRF) is a category of attacks that trick the
victim into submitting a malicious request. In a CSRF attack, a malicious
application (or web site) runs within the same browser as an active session to
which the end-user has authenticated, and this application tricks the end-user
into submitting unauthorized HTTP requests to the site with which the victim
has the active, authenticated session. This request allows the attacker to
exploit the victim’s authorizations to perform actions on the target site.  For
example, a CSRF attack against a client’s redirection URI might cause the
client to mistakenly obtain an access token using an attacker-supplied
authorization code. [RFC6749]( https://tools.ietf.org/html/rfc6749) requires
that clients implement CSRF protection for its redirection URI.  To fulfill
this requirement, the [SMART on FHIR Authorization Guide](
http://docs.smarthealthit.org/authorization/) requires that each app generate
an unpredictable (at least 128 bits of entropy) `state` parameter for each user
session, and that the app validate the `state` value for any request sent to
its redirect URL; include the `state` parameter with all requests sent to the
authorization server; and validate the `state` value included in access tokens
it receives.  In addition, the authorization server should validate `state`
parameters it receives from clients. 

### 2.5 Access Token Phishing by Counterfeit Resource Servers 

2.5.1 To prevent leakage of a genuine bearer token to a counterfeit resource
server, the [SMART on FHIR Authorization Guide](
http://docs.smarthealthit.org/authorization/) requires that authorization
requests include an `aud` parameter whose value is the URL of the FHIR resource
server from which the app wishes to retrieve FHIR data.  Authorization servers
must validate that the `aud` parameter is the URL of a known and trusted
resource server prior to returning an authorization code to the requester.

## 3.0 Best Practices for FHIR Resource Servers

## 4.0 Best Practices for End Users

### 4.1 Token Protection

4.1.1 Sometimes apps obtain tokens that enable them to access EHR and other
sensitive information.  While most tokens are effective for only a limited
period of time, other tokens remain on a device for a longer period of time.
To avoid misuse of the access privileges these tokens represent, it is
important for users to lock device screens, shut down browsers, or power down
devices when not in use.

### 4.2 Cross-Site Request Forgery (CSRF) Protection

4.2.1 For convenience, users often keep multiple web sites and apps open on
their browser device simultaneously.  Some sites and apps may not be as
friendly as others and may try to perform actions and access data in unwanted
ways.  They may accomplish these devious actions through an attack called
cross-site request forgery (CSRF).  To help protect health information against
CSRF attacks, after using an app to access sensitive health data, users should
log off the app (or shut down the browser) before visiting another site, and
clear the browser’s cookies at the end of each browser session.
