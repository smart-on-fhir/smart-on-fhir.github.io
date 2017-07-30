---
layout: main
title: SMART on FHIR
---

# SMART: Tech Stack for Health Apps

SMART on FHIR is a set of **open specifications** to integrate apps with
Electronic Health Records, portals, Health Information Exchanges, and other
Health IT systems. You get...

<h3 id="clean"> Clean, structured data:  <b>FHIR</b></h3>

Easy-to-use, resource-oriented REST API for structured clinical data. Grab a
resource with:

```
$ curl https://sb-fhir-dstu2.smarthealthit.org/api/smartdstu2/open/Patient/SMART-1551992 \
       -H 'Accept: application/json'
{
  "resourceType": "Patient",
  "active": true,
  "name": [{
      "use": "official",
      "family": ["Coleman"],
      "given": ["Lisa","P."]
  }],
  "gender": "female",
  "birthDate": "1948-04-14",
  ...
}
```

<h3 id="oauth">Scopes and permissions:  <b>OAuth2</b></h3>

When an EHR user launches your app, you get a "launch request" notification.
Just ask for the permissions you need using OAuth scopes like `patient/*.read`
and once you're authorized you'll have an access token with the permissions you
need -- including access to clinical data and context like:

 * which patient is in-context in the EHR
 * which encounter is in-context in the EHR
 * the physical location of the EHR user

<h3 id="openid">Simple sign-in:  <b>OpenID Connect</b></h3>

If your app needs to authenticate the EHR end-user, OpenID Connect is there to
help. Just ask for an additional scope (`openid`) when you request
authorization, and the OAuth2 server will provide an 
[`id_token`](http://openid.net/specs/openid-connect-core-1_0.html#IDToken) JWT containing 
claims about the user, including a unique identifier. Additionally, ask for the 
`profile` scope to receive a url to the FHIR resource that represents the current user 
(e.g. Patient, Practitioner, Person).

<h3 id="html">Lightweight UI integration:  <b>HTML5</b></h3>

Need to hook your app into an existing EHR user interface? SMART on FHIR allows
web apps to run inside browser widgets or inline frames, so users can interact
without leaving the EHR environment. Of course, native and mobile apps are
supported too -- so you can choose the level of integration that makes sense
for you.


{% raw %}
<!--
<example>
**An example here**
<pre>
pre
</pre>
</example>
-->
{% endraw %}
