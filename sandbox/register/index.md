---
layout: main
title: "SMART on FHIR Sandbox: How To Use"
---

# Sandbox - Registering a New App

## Overview

In order to run your app against the SMART public sandbox, you will first need to register
your app with our authorization service (i.e. create a new client). There are three
ways to do this that we offer.

 * The easiest way to register your app is by using our *Quick Registration Form* below. The form
 simplifies the registration process by picking up reasonable defaults for your new client on your
 behalf that should meet most app's needs. You can always tweak the client's settings later using
 the authorization server's interface.
 * The *Authorization Server UI* provides a more advanced interface for client registration and management.
 If you know what you are doing and would like to exercise more control over your client, this may be a
 better option for you than the *Quick Registration Form*.
 * If you would like to use an API to be able to register your apps and clients from your own code or application,
 you can use the *OAuth 2.0 Dynamic Client Registration Protocol* described in the last section
 of this document

## Quick Registration Form

<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript">
    function validateInput (id) {
        var element = $('#' + id);
        var parent = element.parent().parent();
        if (element.val().length === 0) {
            parent.addClass("has-error");
            return false;
        } else {
            parent.removeClass("has-error");
            return true;
        }
    }

    function validateForm () {
        var isValid = true;
        isValid = validateInput("input_client_name") && isValid;
        isValid = validateInput("input_launch_uri") && isValid;
        isValid = validateInput("input_redirect_uri") && isValid;
        isValid = validateInput("input_logo_uri") && isValid;
        isValid = validateInput("input_contact") && isValid;
        return isValid;
    }
    
    function registerClient () {
        if (! validateForm ()) return;
    
        var client_type = "none";
        var registration_endpoint;
        
        if ($("input[name=input_client_type]:checked").val() === "confidential") {
            client_type = "client_secret_basic";
        }
        
        var call_params = {
            client_name: $('#input_client_name').val(),
            initiate_login_uri: [$('#input_launch_uri').val()],
            redirect_uris: [$('#input_redirect_uri').val()],
            logo_uri: $('#input_logo_uri').val(),
            contacts: [$('#input_contact').val()],
            scope: $('#input_scopes').text().replace(/\s+/g, " "),
            grant_types: ["authorization_code"],
            token_endpoint_auth_method: client_type
        };
        
        if ($("input[name=input_refresh_token]:checked").val() === "enabled") {
            call_params.scope += " offline_access";
            call_params.grant_types.push("refresh_token");
        }
        
        if ($("input[name=input_smart_version]:checked").val() === "dstu1") {
            registration_endpoint = 'https://authorize.smarthealthit.org/register';
        } else {
            registration_endpoint = 'https://authorize-dstu2.smarthealthit.org/register';
        }

        $.ajax({
            url: registration_endpoint,
            type: 'POST',
            data: JSON.stringify(call_params),
            contentType:"application/json",
            dataType:"json"
        }).done(function(r){
            var canonical = function(scopes){
              JSON.stringify(scopes.split(/\s+/).sort())
            };
            
            $('#client_id').text(r.client_id);
            if (r.client_secret) {
                $('#client_secret').text(r.client_secret);
                $('#client_secret_div').show();
            }
            $('#registration_access_token').text(r.registration_access_token);
            $('#reg-form').fadeOut(400, function() {
                $('#reg-result').fadeIn();
            });
        });
    }
</script>

