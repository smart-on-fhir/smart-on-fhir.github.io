---
layout: main
title: "SMART on FHIR Authorization: Conformance statement"
---

# Publishing OAuth2 URLs

To support automated discovery of OAuth2 endpoints, a SMART on FHIR EHR publishes a set of OAuth2 endpoint URLs inside its conformance statement using a pair of extensions on the `Conformance.rest.security` element.

These extensions are:

<table class="table">
  <thead>
    <th>Extension URI</th>
    <th>Required?</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td><code>http://fhir-registry.smartplatforms.org/Profile/oauth-uris#authorize</code></td>
      <td><span class="label label-success">required</span></td>
      <td>
Identifies the OAuth2 "authorize" endpoint for the server.
      </td>
    </tr>
    <tr>
      <td><code>http://fhir-registry.smartplatforms.org/Profile/oauth-uris#token</code></td>
      <td><span class="label label-success">required</span></td>
      <td>
Identifies the OAuth2 "token" endpoint for the server.
      </td>
    </tr>
    <tr>
      <td><code>http://fhir-registry.smartplatforms.org/Profile/oauth-uris#register</code></td>
      <td><span class="label label-default">optional</span></td>
      <td>
Identifies the OAuth2 dynamic registration endpoint for the server, if supported.
      </td>
    </tr>
  </tbody>
</table>


### Example conformance statement (as JSON)

```
{
  "resourceType": "Conformance", 
...
  "rest": {
   ...
      "security": {
        "extension": [
          {
            "url": "http://fhir-registry.smartplatforms.org/Profile/oauth-uris#authorize",
            "valueUri": "{OAuth2 'authorize' URL for your OAuth2-protected server}"
          },
          {
            "url": "http://fhir-registry.smartplatforms.org/Profile/oauth-uris#token",
            "valueUri": "{OAuth2 'token' URL for your OAuth2-protected server}"
          }
        ],
      ...
```

