# Agent log

Add a dated entry each time you work with your AI coding agent, with the newest entry at the bottom. Each entry records what you asked the agent, what it produced, and what you checked or changed. Paste your key prompts in exactly as you typed them. Include at least one time the agent got something wrong, and how you caught it.

Copy this outline for each entry:

```markdown
## YYYY-MM-DD: What you worked on

- **Asked:** "Paste your prompt here."
- **Agent produced:** What it made or changed.
- **Checked or changed:** How you checked it, and what you fixed.
```

## 2026-11-19: Built and tested the housing market dashboard

- **Asked:**

  > 第一阶段的数据分析和网站设计方案我已经看过了，我同意你的整体设计。
  >
  > 现在请开始第二阶段：正式开发 College Town Housing Market Dashboard。
  >
  > 请按照你刚才提出的技术方案实施，同时补充以下要求：
  >
  > **1. 网站设计**
  >
  > - 使用简洁、现代、专业的 Dashboard 风格。
  > - 网站使用英文，所有数字和价格格式统一。
  > - 支持电脑和手机端。
  > - 优先保证页面美观、易读、功能可靠。
  >
  > **2. 核心功能**
  >
  > 请实现你提出的功能：
  >
  > - Median Sale Price
  > - Number of Sales
  > - Median Days on Market
  > - Median Distance to Campus
  > - 各城市房价中位数比较图
  > - 各城市销售数量比较图
  > - 城市选择器
  > - 数据清洗与计算规则说明
  >
  > 默认展示 All Cities 的统计数据。
  >
  > 当用户选择一个城市时：
  >
  > - 更新顶部统计卡片。
  > - 高亮图表中的对应城市。
  > - 保留其他城市作为比较参考。
  > - 显示该城市的销售数量和相关说明。
  >
  > **3. 数据处理**
  >
  > - 使用真实数据，遵循第一阶段确认的数据清洗规则。
  > - 创建 scripts/build_dashboard_data.py。
  > - 创建新的 data/city_market_summary.json。
  > - 不得修改原始五份数据文件。
  > - 验证汇总结果与原始数据一致。
  > - 缺失值不能当作零。
  > - Days on Market 只使用有效的挂牌和签约日期。
  >
  > **4. 代码和部署**
  >
  > - 使用 HTML、CSS、JavaScript。
  > - 确保网站可以通过 GitHub Pages 直接发布。
  > - 正确使用相对路径。
  > - 避免不必要的外部依赖。
  > - 更新 README.md，说明网站功能和运行方法。
  > - 更新 AGENT_LOG.md，记录 AI 辅助开发过程。
  >
  > **5. 工作方式**
  >
  > 请继续使用中文向我解释。
  >
  > 你可以在当前 work 分支上修改文件、编写代码和运行必要的测试，但不要直接修改 main 分支。
  >
  > 开发完成后，请：
  >
  > 1. 总结修改了哪些文件。
  > 2. 解释主要代码的作用。
  > 3. 展示数据验证和测试结果。
  > 4. 告诉我如何预览网站。
  > 5. 准备 Pull Request，但不要自动合并到 main。
  >
  > 请现在开始第二阶段的开发。完成后向我报告结果。

- **Agent produced:** A responsive English dashboard using HTML, CSS, and JavaScript; a Python data-build script; a compact city summary JSON file; interactive city filtering and comparison charts; and updated project documentation.
- **Checked or changed:** Regenerated the JSON from all 35,442 CSV rows and compared the results with the SQLite data. Tested the page in desktop and 390-pixel mobile browser viewports, checked All Cities and Ann Arbor metrics, confirmed 18 bars per chart and two highlighted bars after selection, and found no browser console errors or horizontal mobile overflow. The first browser-test attempt incorrectly expected Playwright's bundled Chromium to be installed. The resulting executable-not-found error exposed the issue, so the test was changed to use the environment's installed `/usr/bin/chromium`, then rerun successfully.
