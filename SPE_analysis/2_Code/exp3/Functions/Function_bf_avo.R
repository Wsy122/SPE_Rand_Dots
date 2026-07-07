bf_aov <- function(data, dv='acc') {
  set.seed(1234)
  
  subj_num <- base::unique(data$subj_idx) # 每个被试的编号（按数据中顺序排列）
  n <- base::length(unique(data$subj_idx)) # 获取被试数量
  
  bfs_int <- base::rep(1, length(subj_num))
  bfs_association <- base::rep(1, length(subj_num))
  bfs_task <- base::rep(1, length(subj_num))
  
  for (i in base::seq_along(subj_num)) {
    if (i == 1) {
      next # 由于一个被试不能正确计算贝叶斯因子，所以当i等于1时，跳过
    }
    # 循环核心修正：筛选“前i个被试”的数据（而非全量数据）
    data_i <- data %>% dplyr::filter(subj_idx %in% subj_num[1:i])
    
    # 使用dv参数构建公式, 基础公式包含随机斜率（为了与JASP一致）
    dv_formula <- stats::as.formula(base::paste(dv, "~ 1 + subj_idx + association:subj_idx + task_type:subj_idx"))
    
    # 零模型
    null_model <- BayesFactor::lmBF(
      dv_formula,
      data = data_i, 
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 仅包含 association 主效应
    model_association <- BayesFactor::lmBF(
      update(dv_formula, paste(". ~ . + association")),
      data = data_i,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 仅包含 task_type 主效应
    model_task <- BayesFactor::lmBF(
      update(dv_formula, paste(". ~ . + task_type")),
      data = data_i,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 包含两个主效应
    model_main <- BayesFactor::lmBF(
      update(dv_formula, paste(". ~ . + association + task_type")),
      data = data_i,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 包含主效应和交互作用
    model_int <- BayesFactor::lmBF(
      update(dv_formula, paste(". ~ . + association * task_type")),
      data = data_i,
      whichRandom = "subj_idx",
      rscaleFixed = 0.5,
      rscaleRandom = 1,
      iteration = 10000
    )
    
    # 用extractBF提取BF数值
    bfs_int[i] <- BayesFactor::extractBF(model_int / model_main)$bf
    bfs_association[i] <- BayesFactor::extractBF(model_main / model_task)$bf
    bfs_task[i] <- BayesFactor::extractBF(model_main / model_association)$bf
  }
  
  aov_output <- tibble::tibble(
    bfs_association = bfs_association,
    bfs_task = bfs_task,
    bfs_int = bfs_int
  )
  
  print(aov_output)
  return(aov_output)
}