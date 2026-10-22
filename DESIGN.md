---
{
  "version": "alpha",
  "name": "AI情报",
  "description": "AI情报简报系列视觉规范：浅色暖奶油底、扁平杂志编辑感、橙色行动焦点；适用于 B站 16:9 1080p 的 MG 内容帧、数据面板与路线对比图",
  "colors": {
    "primary": "#3E4A5A",
    "secondary": "#7C8797",
    "tertiary": "#F26B1D",
    "canvas": "#F9F2E0",
    "surface": "#FFFFFF",
    "line": "#AEBAC7",
    "system": "#DEE5EC",
    "success": "#FCE8D4"
  },
  "typography": {
    "h1": {
      "fontFamily": "Noto Sans CJK SC, WenQuanYi Zen Hei, sans-serif",
      "fontSize": "88px",
      "fontWeight": 700,
      "lineHeight": 1.1,
      "letterSpacing": "3px"
    },
    "h2": {
      "fontFamily": "Noto Sans CJK SC, WenQuanYi Zen Hei, sans-serif",
      "fontSize": "42px",
      "fontWeight": 700,
      "lineHeight": 1.15,
      "letterSpacing": "0px"
    },
    "subtitle": {
      "fontFamily": "Noto Sans CJK SC, WenQuanYi Zen Hei, sans-serif",
      "fontSize": "30px",
      "fontWeight": 400,
      "lineHeight": 1.25,
      "letterSpacing": "0px"
    },
    "body": {
      "fontFamily": "Noto Sans CJK SC, WenQuanYi Zen Hei, sans-serif",
      "fontSize": "26px",
      "fontWeight": 400,
      "lineHeight": 1.25,
      "letterSpacing": "0px"
    },
    "label": {
      "fontFamily": "Noto Sans CJK SC, WenQuanYi Zen Hei, sans-serif",
      "fontSize": "24px",
      "fontWeight": 400,
      "lineHeight": 1.25,
      "letterSpacing": "0px"
    },
    "metadata": {
      "fontFamily": "JetBrains Mono NF, monospace",
      "fontSize": "26px",
      "fontWeight": 400,
      "lineHeight": 1.25,
      "letterSpacing": "0px"
    }
  },
  "rounded": {
    "small": "10px",
    "card": "16px",
    "container": null
  },
  "spacing": {
    "xs": "2px",
    "sm": "14px",
    "md": "22px",
    "lg": "32px",
    "xl": "44px",
    "section": "60px"
  },
  "components": {
    "card": {
      "backgroundColor": "{colors.surface}",
      "textColor": "{colors.primary}",
      "typography": "{typography.label}；k/n 行按已确认样本用 23px 局部值（见正文 Components）",
      "rounded": "{rounded.card}",
      "padding": "18px 28px",
      "border": "3px solid {colors.line}",
      "height": "149px（含边框；D01 终帧与 D02 数据卡组实测 145–149，按内容自适应会撑到 159）"
    },
    "panel": {
      "backgroundColor": "{colors.surface}（主方）或 {colors.system}（对照方）",
      "textColor": "{colors.primary}",
      "border": "主方 3px solid {colors.line}；对照方无描边（候选A 与测试01 一致）",
      "rounded": "{rounded.card}",
      "padding": "26px 34px"
    },
    "data-value": {
      "fontFamily": "JetBrains Mono NF, monospace",
      "fontSize": "46px",
      "fontWeight": 700,
      "textColor": "{colors.primary}，强调数字用 {colors.tertiary}",
      "unit": "单位与数值同阶（46px）写在同一行盒内，单位恒用 {colors.primary}（候选A／D01 终帧／D04 闭环帧实测；2026-10-20 补登记）"
    },
    "result-label": {
      "backgroundColor": "{colors.tertiary}",
      "textColor": "{colors.canvas}",
      "typography": "{typography.label}（24px 为准；测试01 代码实为 22px，差异已登记，实现以 24px 为准）",
      "rounded": "{rounded.small}",
      "padding": "5px 18px"
    },
    "chip": {
      "backgroundColor": "{colors.surface}",
      "border": "2px solid {colors.line}；强调态：{colors.tertiary} 边框 + {colors.success} 底",
      "typography": "{typography.body}",
      "rounded": "{rounded.small}",
      "padding": "6px 18px"
    },
    "footer": {
      "backgroundColor": "none",
      "textColor": "{colors.secondary}",
      "typography": "{typography.label} 的 23px 局部值（候选A 与本期各内容帧页脚一致）",
      "border": "顶部 2px solid {colors.line}",
      "padding": "上 12px"
    },
    "subtitle": {
      "backgroundColor": "none",
      "textColor": "{colors.primary}",
      "typography": "{typography.body}",
      "stroke": "{colors.surface} 4px（SVG paint-order 描边，不用阴影渐变）",
      "position": "单行居中，文字底边 y≈1035（页脚原来那条带）；出现时页脚 8f 淡出让位"
    }
  },
  "x-video": {
    "profileVersion": "1.0",
    "status": "confirmed",
    "revision": "1.1.0",
    "canvas": {
      "referenceWidth": 1920,
      "referenceHeight": 1080,
      "fpsReference": 30,
      "scaling": "uniform-fit",
      "safeInsets": {
        "top": 60,
        "right": 88,
        "bottom": 44,
        "left": 88
      }
    },
    "layers": {
      "mg": {
        "background": "{colors.canvas}",
        "material": "flat"
      },
      "recording": {
        "fit": "contain",
        "chrome": "待定（本期未计划录屏）"
      },
      "generated": {
        "style": "not used",
        "background": "not used",
        "wrapper": "none"
      }
    },
    "surfaces": {
      "borderWidth": "3px",
      "cardShadow": "none",
      "containerShadow": "none"
    },
    "container": {
      "enabled": false,
      "titlebarHeight": 0,
      "titleFontSize": 0,
      "iconSize": 0,
      "iconGap": 0,
      "scaleTogether": true
    },
    "graphics": {
      "inputRole": "感知节点：白盒、line 边框、rounded.small",
      "processorRole": "面板：surface 卡（主方）/ system 面板（对照方），本系列无处理器实体",
      "resultRole": "答案盒：默认白框；采用/完成态 success 填充 + tertiary 边框",
      "pathRole": "实线 tertiary = 快/采用路线；虚线（16/12）primary = 慢/对照路线；箭头表示方向",
      "outlineWidth": "3px",
      "decorativeRotationMaxDeg": 0
    },
    "motion": {
      "curves": {
        "reveal": [0.215, 0.61, 0.355, 1],
        "anticipation": null,
        "travel": [0.25, 0.1, 0.25, 1],
        "settle": [0.215, 0.61, 0.355, 1],
        "process": [0.645, 0.045, 0.355, 1]
      },
      "linearUseCases": [
        "慢路线对象匀速推进（强调每一步都走的表达目的成立）"
      ],
      "squashStretch": {
        "enabled": false,
        "maxCompression": 0,
        "maxStretch": 0,
        "preserveVolume": true
      },
      "calibration": {
        "sample": "00_系列测试/动态/动态预览_测试01.mp4",
        "fps": 30,
        "phasesFrames": {
          "entrance": "0-58（错峰 6-8f）",
          "panels": "34-64（0.98→1，错峰 8f）",
          "pathL_draw": "48-70（22f）",
          "dotL_travel": "70-88（18f）",
          "contactL": "88-100（12f，脉冲 1.05，第 92 帧离散换态）",
          "pathR_draw": "52-84（32f）",
          "dotR_travel": "84-118（34f，匀速）",
          "contactR": "118-130（12f，脉冲 1.04）",
          "cards": "126-158（错峰 8f，每卡 16f）",
          "count": "140-200（60f）",
          "footer": "200-216",
          "hold": "216-300（84f 停稳阅读）"
        },
        "distancesPx": {
          "note": "圆点位移为 SVG 坐标单位（viewBox 宽 880 → 画布约 0.89 倍）；下划线与上浮为画布 px",
          "dotL": 397,
          "dotR": 640,
          "underline": 120,
          "riseDefault": 14,
          "riseMax": 20
        },
        "anglesDeg": {},
        "followDelaysFrames": {
          "chipStagger": 6,
          "panelStagger": 8,
          "cardStagger": 8
        },
        "scope": "验证入场节奏、沿线生长形态变换、双路时间对比、接触状态反馈、计数可读性、终帧与静态一致；不含运镜、跨镜转场与角色交互（本系列不用角色）"
      }
    },
    "componentBehavior": {
      "subtitle": "单行、随语音出现；cue ≤28 字、最短 1.13s；页脚让位按\"字幕块\"计算（段内首尾相接的 cue 合成一块，块起 8f 淡出、块止 8f 淡回，不在 cue 边界闪现）；页脚入场全片只播一次（由开场段播入场，窗口若落在字幕块内则顺延到最近的无字幕帧），其余段页脚恒定就位、只随字幕块让位，段间切点不重播入场；不为字幕挪动已确认的内容帧构图",
      "card": "成组进入（淡入 + 10px 上浮，16f）；内部信息随后，数字计数到停稳；不逐字乱跳",
      "result-label": "只在动作实际完成后出现（如 JEVA 标签在左点接触后 6f），不提前宣布成功",
      "path": "路径绘制先于对象出发并先完成；不出现轨迹跑完对象未动。回环线闭合＝沿已有节点边沿线生长的新路径实例（复用已确认 path 语言，不是新运动类型；本期 D04 首现，动态后复核）",
      "text": "标签随对象/面板成组进入；末尾 2.8s 停稳供阅读",
      "contact": "半正弦脉冲 0.4s（幅度 1.05/1.04）+ 离散换态（白框→success 填充）",
      "transition": "本期语言＝跨帧/跨镜硬切，切点两侧均为停稳终态（D04 章卡与 D09 片尾卡首现，2026-10-19 随全片视觉总览确认；动态成片后复核，运镜与运动匹配仍未验证）"
    },
    "evidence": {
      "static": "00_系列测试/静态/候选A_暖奶油对齐参考/（design.html + 候选.png，Noto Sans CJK SC 版）",
      "motion": "00_系列测试/动态/动态预览_测试01.mp4（300f @30fps，10s）",
      "confirmation": "2026-10-15 用户确认静态候选A（整体观感、配色、布局、内容帧结构）；同日用户确认动态样片（入场节奏、形态变换语言、双路时间对比、接触反馈、计数、结果停稳）；同日用户正式确认本规范整份（固定项与变量范围，revision 1.0.0）",
      "registration": "2026-10-19 随本期全片视觉总览确认（用户\"全部默认\"）补登记，不改变已确认视觉：card k/n 行 23px 与页脚 23px 为已确认样本局部值；panel 主方 3px line 边补入定义；result-label 以 24px 为准（测试01 代码 22px 记差异）；帧率 30fps 由变量转固定项；跨帧/跨镜硬切登记为本期语言（动态后复核）。同日用户确认字幕形式（单行、body 26px、primary 字＋surface 描边、字幕出现时页脚让位）→ revision 1.1.0；1.0.0 已确认范围不变。2026-10-20 再补两处口径缺口（取自已确认设计图实测，非新决定）：data-value 的单位与数值同阶同行盒、单位恒 primary；card 盒高 149px（含边框）不随内容撑开；并把页脚让位明确为按字幕块计算＋入场窗口遇字幕顺延。2026-10-20 同日用户另确认一项行为变更：页脚入场全片只播一次（D01 段尾留白），其余段恒定就位——理由＝本期留白多为 15f，短于 20f 入场，逐段重播会在切点被截断归零；revision 仍 1.1.0（避免各段任务书引用的版本号漂移），变更以日期登记"
    },
    "fixed": [
      "颜色角色与取值（8 色）",
      "字体栈与六级字阶：Noto Sans CJK SC（OFL 许可，系统已装）+ JetBrains Mono NF（数字/英文/日期），回退 WenQuanYi Zen Hei",
      "扁平 + 3px 描边，无阴影、无渐变",
      "圆角：small 10px / card 16px；不使用窗口框（container 不适用）",
      "画布 1920×1080，安全区 上 60 / 左右 88 / 下 44",
      "曲线：出现/停稳 out(cubic)，对象传递 inOut(quad)，过程 inOut(cubic)，匀速仅限慢路线",
      "帧率 30fps（2026-10-19 随本期全片视觉总览确认；校准样本同为 30fps）",
      "不使用角色"
    ],
    "variables": [
      "每段具体布局、镜头路线与对象数量",
      "依据真实配音确定的时长与秒点"
    ],
    "exceptions": []
  }
}
---

