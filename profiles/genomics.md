---
layout: main
title: FHIR Genomics Data
---

## Genetic Data Available 
There are approximately 240,000 FHIR Sequence resources belonging to 6 Sample Patients (about 40,000 sequences per patient) available to FHIR App Developers on an open FHIR endpoint.

[Click here](http://genomics-advisor.smartplatforms.org:7080/) to access the data on the server! 

## Data Sources

The SMART Genomics Team downloaded genetic data from [OpenSNP](https://opensnp.org/genotypes), an open source website where users share their genetic information, and from the [Harvard Personal Genome Project](http://www.personalgenomes.org/harvard/data) website. All data was downloaded as VCF (Variant Call Format) files from these public data sources.  

VCF is a text file format, containing meta-information lines, a header line, and data lines containing information about a position in the genome.

The VCF files provide complete genetic data for professional detail validation. Each genetic data file provides:
  * Position Information
  * Variant status
  * Test quality matrix.

## FHIR Data Development

We created Patient and Sequence resources in FHIR STU3 Format, using both real and synthetic information, and developed an open source VCF to FHIR [converter tool](https://github.com/xliu3/deprecated-fhir-converter) to convert and upload the genomic data to the open FHIR endpoint. 

All data in the Sequence resources comes directly from the source VCF files. In order to create sample patients that are meaningful to the App developer community, we randomly generated information to create the associated Patient resources.  

**Real Data Elements:**
 * All data in the Sequence resource 
   * Genome Build
   * Chromosome number
   * Variant Info
   * Reference Allele
   * Observed Allele (ALT Allele)
   * Start and End Position (Position of the variant)
   * Quality value of variant

 * Gender of the patient/subject 
 
**Synthetic Data Elements:**
 * First and Last Name
 * Date of Birth 
 * Medical Record Number (MRN)
 
The value of the identifier element of each Sequence resource is the UID associated with the VCF file from which the sequence was derived. Each VCF file contains data from one individual subject, therefore any sequence resource with the same identifier value belongs to the same subject. Sequences belonging to the same patient/subject also reference the same FHIR Patient resource. 

The gender of the subject was determined by the presence or absence of a Y chromosome in the genetic data file. First name, Last name, and date of birth were randomly generated in order to create a patient profile. 



