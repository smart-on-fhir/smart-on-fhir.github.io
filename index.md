---
layout: main
title: SMART on FHIR
---

## Standards and Specifications
* Foundational
    * [FHIR](http://hl7.org/fhir/): Fast Healthcare Interoperability Resources. Web standard for health interop
    * [CDS Hooks](https://cds-hooks.hl7.org/): Clinical Decision Support Hooks. Web standard for CDS in the EHR workflow
* Data access
    * [US Core Data Profiles](https://www.hl7.org/fhir/us/core/): FHIR data profiles for health data in the US ("core data for interoperability")
    * [FHIR Bulk Data API Implementation Guide](https://hl7.org/fhir/uv/bulkdata/index.html): FHIR export API for large-scale data access
* UI and Security Integration
    * [SMART App Launch](http://hl7.org/fhir/smart-app-launch/index.html): User-facing apps that connect to EHRs and health portals
    * [SMART Backend Services](https://hl7.org/fhir/uv/bulkdata/authorization/index.html): Server-to-server FHIR connections

## Tutorials
* [Getting started with Browser-based Apps](./tutorials/javascript/): Tutorial to create a simple app that launches via the SMART browser library
* [Cerner's Browser-based app tutorial](https://engineering.cerner.com/smart-on-fhir-tutorial/): In-depth tutorial to build a simple browser-based app
* [Getting started with CDS Hooks](https://github.com/cerner/cds-services-tutorial): Tutorial to create a simple CDS Hooks Service
* [Getting started for EHRs](./tutorials/server-quick-start/): Tutorial to SMART-enable a clinical data system

## Software Libraries
* [JS Browser](http://docs.smarthealthit.org/client-js/client.html): Client-side JavaScript library with support for SMART App Launch
* [Node.js](http://docs.smarthealthit.org/client-js/node.html): Server-side JavaScript library with support for SMART App Launch
* [Node.js from Vermonster](https://github.com/Vermonster/fhir-kit-client): An alternative Node.js implementation
* [Python](http://docs.smarthealthit.org/client-py/): Server-side Python library with support for SMART App Launch
* [R](https://github.com/FirelyTeam/RonFHIR)
* [Ruby](https://github.com/fhir-crucible/fhir_client)
* [Swift (iOS)](https://github.com/smart-on-fhir/Swift-SMART)
* [Java](https://mvnrepository.com/artifact/org.hspconsortium.client/hspc-java-client)
* [.NET](https://fire.ly/fhir-api/): FHIR client library from Firely

## Test Environments
* [SMART App Launcher (no registration required)](https://launch.smarthealthit.org): Developer tool for SMART apps
    * [Docker Container](https://github.com/smart-on-fhir/smart-dev-sandbox): For local installation or experiments
    * [R4 open endpoint](https://r4.smarthealthit.org/) (see also [R2](https://r2.smarthealthit.org/), [R3](https://r3.smarthealthit.org/))
* [SMART Bulk Data Server (no registration required)](https://bulk-data.smarthealthit.org/): Developer tool for Bulk Data clients
    * [Source Code](https://github.com/smart-on-fhir/bulk-data-server)
* [Logica Health Sandbox](https://sandbox.logicahealth.org): Manage your own sandbox server and users over time

## Vendor Sandboxes
* [Allscripts](https://developer.allscripts.com/)
* [Cerner - Provider and Patient Facing Apps](https://fhir.cerner.com/millennium/dstu2/)
* [Epic Provider Facing Apps](https://uscdi.epic.com/)
* [Epic Patient Facing Apps](https://open.epic.com/)
* [Intersystems](https://www.intersystems.com/fhir/)
* [Meditech](https://ehr.meditech.com/meditech-greenfield)

## Data
* [Synthea](https://synthetichealth.github.io/synthea/): Open source synthetic FHIR data generator
* [SMART Test Data](https://github.com/smart-on-fhir/sample-patients): 60 de-identified records with Python to generate FHIR from CSVs

## Sample Apps
* [SMART App Gallery](https://apps.smarthealthit.org): Listing site with commercial and open source SMART on FHIR apps)
* [SMART on FHIR DSTU2](https://github.com/smart-on-fhir/sample-apps): Javascript Example Apps (see also [R3](https://github.com/smart-on-fhir/sample-apps-stu3))
* [Bulk Data Client - Javascript](https://github.com/smart-on-fhir/sample-apps-stu3/tree/master/fhir-downloader)
* [SMART Growth Chart](https://github.com/smart-on-fhir/growth-chart-app): Full featured app that has been deployed in care settings. Note that the open source version of this app requires review before production deployment and is not supported for clinical use.
* [SMART BP Centiles](https://github.com/smart-on-fhir/bp-centiles-app): Full featured app that has been deployed in care settings. Note that the open source version of this app requires review before production deployment and is not supported for clinical use.
* [Cerner ASCVD Risk Calculator](https://github.com/cerner/ascvd-risk-calculator)

## Support
* [FHIR Discussion Board](https://chat.fhir.org) ([SMART Stream](https://chat.fhir.org/#narrow/stream/179170-smart))
* [SMART on FHIR community mailing list](https://groups.google.com/forum/#!forum/smart-on-fhir)
* [SMART Health IT](https://smarthealthit.org): The team behind SMART on FHIR

## In Progress / Bleeding Edge Projects
* [CDS for PAMA](https://github.com/argonautproject/cds-hooks-for-pama)
* [SMART Web Messaging](https://github.com/smart-on-fhir/smart-web-messaging)
* [FHIR Bulk Data Import](https://github.com/smart-on-fhir/bulk-import)