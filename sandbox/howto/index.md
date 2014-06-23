---
layout: main
title: "SMART on FHIR Sandbox: How To Use"
---

# SMART on FHIR Sandbox General Usage

# How to Register a New App

## Via Authorization Server UI

### Step 1

Log into the OpenID Connect Server at [https://authorize.smartplatforms.org](https://authorize.smartplatforms.org)
and click on `Register a new client` in `Self-servixe client registration`.

<div style='text-align: center'>
  <img src="/assets/img/newapp1.png" />
</div>

### Step 2

In the `Main` tab enter a user-friendly name for your app in the `Client name` box.
Also, enter the main URI of your app which the user client should visit after
completing the app authorization process with the OpenID Connect Server. Finally,
enter the URL of the app's logo that will be displayed to the user during the
authorization process.

<div style='text-align: center'>
  <img src="/assets/img/newapp2.png" />
</div>

### Step 3

In the `Access` tab make sure that the app is granted the following scopes: `launch`, `openid`, `user/*.*`, `address`, `email`, `patient/*.read`, `smart/orchestrate_launch`. The `code` response type should be unchecked.

<div style='text-align: center'>
  <img src="/assets/img/newapp3.png" />
</div>

### Step 4

In the `Credentials` tab change the authentication method to `No authentication`.

<div style='text-align: center'>
  <img src="/assets/img/newapp4.png" />
</div>

### Step 5

In the `Other` tab unccheck the `Always require that the auth_time claim be sent in the id token`
and enter the URL to your `launch.html` page in the `Initiate Login` box.

<div style='text-align: center'>
  <img src="/assets/img/newapp5.png" />
</div>

### Step 6

Click the `Save` button. The OpenID Connect Server will assign a `Client ID` and `Registration Access Token`
to your self-service client. Make sure to copy them to a file on your local machine, because you will need
them to update your client configuration.

<div style='text-align: center'>
  <img src="/assets/img/newapp6.png" />
</div>

### Step 7

You can use the `Client ID` and `Registration Access Token` for your self-service client to
update or delete its record in the OpenID Connect Server.

<div style='text-align: center'>
  <img src="/assets/img/newapp7.png" />
</div>

## Via OpenID Connect Server internal admin REST API

To register your client via the OpenID Connect Server internal admin REST API,
execute the following REST call (substituting your client details as appropriate):

```
POST /api/clients HTTP/1.1
Authorization: Basic Y2xpZW50OnNlY3JldA==
Content-Type: application/json
Accept: application/json
Host: authorize.smartplatforms.org

{
  "clientId": "MYCOOLAPP",
  "clientName": "Cool Smart-on-FHIR App",
  "logoUri": "https://srv.me/img/cool.jpg",
  "initiateLoginUri":"https://srv.me/app/launch.html",
  "redirectUris": ["https://srv.me/app/cool"],
  "scope": [
    "launch",
    "user/*.*",
    "patient/*.read",
    "smart/orchestrate_launch",
    "openid",
    "address",
    "email"
  ],
  "clientDescription": null,
  "tokenEndpointAuthMethod": "NONE",
  "clientSecret": "unused-secret-for-public-app",
  "grantTypes": [
    "authorization_code",
    "implicit"
   ],
  "responeType": ["token", "code"],
  "accessTokenValiditySeconds": 3600
}
```

## Via OAuth 2.0 Dynamic Client Registration Protocol

Based on: [http://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-17](http://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-17)

REST call:
```
POST /register HTTP/1.1
Authorization: Basic Y2xpZW50OnNlY3JldA==
Content-Type: application/json
Accept: application/json
Host: authorize.smartplatforms.org

{
   "client_name": "Cool Smart-on-FHIR App",
   "redirect_uris": [
     "https://srv.me/app/cool"
   ],
   "initiate_login_uri": "https://srv.me/app/launch.html",
   "logo_uri": "https://srv.me/img/cool.jpg",
   "scope": "launch user/*.* patient/*.read smart/orchestrate_launch openid address email"
}
```