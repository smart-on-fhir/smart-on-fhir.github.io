---
layout: main
title: SMART on FHIR Profiles
---

# SMART on FHIR resource profiles

To support apps that run unmodified across different health IT systems, we
construct a set of "ground rules" that define which data fields are required
vs.  optional, and which coding systems are used in a given context. The FHIR
specification leaves many of these decisions open to downstream implementers,
to ensure that FHIR can work with a variety of use cases. But for a viable app
platform, we need more.

Below, we'll define the data elements and coding systems that are considered
essential for a SMART on FHIR implementation. Eventually we'd like to document
these decisions using FHIR's built-in "profiling" mechanism, but for now we
host the following human-readable explanations, along with sample data to
demonstrate what we mean.

## Why do we need profiles?

Imagine an app that queries a patient's problem list and wants to create a
timeline view of problems in 2014. According to the FHIR specification, an app
can query for `/Condition?subject=123&onset=2014` to find problems that began
in 2014, or it can query for `/Condition?subject=123&date-asserted=2014` to
find problems that were first detected in 2014. 

In practice, any given FHIR server might have data with both `onsetDate` and
`dateAsserted` or might populate just one of them, or neither (or any mixture
of these). This suggests that if you're building an app for the "general case,"
you can't rely on either field, which makes it hard to build rich, expressive
queries. In the worst case, you might query by `dateAsserted` against a server
that only provides `onset`, and then upon finding no results, might mistakenly
conclude that the patient has no problems. 

In short: if you get no guarantees about which fields will be populated, you're
limited to just querying for all Conditions and doing all of your filtering
work client-side.

Profiles improve the situation by giving you a reliable set of agreed-upon
guarantees that go above and beyond FHIR's base specification.

# Patient Demographcs

Each
[Patient](http://www.hl7.org/implement/standards/fhir/patient.html#Patient)
must have:

 * `1..*` medical record numbers in `Patient.identifier`
 * `1..*` names in `Patient.name`
 * `1` administrative gender in `Patient.gender`

##### Example: [https://fhir-open-api.smartplatforms.org/Patient/1032702](https://fhir-open-api.smartplatforms.org/Patient/1032702?_format=json)

# Allergy or intolerance

Each [AllergyIntolerance](http://www.hl7.org/implement/standards/fhir/allergyintolerance.html) must have:

 * `1` sensitivity type (allergy, intolerance, or unknown) in `AllergyIntolerance.sensitivityType`
 * `1` patient in `AllergyIntolerance.subject`
 * `1` substance in `AllergyIntolerance.substance`

##### Example: [https://fhir-open-api.smartplatforms.org/AllergyIntolerance/634](https://fhir-open-api.smartplatforms.org/AllergyIntolerance/634?_format=json)

The coding system used to record the substance depends on the substance type.
There are three	cases: drug allergies, drug class allergies, and other.

### Allergy to a specific drug
#### Coded with RxNorm Ingredient codes

Allergies to a specific drug are coded using RxNorm at the ingredient level
(using codes with `TTY=IN`). It is almost certainly an error to claim that a
patient is allergic to a specific dose form such as a 100mg tablet of
Sulfamethoxazole
([rxnorm:402625](http://schemes.caregraf.info/rxnorm#!402625)). Instead, the
allergy is captured using the ingredient code for Sulfamethoxazole
([rxnorm:10180](http://schemes.caregraf.info/rxnorm#!10180)).

`Substance.type.coding.system`: `http://rxnav.nlm.nih.gov/REST/rxcui`
##### Example: cipro [https://fhir-open-api.smartplatforms.org/Substance/203563](https://fhir-open-api.smartplatforms.org/Substance/203563?_format=json)

### Allergy to a drug class
#### Coded with NDF-RT

Allergies to a drug class are captured using NDF-RT. For example, an allergy to
Sulfonamide drugs is captured using the drug class code
[NDFRT:N0000175503](http://purl.bioontology.org/ontology/NDFRT/N0000175503)

`Substance.type.coding.system`: `http://rxnav.nlm.nih.gov/REST/Ndfrt`

##### Example: sulfonamides [https://fhir-open-api.smartplatforms.org/Substance/N0000175503](https://fhir-open-api.smartplatforms.org/Substance/N0000175503?_format=json)

### Food and environmental allergies
#### Coded with FDA UNII

Allergies to other substances (foods ane environmental allergies) are captured
using FDA UNII codes.

`Substance.type.coding.system`: `http://fda.gov/UNII/`

##### Example: shrimp [https://fhir-open-api.smartplatforms.org/Substance/1891LE191T](https://fhir-open-api.smartplatforms.org/Substance/1891LE191T?_format=json)

# Immunizations

Each
[Immunization](http://www.hl7.org/implement/standards/fhir/immunization.html#Immunization)
must have:

 * `1..1` patient in `Immunization.subject`
 * `1..1` refusal indicator in `Immunization.refusalIndicator`
 * `1..1` self-reported indicator in `Immunization.reported`
 * `1..1` vaccine code in `Immunization.vaccineType`

#### Vaccines coded with CVX

Each immunizations is coded with a `vaccineType` drawn from CDC's [CVX
vocabulary](http://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx).
This is a coding with:
System: `http://www2a.cdc.gov/vaccines/iis/iisstandards/vaccines.asp?rpt=cvx`

##### Example: [https://fhir-open-api.smartplatforms.org/Immunization/4310](https://fhir-open-api.smartplatforms.org/Immunization/4310?_format=json)

# TODO: work in progress.

```
# Vital Signs
### Blood Pressure
# "No allergies"
# Condition
# Medication Prescription
# Medication Dispense
# Procedure
# Smoking Status
# Family History
# Lab result
```
