---
layout: main
title: STU3 Sandbox Data
---

The following datasets are available in the SMART STU3 Sandbox (link) for App testing and development.


| Dataset|Tag|Number of Patients|Number of Resources|
| :-------------|:--------|:-------|:--------|
| Core SMART Patients |smart-5-2017 |67  |14,548 |
| Synthea Synthetic Patients | synthea-5-2017 |1,406 | 131,314   |
| Patient Reported Outcome Data | pro-5-2017 |100 |986 |



* **Core SMART Patients** 
  * The 67 STU3 Core SMART Patients were developed using an improved version of the csv data files used to create the DSTU2 Core SMART Patients. The new STU3 SMART Patient Data Generator [(Code)](https://github.com/smart-on-fhir/sample-patients-stu3) created these sample patients from data files containing a mix of de-identified clinical data and synthetic data elements.
  * Improvements on the DSTU2 resources: Minor data cleanup, and addition of 7 practitioner resources.  
  
  * May 2017 Release:
    * Tag: smart-5-2017
  
<div class="table-wrapper">
| Resource            | Count | 
| :-------------------|:------| 
|AllergyIntolerance   |63     |    
|Binary               |8      | 
|Condition            |561    | 
|DocumentReference    |4      |
|Encounter            |1,029  |
|FamilyMemberHistory  |16     |
|Immunization         |28     |
|MedicationDispense   |1,107  |
|MedicationRequest    |363    |
|Observation          |11,272 |
|Patient              |67     |
|Practitioner         |7      |
|Procedure            |23     |
|**Total** | **14,548** |
</div>

* **Synthea Synthetic Patients**
  * The SMART Team generated 1390 Synthetic sample patients in FHIR STU3 format using the [MITRE Synthea tool](https://synthetichealth.github.io/synthea/). For each synthetic patient, Synthea data contains a complete medical history, including medications, allergies, medical encounters, and social determinants of health. 
  
 * May 2017 Release:
    * Tag: synthea-5-2017
    * [Dataset population Statistics](http://docs.smarthealthit.org/profiles/synthea-stats)
 
    
| Resource            | Count | 
| :-------------------|:------| 
|AllergyIntolerance   | 557  |    
|CarePlan             | 3,122 |
|Condition            | 6,194| 
|Diagnostic Report    | 4,002 |
|Encounter            |17,548  |
| Goal                | 1,860 |
|Immunization         | 13,110 |
|Medication           | 3,847  | 
|MedicationRequest    | 4,685  |
|Observation          |65,320  |
|Organization         | 1,258| 
|Patient              | 1,406   |
|Procedure            | 8,405  |
|**Total**          | **131,314** |
 
* **Patient Reported Outcome (PRO) Data**
  * The SMART Team generated 100 Sample patients using PRO data available online from the UK National Health Service. The data measures health gain in patients undergoing hip replacement, knee replacement, varicose vein and groin hernia surgery in England, based on responses to questionnaires before and after surgery.
  * The [Sample Patients that SMART generated](https://github.com/smart-on-fhir/sample-patients-prom) contain a mixture of real and synthetic data elements, based on the data available in the [PROMs csv data package](http://content.digital.nhs.uk/catalogue/PUB23908). For more information about the source of the data contained within the PRO patient resources, please see the full [SMART PRO Sample Patient documentation.](http://docs.smarthealthit.org/profiles/PRO-full) 
  
  * May 2017 Release:
    * Tag: pro-5-2017
 

| Resource|Count | 
| :----|:---|   
|Encounter|300  |
|Patient|100  |
|Procedure |100  |
|Questionnaire |6   |
|QuestionnaireResponse   |450  |
|ValueSet |30  |
|**Total** | **986** | 
