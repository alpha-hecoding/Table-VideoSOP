import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ChapterLine, Chip, Frame} from '../../../remotion-main/src/lib/ui';
import {C, CARD, FONT_MONO} from '../../../remotion-main/src/lib/tokens';
import {EASE, enter, prog} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

const FOOT_LEFT = 'AI 情报 · 第 02 期 — GUI Agent 登顶，开源推理模型新标杆';
const FOOT_RIGHT = '三、开源生态 · 四项开源成果速览';

/** 帧收敛让位：淡出＋上浮 10px */
const converge = (f: number, start: number, dur = 16) => {
  const p = prog(f, start, dur, EASE.reveal);
  return {opacity: 1 - p, transform: `translateY(${-10 * p}px)`};
};

export const Segment: React.FC = () => {
  const f = useCurrentFrame();

  // 尾部收画面：于 finalConverge 开始 16 帧淡出上浮，预留干净画布平滑接棒 D07
  const cv = f >= EV.finalConverge ? converge(f, EV.finalConverge, 16) : {};

  // 4 张卡片分别按词点入场
  const c1 = enter(f, EV.card1Enter, {dur: 18, rise: 14});
  const c2 = enter(f, EV.card2Enter, {dur: 18, rise: 14});
  const c3 = enter(f, EV.card3Enter, {dur: 18, rise: 14});
  const c4 = enter(f, EV.card4Enter, {dur: 18, rise: 14});

  return (
    <Frame footerLeft={FOOT_LEFT} footerRight={FOOT_RIGHT}>
      <div style={{...cv, flex: 1, display: 'flex', flexDirection: 'column'}}>
        {/* 轻量章节行 */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <ChapterLine
            no="03 · "
            name="开源生态"
            tag="四个代表性项目 · 覆盖科学 / 框架 / 图像 / 本地化"
            f={f}
            start={EV.chapLine}
          />
          {f >= EV.introBadges && (
            <div style={{marginBottom: 4, display: 'flex', gap: 8}}>
              <Chip text="科学探索 · 推理框架 · 中文图像 · 区域本地化" hot={true} f={f} start={EV.introBadges} />
            </div>
          )}
        </div>

        {/* 2×2 四宫格卡片网格 */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 20,
            marginTop: 18,
            marginBottom: 12,
          }}
        >
          {/* 卡 1（左上）：Sage-A1.5（强调态） */}
          <div
            style={{
              ...CARD,
              border: `2px solid ${C.tertiary}`,
              boxShadow: '0 4px 16px rgba(242, 107, 29, 0.12)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c1,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.primary}}>
                  Sage-A1.5
                </div>
                <div style={{fontSize: 16, color: C.tertiary, background: C.success, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  上海 AI 实验室 · 科学智能
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                主打"能力组合"范式，将复杂科学探索拆解为可解释单元
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="能力组合范式" hot={true} f={f} start={EV.card1Chip1} />
                <Chip text="文献综述 ➔ 假设生成 ➔ 实验设计" f={f} start={EV.card1Flow} />
                <Chip text="科研过程步步可查" f={f} start={EV.card1Impact} />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 18,
                color: C.primary,
                lineHeight: 1.4,
              }}
            >
              <b>核心范式：</b>将复杂科研拆解为可解释、可复用的能力单元，步步留痕可追溯
            </div>
          </div>

          {/* 卡 2（右上）：DeepSeek DeepInfer */}
          <div
            style={{
              ...CARD,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c2,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.primary}}>
                  DeepSeek DeepInfer
                </div>
                <div style={{fontSize: 16, color: C.primary, background: C.system, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  DeepSeek · 推理优化框架
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                MoE 专用推理框架，专攻超大规模专家模型吞吐优化
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="预填充与解码解耦" f={f} start={EV.card2Chip1} />
                <Chip text="智能 KV 缓存管理" f={f} start={EV.card2Chip2} />
                <Chip text="推理吞吐提升 30%~50%" hot={true} f={f} start={EV.card2Impact} />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 18,
                color: C.primary,
                lineHeight: 1.4,
              }}
            >
              <b>核心机制：</b>Prefill 与 Decode 计算分离，协同高效 KV 换入换出，极致压榨硬件潜能
            </div>
          </div>

          {/* 卡 3（左下）：MOSS-Image 5B */}
          <div
            style={{
              ...CARD,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c3,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.primary}}>
                  MOSS-Image 5B
                </div>
                <div style={{fontSize: 16, color: C.primary, background: C.system, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  复旦 × 上海 AI 实验室 · 中文文生图
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                上线首日近万次下载，消费级单卡即可微调与生成
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="首日近万次下载" hot={true} f={f} start={EV.card3Chip1} />
                <Chip text="Base + 指令微调双版本" f={f} start={EV.card3Chip2} />
                <Chip text="深度中文理解" f={f} start={EV.card3Impact} />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 18,
                color: C.primary,
                lineHeight: 1.4,
              }}
            >
              <b>核心优势：</b>5B 轻量化架构兼顾高画质与低门槛，对中文成语、传统意象理解尤为精准
            </div>
          </div>

          {/* 卡 4（右下）：GoTo 27B */}
          <div
            style={{
              ...CARD,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              ...c4,
            }}
          >
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                <div style={{fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.primary}}>
                  GoTo 27B
                </div>
                <div style={{fontSize: 16, color: C.primary, background: C.system, padding: '3px 10px', borderRadius: 4, fontWeight: 700}}>
                  印尼科技巨头 GoTo · 区域本土化
                </div>
              </div>
              <div style={{fontSize: 20, color: C.secondary, marginBottom: 14}}>
                开源 27B 区域大模型，树立非通用语言本土化部署范本
              </div>
              <div style={{display: 'flex', gap: 10, flexWrap: 'wrap'}}>
                <Chip text="27B 开源大模型" f={f} start={EV.card4Chip1} />
                <Chip text="支持爪哇语等 4 种方言" f={f} start={EV.card4Chip2} />
                <Chip text="区域化本土部署范例" hot={true} f={f} start={EV.card4Impact} />
              </div>
            </div>

            <div
              style={{
                background: C.canvas,
                border: `1px solid ${C.line}`,
                borderRadius: 6,
                padding: '12px 16px',
                fontSize: 18,
                color: C.primary,
                lineHeight: 1.4,
              }}
            >
              <b>标杆价值：</b>覆盖小语种与区域方言，为全球非英语/中文市场的本地私有化落地铺平道路
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
};

export default Segment;
