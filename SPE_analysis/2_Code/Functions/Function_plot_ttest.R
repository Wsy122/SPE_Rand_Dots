# 绘图函数，用来绘制t检验的图
plot_ttest <- function(data, dv, condition) {
  
  plot_obj <- data %>%
    dplyr::filter(Effect == dv ) %>% 
    ggplot2::ggplot(aes(x = subj_idx, y = BFs, group = 1)) + 
    geom_point(size = 3) + 
    geom_line() + 
    geom_hline(aes(yintercept = log(1)), linetype = "dashed") +
    geom_hline(aes(yintercept = log(10)), linetype = "dashed") +
    labs(y = TeX("$\\BF_{10}$"), x = 'n') + 
    ggtitle(paste(condition)) +  
    theme(
      panel.background = element_blank(),
      plot.margin = unit(c(1, 1, 1, 1), "cm"),
      plot.background = element_rect(fill = "white", color = NA),
      plot.title = element_text(size = 22, 
                                # family = "song",
                                face = "bold",
                                hjust = 0.5,
                                margin = margin(b = 15)),
      axis.line = element_line(color = "black", linewidth = .5),
      axis.title = element_text(size = 18, color = "black",
                                face = "bold"),
      axis.text = element_text(size = 15, color = "black"),
      axis.text.x = element_text(margin = margin(t = 10)),
      axis.title.y = element_text(margin = margin(r = 10)),
      axis.ticks = element_line(size = .5),
      panel.grid = element_blank(),
      legend.position.inside = c(0.20, 0.8),
      legend.background = element_rect(color = "black"),
      legend.text = element_text(size = 15),
      legend.margin = margin(t = 5, l = 5, r = 5, b = 5),
      legend.key = element_rect(color = NA, fill = NA)
    )
  
  return(plot_obj)
}
