# SPE_Rand_Dots

This repo contains the experimental programs and data analysis code for "Self-prioritization effect in perceptual matching and discrimination tasks".

```
└── 1_Procedure
|    └── exp1a
|     
└── 2_Code
│    └── Functions
│    └── Analysis_exp1a.Rmd
│    └── Data_clean.Rmd
│    └── SBFA_SPE_exp.Rmd
└── 3_Data  
```



- **Data_clean.Rmd:** Conducts preprocessing of raw experimental data to generate clean, analysis-ready datasets.
  
- **SBFA_SPE_exp.Rmd:** Implements a Sequential Bayesian Factor Analysis (SBFA) to calculate Bayesian factors (BFs) and guide data collection (i.e., stopping data collection when a pre-defined Bayesian evidence threshold is met).

- **Analysis_exp1a.Rmd:** Performs primary statistical analyses to test the core hypotheses of the experiment.