# AI情报 — 系列视觉与运动规范

## Overview

观众：关注 AI 前沿的开发者与技术爱好者（本期受众描述待确认）。内容类型：AI 情报简报——每期围绕一篇论文/事件，MG 内容帧承载数据、对比与路线图解。视觉关键词：浅色暖奶油底、扁平杂志编辑感、橙色行动焦点；运动克制——淡入+轻微上浮、时间对比、离散换态，不用漂浮与弹跳。

已确认样本：

- 静态：[候选A_暖奶油对齐参考](00_系列测试/静态/候选A_暖奶油对齐参考/候选.png)，确认范围：整体观感、配色、布局、内容帧结构。
- 动态：[动态预览_测试01.mp4](00_系列测试/动态/动态预览_测试01.mp4)，确认范围：入场节奏、形态变换语言（沿线生长）、双路时间对比、接触状态反馈、数据计数、结果停稳。
- 整份规范：2026-10-15 用户正式确认（"DESIGN 确认"），固定项、变量范围与未验证项界定见 front matter 与 Exceptions。

待定项：录屏层包装、运镜与跨镜转场参考。已定：帧率 30fps（转入固定项）；字幕形式（单行、body 26px、primary 字＋surface 描边、出现时页脚让位，见 `components.subtitle`）；跨帧/跨镜硬切登记为本期语言（切点两侧均为停稳终态），动态成片后复核。

