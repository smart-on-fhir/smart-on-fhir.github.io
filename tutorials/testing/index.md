---
layout: main
title: SMART on FHIR -- Tutorials -- Testing
---

# Testing you SMART-on-FHIR app

## Overview

This tutorial will walk you through the steps for testing your SMART-on-FHIR
app against our public apps container.

## General steps

To test your app against FHIR Starter, first set up a local web server (such as Apache)
and server your FHIR app and its launch page at the following URLs:

* [http://localhost:8000/fhir-app/index.html](http://localhost:8000/fhir-app/index.html)
* [http://localhost:8000/fhir-app/launch.html](http://localhost:8000/fhir-app/launch.html)

Also, make sure that your `client_id` in `launch.html` is set to `my_web_app`. At this point
you can open up FHIR Starter and launch the "My Web App" special application which will
load your app.

### Sample Test App

To get you started, here is the scaffolding of a simple SMART-on-FHIR app that you can use
for testing this mechanism.

launch.html:
```
<!DOCTYPE html>
<html>
  <head>
    <script src="fhir-client.js"></script>
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
    <script src="fhir-client.js"></script>
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
                document.getElementById('name').innerHTML = pt.name[0].given.join(" ") +" "+ pt.name[0].family.join(" ");
                
                patient.MedicationPrescription.search().then(function(prescriptions) {
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
