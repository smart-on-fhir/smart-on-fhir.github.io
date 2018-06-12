---
layout: main
title: "SMART on FHIR Authorization: Conformance statement"
---

# Publishing OAuth2 URLs

If a server requires SMART on FHIR authorization for access, its conformance
statement must support automated dicovery of OAuth2 endpoints by including a
"complex" extension (that is, an extension with multiple components inside) on
the `Conformance.rest.security` element. Any time a client sees this extension,
it must be prepared to authorize using SMART's OAuth2-based protocol.

[The top-level extension uses the URL
`http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris`, with
the following internal components:

<table class="table">
  <thead>
    <th>Component</th>
    <th>Required?</th>
    <th>Description</th>
  </thead>
  <tbody>
    <tr>
      <td><code>authorize</code></td>
      <td><span class="label label-success">required</span></td>
      <td><code>valueUri</code> indicating the OAuth2 "authorize" endpoint for this FHIR server.
      </td>
    </tr>
    <tr>
      <td><code>token</code></td>
      <td><span class="label label-success">required</span></td>
      <td><code>valueUri</code> indicating the OAuth2 "token" endpoint for this FHIR server.</td>
    </tr>
    <tr>
      <td><code>register</code></td>
      <td><span class="label label-default">optional</span></td>
      <td><code>valueUri</code> indicating the OAuth2 dynamic registration endpoint for this FHIR server, if supported.
      </td>
    </tr>
    <tr>
      <td><code>manage</code></td>
      <td><span class="label label-default">optional</span></td>
      <td><code>valueUri</code> indicating the user-facing authorization management workflow entry point for this FHIR server. Overview in <a href="https://drive.google.com/file/d/0BylO-n0_de7gOWxiYkhra2dQRXM/view">this presentation</a>.</td>
    </tr>
  </tbody>
</table>


### Example conformance statement (as JSON)

```
{
  "resourceType": "Conformance", 
...
  "rest": [{
   ...
      "security": {
        "service": [
          {
            "coding": [
              {
                "system": "http://hl7.org/fhir/restful-security-service",
                "code": "SMART-on-FHIR"
              }
            ],
            "text": "OAuth2 using SMART-on-FHIR profile (see http://docs.smarthealthit.org)"
          }
        ],
        "extension": [{
          "url": "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris",
          "extension": [{
            "url": "token",
            "valueUri": "https://my-server.org/token"
          },{
            "url": "authorize",
            "valueUri": "https://my-server.org/authorize"
          },{
            "url": "manage",
            "valueUri": "https://my-server.org/authorizations/manage"
          }]
        }],
      ...
```