本文件只决定怎样呈现。稿件、时间、采用版本和允许制作范围分别认本期表与用户确认。结构化参数是具体数值的唯一来源；发生冲突先报告并修正规范，不由代码自行挑值。

### 呈现范围

| 内容层 | 应用哪些规则 | 不继承哪些规则 |
| --- | --- | --- |
| MG／图形 | 全部颜色角色、六级字体、图形语法、画布与运动曲线 | 不套用到生成场景内部（未使用） |
| 真实录屏 | 原比例 contain、安全区；包装（chrome）待定 | 不能为装饰改动真实产品证据；本期未计划录屏，引入前另确认 |
| 生成场景内部 | 未使用 | 不套用 MG 背景与组件；引入时单独确认画风与身份 |
| 外部包装／字幕 | 安全区；字幕字阶待定 | 不可改变片内动作与真实内容 |

## Colors

`canvas` 是暖奶油底与画布；`surface` 是白卡片；`system` 是浅蓝灰面板（对照方底色）；`line` 表示边界；`primary` 是主文字（蓝灰墨）；`secondary` 是次要注释；`tertiary` 是橙色——唯一的行动焦点，用于采用路线、关键数字与结果标签；`success` 是浅橙填充，只标记已完成/已采用状态（答案盒换态后）。

