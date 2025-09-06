# SPE_Rand_Dots

This repo contains the experimental programs and data analysis code for "Self-prioritization effect in perceptual matching and discrimination tasks".

## Research Background and Aims
The self-prioritization effect (SPE) refers to the phenomenon whereby self-related stimuli are processed more efficiently than stimuli not related to the self. This study combines the associative learning paradigm with a random dot motion (RDM) task to examine (a) whether the SPE persists in tasks without direct self-relevance, and (b) how this effect interacts with varying levels of task difficulty.

## Experimental Design
The experiment employed a 2 × 4 × 2 mixed design:
- **Within-subject factors**:
  - `Association type`: self-related vs. stranger-related
  - `Difficulty`: 4 levels (very easy, easy, difficult, very difficult)
- **Between-subject factor**:
  - `Perceptual dimension`: motion vs. color 

## Folder Structure
```
└── 1_Procedure/
|    └── exp1a
|      └── img/ # Stimulus images
|      └── jspsych-7.0/ # jsPsych library
|      └── template_Expt/ # HTML and JavaScript templates
|        └── color.js
|        └── move.js
|        └── getThreshold.js
|      └── index.html # Main experiment page
|     
└── 2_Code/
│    └── Functions/
│    └── Analysis_exp1a.Rmd
│    └── Data_clean.Rmd
│    └── SBFA_SPE_exp.Rmd
|
└── 3_Data/ 
```
## Analysis Scripts

- **Data_clean.Rmd:** Conducts preprocessing of raw experimental data to generate clean, analysis-ready datasets.
  
- **SBFA_SPE_exp.Rmd:** Implements a Sequential Bayesian Factor Analysis (SBFA) to calculate Bayesian factors (BFs) and guide data collection (i.e., stopping data collection when a pre-defined Bayesian evidence threshold is met).

- **Analysis_exp1a.Rmd:** Performs primary statistical analyses to test the core hypotheses of the experiment.

## Getting Started

### Prerequisites
- For running the experiment: a web server or jsPsych compatible environment
- For data analysis: R (≥ 4.3.3)

#### For questions regarding the experimental programs or data analysis code, please open an issue in this repository
