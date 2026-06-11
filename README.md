# SPE_Rand_Dots

This repo contains the experimental programs and data analysis code for "Self-prioritization effect in perceptual matching and discrimination tasks".

## Research Background and Aims
The self-prioritization effect (SPE) refers to the phenomenon whereby self-related stimuli are processed more efficiently than stimuli not related to the self.
This repository contains two experiments examining different aspects of the SPE:
- **Experiment 1**: Examines whether SPE persists in tasks without direct self-relevance and how it interacts with varying levels of task difficulty (matching task + RDM discrimination).
- **Experiment 2**: Investigates whether SPE is modulated by the task relevance of the feature-person association, specifically, whether the self-associated visual feature overlaps with or is independent of the discrimination task target.with a random dot motion task to examine (a) whether the SPE persists in tasks without direct self-relevance, and (b) how this effect interacts with varying levels of task difficulty.

## Experimental Design
### Experiment 1: 
- **2 × 4 × 2 mixed design:**
  - **Within-subject factors**:
    - `Association type`: self-related vs. stranger-related
    - `Difficulty`: 4 levels (very easy, easy, difficult, very difficult)
  - **Between-subject factor**:
    - `Perceptual dimension`: motion vs. color 
### Experiment 2:
- **2 × 2 × 2 within-subject design**:
  - `Association type`: self-related vs. stranger-related
  - `Difficulty`: easy (~85% accuracy threshold) vs. difficult (~70% accuracy threshold)
  - `Task relevance`: target-overlapped vs. target-independent

## Folder Structure
```
1_Procedure/
├─ exp1/
│ ├─ img/ # Stimulus images
│ ├─ jspsych-7.0/ # jsPsych library
│ ├─ template_Expt/ # HTML and JavaScript templates
│ │ ├─ color.js
│ │ ├─ move.js
│ │ └─ getThreshold.js
│ └─ index.html # Main experiment page
│
└─ exp2/
├─ img/ # Stimulus images
├─ jspsych-7.0/ # jsPsych library
├─ template_Expt/ # HTML and JavaScript templates
│ ├─ color.js
│ ├─ move.js
│ └─ getThreshold.js
└─ index.html # Main experiment page
2_Code/
├─ exp1/
│ ├─ HDDM/
│ ├─ Functions/
│ ├─ Data_clean.Rmd
│ ├─ SBFA_SPE.Rmd
│ ├─ BHM_Analysis_motion.Rmd
│ └─ BHM_Analysis_color.Rmd
│
└─ exp2/
├─ HDDM/
├─ Functions/
├─ Data_clean.Rmd
├─ SBFA_SPE.Rmd
└─ BHM_Analysis.Rmd
3_Data/
├─ exp1/
│ ├─ RawData/ # Raw experimental data
│ └─ CleanData/ # Preprocessed data
│
└─ exp2/
├─ RawData/ # Raw experimental data
└─ CleanData/ # Preprocessed data
```
## Main Analysis Scripts
### Experiment 1
- **Data_clean.Rmd:** Preprocessing of raw experimental data to generate clean, analysis-ready datasets.
- **SBFA_SPE.Rmd:** Sequential Bayesian Factor Analysis to calculate Bayesian factors (BFs) and guide data collection.
- **BHM_Analysis_motion.Rmd / BHM_Analysis_color.Rmd:** Bayesian hierarchical model analyses by perceptual dimension.
### Experiment 2
- **Data_clean.Rmd:**
- **SBFA_SPE.Rmd:** 
- **BHM_Analysis.Rmd:**

## Getting Started

### Prerequisites
- For running the experiment: a web server or jsPsych compatible environment
- For data analysis: R (≥ 4.3.3)

#### For questions regarding the experimental programs or data analysis code, please open an issue in this repository