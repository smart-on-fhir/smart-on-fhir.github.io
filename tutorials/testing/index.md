---
layout: main
title: SMART on FHIR -- Tutorials -- Testing
---

# Tutorials - Testing Your SMART App Against The Public Sandbox

## Overview

This tutorial will walk you through the steps for testing your SMART on mFHIR
app against our public apps container.

## General steps

To test your app against [our public sandbox server](https://fhir.smarthealthit.org), first set up a local web server<sup>*</sup>
and server your FHIR app and its launch page at the following URLs:

* [http://localhost:8000/fhir-app/index.html](http://localhost:8000/fhir-app/index.html)
* [http://localhost:8000/fhir-app/launch.html](http://localhost:8000/fhir-app/launch.html)

Also, make sure that your `client_id` in `launch.html` is set to `my_web_app`. At this point
you can [sign into our sandbox](https://fhir.smarthealthit.org) and launch the "My Web App" special application which will
load your app.

<sup>*</sup> You can use any web server you like. For prototyping, we're partial to [`http-server`](https://github.com/nodeapps/http-server) which you can launch via
`http-server -p 8080 /path/to/fhir-app/..`.

### Sample Test App

To get you started, here is the scaffolding of a simple SMART-on-FHIR app that you can use
for testing this mechanism. Note that you can't use teh "rawgithub" domain in production, 
but it can be handy for testing.

launch.html

```
<!DOCTYPE html>
<html>
  <head>
    <script src="https://rawgithub.com/smart-on-fhir/client-js/master/dist/fhir-client.js"></script>
    <script>
      FHIR.oauth2.authorize({
        "client_id": "my_web_app",
        "scope":  "patient/*.read"
      });
    </script>
  </head>
  Loading...
</html>
```

index.html

```
<!DOCTYPE html>
<html>
  <head>
    <script src="https://rawgithub.com/smart-on-fhir/client-js/master/dist/fhir-client.js"></script>
  </head>
  <body>
    <h1>Medications for <span id="name"></span></h1>

    <ul id="med_list"></ul>

    <script type="text/javascript">
      (function () {
        "use strict";

        FHIR.oauth2.ready(function(smart){
          var patient = smart.context.patient;

          patient.read().then(function(pt) {

            var name =
                pt.name[0].given.join(" ") + " " +  
                pt.name[0].family.join(" ");

            document.getElementById('name').innerHTML = name;

            patient.MedicationPrescription
            .search()
            .then(function(prescriptions) {

              var med_list = document.getElementById('med_list');

              prescriptions.forEach(function(prescription){
                var meds = prescription.contained;
                meds.forEach(function(med){
                  med_list.innerHTML += "<li> " + med.name + "</li>";
                });
              });

            });
          });
        });

      }());
    </script>
  </body>
</html>
```
