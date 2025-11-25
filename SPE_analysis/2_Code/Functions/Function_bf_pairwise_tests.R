# 定义函数，用来对交互效应进行进一步检验
# 计算 bf 值，用贝叶斯配对样本t检验进一步检验交互作用
bf_pairwise_tests <- function(data, prefix = "acc_diff_so") {
  
  set.seed(1234)
  pairs <- utils::combn(1:4, 2, simplify = FALSE)
  subj_num <- base::unique(data$subj_idx)
  
  # 创建嵌套列表存储所有结果
  all_results <- list()
  for (i in base::seq_along(subj_num)) { # i遍历subj_num
    if (i == 1) {
      next
    }
    current_subj <- base::unique(data$subj_idx)[1:i]
    df_sub <- data[data$subj_idx %in% current_subj, ]
    
    # 存储当前迭代的结果
    iter_results <- list()
    
    for (pair in pairs) {
      col1 <- base::paste0(prefix, pair[1])
      col2 <- base::paste0(prefix, pair[2])
      x <- df_sub[[col1]]
      y <- df_sub[[col2]]
      
      # 进行贝叶斯检验
      bf <- BayesFactor::ttestBF(x, y, paired = TRUE, nullInterval = c(0, Inf))
      
      iter_results[[base::paste(pair[1], "vs", pair[2])]] <- list(
        BF = exp(bf@bayesFactor$bf[1]),
        Direction = mean(x - y)
      )
    }
    all_results[[base::paste0("", i)]] <- iter_results
  }
  return(all_results)
}