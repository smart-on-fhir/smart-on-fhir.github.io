---
layout: main
title: FAQ
---

# Frequently Asked Questions

### SMART Client Apps

#### How do I get information about the current user?
When writing a SMART app, you can get information about the logged in user by requesting the oauth scopes ```openid``` and ```profile``` in addition to any other scopes your app needs. This will give your app an ```id_token``` property in the access token response (see bottom of [Scope Documentation]({{site.baseurl}}/authorization/scopes-and-launch-context) for details on how to process it). If you're using our [Javascript client library]({{site.baseurl}}/clients/javascript/), you can just do:
```
smart.user.read().then(function(user){
  console.log("User is a " + user.resourceType + " with id " + user.id);
})
```

The ```user``` object will be _either_ a [Patient](https://www.hl7.org/fhir/patient.html), a [Practitioner](https://www.hl7.org/fhir/practitioner.html), or a [RelatedPerson](https://www.hl7.org/fhir/relatedperson.html).  Note that in our sandbox right now we always pretend that the user is ```Practitioner/123``` - this obeys the formal specification, so you can test your app and ensure you're handling tokens correctly.
