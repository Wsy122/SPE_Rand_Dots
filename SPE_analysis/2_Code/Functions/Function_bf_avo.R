# 定义函数，用来进行贝叶斯重复测量方差分析

bf_aov <- function(data, dv='acc', v='association') {
  set.seed(1234)
  
  subj_num <- base::unique(data$subj_idx) # 每个被试的编号
  n <- base::length(unique(data$subj_idx)) # 获取被试数量
  
  bfs_int <- base::rep(1, length(subj_num))
  bfs_a <- base::rep(1, length(subj_num))
  bfs_diff <- base::rep(1, length(subj_num))
  
  for (i in base::seq_along(subj_num)) {
    if (i == 1) {
      next # 由于一个被试不能正确计算贝叶斯因子，所以当i等于1时，跳过
    }
    # 使用dv参数构建公式
    dv_formula <- stats::as.formula(base::paste(dv, "~ 1 + subj_idx + difficulty:subj_idx +", v, ":subj_idx"))
    
    # 零模型
    null_model <- BayesFactor::lmBF(
      dv_formula,
      data = data,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 仅包含 difficulty 主效应
    model_difficulty <- BayesFactor::lmBF(
      update(dv_formula, paste(". ~ . + difficulty")),
      data = data,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 仅包含 association 主效应
    model_association <- BayesFactor::lmBF(
      update(dv_formula, paste(". ~ . +", v)),
      data = data,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 包含两个主效应
    model_main <- BayesFactor::lmBF(
      update(dv_formula, paste(". ~ . + difficulty +", v)),
      data = data,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 包含主效应和交互作用
    model_int <- BayesFactor::lmBF(
      update(dv_formula, paste(". ~ . + difficulty *", v)),
      data = data,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    bfs_int[i] <- model_int / model_main
    bfs_a[i] <- model_main / model_difficulty
    bfs_diff[i] <- model_main / model_association
  }
  
  aov_output <- tibble::tibble(
    bfs_a = bfs_a,
    bfs_diff = bfs_diff,
    bfs_int = bfs_int
  )
  
  print(aov_output)
  return(aov_output)
}
