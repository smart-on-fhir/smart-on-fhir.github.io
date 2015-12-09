---
layout: main
title: SMART on FHIR -- Tutorials -- Authorization
---

# Tutorials - Simple Authorization App

## Overview

This tutorial will demonstrate the basic implementation steps to perform SMART on FHIR
OAuth2 authorization and retrieve patient data from
scratch without relying on a specialized SMART on FHIR client. Understanding the 
implementation steps of this mechanism is useful if you are planning on developing
your own SMART on FHIR client or would simply like to gain insight into the SMART on FHIR
authorization protocol. If you would rather start with writing SMART on FHIR apps
as quickly as possible, you can use our Java Script client which handles the
authorization process for you (see [`this tutorial`]({{site.baseurl}}clients/javascript/tutorial/)
to learn about the JS client)

## Registering A Client

To run this sample app against [our public sandbox server](https://fhir.smarthealthit.org), first you will need 
to select two endpoint URLs for your app which will handle the launch and redirect requests. For this tutorial
we decided to use `http://localhost:4000/simple-auth/launch.html` as our launch endpoint and 
`http://localhost:4000/simple-auth/index.html` as our redirect URL. You should configure a web server
to handle these URLs (or the ones that you pick) by serving the two sample pages below. For prototyping, we're partial to [`http-server`](https://github.com/nodeapps/http-server) which you can launch via
`http-server -p 4000 /path/to/simple-auth/..`.

Now that you have established the client endpoints for your app, it's time to register your very own
client with the SMART on FHIR authorization server (in this case it is at `https://authorize.smarthealthit.org/`).
There are a couple different approaches to register a new dynamic client with the server outlined
in the [`How to Register a New App`](http://docs.smarthealthit.org/sandbox/register/) tutorial. We chose
to use the "Client Quick Registration" form available there. (Use your favorite image URL for the logo URL)

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/regexample1.png" />
</div>

If everything is in order, the authorization server will respond with a Client ID and
a Registration Access Token like this:

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/regexample2.png" />
</div>

You should record these, since you can later use them to update your client via the [`authorization server UI`](https://authorize.smarthealthit.org/). At very minimum, you will need the Client ID, which
you should configure within your sample app in the next step.

## Sample App

Now that you have successfully registered your client and obtained a Client ID from the authorization
server, try this sample app, which implements all the basic steps necessary to obtain an authorization
token from the authorization service and then request patient data from the SMART on FHIR API server.
Don't forget to change the Client ID inside the `launch.html` script with the one for your client.

launch.html

```
<!DOCTYPE html>
<html>
    <head>
        <title>Simple Auth App - Launch</title>
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    </head>
    <body>
        Loading...
        <script>
        // Change this to the ID of the client that you registered with the SMART on FHIR authorization server.
        var clientId = "16cbfe7c-6c56-4876-944f-534f9306bf8b";
        
        // For demonstration purposes, if you registered a confidential client
        // you can enter its secret here. The demo app will pretend it's a confidential
        // app (in reality it cannot be confidential, since it cannot keep secrets in the
        // browser)
        var secret = null;    // set me, if confidential
        
        // These parameters will be received at launch time in the URL
        var serviceUri = getUrlParameter("iss");
        var launchContextId = getUrlParameter("launch");
        
        // The scopes that the app will request from the authorization server
        // encoded in a space-separated string:
        //      1. permission to read all of the patient's record
        //      2. permission to launch the app in the specific context
        var scope = [
                "patient/*.read",
                "launch"
            ].join(" ");
            
        // Generate a unique session key string (here we just generate a random number
        // for simplicity, but this is not 100% collision-proof)
        var state = Math.round(Math.random()*100000000).toString();
        
        // To keep things flexible, let's construct the launch URL by taking the base of the 
        // current URL and replace "launch.html" with "index.html".
        var launchUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
        var redirectUri = launchUri.replace("launch.html","index.html");
        
        // FHIR Service Conformance Statement URL
        var conformanceUri = serviceUri + "/metadata"
        
        // Let's request the conformance statement from the SMART on FHIR API server and
        // find out the endpoint URLs for the authorization server
        $.get(conformanceUri, function(r){

            var authUri,
                tokenUri;
            
            var smartExtension = r.rest[0].security.extension.filter(function (e) {
               return (e.url === "http://fhir-registry.smarthealthit.org/StructureDefinition/oauth-uris");
            });

            smartExtension[0].extension.forEach(function(arg, index, array){
              if (arg.url === "authorize") {
                authUri = arg.valueUri;
              } else if (arg.url === "token") {
                tokenUri = arg.valueUri;
              }
            });
            
            // retain a couple parameters in the session for later use
            sessionStorage[state] = JSON.stringify({
                clientId: clientId,
                secret: secret,
                serviceUri: serviceUri,
                redirectUri: redirectUri,
                tokenUri: tokenUri
            });

            // finally, redirect the browser to the authorizatin server and pass the needed
            // parameters for the authorization request in the URL
            window.location.href = authUri + "?" +
                "response_type=code&" +
                "client_id=" + encodeURIComponent(clientId) + "&" +
                "scope=" + encodeURIComponent(scope) + "&" +
                "redirect_uri=" + encodeURIComponent(redirectUri) + "&" +
                "aud=" + encodeURIComponent(serviceUri) + "&" +
                "launch=" + launchContextId + "&" +
                "state=" + state;
         }, "json");
        
        // Convenience function for parsing of URL parameters
        // based on http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
        function getUrlParameter(sParam)
        {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) 
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) 
                {
                    return decodeURIComponent(sParameterName[1]);
                }
            }
        }
        </script>
    </body>
</html>
```

index.html

```
<!DOCTYPE html>
<html>
  <head>
     <title>Simple Auth App</title>
     <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
  </head>
  <body>
    <script>
        // get the URL parameters received from the authorization server
        var state = getUrlParameter("state");  // session key
        var code = getUrlParameter("code");    // authorization code
        
        // load the app parameters stored in the session
        var params = JSON.parse(sessionStorage[state]);  // load app session
        var tokenUri = params.tokenUri;
        var clientId = params.clientId;
        var secret = params.secret;
        var serviceUri = params.serviceUri;
        var redirectUri = params.redirectUri;
        
        // Prep the token exchange call parameters
        var data = {
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        };
        var options;
        if (!secret) {
            data['client_id'] = clientId;
        }
        options = {
            url: tokenUri,
            type: 'POST',
            data: data
        };
        if (secret) {
            options['headers'] = {'Authorization': 'Basic ' + btoa(clientId + ':' + secret)};
        }
        
        // obtain authorization token from the authorization service using the authorization code
        $.ajax(options).done(function(res){
            // should get back the access token and the patient ID
            var accessToken = res.access_token;
            var patientId = res.patient;
                    
            // and now we can use these to construct standard FHIR
            // REST calls to obtain patient resources with the
            // SMART on FHIR-specific authorization header...
            // Let's, for example, grab the patient resource and
            // print the patient name on the screen
            var url = serviceUri + "/Patient/" + patientId;
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                headers: {
                    "Authorization": "Bearer " + accessToken
                },
            }).done(function(pt){
                var name = pt.name[0].given.join(" ") +" "+ pt.name[0].family.join(" ");
                document.body.innerHTML += "<h3>Patient: " + name + "</h3>";
            });
        });
        
        // Convenience function for parsing of URL parameters
        // based on http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
        function getUrlParameter(sParam)
        {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) 
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) 
                {
                    return decodeURIComponent(sParameterName[1]);
                }
            }
        }
    </script>
  </body>
</html>
```

## Launching the Sample App

To launch the sample app, first log into [`FHIR Starter`](http://fhir.smarthealthit.org) and 
select a sample patient. Next, enter your `Client ID` and `Launch URL` in the Custom App
box like this:

<div style='text-align: center'>
  <img src="{{site.baseurl}}assets/img/regexample3.png" />
</div>

Finally press the `Custom App` button to launch your app and watch it
request authorization and print the patient's name.

## Next steps

The sample app that we looked at provides a simple scaffolding for developing a SMART on FHIR
client. Of course, there are a number of nice features that we have omitted for the sake of
simplicity, which we leave as an exercise to the reader. Here are a couple such features:

 * caching of the authorization token and stripping the code and state parameters from
 the app location bar to enable handling of browser refresh events
 * exception handling for the REST calls and parameter validation
 * object models for representing the FHIR resources
 * convenience methods for the API calls
