---
layout: main
title: "SMART on FHIR Sandbox: How To Use"
---

# SMART on FHIR Sandbox General Usage

# How to Register a New App

## Via Quick Registration Form

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
        
        if ($("input[name=input_client_type]:checked").val() === "confidential") {
            client_type = "client_secret_basic";
        }
        
        var call_params = {
            "client_name": $('#input_client_name').val(),
            "initiate_login_uri": [$('#input_launch_uri').val()],
            "redirect_uris": [$('#input_redirect_uri').val()],
            "logo_uri": $('#input_logo_uri').val(),
            "contacts": [$('#input_contact').val()],
            "scope": $('#input_scopes').text(),
            "grant_types": ["authorization_code"],
            "token_endpoint_auth_method": client_type
        };
        
        $.ajax({
            url: 'https://authorize.smartplatforms.org/register',
            type: 'POST',
            data: JSON.stringify(call_params),
            contentType:"application/json",
            dataType:"json"
        }).done(function(r){
            if (call_params.scope === r.scope && call_params.client_name === r.client_name && call_params.token_endpoint_auth_method === r.token_endpoint_auth_method) {
                $('#client_id').text(r.client_id);
                if (r.client_secret) {
                    $('#client_secret').text(r.client_secret);
                    $('#client_secret_div').show();
                }
                $('#registration_access_token').text(r.registration_access_token);
                $('#reg-form').fadeOut(400, function() {
                    $('#reg-result').fadeIn();
                });
            }
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
            public (<a href='http://docs.smartplatforms.org/authorization/public/'>details</a>)
          </label>
        </div>
        <div class="radio">
          <label>
            <input name="input_client_type" type='radio' value='confidential'>
            confidential (<a href='http://docs.smartplatforms.org/authorization/confidential/'>details</a>)
          </label>
        </div>
      </div>
    </div>
    <div class="form-group">
        <label class="col-lg-2 control-label">Scopes</label>
        <div class="col-lg-10">
            <span id="input_scopes">email address launch openid user/*.* patient/*.read profile smart/orchestrate_launch</span>
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
    <div id="client_secret_div" style="display:none"><strong>Client Secret:</strong> <span id="client_secret"></span></div>
    <div><strong>Registration Access Token:</strong><br/><textarea style="width:100%; height:100px" readonly="readonly" id="registration_access_token"></textarea></div>
  </div>
</div>

## Via Authorization Server UI

### Step 1

Log into the OpenID Connect Server at [https://authorize.smartplatforms.org](https://authorize.smartplatforms.org)
and click on `Register a new client` in `Self-service client registration`.

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

In the `Access` tab make sure that the app is granted the following scopes: `launch`, `openid`, `user/*.*`, `address`, `email`, `patient/*.read`. The `code` response type should be unchecked.

<div style='text-align: center'>
  <img src="/assets/img/newapp3.png" />
</div>

### Step 4

On the `Credentials` tab change the authentication method:

* If you're writing a [Confidential Client](http://docs.smartplatforms.org/authorization/confidential/), choose `Client Secret over HTTP Basic` 
* * If you're writing a [Public Client](http://docs.smartplatforms.org/authorization/public/), choose `No authentication`

<div style='text-align: center'>
  <img src="/assets/img/newapp4.png" />
</div>

### Step 5

In the `Other` tab uncheck the `Always require that the auth_time claim be sent in the id token`
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

## Via OAuth 2.0 Dynamic Client Registration Protocol

Based on: [http://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-17](http://tools.ietf.org/html/draft-ietf-oauth-dyn-reg-17)

To register your client dynamically in the OpenID Connect OAuth 2
server, you may use a REST call like this:

```
POST /register HTTP/1.1
Content-Type: application/json
Accept: application/json
Host: authorize.smartplatforms.org

{
   "client_name": "Cool Smart-on-FHIR App",
   "redirect_uris": [
     "https://srv.me/app/cool"
   ],
   "token_endpoint_auth_method": "none",
   "grant_types": ["authorization_code"],
   "initiate_login_uri": "https://srv.me/app/launch.html",
   "logo_uri": "https://srv.me/img/cool.jpg",
   "scope": "launch patient/*.read openid profile"
}
```

You should substitute BASE64CREDENTIALS with your user credentials for the authorization server.
If everything goes well, the server will respond with a JSON object that will contain the client
id that you should use. The above example is for a public client. If you'd like to register
a private client, you will need to change the "token_endpoint_auth_method" value to
"client_secret_basic".
