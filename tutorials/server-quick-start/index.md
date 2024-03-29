---
layout: main
title: SMART on FHIR -- Tutorials -- Server Quick-start
---

# Tutorials - Quick-start: Making your EHR SMART

This is a getting-started guide for Health IT systems looking to support pluggable
apps using SMART on FHIR. We'll take you through the process of allowing your users to launch
a single app: the open-source SMART Growth Charts app.   

To get Growth Charts running inside your EHR, you'll implement a basic SMART on FHIR server that can:

1. Expose clinical data using FHIR `Patient` and `Observation` resources
2. Protect your clinical data via the [SMART on FHIR App Authorization protocol](http://docs.smarthealthit.org/authorization/) (based on OAuth2).
3. Allow a user to launch Growth Charts by clicking a "launch" button

To get up and running as easily as possible, this quick-start guide helps you
through two scenarios: first, to run the app in debugging mode against an
unprotected server, and second, to get the app running against an
OAuth2-protected server.

## Debugging: Launch Growth Charts against your unprotected server

Once you've exposed the necessary clinical data (see payload examples below for
full details), make sure that you're exposing Cross-Origin Request Support (CORS) headers
with your HTTP responses. A quick set of headers to get starter would be:


```
Access-Control-Allow-Headers: origin, authorization, accept, content-type, x-requested-with
Access-Control-Allow-Methods: GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS
Access-Control-Allow-Origin: *
```

At this point, you can launch the Growth Charts app in debugging mode (no
authorization required).

You'll expose a "launch" button that users can click from within an existing EHR session.  When a user clicks this button, you'll load the following URL in a new browser window (or an iframe, or an embedded browser widget, depending on the architecture of your EHR), supplying two URL parameters:

