# Data Provenance Documentation
**Telugu-English Bilingual Science Reader**
**Project:** CS6460 Educational Technology
**Author:** Pawan Medidi (pmedidi3@gatech.edu)
**Date:** January 2025
**Version:** 1.0

---

## Overview

This document provides comprehensive provenance information for all datasets used in the Telugu-English Bilingual Science Reader, following best practices from Bender & Friedman (2018) data statements and Gebru et al. (2021) datasheets for datasets.

---

## 1. Dataset: sentences.json

### 1.1 Basic Information
- **Size:** 751 aligned English-Telugu sentence pairs
- **Domain:** 7th-grade science education (heat transfer)
- **Format:** JSON array of objects
- **Encoding:** UTF-8
- **File Size:** ~180 KB

### 1.2 Source & Collection
**Source Materials:**
- Open-source Indian science textbooks (NCERT Class 7 Science)
- Teacher-contributed classroom materials (Telangana State Board)
- Public domain educational resources
- Author-generated examples based on curriculum standards

**Collection Method:**
- Manual extraction from textbooks (200 sentences)
- Teacher interviews and classroom observations (150 sentences)
- Author-created examples aligned to curriculum (401 sentences)

**Collection Period:** November 2024 - January 2025

**Geographic Coverage:**
- Content applicable to Telangana and Andhra Pradesh
- Cultural examples from urban and rural Telugu-speaking regions

### 1.3 Language Information
**English:**
- Variety: Indian English
- Register: Educational/academic
- Grade level: 7th grade (ages 12-13)
- Readability: Flesch-Kincaid Grade 6-7

**Telugu:**
- Script: Telugu (Unicode)
- Variety: Standard written Telugu (Andhra Pradesh/Telangana)
- Register: Educational/formal
- Dialect: Neutral (avoiding region-specific colloquialisms in v1.0)

### 1.4 Quality Assurance
- **Translation Verification:** Author (native Telugu speaker) verified all translations
- **Peer Review:** 2 Telugu-speaking educators reviewed 25% sample
- **Accuracy Check:** Scientific content verified against NCERT standards
- **Cultural Appropriateness:** Reviewed by Telugu teachers for cultural fit

### 1.5 Known Limitations
- Dialectal variation not yet incorporated (planned for v2.0)
- Focus on standard Telugu; may not reflect all regional variations
- Some technical terms use transliteration alongside Telugu equivalents
- Sentence complexity may vary (not normalized)

### 1.6 Intended Use
- Educational purposes in Telugu-medium schools
- 7th-grade science instruction (heat transfer unit)
- Bilingual reading practice
- Teacher training materials

### 1.7 Prohibited Use
- Commercial sale without attribution
- Training large language models without proper licensing
- Use in contexts outside K-12 education without review

---

## 2. Dataset: glossary.json

### 2.1 Basic Information
- **Size:** 397 science terms
- **Domain:** Heat transfer, energy, temperature, states of matter
- **Format:** JSON array of term objects
- **Encoding:** UTF-8
- **File Size:** ~95 KB

### 2.2 Source & Collection
**Source Materials:**
- NCERT Class 7 Science glossary
- Telangana State Board science textbooks
- Telugu-English science dictionaries
- Teacher-contributed classroom vocabulary

**Term Selection Criteria:**
- Frequency in 7th-grade science curriculum
- Relevance to heat transfer concepts
- Student difficulty (as reported by teachers)
- Cross-curricular importance

**Collection Period:** November 2024 - January 2025

### 2.3 Term Structure
Each term includes:
- `term_en`: English term (lowercase)
- `term_te`: Telugu translation (with transliteration)
- `defs`: Array of 1-3 definitions (grade-appropriate)
- `examples`: Array of 1-3 contextual examples

**Example Quality Standards:**
- Examples drawn from everyday life
- Culturally appropriate to Telugu-speaking regions
- Age-appropriate for 7th graders
- Scientifically accurate

### 2.4 Quality Assurance
- **Linguistic Review:** Native Telugu speaker verification
- **Scientific Review:** Aligned with NCERT standards
- **Pedagogical Review:** 3 teachers assessed comprehensibility
- **Cultural Review:** Examples checked for regional appropriateness

### 2.5 Known Limitations
- Dialectal synonyms not yet included (v2.0 feature)
- Some advanced terms included for reference (may exceed 7th grade)
- Register variation (formal vs. colloquial) not systematically documented
- Limited coverage of Telugu-origin scientific terms

### 2.6 Intended Use
- Vocabulary support for bilingual science education
- Glossary reference for students and teachers
- Assessment item development
- Supplementary learning materials

---

## 3. Dataset: vignettes.json

### 3.1 Basic Information
- **Size:** 20 culturally-grounded science examples
- **Domain:** Heat transfer concepts applied to daily life
- **Format:** JSON array of vignette objects
- **Encoding:** UTF-8
- **File Size:** ~15 KB

### 3.2 Source & Collection
**Creation Method:**
- Author-generated based on cultural knowledge
- Teacher input on common student experiences
- Classroom observation of student questions
- Iterative refinement with teacher feedback

**Design Principles:**
- Connect abstract concepts to concrete experiences
- Use culturally familiar contexts (Telugu households)
- Avoid urban bias where possible
- Include gender-neutral examples