一个画面内 `tertiary` 只服务当前需要注意的对象：测试样本中集中在左面板（橙线、橙答案盒、JEVA），对照方（右面板）只用 `primary`/`system`。状态色不承担类别语义；新增颜色先说明语义并验证，不随镜头随机添加。参考视频（BV1xGah67E1j）的采用色已并入本表，后续引用以本表为准。

## Typography

六级字阶见 front matter，字号按 1920×1080 基准画布解释；输出等比缩放时随场景缩放。实际字体：Noto Sans CJK SC（OFL 许可，系统 `fonts-noto-cjk` 已安装），数字、英文与日期用 JetBrains Mono NF；回退 WenQuanYi Zen Hei——回退后行高明显变低、整版高度变化，换字体后必须重新检查布局。

h1 内容帧大标题；h2 面板分区标题；subtitle 副题行与 kicker（kicker 字距 4px 是该组件的已确认局部值）；body 芯片与一般上屏文字；label 说明文与卡片描述；metadata 等宽信息（日期、EP、面板英文）。数据大数字 46px/700 见 `components.data-value`。

标题与说明左对齐；不靠扩大字间距填满一行（h1 的 3px 是已确认值，不是通用规则）。上屏文字只写给观众，制作说明不进画面；标题栏与元数据不承担必须看清的关键事实，关键事实放内容帧主体。

## Layout

