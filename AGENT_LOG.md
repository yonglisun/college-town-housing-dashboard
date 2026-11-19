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

## 2026-11-19: Fixed data loading in the Codex preview

- **Asked:**

  > 我已经看到了你开发完成的网站预览，整体设计不错。
  >
  > 但是目前页面右下角出现了错误提示：
  >
  > "Market data could not be loaded. Please refresh the page."
  >
  > 请先帮我排查并解决这个问题，再进入 Pull Request 阶段。
  >
  > 具体要求：
  >
  > 1. 检查 data/city_market_summary.json 是否已经成功生成，且包含正确的数据。
  > 2. 检查 index.html 和 JavaScript 中读取 JSON 的路径是否正确。
  > 3. 检查是否只是 Codex 预览环境无法加载数据，还是实际网站也会出现问题。
  > 4. 使用本地 HTTP Server 或其他适合的方法测试页面，确认数据可以正常加载。
  > 5. 验证 Median Sale Price、Number of Sales 等统计数据能够正确展示。
  > 6. 测试城市筛选器是否正常工作。
  > 7. 确保未来合并到 main 后能够在 GitHub Pages 正常运行。
  >
  > 如果需要修改代码，请在当前 work 分支上完成，并提交、推送修复。
  >
  > 完成后请用中文告诉我：
  >
  > - 错误的原因是什么？
  > - 你做了哪些修改？
  > - 进行了什么测试？
  > - 现在是否可以安全创建 Pull Request？
  >
  > 暂时不要合并到 main 分支。

- **Agent produced:** Kept the JSON endpoint for GitHub Pages and added a generated JavaScript data asset that works in direct-file preview environments. The application uses the generated script first and retains the relative JSON request as a fallback. The data-build script now writes both files from the same calculated object and gives the generated assets readable file permissions.
- **Checked or changed:** Confirmed the JSON contains 35,442 records and 18 city summaries. An HTTP test loaded the generated JavaScript asset with status 200 and displayed the correct All Cities metrics. A second test deliberately blocked that asset and confirmed the JSON fallback returned status 200 and displayed the same metrics. The Madison selector updated all four cards and highlighted Madison in both charts. The first Madison test mistakenly expected 8 days and 3.0 miles; the test exposed that mistake, the generated data was checked, and the expectation was corrected to the actual medians of 7 days and 4.6 miles. Final browser tests reported no console errors and no visible error banner.