[http://examples.smarthealthit.org/growth-chart-app/launch.html?fhirServiceUrl=https://r2.smarthealthit.org&patientId=smart-1482713](http://examples.smarthealthit.org/growth-chart-app/launch.html?fhirServiceUrl=https://r2.smarthealthit.org&patientId=smart-1482713)

 * `fhirServiceUrl={FHIR base URL of your unprotected server}`
 * `patientId={patient ID from the current user session}`

You can click the URL above for a live example (running against our open testing server).

## For real: Launch Growth Charts against your OAuth2-protected server

Once you've implemented the [SMART on FHIR Authorization
protocols](http://docs.smarthealthit.org/authorization), you can wire up your "launch" button to launch
the app in production mode (with authorization) by completing the following
sequence:

#### 1. Create a launch context

On your back-end, as soon as a user clicks the launch button you'll create a SMART "launch context" that includes (at least) the patient ID from the current EHR user session.  You'll assign a new "launch id" to
this context, and you'll pass that id to the Growth Charts app as a URL parameter. In
the real world, you'd create a launch context every time a user launches an app
 -- though for prototyping, you might just want to create a trivial implementation
that hard-codes a set of sample values.

#### 2. Open the app

When a user launches the Growth Charts app from inside your EHR, you'll load the following URL in a new browser window (or an iframe, or an embedded browser widget, depending on the architecture of your EHR), supplying two URL parameters:

[http://examples.smarthealthit.org/growth-chart-app/launch.html?](#)

 * `iss={FHIR base URL of your OAuth2-protected server}`
 * `launch={opaque launch ID generated by your server}`

(Note: the link above is for example purposes only. You'll need to fill in your
own server's issuer and a launch ID to proceed.)

## Data requirements

When the SMART Growth Charts, it will fetch:

### 1. Patient demographics
```sh
curl 'https://r2.smarthealthit.org/Patient/smart-1482713' -H 'Accept: application/json'
```

### 2. All Weight, Height, Head Circumference, and BMI Observations
Note LOINC Codes: `3141-9`, `8302-2`, `8287-5`, `39156-5`

```sh
curl 'https://r2.smarthealthit.org/Observation?subject%3APatient=smart-1482713&code=3141-9%2C8302-2%2C8287-5%2C39156-5&_count=50' -H 'Accept: application/json' 
```

## Sample patient demographics

```json
{
   "resourceType" : "Patient",
   "id" : "1482713",
   "meta" : {
      "lastUpdated" : "2015-09-30T14:31:27.885+00:00",
      "versionId" : "18619"
   },
   "text" : {
      "status" : "generated",
      "div" : "<div>\n        \n            <p>Susan Clark</p>\n      \n          </div>"
   },
   "name" : [
      {
         "given" : [
            "Susan",
            "A."
         ],
         "use" : "official",
         "family" : [
            "Clark"
         ]
      }
   ],
   "address" : [
      {
         "country" : "USA",
         "city" : "Tulsa",
         "state" : "OK",
         "use" : "home",
         "line" : [
            "52 Highland St"
         ],
         "postalCode" : "74116"
      }
   ],
   "gender" : "female",
   "telecom" : [
      {
         "system" : "phone",
         "use" : "home",
         "value" : "800-576-9327"
      },
      {
         "system" : "email",
         "value" : "susan.clark@example.com"
      }
   ],
   "active" : true,
   "birthDate" : "2000-12-27",
   "identifier" : [
      {
         "type" : {
            "text" : "Medical record number",
            "coding" : [
               {
                  "code" : "MR",
                  "system" : "http://hl7.org/fhir/v2/0203",
                  "display" : "Medical record number"
               }
            ]
         },
         "system" : "http://hospital.smarthealthit.org",
         "value" : "1482713",
         "use" : "usual"
      }
   ]
}
```


## Sample vitals (height, weight, BMI)


```json
{
   "total" : 3,
   "resourceType" : "Bundle",
   "type" : "searchset",
   "entry" : [
      {
         "search" : {
            "mode" : "match"
         },
         "resource" : {
            "resourceType" : "Observation",
            "effectiveDateTime" : "2003-11-28",
            "id" : "428-height",
            "text" : {
               "status" : "generated",
               "div" : "<div>2003-11-28: height = 115.316 cm</div>"
            },
            "meta" : {
               "versionId" : "19628",
               "lastUpdated" : "2015-09-30T14:31:29.576+00:00"
            },
            "code" : {
               "text" : "height",
               "coding" : [
                  {
                     "system" : "http://loinc.org",
                     "code" : "8302-2",
                     "display" : "height"
                  }
               ]
            },
            "encounter" : {
               "reference" : "Encounter/428"
            },
            "subject" : {
               "reference" : "Patient/1482713"
            },
            "status" : "final",
            "valueQuantity" : {
               "unit" : "cm",
               "system" : "http://unitsofmeasure.org",
               "value" : 115.316,
               "code" : "cm"
            }
         },
         "fullUrl" : "https://r2.smarthealthit.org/Observation/428-height"
      },
      {
         "search" : {
            "mode" : "match"
         },
         "resource" : {
            "code" : {
               "text" : "weight",
               "coding" : [
                  {
                     "code" : "3141-9",
                     "system" : "http://loinc.org",
                     "display" : "weight"
                  }
               ]
            },
            "meta" : {
               "lastUpdated" : "2015-09-30T14:31:29.645+00:00",
               "versionId" : "19676"
            },
            "valueQuantity" : {
               "system" : "http://unitsofmeasure.org",
               "unit" : "kg",
               "value" : 18.55193,
               "code" : "kg"
            },
            "status" : "final",
            "subject" : {
               "reference" : "Patient/1482713"
            },
            "encounter" : {
               "reference" : "Encounter/428"
            },
            "id" : "428-weight",
            "effectiveDateTime" : "2003-11-28",
            "resourceType" : "Observation",
            "text" : {
               "status" : "generated",
               "div" : "<div>2003-11-28: weight = 18.55193 kg</div>"
            }
         },
         "fullUrl" : "https://r2.smarthealthit.org/Observation/428-weight"
      },
      {
         "fullUrl" : "https://r2.smarthealthit.org/Observation/428-bmi",
         "search" : {
            "mode" : "match"
         },
         "resource" : {
            "subject" : {
               "reference" : "Patient/1482713"
            },
            "status" : "final",
            "valueQuantity" : {
               "value" : 13.9,
               "code" : "kg/m2",
               "unit" : "kg/m2",
               "system" : "http://unitsofmeasure.org"
            },
            "encounter" : {
               "reference" : "Encounter/428"
            },
            "meta" : {
               "lastUpdated" : "2015-09-30T14:31:29.663+00:00",
               "versionId" : "19688"
            },
            "code" : {
               "text" : "bmi",
               "coding" : [
                  {
                     "code" : "39156-5",
                     "system" : "http://loinc.org",
                     "display" : "bmi"
                  }
               ]
            },
            "text" : {
               "div" : "<div>2003-11-28: bmi = 13.9 kg/m2</div>",
               "status" : "generated"
            },
            "effectiveDateTime" : "2003-11-28",
            "id" : "428-bmi",
            "resourceType" : "Observation"
         }
      }
   ]
}
```

## Sample Encounter (note: app can work without encounter details)

```json
{
   "resourceType" : "Encounter",
   "class" : "ambulatory",
   "status" : "finished",
   "text" : {
      "div" : "<div>2003-11-28: ambulatory encounter</div>",
      "status" : "generated"
   },
   "id" : "428",
   "meta" : {
      "lastUpdated" : "2015-09-30T14:31:27.908+00:00",
      "versionId" : "18639"
   },
   "period" : {
      "end" : "2003-11-28",
      "start" : "2003-11-28"
   },
   "patient" : {
      "reference" : "Patient/1482713"
   }
}

```