画布与安全区见 `x-video.canvas`。间距阶梯：`xs` 组内微调（卡片 k/v/n 行距），`sm` 芯片与下划线间距，`md` 数据行间距，`lg` 面板/卡片之间，`xl` 底部留白，`section` 顶部留白。标题块内部比例（kicker→h1→下划线→副题）以确认样本为准，其中个别局部值不在阶梯内，不外推到其他段落。

主体内容位于安全区内。字幕占用页脚原来那条带（文字底边 y≈1035）：字幕出现时页脚淡出让位，内容帧构图不为字幕挪动——内容帧主体最低边须留在 y≈975 以上，给字幕留 ≥29px 间隙。改变画幅（如竖版）时重新布局，不拉伸。不使用窗口框（`container.enabled` false）；将来引入录屏时按原比例 contain，包装另行确认。

镜头运动作用于整个画面；本规范不预设运镜参数，每段按 [镜头推进方法](experience/镜头推进与转场.md) 的情境表判断，在出设计图前写入大段表或运动标注。

## Elevation & Depth

扁平：边框（`x-video.surfaces.borderWidth`）与遮挡区分平面层次，阴影、光照均为 none。移动对象（圆点、标签）位于面板内容层上方；接触后按面板遮挡边界归位。需要视差或三维空间时另补空间设计，不将二维缩放描述成绕到对象背面。

## Shapes

节点盒、芯片与标签用 `rounded.small`；面板与数据卡用 `rounded.card`；不使用窗口框，`rounded.container` 不适用。边框线宽 `x-video.outlineWidth`；路径线宽：实线 7px（`tertiary`）、虚线 6px（`primary`，dash 16/12）；箭头为 30×34px 实心三角。

角色分工：输入 = 感知节点（白盒）；处理 = 面板（无处理器实体）；结果 = 答案盒（白框→`success` 填充）；动作方向 = 线+箭头（实线/`tertiary` 快，虚线/`primary` 慢）。装饰倾斜上限 0°；有叙事依据的旋转或镜头滚转不受此限，但需单段说明。

## Components

| 组件 | 静态接口 | 状态与运动 | 验证重点 |
| --- | --- | --- | --- |
| 卡片（数据卡） | 引用 `card`：`surface` 底、3px `line` 边、`rounded.card`、padding 18px 28px、盒高 149px（含边框）；k/n 用 `label` 的 23px 局部值（候选A 与测试01 实测，不外推到其他文字），数字与单位用 `data-value` | 成组进入（淡入 + 10px 上浮，16f，错峰 8f）；数字 60f 计数停稳 | 计数可读、等宽数字不跳动；盒高不随内容撑开 |
| 面板 | 引用 `panel`：主方 `surface` + 3px `line` 边 / 对照方 `system` 无描边 | 进入 0.98→1 + 淡入（18f，错峰 8f） | 两面板等重，对照方不抢焦点 |
| 数据数字与单位 | 引用 `data-value`：46px 700，强调数字 `tertiary`；单位同阶同行盒、恒 `primary`（"852 篇"、"266 票"） | 2s `reveal` 曲线从 0 计数 | 千分位与 `+` 号不参与计数；单位不缩小成注释 |
| 结果标签 | 引用 `result-label`：`tertiary` 底、白字、`rounded.small`、字距 2px | 只在动作完成后出现（接触后 6f，6px 上浮） | 不抢主动作、不提前宣布成功 |
| 芯片 | 引用 `chip`：`surface` 底 2px `line` 边；强调态 `tertiary` 边 + `success` 底 | 随副题成组进入（错峰 6f） | 不挤占副题行 |
| 页脚 | 引用 `footer`：无底色、顶部 2px `line` 线、上内边距 12px、`secondary` 文字 23px 局部值；左右两栏（来源型或章位型） | 随内容帧成组进入（测试01 页脚 200-216f） | 不承载关键事实；同帧只允许一种口径 |
| 字幕 | 引用 `subtitle`：`primary` 文字 26px（body）、`surface` 4px 描边（SVG paint-order）、单行居中、文字底边 y≈1035 | 随语音出现与消失（淡入 4f／淡出 3f）；出现时页脚 8f 淡出让位 | 单行 ≤28 字、最短 1.13s；不压内容帧主体；不用阴影渐变 |
| 路径与节点 | 节点白盒 3px `line` 边 `rounded.small`；实线 7px `tertiary` 箭头 30px；虚线 6px `primary`（16/12） | 路径先绘（22f/32f）对象后发；点 10px，快路 `travel` 曲线、慢路匀速；接触脉冲 + 换态同帧 | 轨迹不先于对象完成；换态与脉冲不错帧 |

