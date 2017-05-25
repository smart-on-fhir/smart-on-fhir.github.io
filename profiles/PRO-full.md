---
layout: main
title: PRO Full Data Documentation
---

# Provisional Quarterly Patient Reported Outcome Measures (PROMs) in England 
**April 2015 to March 2016**    
**Data Publication date: November 10, 2016**

## Accessing the Data and Resources

1. [Download CSV Data Pack](http://content.digital.nhs.uk/catalogue/PUB22172) under “Resources”
  * The CSV data pack contains several files that enable detailed local analysis, as well as explanatory footnotes. These are:
    * Key Facts, which shows the aggregate number of patients who have improved, unchanged or worsened based on the pre- and post- operative questionnaires for each procedure and measure;
    * Participation Linkage, which shows numbers of participants, linked episodes and questionnaire issue and response rates for each procedure and measure;
    * Provider Commissioner, which shows the number of modelled records, the average pre- and post-operative questionnaires scores and average health gain, the adjusted post-operative score and health gain, as well as the aggregate number of patients who have improved, unchanged or worsened for each procedure and measure;
    * **Record-level data for each procedure, which includes one row for each patient questionnaire record successfully linked to a record of inpatient hospital activity in the Hospital Episode Statistics data warehouse.**

2.	On the [PROMs Homepage}(http://content.digital.nhs.uk/proms), download “PROMs Data Dictionary” on right column under “Guidance” 



## Methodology Overview

* PROMs measures health gain in patients undergoing hip replacement, knee replacement, varicose vein and groin hernia surgery in England, based on responses to questionnaires before and after surgery. 

* Pre-operative questionnaires are completed a maximum of 18 weeks before the procedure.
* Post-operative questionnaires are sent at least 3 months post-surgery for groin hernia and varicose vein surgeries, and 6 months for hip and knee replacements. 


### Surveys:

**1. Q1 General Health**
  * Information about the patient’s general health before surgery. Includes living arrangements, comorbidities, and how long they’ve experienced symptoms leading up to the procedure. 
  * Completed for all 4 PROMs procedures
  * Changed “Symptom Period” question to not be specific to surgery type, so the same questionnaire could be used for each individual questionnaire response. 

**2. Q2 General Health** 
  * Information about the patient’s general health after surgery and a recovery period. Questions are tailored toward the success of the procedure, and whether the patient experienced any complications. 
  * Completed for all 4 PROMs procedures

**3. The EuroQol five dimensions questionnaire EQ-5D-3L** 
  * EQ-5D descriptive system
    * comprises the following 5 dimensions: mobility, self-care, usual activities, pain/discomfort and anxiety/depression. Each dimension has 3 levels: no problems, some problems, extreme problems. 

  * Includes the EQ visual analogue scale (EQ VAS)
    * Records the respondent’s self-rated health on a vertical, visual analogue scale where the endpoints are labelled ‘Best imaginable health state’ and ‘Worst imaginable health state’.

  * Completed Pre-Op and Post-Op for all 4 PROMs procedures. 

**4. Oxford Hip and Oxford Knee Scores (OHS, OKS)**
  * A patient-reported outcome instrument which contains 12 questions on activities of daily living that assess function and residual pain in patients undergoing total hip replacement or total knee replacement surgery.
  * Distributed only to hip or knee replacement patients.

**5. Aberdeen Varicose Vein Questionnaire (AVVQ)**
  * The questionnaire has a section in which the patients can indicate diagrammatically the distribution of their varicose veins. 
  * There are also questions relating to the amount of pain experienced; ankle swelling; use of support stockings; interference with social and domestic activities and the cosmetic aspects of varicose veins.
  * Distributed only to Varicose Vein surgery patients.

### FHIR Data Development

We chose an initial subset of 25 records from each of the 4 PROMs record-level data packages for each procedure. The 100 patient records cover a range of symptom severities, patient age, self-reported comorbidities, and surgical sites. 

To create useful sample patients, we supplemented the raw data with synthetic information. We used the provided patient age range and the known data collection period (April 2015 – March 2016) to randomly generate a date of birth and procedure date for each sample patient. We used the provided data dictionary to determine gender, and used the list of eligible OPCS4.5 procedure codes to map to an appropriate SNOMED procedure code for all patients. 


**Real Data Elements:**

 * Patient’s Gender
 * Age range
 * Surgery type (general not code specific)
 * Surgery date range (within covered dates of data package)
 * All survey responses, including self-reported comorbidities.


**Synthetic Data Elements:**

 * First and last Name
 * Contact Information (Phone and Email)
 * Street Address
 * Date of birth
   * Using known age range
 * Exact date of Surgery
   * Using known range
 * Date of pre-operative assessment and survey completion
   * We used 2 weeks before the surgery date as the pre-operative assessment appointment date. 
 * Date of post-operative survey completion
   * Surveys sent about 3 months after vein and groin procedures
     * Assumed 100 days for mailed completed survey received
   * Surveys sent about 6 months after hip and knee replacement
     * Assumed 180 days for mailed completed survey received


**Generating Synthetic Data**

Generated the following data using [Mockaroo](https://www.mockaroo.com) for male and female patients: 

 * First name
 * Last name	
 * Address (Line, City, State and Postal Code)
 * Telephone number

We used Excel to generate email address, DOB and surgery dates for each patient record. Encounter resources covering the inpatient surgical procedure used a time period based on our own research for the standard length of stay after each procedure type. We also generated encounter resources for the pre-operative assessment appointment during which the patient would have filled out the pre-operative surveys, and another for when a patient’s post-operative surveys may have been received; 180 days post-surgery for hip and knee replacement procedures, and 100 days post-surgery for groin hernia and varicose vein procedures. 











