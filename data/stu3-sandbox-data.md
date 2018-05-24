---
layout: main
title: STU3 Sandbox Data
---

### The following datasets are available in the [SMART STU3 Sandbox](https://sandbox.smarthealthit.org/smartstu3) for App testing and development.

[About the SMART Sandbox](http://docs.smarthealthit.org/sandbox/)

---


<div class="before-table"></div>

| Dataset|Tag|Number of Patients|Number of Resources| Browse Data|
| :-------------|:--------|:-------|:--------|:--------:|
| Core SMART Patients |smart-7-2017 |67  |14,551 |<button href="#" class="open-picker" data-tags="smart-7-2017" data-stu="r3">Browse</button>|
| Synthea Synthetic Patients | synthea-7-2017 |1,461 | 138,832   |<button href="#" class="open-picker" data-tags="synthea-7-2017" data-stu="r3">Browse</button>|
| Patient Reported Outcome Data | pro-7-2017 |100 |986 |<button href="#" class="open-picker" data-tags="pro-7-2017" data-stu="r3">Browse</button>|


---

* **Core SMART Patients** 
  * The 67 STU3 Core SMART Patients were developed using an improved version of the csv data files used to create the DSTU2 Core SMART Patients. The new STU3 SMART Patient Data Generator [(Code)](https://github.com/smart-on-fhir/sample-patients-stu3) created these sample patients from data files containing a mix of de-identified clinical data and synthetic data elements.
  * Improvements on the DSTU2 resources: Minor data cleanup, and addition of 7 practitioner resources.  
  
  * July 2017 Release:
    * Tag: smart-7-2017
    
    
* **Synthea Synthetic Patients** 
  * The SMART Team generated 1461 Synthetic sample patients in FHIR STU3 format using the [MITRE Synthea tool](https://synthetichealth.github.io/synthea/). For each synthetic patient, Synthea data contains a complete medical history, including medications, allergies, medical encounters, and social determinants of health. 
  
  * July 2017 Release:
    * Tag: synthea-7-2017
    
    
* **Patient Reported Outcome (PRO) Data**
  * The SMART Team generated 100 Sample patients using PRO data available online from the UK National Health Service. The data measures health gain in patients undergoing hip replacement, knee replacement, varicose vein and groin hernia surgery in England, based on responses to questionnaires before and after surgery.
  * The Sample Patients that SMART generated [(code)](https://github.com/smart-on-fhir/sample-patients-prom) contain a mixture of real and synthetic data elements, based on the data available in the [PROMs csv data package](http://content.digital.nhs.uk/catalogue/PUB23908).
  * All QuestionnaireResponse resources contain real pre and post-operative patient survey data. 
  * For more information about the source of the data contained within the PRO resources, please see the full [SMART PRO Sample Patient documentation.](http://docs.smarthealthit.org/data/pro-full) 
  
  * July 2017 Release:
    * Tag: pro-7-2017
 
 ---
 
View the SMART FHIR STU3 Data Dashboard: [http://docs.smarthealthit.org/fhir-server-dashboard/](http://docs.smarthealthit.org/fhir-server-dashboard/)
 
 ---

 

