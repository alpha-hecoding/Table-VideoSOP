# 主工程 · AI情报 第01期（总控维护）

1920×1080 @ 30fps。本目录只做**排点、共享实现、总装与重渲染**；每段的画面实现在自己的专属目录里，不在本目录写段内代码。

## 分段要做什么

只改一个文件：`../../分段/D0X_<段名>/src/Segment.tsx`（总控已放占位桩）。

- 默认导出一个组件，渲染整帧内容（用 `<Frame>` 外壳，别自己画画布）。
- `useCurrentFrame()` 返回**局部帧**：0＝本段第一帧，与运动标注的秒点同一时基。段帧数＝该段配音帧数（见 `src/segments.ts`）。
- 秒点＝运动标注事件帧，按 `02_配音/配音说明.md` 句级锚点重排后写死在组件里；不要读全片 F0。
- 共享实现只读引用（不要复制一份到段内）：
  `import {Frame, DataCard, Chip, Panel, ResultLabel, ChapterLine} from '../../../remotion-main/src/lib/ui'`
  `import {C, TYPE, SPACE, ROUNDED, SAFE, GRAPHIC} from '../../../remotion-main/src/lib/tokens'`
  `import {enter, enterPanel, stagger, countTo, drawPath, contactPulse, travel, travelLinear, EASE} from '../../../remotion-main/src/lib/motion'`
- 段目录里的 `node_modules` 是指向本目录 `node_modules` 的软链（同一份 React，别在段内 `pnpm install`）。

## 预览（分段自己跑，输出写到自己目录）

在本目录执行，输出路径指向分段专属目录：

```bash
npx remotion still D03 ../../分段/D03_前沿模型速览/_work/预览_f1200.png --frame=1200
npx remotion studio          # 时间轴上看整段；只抽关键帧，不做整段重渲染
```

整段重渲染（`render`）由总控在接入后执行；分段需要交整段预览时，输出到 `../../分段/D0X/_work/`，并在接入说明里写清帧范围与已实现的事件帧。

## 槽位与排点

`src/segments.ts` 是排点唯一来源（对应 `05_制作工程/总装排点.md` v2）：`f0`、`dur`、留白（默认 `GAP=15`，D01→D02＝40f）。改留白只改这里并重算 `f0`，各段内部秒点不受影响。

`src/Root.tsx` 注册 9 个分段 Composition（`D01`–`D09`，各带本段配音）＋ `Full` 总装（13198f≈439.9s，含 9 条配音轨）。分段不改这两个文件；需要改排点或加轨道，写接入说明交总控。

配音经 `public/audio/D0X.wav` **硬链**到 `02_配音/采用/D0X_配音.wav`（ASCII 名，避免 URL 编码问题）。2026-10-20 由软链改硬链：webpack 打包 `public/` 时不跟随软链，`remotion render` 取 `staticFile('audio/D0X.wav')` 会 404（`still` 不读音频所以此前没暴露）。换配音＝重新硬链一次（`ln 新wav public/audio/D0X.wav`），不要只改链接目标。同理，`public/` 下任何经 `staticFile()` 引用的资源（音频、图片、字体、字幕 json）都用硬链或实体文件、不用软链；这类坑 `still` 不暴露，交付前用一次整段 `remotion render` 或 `ffprobe` 兜底确认。

## 已验证（2026-10-19）

- `npx tsc --noEmit` 通过（含 `../分段` 下的段内文件）。
- `npx remotion compositions` 列出 10 个槽位，时长与总装排点逐段一致。
- `npx remotion still D01 --frame=400` 与 `still Full --frame=3000` 成功，输出 1920×1080；`Full` 第 3000 帧落在 D03 局部帧 808，说明 F0 与局部帧换算正确。样张在 `_smoke/`。
- 字体：Noto Sans CJK SC ＋ JetBrains Mono NF 正常渲染（无豆腐块）。

## 未验证 / 待办

- 顶栏取值（系列名 44px／EP 28px／日期 26px／字距 2px）来自候选A 实测，DESIGN 尚未登记为组件——期末复盘统一补，段内不要各自改。
- `Full` 的转场目前全是硬切（本期已确认语言）；字幕轨、封面帧、片尾停稳档位在字幕形式确认后由总控加。

## 字幕层

`src/lib/subtitles.ts` 是生成物，不要手改；改规则改 `05_制作工程/scripts/字幕切句.py` 后重跑。

时序来源优先级（2026-10-20 重锚）＝**各分段 `../分段/D0X_*/src/秒点.ts` 注释里的实测词组／句级边界** → 配音语音段实测边界 → `02_配音/原始/D0X_原始.vtt`。edge-tts 的 VTT 只有句级且止点系统性偏短 0.5–1.0s，所以不能只靠它。

**改秒点＝改字幕**：秒点表里保留 `「词组」`＋`秒｜f帧` 的写法即可被脚本定位；`（VTT …）` 对照值、`（…估算…）` 与「尾静音」会被自动剔除。改完交总控重跑脚本，段内不要自己算 cue 帧号。

对照开关：`--no-anchor` 跳过秒点锚、`--no-reanchor` 再跳过语音段层，两个都给＝纯 VTT（复现 2026-10-19 那版 178 条）。旧产物备份在 `05_制作工程/字幕/上一版_2026-10-19_VTT时序/`。
- 音效／配乐未选用；若启用，总控另加轨道，段内不埋音效。
