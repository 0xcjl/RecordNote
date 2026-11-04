# RecordNote for Obsidian

Turn voice recordings into searchable transcripts, summaries, action items, and Markdown notes with configurable AI services. RecordNote works with recordings captured by Obsidian Quick Capture on iPhone and audio files available in your vault.

**项目地址 / Repository:** [github.com/0xcjl/RecordNote](https://github.com/0xcjl/RecordNote)

**Author:** Jialin · **Email:** [0xjialin@gmail.com](mailto:0xjialin@gmail.com) · **X:** [@0xjialin](https://x.com/0xjialin)

RecordNote 是一个 Obsidian 第三方插件，用于将录音转写为 Markdown，并生成摘要、待办和建议。项目处于早期测试阶段。

## 工作流程与特点

**快速录音 → 打开录音笔记 → 一键转写和整理 → 查看、分享 Markdown。**

Obsidian 的 Quick Capture 负责录音；RecordNote 负责后续处理。在 iPhone 上可以从小组件启动录音，也可以在 Mac 上处理仓库中的音频或手动选择录音。生成的结果保留在自己的 Obsidian 仓库中，原录音不因处理而删除。转写和总结分开保存，方便分别查看或导出。

## 功能

- 在包含录音的笔记或打开的音频文件中，使用“处理当前语音笔记”命令；也可以手动选择其他录音文件。
- 音频分段转写并保存进度，失败后可重试；生成独立的转写稿和整理稿，并在来源笔记中添加链接。
- 提供任务状态、重新整理以及 Markdown 导出 / 分享入口。文件分享功能取决于设备和系统支持。
- 支持 MiniMax、OpenAI 和兼容 OpenAI 音频转写接口的自定义服务；文字整理可配置 MiniMax、OpenAI、Gemini、Grok、DeepSeek、Claude 或兼容接口。实际可用性取决于服务商接口、模型和账号权限。

## 命令与入口

在 Obsidian 命令面板搜索以下命令，或将常用命令加入移动端菜单：

- **处理当前语音笔记**：处理当前笔记中嵌入的录音；如果笔记有多段录音，可选择其中一段。也可从侧边栏图标调用。
- **选择录音并转写整理**：从文件选择器选择其他录音，例如语音备忘录导出的音频。
- **查看语音处理状态**：查看任务进度、错误和继续处理入口。
- **仅重新整理当前转写（保留旧稿）**：基于已有转写重新生成整理稿。
- **导出 / 分享当前语音笔记的 Markdown**：选择转写稿、总结稿或合并稿，按设备支持情况分享或保存副本。

## 手动安装

本项目尚未发布到 Obsidian 社区插件市场。下载 `main.js`、`manifest.json` 和 `styles.css`，放入仓库的 `.obsidian/plugins/voice-organizer-local/` 文件夹，重启 Obsidian 后在第三方插件设置中启用 RecordNote。最低 Obsidian 版本见 `manifest.json`。在移动设备上可通过支持插件同步的方式传递这些插件文件，再按提示重启。

## iPhone 快速录音：应用案例

这个用法参考了 [阿蔺 A-Lin 分享的 Obsidian 语音速记帖子](https://x.com/alin_zone/status/2117444969552396431)，并结合 [Obsidian 官方 iOS 使用说明](https://obsidian.md/help/ios)。录音和锁屏入口由 Obsidian 提供，RecordNote 负责录音结束后的转写与整理。

1. 使用 iOS 26 或更新版本，将 iPhone 上的 Obsidian 更新到 1.15 或更新版本。
2. 在主屏幕长按空白处进入编辑，添加 Obsidian 的 Quick Capture（快速记录）小组件。长按小组件并选择编辑，可配置仓库和语音录入操作；也可使用锁屏或控制中心的 Quick Capture 入口。
3. 打开 Quick Capture，进入语音录入，在齿轮设置中开启 **Save Audio File（保存音频文件）**。这是 RecordNote 读取录音所必需的：Obsidian 1.15.1 起该选项默认关闭。可同时选择识别语言和麦克风。
4. 点小组件的语音入口开始录音；也可以进入快速记录后点击麦克风。录音期间可以锁屏，结束后停止并保存。确认生成的笔记中包含音频附件。
5. 打开这条笔记，在 Obsidian 命令或菜单中选择 **处理当前语音笔记**。处理完成后，通过笔记中的链接查看转写和总结，再按需导出或分享。

Siri 和 Spotlight 也可用于打开 Quick Capture；可在 Quick Capture 的捕获位置设置中把笔记标题设为自动。具体入口名称可能随系统语言和 Obsidian 版本变化。小组件在 Obsidian 开启“需要 Face ID”时不可用，详见官方说明。

## AI 配置与使用

1. 在插件设置中选择转写服务与文字整理服务、模型和 API 地址，并通过 Obsidian 密钥库配置对应 API 密钥。MiniMax 国内站与国际站需使用匹配的账号和地址。
2. 打开包含录音的笔记或音频文件，执行“处理当前语音笔记”。如果要处理其他来源的录音，可使用“选择录音并转写整理”。
3. 处理结束后，从来源笔记访问转写和整理结果；使用“导出 / 分享当前语音笔记的 Markdown”分享或保存副本。

转写和文字整理可以使用不同的服务和密钥。选择 MiniMax 时，先选对应区域，在密钥库选择密钥，并填写文字模型 ID；其他服务分别填写对应的密钥与模型。自定义转写接口需兼容 OpenAI Audio Transcriptions，自定义文字接口需兼容 OpenAI Chat Completions，并使用 HTTPS。设置中的“测试文字服务”只测试文字接口，会发送固定测试文字，可能产生费用；它不代表转写接口也已验证。

插件使用 API 密钥；目前没有实现服务商消费级订阅登录或本机 Agent 接入。API 可能收费，套餐是否包含对应接口由服务商决定。默认 MiniMax 文字模型可在设置中更改。

## 数据与限制

原始录音保留在原位置；处理结果和进度保存在仓库的 `语音整理` 文件夹。手动选择录音时可读取用户在文件选择器中指定的仓库外音频；在支持的 Mac 环境中，导出功能可将用户选定的 Markdown 保存到仓库外位置。处理时录音会发送给所选转写服务，转写文字会发送给所选文字整理服务。关闭 Obsidian Sync 的音频同步需要在每台设备的同步设置中配置；插件本身不会关闭同步，其他同步服务也需要单独检查。同步设置变更不会自动删除此前已上传的音频。

长音频会先在设备内解码，文件超过 100 MB 会被拒绝；长录音的内存消耗、后台执行和恢复能力受设备及系统限制。输出可能包含识别或总结错误，请核对重要信息。最新版本对直接打开音频文件的处理入口有本地自动化测试，但尚未完成该修复的 iPhone 真机验收。

## 联系与许可

作者：Jialin。问题反馈可通过 [GitHub Issues](https://github.com/0xcjl/RecordNote/issues) 或 [邮件](mailto:0xjialin@gmail.com) 联系；也可访问 [X @0xjialin](https://x.com/0xjialin)。

本项目采用 [MIT License](LICENSE)。