**Collection Period:** December 2024 - January 2025

### 3.3 Vignette Structure
Each vignette includes:
- `id`: Unique identifier
- `concept`: Heat transfer concept illustrated
- `title_en` / `title_te`: Bilingual titles
- `description_en` / `description_te`: Detailed explanations
- `culturally_relevant`: Boolean flag
- `classroom_tested`: Boolean flag (teacher validation)

### 3.4 Cultural Examples Included
- **Kitchen practices:** tawa cooking, pressure cooker, tea stirring
- **Daily life:** clothing choices, floor drying, water storage (matka)
- **Environmental:** beach breezes, morning dew, sun drying clothes
- **Infrastructure:** railway tracks, park benches

### 3.5 Quality Assurance
- **Cultural Validation:** 3 Telugu teachers reviewed for authenticity
- **Scientific Accuracy:** Verified against physics principles
- **Accessibility:** Tested with sample of 7th-grade students (n=12)
- **Inclusivity Check:** Reviewed for socioeconomic and gender bias

### 3.5 Known Limitations
- Geographic bias toward Andhra Pradesh/Telangana
- Limited representation of tribal or minority cultural practices
- Urban examples may be more common than rural
- Some modern conveniences (pressure cooker) may not be universal

### 3.6 Intended Use
- Contextual learning support
- Cultural scaffolding for science concepts
- Teacher discussion prompts
- Assessment context creation

---

## 4. Cross-Dataset Considerations

### 4.1 Consistency
- **Terminology:** Same Telugu terms used across datasets
- **Tone:** Consistent formal register for educational content
- **Examples:** Cross-referenced between glossary and vignettes
- **Concepts:** Aligned to same curriculum standards (NCERT)

### 4.2 Interoperability
- **Format:** All datasets in UTF-8 JSON for easy parsing
- **IDs:** Unique identifiers enable cross-referencing
- **Schema:** Consistent structure for programmatic access
- **Versioning:** All datasets share version numbering

### 4.3 Privacy & Ethics
- **No Personal Data:** No student names, locations, or identifiable information
- **Open Licensing:** Intended for educational use (CC BY-NC-SA 4.0)
- **Cultural Sensitivity:** Reviewed to avoid stereotypes or bias
- **Accessibility:** Designed for low-resource, low-bandwidth contexts

---

## 5. Data Collection Ethics

### 5.1 Informed Consent
- Teacher contributors informed of project goals
- No student data collected
- All examples anonymized

### 5.2 Compensation
- No monetary compensation provided
- Attribution offered to contributing teachers
- Project outcomes shared with participating schools

### 5.3 Power Dynamics
- Author is native Telugu speaker (insider perspective)
- Engaged teachers as collaborators, not just subjects
- Iterative feedback incorporated

---

## 6. Maintenance & Updates

### 6.1 Version Control
- **Current Version:** 1.0 (January 2025)
- **Next Planned Update:** v1.1 (March 2025) - Add dialectal variations
- **Future Plans:** v2.0 (June 2025) - Expand to other science topics

### 6.2 Error Reporting
- Errors can be reported via project GitHub issues
- Translation corrections welcomed from Telugu speakers
- Scientific accuracy issues reviewed by domain experts

### 6.3 Community Contributions
- Open to contributions from Telugu educators
- Guidelines for submissions available in CONTRIBUTING.md
- Review process: Author + 2 teacher reviewers

---

## 7. Technical Metadata

### 7.1 File Encoding
- Character Encoding: UTF-8
- Line Endings: LF (Unix-style)
- JSON Validation: Passes JSONLint validation
- Schema Version: 1.0

### 7.2 Dependencies
- No external dependencies required
- Self-contained JSON files
- Can be used offline

### 7.3 Backward Compatibility
- Version 1.x will maintain schema compatibility
- Major version changes (2.0+) may break compatibility
- Changelog maintained for all updates

---

## 8. References

**Data Documentation Standards:**
- Bender, E. M., & Friedman, B. (2018). Data statements for natural language processing. *Transactions of the Association for Computational Linguistics*, 6, 587-604.
- Gebru, T., et al. (2021). Datasheets for datasets. *Communications of the ACM*, 64(12), 86-92.

**Curriculum Standards:**
- NCERT. (2020). *Science Textbook for Class VII*. National Council of Educational Research and Training.
- Telangana State Board of Intermediate Education. (2019). *Science curriculum standards*.

**Linguistic References:**
- Krishnamurti, Bh., & Gwynn, J. P. L. (1985). *A Grammar of Modern Telugu*. Oxford University Press.

---

## 9. License

**Content License:** Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

**You are free to:**
- Share: Copy and redistribute the material
- Adapt: Remix, transform, and build upon the material

**Under the following terms:**
- Attribution: Give appropriate credit
- NonCommercial: Not for commercial purposes
- ShareAlike: Distribute under same license

---

## 10. Contact & Acknowledgments

**Primary Contact:**
Pawan Medidi
pmedidi3@gatech.edu
Georgia Institute of Technology

**Acknowledgments:**
- Contributing teachers from Telangana schools (names withheld for privacy)
- Dr. Dave Smith (CS6460 instructor) for project guidance
- Telugu-speaking pilot testers

**Last Updated:** January 2025
**Document Version:** 1.0
