---
layout: main
title: SMART on FHIR -- Tutorials -- Testing
---

# Tutorials - Testing Your SMART App Against The Public Sandbox

## Overview

This tutorial will walk you through the steps for testing your SMART on FHIR
app against our public apps container.

## General steps

The steps required to test your app against [our public sandbox server](https://fhir.smarthealthit.org), use the following steps.

### Setup your local web server

FHIR Apps need a registered manifest on the server in order to be launchable (from the patient context). So to quickly test against our server and launch your local app, you need to make sure your app serves the following pages:

* [http://localhost:8000/fhir-app/](http://localhost:8000/fhir-app/)
* [http://localhost:8000/fhir-app/launch.html](http://localhost:8000/fhir-app/launch.html)

You can use any web server you like. For prototyping, we're partial to [`http-server`](https://github.com/nodeapps/http-server) which you can launch via
`http-server -p 8000 /path/to/fhir-app/..`.

If you are using [Rails](http://rubyonrails.org/), you can quickly test the code below by doing the following

    mkdir public/fhir-app

Copy the code below into public/fhir-app as index.html and layout.html

Launch rails on port 8000 

    rails s -p 8000

### Sign into sanbox, select a patient, and launch My Web App

* [sign into our sandbox](https://fhir.smarthealthit.org)
* select a patient
* launch the "My Web App" special application which will load your app.

## Sample Test App Source Code

To get you started, here is the scaffolding of a simple SMART-on-FHIR app that you can use
for testing this mechanism. Note that you can't use the "rawgithub" domain in production, 
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
        function getPatientName (pt) {
            if (pt.name) {
                var names = pt.name.map(function(name) {
                    return name.given.join(" ") + " " + name.family.join(" ");
                });
                return names.join(" / ")
            } else {
                return "anonymous";
            }
        }

        function getMedicationName (medCodings) {
            var coding = medCodings.find(function(c){
                return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
            });

            return coding && coding.display || "Unnamed Medication(TM)"
        }

        function displayPatient (pt) {
            document.getElementById('name').innerHTML = getPatientName(pt);
        }

        var med_list = document.getElementById('med_list');

        function displayMedication (medCodings) {
            med_list.innerHTML += "<li> " + getMedicationName(medCodings) + "</li>";
        }                

        FHIR.oauth2.ready(function(smart){
            smart.patient.read().then(function(pt) {
                displayPatient (pt);
            });
            smart.patient.api.fetchAllWithReferences({type: "MedicationOrder"},["MedicationOrder.medicationReference"]).then(function(results, refs) {
               results.forEach(function(prescription){
                    if (prescription.medicationCodeableConcept) {
                        displayMedication(prescription.medicationCodeableConcept.coding);
                    } else if (prescription.medicationReference) {
                        var med = refs(prescription, prescription.medicationReference);
                        displayMedication(med && med.code.coding || []);
                    }
               });
            });
        });
    </script>
  </body>
</html>
```
