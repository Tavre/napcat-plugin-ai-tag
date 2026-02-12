# napcat-plugin-ai-tag

NapCat 插件 —— 随机绘画 Tag 生成

## 功能

在群聊中发送 `tag` 或自定义触发词，随机获取一条 AI 绘画 prompt，拼接跑图前缀后发送到群内。

## 安装

1. 下载 `napcat-plugin-ai-tag.zip`
2. 解压到 NapCat 的 `plugins` 目录
3. 重启 NapCat

> 💡 你也可以在 NapCat WebUI 中直接安装插件。

## 命令

| 命令 | 说明 |
|------|------|
| `tag` | 随机抽取一条绘画 prompt |
| `随机tag`（可配置） | 同上 |

## 配置

在 NapCat WebUI 配置面板中可修改：

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `prefix` | 跑图前缀 | `生图` |
| `keyword` | 触发词别名 | `随机tag` |

## 许可证

MIT
