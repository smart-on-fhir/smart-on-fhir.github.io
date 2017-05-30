---
layout: main
title: STU3 Sandbox Data
---

The following datasets are available in the SMART STU3 Sandbox (link) for App testing and development.


| Dataset                        |  Tag            | Number of Resources  |
| :------------------------------| :---------------| :--------------------|
| Core SMART Patients            | smart-5-2017    |14,548                |
| Synthea Synthetic Patients     | synthea-5-2017  |                      |
| Patient Reported Outcome Data  | pro-5-2017      |986                   |



* **Core SMART Patients** 
  * The 67 STU3 Core SMART Patients were developed using an improved version of the csv data files used to create the DSTU2 Core SMART Patients. The new [STU3 SMART Patient Data Generator](https://github.com/smart-on-fhir/sample-patients-stu3) created these sample patients from data files containing a mix of de-identified clinical data and synthetic data elements.
  * Improvements on the DSTU2 resources: Minor data cleanup, and addition of 7 practitioner resources.  
  
  * May 2017 Release:
    * Tag: smart-5-2017
    * Resources:
      
| Resource            | Count | 
|: -------------------|:------| 
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


* **Synthea Synthetic Patients**
  * The SMART Team generated 1390 Synthetic sample patients in FHIR STU3 format using the [MITRE Synthea tool](https://github.com/synthetichealth/synthea/wiki). 
  
 * May 2017 Release:
    * Tag: synthea-5-2017
    * [Dataset population Statistics] 
    * Resources:
   
 
* **Patient Reported Outcome(PRO) Patients**
  * The SMART Team generated 100 Sample patients using PRO data available online from the UK National Health Service. The data measures health gain in patients undergoing hip replacement, knee replacement, varicose vein and groin hernia surgery in England, based on responses to questionnaires before and after surgery.
  * The [Sample Patients that SMART generated](https://github.com/smart-on-fhir/sample-patients-prom) contain a mixture of real and synthetic data elements, based on the data available in the [PROMs csv data package](http://content.digital.nhs.uk/catalogue/PUB23908). For more information about the source of the data contained within the PRO patient resources, please see the full [SMART PRO Sample Patient documentation.](https://github.com/smart-on-fhir/smart-on-fhir.github.io/blob/master/profiles/PRO-full.md) 
  
  * May 2017 Release:
    * Tag: pro-5-2017
    * Resources:
  
      | Resource               | Count | 
      | ----------------------:|------:|   
      |Encounter               |300    |
      |Patient                 |100    |
      |Procedure               |100    |
      |Questionnaire           |6      |
      |QuestionnaireResponse   |450    |
      |ValueSet                |30     |
