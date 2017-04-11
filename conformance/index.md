# SMART on FHIR Conformance

The SMART's App Launch specificatino enables apps to launch and securely interact with EHRs.
The specification can be described as a set of capabilities; a given server implementation
may implement a subset of these. To promote interoperability, we describe a full package
known as the **Core SMART on FHIR Support** that includes support for
 * both launch modes (EHR Launch + Standalone Launch)
 * both client types (Public + Confidential with symmetric client secret authentication)
 * single sign-on (OpenID Connect)
 * basic launch context (patient, encoutner, banner, style)
 * permission for single-patient and user-level apps
 
## Publishing a set of Capabilities

A SMART on FHIR server can convey its capabilities to app develoeprs by listing
a set of the capabilities described below. This can be published out of band,
or it can be conveyed as part of a server's FHIR `CapabilityStatement` using 
an extension on `CapabilityStatement.rest.security`. For example, a server
can pulbish its support for Core SMART on FHIR Support by including: [Core Capabilities](./core-set.md)

## Specific Capabilities (by category)

### Launch Modes

`launch-ehr`: support for SMART's EHR Launch mode  
`launch-standalone`: support for SMART's Standalone Launch mode  

### Client Types

`client-public`: support for SMART's public client profile (no client authentication)  
`client-confidential-symmetric`: support for SMART's confidential client profile (symmetric client secret authentication)

### Single Sign-on

`sso-openid-connect`: support for SMART's OpenID Connect profile

### Launch Context

`context-patient`: support for patient-level launch context (requested by `launch/patient` scope, conveyed via `patient` token parameter)  
`context-encounter`: support for encounter-level launch context (requested by `launch/encounter` scope, conveyed via `encounter` token parameter)  
`context-banner`: support for "need patient banner" launch context (conveyed via `need_patient_banner` token parameter)  
`context-style`: support for "SMART style URL" launch context (conveyed via `smart_style_url` token parameter)  

### Permissions

`permission-offline`: support for refresh tokens (requested by `offline_access` scope)  
`permission-patient`: support for patient-level scopes (e.g. `patient/Observation.read`)  
`permission-user`: support for user-level scopes (e.g. `user/Appointment.read`)

