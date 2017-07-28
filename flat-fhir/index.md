---
layout: main
title: "Flat FHIR"
---

# SMART Operations for Flat File Export (draft)

## Goals

Healthcare organizations have many reasons for bulk-data export, including,
populating a data warehouse for operational or clinical analytics, leveraging
population health and decision support tools from external vendor, migrating
from one EHR vendor to another, and submitting data to regulatory agencies like
CMS. Today, bulk export is often accomplished through proprietary pipelines.
Every data transfer operation becomes an engineering and mapping project.  This
specification sketches out a FHIR-based approach to bulk export.


## Design Sketch

Two operations are defined: one to kick off a (potentially long-running) job to
perform the export, and one to check the status of an ongoing export.


* `$smart-export`. Parameters include `since`, `dataType`, and `targetLocation`. Returns a job ID.

* `$smart-export-status`: Parameters include `jobId`. Returns a status (`active | canceled | paused | completed`) and a `progress` (percent completion, from 0 to 100).

### Example queries:

```
POST /$smart-export?since=2017-05-01T00:00:00.000Z&dataType=Patient,Observation,DocumentReference
→ SMART Export jobId = "abc"
```

```
GET /$smart-export-status?jobId=abc
→ status: active, progress: 30%.
```

