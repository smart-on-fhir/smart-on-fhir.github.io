---
title: "SMART App Launch: Conformance"
layout: default
---

# SMART on FHIR Conformance

The SMART's App Launch specification enables apps to launch and securely interact with EHRs.
The specification can be described as a set of capabilities; a given server implementation
may implement a subset of these. To promote interoperability, we describe a full package
known as the **Core SMART on FHIR Support** that includes support for

* both launch modes (EHR Launch + Standalone Launch)
* both client types (Public + Confidential with symmetric client secret authentication)
* single sign-on (OpenID Connect)
* basic launch context (patient, encounter, banner, style)
* permission for single-patient apps, user-level apps, and refresh tokens
 
## Publishing a set of Capabilities

A SMART on FHIR server can convey its capabilities to app developers by listing
a set of the capabilities described below. This can be published out of band,
or it can be conveyed as part of a server's FHIR `CapabilityStatement` using 
an extension on `CapabilityStatement.rest.security`. For example, a server
can publish its support for Core SMART on FHIR Support by including: [Core Capabilities](./core-set)

## Specific Capabilities (by category)

### Launch Modes

* `launch-ehr`: support for SMART's EHR Launch mode  
* `launch-standalone`: support for SMART's Standalone Launch mode  

### Client Types

* `client-public`: support for SMART's public client profile (no client authentication)  
* `client-confidential-symmetric`: support for SMART's confidential client profile (symmetric client secret authentication)

### Single Sign-on

* `sso-openid-connect`: support for SMART's OpenID Connect profile

### Launch Context

The following capabilities convey that a SMART on FHIR server is capable of provding basic context
to an app at launch time. These capabilities apply during an EHR Launch or a Standalone Launch:

* `context-passthrough-banner`: support for "need patient banner" launch context (conveyed via `need_patient_banner` token parameter)
* `context-passthrough-style`: support for "SMART style URL" launch context (conveyed via `smart_style_url` token parameter)

#### Launch Context for EHR Launch

When a SMART on FHIR server supports the launch of an app from _within_ an
existing user session ("EHR Launch"), the server has an opportunity to pass
existing, already-established context (such as the current patient ID) through
to the launching app. Using the following capabilities, a server declares its
ability to pass context through to an app at launch time:

* `context-ehr-patient`: support for patient-level launch context (requested by `launch/patient` scope, conveyed via `patient` token parameter)
* `context-ehr-encounter`: support for encounter-level launch context (requested by `launch/encounter` scope, conveyed via `encounter` token parameter)

#### Launch Context for Standalone Launch

When a SMART on FHIR server supports the launch of an app from _outside_ an
existing user session ("Standalone Launch"), the server may be able to
proactively resolve new context to help establish the details required for an
app launch. For example, an external app may request that the SMART on FHIR
server should work with the end-user to establish a patient context before
completing the launch.

* `context-standalone-patient`: support for patient-level launch context (requested by `launch/patient` scope, conveyed via `patient` token parameter)
* `context-standalone-encounter`: support for encounter-level launch context (requested by `launch/encounter` scope, conveyed via `encounter` token parameter)


### Permissions

* `permission-offline`: support for refresh tokens (requested by `offline_access` scope)
* `permission-patient`: support for patient-level scopes (e.g. `patient/Observation.read`)
* `permission-user`: support for user-level scopes (e.g. `user/Appointment.read`)