## Do's and Don'ts

- 同一对象保留身份与状态演化（两条路线共享"感知→答案"对象，答案盒接触后换态）；不用淡出旧对象+淡入新对象冒充过程。
- 用时间与轨迹表达对比（快路 18f vs 慢路 34f），不靠额外注释文字。
- 路径先于对象出发完成；状态改变与脉冲同帧发生。
- 需要阅读时（计数、末尾 2.8s 停稳）画面保持稳定。
- 不做持续漂浮、装饰弹跳和无因果的空转运动。
- 结果标签不在完成前出现；不因旁白先提到结果就提前上屏。
- 不用阴影、渐变；不新增无语义说明的颜色。
- 不用进度条变满、完成勾单独出现替代处理过程。

## Motion（视频扩展）

运动按 出现（reveal）→ 主动作（travel）→ 接触/状态改变（contact）→ 跟随（错峰）→ 停稳（hold）组织。本系列为克制风格：入场统一"淡入 + ≤20px 上浮（默认 14px）"，无预备动作（`anticipation` 为 null；将来需要时先测试再登记）。

曲线用法：出现/停稳用 `reveal`/`settle`（out cubic），对象传递用 `travel`（inOut quad），需要被看清的过程（路径绘制、生长、逐步变化）用 `process`（inOut cubic）；匀速只用于慢路线对象（"每一步都走"的表达目的成立）。一个动作保持连贯的曲线逻辑；跨镜运动匹配承接切点两侧屏幕速度，按 [镜头推进方法](experience/镜头推进与转场.md#运动匹配剪辑：共同要求只维护一次) 执行（尚未验证，见 Exceptions）。

镜头：本规范不含运镜默认值。每段先按情境表判断主体动作与观察方式，写明看向谁、落在哪里、何时停稳，再定参数；不把阅读时段的 2.8s 停稳扩大为整段固定机位。

### 校准样本

`calibration.sample` 为 [动态预览_测试01.mp4](00_系列测试/动态/动态预览_测试01.mp4)（30fps，10s）。阶段帧数、位移（SVG 坐标单位，viewBox 宽 880 → 画布约 0.89 倍）、错峰与脉冲幅度见 `x-video.motion.calibration`。这些数值供同类动作复用手感；本期动作的实际秒点以配音为准，换 fps 先换算时间再换算帧。

### 动画原则检查

| 原则 | 基于测试 01 的结论 |
| --- | --- |
| 演出布局 | 主焦点唯一：任一时刻只有一条路线/一个对象是焦点，对照方在场不抢光 |
| 关键姿势与连续动作 | 起点（感知）→变化（点移动）→结果（答案盒换态）先明确，中间由曲线补全 |
| 跟随与重叠 | JEVA 在接触后 6f 进入；芯片/面板/卡片错峰 6–8f，主次动作不同帧启动 |
| 缓入缓出 | 入场 out(cubic) 减速；传递 inOut；无突然停 |
| 时间 | 计数 60f、末尾停稳 84f（2.8s）阅读；每次主要变化 ≥12f |
| 挤压与拉伸 | 未使用（`squashStretch.enabled` false）；脉冲 1.05/1.04 只作接触反馈，不作形变 |
| 次要动作 | 脉冲只辅助接触表达，不与主动作争焦点 |

## Exceptions & Evidence（视频扩展）

`evidence.static` 与 `evidence.motion` 指向真实样本，`confirmation` 记录确认范围（见 front matter）。运动确认只覆盖测试 01 的六项；运镜、跨镜转场、角色交互未验证（本系列不用角色）。静态确认不扩展为运动确认。

固定项、变量与例外见 `x-video.fixed` / `variables` / `exceptions`；当前无单段例外。

采用前核对：front matter 引用可解析、组件使用已定义值、静态帧字号/构图/安全区与样本一致、动态样片因果/接触/遮挡/阅读已抽帧验证。未验证项如实保留：录屏层包装、运镜与运动匹配（跨帧硬切已登记为本期语言，待动态成片后复核）；字幕已确认形式并在本期实装，但尚未整片审看。
