---
layout: main
title: SMART Sandbox
---

# SMART Sandbox

The SMART Health IT Sandbox is a virtual testing environment that mimics a live EHR production environment, but is populated with sample data. Use it to test and demonstrate apps for practitioners and patients that use the SMART on FHIR platform to access clinical data.

The Sandbox is provided by the SMART Health IT project as a free service to the healthcare app development community and is for testing purposes only. Do not store any information that contains personal health information or any other confidential information. This system should not be used in the provision of clinical care.

## Online Sandbox

You can access the sandbox at [https://sandbox.smarthealthit.org](https://sandbox.smarthealthit.org) to register and launch SMART apps. If you've registered on the previous version of our sandbox, you'll need to create a new account.

The sandbox's open **DSTU2 FHIR server** is accessible directly at [https://sb-fhir-dstu2.smarthealthit.org/api/smartdstu2/open](https://sb-fhir-dstu2.smarthealthit.org/api/smartdstu2/open) and the secure endpoint for launching a standalone app that's been registered is at [https://sb-fhir-dstu2.smarthealthit.org/api/smartdstu2/data](https://sb-fhir-dstu2.smarthealthit.org/api/smartdstu2/data). Note that the data in the online sandbox is reset on a nightly basis. [Click Here](http://docs.smarthealthit.org/data/dstu2-sandbox-data) for more information about the data available in the DSTU2 Sandbox.

The sandbox's open **STU3 FHIR server** is accessible directly at [https://sb-fhir-stu3.smarthealthit.org/smartstu3/open](https://sb-fhir-stu3.smarthealthit.org/smartstu3/open) and the secure endpoint for launching a standalone app that's been registered is at [https://sb-fhir-stu3.smarthealthit.org/smartstu3/data](https://sb-fhir-stu3.smarthealthit.org/smartstu3/data). Note that the data in the online sandbox is reset on a nightly basis. [Click Here](http://docs.smarthealthit.org/data/stu3-sandbox-data) for more information about the data available in the STU3 Sandbox.

## Self-Hosted Sandbox

If you're an advanced user, you can set up a local copy of the sandbox on your computer, a local server, or a cloud server by following the instructions at [https://github.com/smart-on-fhir/installer](https://github.com/smart-on-fhir/installer). 

## Open Source

The SMART Sandbox is an open source project based on the excellent [HAPI FHIR Server](http://hapifhir.io/), work done by the [Health Platform Services Consortium](https://healthservices.atlassian.net/wiki/display/HSPC/HSPC+Sandbox), and development by [iSalus Solutions](https://www.isalussolutions.com/) that was directed and funded by the SMART Health IT Project. The source code is available at [https://bitbucket.org/hspconsortium/](https://bitbucket.org/hspconsortium/).
