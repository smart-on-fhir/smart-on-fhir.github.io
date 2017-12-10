---
layout: main
title: "FHIR Bulk Data"
---

# FHIR Bulk Data Proposal (aka "Flat FHIR")

## Goals
Healthcare organizations have many reasons for bulk-data export, including, populating a data warehouse for operational or clinical analytics, leveraging population health and decision support tools from external vendor, migrating from one EHR vendor to another, and submitting data to regulatory agencies like CMS. Today, bulk export is often accomplished through proprietary pipelines and every data transfer operation becomes an engineering and mapping project. This specification will sketch out a FHIR-based approach to bulk export.

## Resources
- Join us at the FHIR Jaunary 2018 Connectation bulk data track to work on this specification:
[http://wiki.hl7.org/index.php?title=FHIR_Connectathon_17](http://wiki.hl7.org/index.php?title=FHIR_Connectathon_17)

- Overview blog post describing the project (slightly out of date technically): 
[http://www.healthintersections.com.au/?p=2689](http://www.healthintersections.com.au/?p=2689)

- Description of proposed APIs to be tested at FHIR Jaunary 2018 Connectation bulk data track: [http://wiki.hl7.org/index.php?title=201801_Bulk_Data](http://wiki.hl7.org/index.php?title=201801_Bulk_Data)

- Authentication approach with SMART backend services specification: 
[http://docs.smarthealthit.org/authorization/backend-services/](http://docs.smarthealthit.org/authorization/backend-services/
)

- Initial output format supported: 
[http://ndjson.org/](http://ndjson.org/)
