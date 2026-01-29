# 🚀 AI Smart Changelog (AI 智能更新日志)

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/jjiachen4-dev/ai-changelog-action/test.yml?label=Build&style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Language](https://img.shields.io/badge/language-Node.js-green?style=flat-square)

> 还在手动写更新日志？让 AI 帮你把枯燥的 Git Commits 变成幽默、易读的用户文案！✨

## 🌟 简介 (Introduction)

这是一个基于 **豆包 (Doubao-Pro)** 大模型的 GitHub Action。它能自动读取你项目的 Git 提交记录，过滤掉无意义的杂活（chore/wip），并将技术术语翻译成**只有人类能看懂的**、带 Emoji 的精美更新日志。

**核心功能：**
* 🕵️ **智能过滤**：自动忽略 `update dependencies` 或 `typo` 等无聊提交。
* 🎭 **情感化文案**：告别冷冰冰的机器语言，生成的日志像老朋友聊天。
* 🌍 **多语言支持**：支持中文、英文等多种语言输出。

---

## 📸 效果演示 (Demo)

**原始 Commits:**
```text
feat: add dark mode switch
fix: mobile login button not clickable
chore: update react to v18
AI 生成的日志:====== 🎉 本次更新亮点 ======✨ 夜间模式降临：终于安排上了！现在你可以一键切换深色模式，深夜写代码再也不怕亮瞎眼。🐛 登录修复：之前的手机端登录按钮有点“耍大牌”，现在把它修好了，点击丝滑无卡顿！🛠️ 快速开始 (Quick Start)1. 准备工作你需要一个火山引擎（豆包）的 API Key。在 GitHub 仓库中，进入 Settings -> Secrets and variables -> Actions。点击 New repository secret，添加以下两个变量：DOUBAO_API_KEY: 你的 API 密钥。DOUBAO_ENDPOINT_ID: 你的推理接入点 ID (ep-xxxx...)。2. 添加 Workflow在你的项目中创建 .github/workflows/changelog.yml，复制以下内容：YAMLname: Generate Changelog
on:
  push:
    branches:
      - master # 或者 main

jobs:
  release_notes:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0 # 必须获取完整历史

      - name: Run AI Changelog
        uses: jjiachen4-dev/ai-changelog-action@master
        with:
          api_key: ${{ secrets.DOUBAO_API_KEY }}
          endpoint_id: ${{ secrets.DOUBAO_ENDPOINT_ID }}
          language: 'Chinese' # 可选: English, Japanese 等
⚙️ 参数说明 (Inputs)参数名必填默认值说明api_key✅-豆包/OpenAI 兼容格式的 API Keyendpoint_id✅-模型的接入点 IDlanguage❌Chinese输出语言，支持任何自然语言🤝 贡献与支持如果你觉得这个工具有趣，欢迎点个 ⭐️ Star！有问题请提 Issue。
