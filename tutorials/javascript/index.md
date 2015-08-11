---
layout: main
title: SMART on FHIR -- Tutorials -- JavaScript
---

# Tutorial - Building a JavaScript App

## Getting started

The SMART on FHIR JavaScript client library helps you build browser-based SMART
apps that interact with a FHIR REST API server. It can help your app get
authorization tokens, provide information about the user and patient record in
context, and issue API calls to fetch clinical data.

To get started with the SMART on FHIR JavaScript client library, you'll need to:

### 1. Include a `script` tag

Include a `script` tag referencing the library. The latest code is always
available *for download* (not live hosting) in GitHub at
[https://raw.githubusercontent.com/smart-on-fhir/client-js/master/dist/fhir-client.js](https://raw.githubusercontent.com/smart-on-fhir/client-js/master/dist/fhir-client.js).

You'll want to download and host this file alongside your app. Unless you're
just prototyping -- in which case you can use this [rawgithub
link](https://rawgithub.com/smart-on-fhir/client-js/master/dist/fhir-client.js)
in your script tag's `src`. (Be sure never to use "rawgithub" in a deployment scenrio, though!)

Including this script will create a global `FHIR` object for you to work with.

### 2. Create or obtain an instance of `FHIR.client`

In a typical workflow, you won't instantiate this object yourself -- it will
be created by `FHIR.oauth2.launch()`. But when you're prototyping, you can just
create your own. By convention, we call this instance `smart`. So you can
create a client via:

```
var smart = FHIR.client({
  serviceUrl: 'https://fhir-open-api.smarthealthit.org',
  patientId: '1137192'
});
```

This object will be your touchpoint for making FHIR API calls. Your client
will have some context built in, including:

* `smart.context.patient`
* `smart.context.practitioner`

### 3. Use your client instance to execute FHIR API calls

You can make calls like:

* `read`: fetch a single resource, given its id
* `search`: search for resources that match a set of criteria

In general, you can make API calls that are scoped to the current patient by
using `smart.context.patient`, as follows:

```
// Search for the current patient's conditions
smart.context.patient.Condition.search();

// Search for the current patient's prescriptions
smart.context.patient.MedicationPrescription.search();
```

If you're writing a population-level app, you can query across patient records
by using `smart.api`, as follows:

```
// Search for the all conditions added today
var todaysDiagnoses = smart.api.Condition.where.dateAsserted("2014-05-01").search();

// Search for all statins prescribed today
var statinRxs = smart.api.MedicationPrescription.where
  .datewritten("2014-05-01")
  .medication(smart.api.Medication.where
    .name("statin")
  ).search();
```

These functions return `$.Deferred` objects, which you can work with simply by
calling their `done` method:

```
statinRxs.done(function(prescriptions, cursor){
  console.log(prescriptions[0]);
});
```

In the `done` callback, you'll get an array of search results, and potentially
a paging cursor that you can use to fetch the next page of results. To use the
cursor, just call `cursor.next()`, which gives you a new `Deferred` result set.

Here's a complete example of the steps above:

See the source, or click "preview" to see the app in action!

<iframe
  style="border: 1px solid black"
  src="http://embed.plnkr.co/goszYR/get-data.js"
  width="100%" height="500px"></iframe>

<iframe 
    style="border: 1px solid black"
    width="100%" height="500px"
    src="//jsfiddle.net/pv31bL0z/embedded/"></iframe>

For more details, see our [JS client docs](../../clients/javascript)