<div id="reg-form" class="well bs-component">
  <form class="form-horizontal">
   <fieldset>
    <legend>Client Quick Registration</legend>
    <div class="form-group">
        <label class="col-lg-2 control-label" for="input_client_name">Client name</label>
        <div class="col-lg-10">
            <input id="input_client_name" class="form-control" size="50" type="text" placeholder='App Name'>
        </div>
    </div>
    <div class="form-group">
        <label class="col-lg-2 control-label" for="input_launch_uri">Launch URI</label>
        <div class="col-lg-10">
            <input id="input_launch_uri" class="form-control" size="50" type="text" placeholder='http://localhost:8000/launch.html'>
        </div>
    </div>
    <div class="form-group">
        <label class="col-lg-2 control-label" for="input_redirect_uri">Redirect URI</label>
        <div class="col-lg-10">
            <input id="input_redirect_uri" class="form-control" size="50" type="text" placeholder='http://localhost:8000/'>
        </div>
    </div>
    <div class="form-group">
        <label class="col-lg-2 control-label" for="input_logo_uri">Logo URI</label>
        <div class="col-lg-10">
            <input id="input_logo_uri" class="form-control" size="50" type="text" placeholder='http://localhost:8000/logo.png'>
        </div>
    </div>
    <div class="form-group">
        <label class="col-lg-2 control-label" for="input_contact">Owner</label>
        <div class="col-lg-10">
            <input id="input_contact" class="form-control" size="50" type="text" placeholder='your@email.com'>
        </div>
    </div>
    <div class="form-group">
      <label class="col-lg-2 control-label">Client type</label>
      <div class="col-lg-10">
        <div class="radio">
          <label>
            <input name="input_client_type" value='public' checked='checked' type="radio">
            public (apps that don't use server-side logic <a href='http://docs.smarthealthit.org/authorization/public/'>[details]</a>)
          </label>
        </div>
        <div class="radio">
          <label>
            <input name="input_client_type" type='radio' value='confidential'>
            confidential (apps that have server-side logic <a href='http://docs.smarthealthit.org/authorization/confidential/'>[details]</a>)
          </label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label class="col-lg-2 control-label">Refresh token</label>
      <div class="col-lg-10">
        <div class="radio">
          <label>
            <input name="input_refresh_token" value='enabled' type="radio">
            enabled (requests "refresh_token" grant type and "offline_access" scope)
          </label>
        </div>
        <div class="radio">
          <label>
            <input name="input_refresh_token" type='radio' checked='checked'  value='disabled'>
            disabled (recommended for most apps)
          </label>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label class="col-lg-2 control-label">Target environment</label>
      <div class="col-lg-10">
        <div class="radio">
          <label>
            <input name="input_smart_version" value='dstu1' type="radio">
            DSTU1 (fhir.smarthealthit.org)
          </label>
        </div>
        <div class="radio">
          <label>
            <input name="input_smart_version"  checked='checked' type='radio' value='dstu2'>
            DSTU2 (fhir-dstu2.smarthealthit.org)
          </label>
        </div>
      </div>
    </div>
    <div class="form-group">
        <label class="col-lg-2 control-label">Scopes</label>
        <div class="col-lg-10">
            <span id="input_scopes"><pre>launch
launch/patient
launch/encounter
patient/*.read
user/*.*
user/*.read
openid
profile</pre></span>
        </div>
    </div>
    <div class="form-group">
      <div class="col-lg-10 col-lg-offset-2">
        <button class="btn btn-default btn-primary" onclick="registerClient(); return false">Register Client</button>
      </div>
    </div>
   </fieldset>
  </form>
</div>
<div id="reg-result" style="display:none" class="panel panel-success">
  <div class="panel-heading">
    <h3 class="panel-title">Client registration successful. Please write down the following client access details.</h3>
  </div>
  <div class="panel-body">
    <div><strong>Client ID:</strong> <span id="client_id"></span></div>
    <div id="client_secret_div" style="display:none"><strong>Client Secret:</strong><br/><textarea style="width:100%; height:40px" readonly="readonly" id="client_secret"></textarea></div>
    <div><strong>Registration Access Token:</strong><br/><textarea style="width:100%; height:100px" readonly="readonly" id="registration_access_token"></textarea></div>
  </div>
</div>

## Authorization Server UI

This is a more advanced alternative to using the *Quick Registration Form*.

### Step 1

Log into the OpenID Connect Server at [https://authorize-dstu2.smarthealthit.org](https://authorize-dstu2.smarthealthit.org)
and click on `Register a new client` in `Self-service client registration`.

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/newapp1.png" />
</div>

### Step 2

In the `Main` tab enter a user-friendly name for your app in the `Client name` box.
Also, enter the main URI of your app which the user client should visit after
completing the app authorization process with the OpenID Connect Server. Finally,
enter the URL of the app's logo that will be displayed to the user during the
authorization process.

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/newapp2.png" />
</div>

### Step 3

In the `Access` tab make sure that the app is granted the following scopes: `launch`, `launch/patient`, `launch/encounter`,
`patient/*.read`, `user/*.*`, `openid`, `profile`. The `code` response type should be unchecked.

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/newapp3.png" />
</div>

### Step 4

On the `Credentials` tab change the authentication method:

* If you're writing a [Confidential Client](http://docs.smarthealthit.org/authorization/confidential/), choose `Client Secret over HTTP Basic` 
* If you're writing a [Public Client](http://docs.smarthealthit.org/authorization/public/), choose `No authentication`

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/newapp4.png" />
</div>

### Step 5

In the `Other` tab uncheck the `Always require that the auth_time claim be sent in the id token`
and enter the URL to your `launch.html` page in the `Initiate Login` box.

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/newapp5.png" />
</div>

### Step 6

Click the `Save` button. The OpenID Connect Server will assign a `Client ID` and `Registration Access Token`
to your self-service client. Make sure to copy them to a file on your local machine, because you will need
them to update your client configuration.

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/newapp6.png" />
</div>

### Step 7

You can use the `Client ID` and `Registration Access Token` for your self-service client to
update or delete its record in the OpenID Connect Server.

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/newapp7.png" />
</div>

## OAuth 2.0 Dynamic Client Registration Protocol

Based on: [http://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-17](http://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-17)

To register your client dynamically in the OpenID Connect OAuth 2
server, you may use a REST call like this:

```
POST /register HTTP/1.1
Content-Type: application/json
Accept: application/json
Host: authorize-dstu2.smarthealthit.org

{
   "client_name": "Cool SMART App",
   "redirect_uris": [
     "https://srv.me/app/cool"
   ],
   "token_endpoint_auth_method": "none",
   "grant_types": ["authorization_code"],
   "initiate_login_uri": "https://srv.me/app/launch.html",
   "logo_uri": "https://srv.me/img/cool.png",
   "scope": "launch launch/patient launch/encounter patient/*.read user/*.* openid profile"
}
```

If everything goes well, the server will respond with a JSON object that will contain the client
id that you should use. The above example is for a public client. If you'd like to register
a private client, you will need to change the `token_endpoint_auth_method` value to
"client_secret_basic".
