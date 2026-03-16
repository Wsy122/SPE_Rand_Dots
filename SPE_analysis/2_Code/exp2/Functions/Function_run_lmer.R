run_lmer <- function(data, dv) {
  # 加载必要的包
  suppressPackageStartupMessages({
    require(lme4)
    require(lmerTest)
    require(car)
    require(emmeans)
  })
  
  # 构建公式（使用指定的因变量）
  formula <- as.formula(paste(dv, "~ difficulty + (1 | subj_idx)"))
  
  # 构建混合效应模型
  model <- lmerTest::lmer(
    formula,
    data = data
  )
  
  # 执行类型II方差分析
  anova_results <- car::Anova(model, type = 2)
  
  # 计算边际均值和两两比较
  emm <- emmeans(
    model, 
    pairwise ~ difficulty, 
    adjust = "Bonferroni",
    lmer.df = "satterthwaite"
  )
  
  # 提取比较结果和置信区间
  pairwise_comparisons <- pairs(emm, simple = "difficulty")
  ci <- confint(emm, level = 0.95)
  
  # 返回结构化结果
  return(list(
    model_summary = summary(model),
    anova_results = anova_results,
    emmeans = emm$emmeans,
    pairwise_comparisons = pairwise_comparisons,
    confidence_intervals = ci,
    formula = format(formula)  # 返回使用的公式
  ))
}