import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

// ===== 设计 token：与静态候选A一致（00_系列测试/静态/候选A_暖奶油对齐参考/design.html） =====
const C = {
  bg: '#F9F2E0',
  ink: '#3E4A5A',
  inkSoft: '#7C8797',
  accent: '#F26B1D',
  panel: '#FFFFFF',
  panelBlue: '#DEE5EC',
  panelOrange: '#FCE8D4',
  line: '#AEBAC7',
} as const;

const F_ZH = "'Noto Sans CJK SC', sans-serif";
const F_MONO = "'JetBrains Mono NF', monospace";

// ===== 秒点（30fps，总 300 帧）：入场 → 双路对比 → 数据计数 → 结果停稳 =====
// 每项为 [起始帧, 结束帧]，曲线在用法处注明
const T = {
  brand: [0, 18],
  kicker: [6, 22],
  h1: [10, 30],
  underline: [18, 34],
  sub: [22, 38],
  chip1: [28, 42],
  chip2: [34, 48],
  panelL: [34, 52],
  panelR: [42, 60],
  ptL: [44, 58],
  ptR: [50, 64],
  sensL: [46, 60],
  lineL: [48, 70],
  ansL: [56, 70],
  capL: [52, 66],
  arrowL: [64, 72],
  dotL: [70, 88],
  contactL: [88, 100],
  jeva: [94, 108],
  pathR: [52, 84],
  dotR: [84, 118],
  contactR: [118, 130],
  arrowR: [78, 86],
  sensR: [48, 62],
  ansR: [58, 72],
  capR2: [120, 134],
  card0: [126, 142],
  card1: [134, 150],
  card2: [142, 158],
  count: [140, 200],
  footer: [200, 216],
} as const;

// ===== 工具 =====
const cl = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

// 克制的入场：淡入 + 上浮（默认 14px）
function rise(f: number, range: readonly [number, number], y = 14) {
  const t = interpolate(f, [...range] as [number, number], [0, 1], {
    ...cl,
    easing: Easing.out(Easing.cubic),
  });
  return {opacity: t, transform: `translateY(${(1 - t) * y}px)`};
}

function fade(f: number, range: readonly [number, number]) {
  return interpolate(f, [...range] as [number, number], [0, 1], cl);
}

// 右面板折线（与静态 svg 一致，viewBox 0 0 880 150），x 单调不减
const PTS: [number, number][] = [
  [180, 75],
  [300, 75],
  [300, 30],
  [420, 30],
  [420, 110],
  [540, 110],
  [540, 75],
  [660, 75],
];
const PATH_R = 'M180 75 H300 V30 H420 V110 H540 V75 H660';
const segLen = (a: [number, number], b: [number, number]) =>
  Math.hypot(b[0] - a[0], b[1] - a[1]);
const TOTAL = PTS.slice(1).reduce((s, p, i) => s + segLen(PTS[i], p), 0);

// t∈[0,1] → 折线上的点（按弧长参数化）
function pointAt(t: number): [number, number] {
  let d = t * TOTAL;
  for (let i = 1; i < PTS.length; i++) {
    const l = segLen(PTS[i - 1], PTS[i]);
    if (d <= l) {
      const r = l === 0 ? 0 : d / l;
      return [
        PTS[i - 1][0] + (PTS[i][0] - PTS[i - 1][0]) * r,
        PTS[i - 1][1] + (PTS[i][1] - PTS[i - 1][1]) * r,
      ];
    }
    d -= l;
  }
  return PTS[PTS.length - 1];
}

const chipBase: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 26,
  padding: '6px 18px',
  borderRadius: 10,
  border: `2px solid ${C.line}`,
  color: C.ink,
  background: C.panel,
};

export const MotionTest: React.FC = () => {
  const f = useCurrentFrame();

  // 入场
  const sBrand = rise(f, T.brand);
  const sDate = {opacity: fade(f, [4, 18] as const)};
  const sKicker = rise(f, T.kicker, 10);
  const sH1 = rise(f, T.h1, 20);
  const underlineW = interpolate(f, [...T.underline] as [number, number], [0, 120], {
    ...cl,
    easing: Easing.out(Easing.cubic),
  });
  const sSub = rise(f, T.sub);
  const sChip1 = rise(f, T.chip1);
  const sChip2 = rise(f, T.chip2);

  // 面板：淡入 + 0.98→1
  const panelStyle = (range: readonly [number, number]) => {
    const t = interpolate(f, [...range] as [number, number], [0, 1], {
      ...cl,
      easing: Easing.out(Easing.cubic),
    });
    return {
      opacity: t,
      transform: `scale(${0.98 + 0.02 * t})`,
      transformOrigin: 'top center',
    };
  };

  // 左面板：快速直觉
  const lineLx2 = interpolate(f, [...T.lineL] as [number, number], [210, 600], {
    ...cl,
    easing: Easing.out(Easing.cubic),
  });
  const dotLx = interpolate(f, [...T.dotL] as [number, number], [215, 612], {
    ...cl,
    easing: Easing.inOut(Easing.quad),
  });
  const dotLOp = interpolate(
    f,
    [T.dotL[0], T.dotL[0] + 4, T.dotL[1], T.dotL[1] + 6],
    [0, 1, 1, 0],
    cl,
  );
  // 接触反馈：f>=88 起 0.05 脉冲；f>=92 盒子离散换态（白框→浅橙框，与静态终帧一致）
  const pulseL =
    1 + 0.05 * Math.sin(Math.PI * Math.min(1, Math.max(0, (f - T.contactL[0]) / 12)));
  const stateL = f >= 92;

  // 右面板：慢速反思
  const pathT = interpolate(f, [...T.pathR] as [number, number], [0, 1], {
    ...cl,
    easing: Easing.inOut(Easing.cubic),
  });
  // 匀速推进，强调"每一步都走"
  const dotRT = Math.min(1, Math.max(0, (f - T.dotR[0]) / (T.dotR[1] - T.dotR[0])));
  const [dotRx, dotRy] = pointAt(dotRT);
  const dotROp = interpolate(
    f,
    [T.dotR[0], T.dotR[0] + 4, T.dotR[1], T.dotR[1] + 6],
    [0, 1, 1, 0],
    cl,
  );
  const pulseR =
    1 + 0.04 * Math.sin(Math.PI * Math.min(1, Math.max(0, (f - T.contactR[0]) / 12)));
  const contactRActive = f >= T.contactR[0] && f < T.contactR[1] + 4;

  // 数据计数
  const cNum = (target: number) =>
    Math.round(
      interpolate(f, [...T.count] as [number, number], [0, target], {
        ...cl,
        easing: Easing.out(Easing.cubic),
      }),
    );

  // 页脚
  const footW = interpolate(f, [...T.footer] as [number, number], [0, 100], {
    ...cl,
    easing: Easing.out(Easing.cubic),
  });
  const footOp = fade(f, [T.footer[0] + 4, T.footer[1]] as const);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        fontFamily: F_ZH,
        color: C.ink,
        padding: '60px 88px 44px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 顶栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          ...sBrand,
        }}
      >
        <div style={{fontSize: 44, fontWeight: 700, letterSpacing: 2}}>
          AI 情报
          <span
            style={{
              fontFamily: F_MONO,
              color: C.accent,
              fontSize: 28,
              marginLeft: 16,
              fontWeight: 700,
            }}
          >
            EP.01
          </span>
        </div>
        <div style={{fontFamily: F_MONO, fontSize: 26, color: C.inkSoft, ...sDate}}>
          2026.10.15 · AI DAILY
        </div>
      </div>

      {/* kicker */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginTop: 28,
          ...sKicker,
        }}
      >
        <div style={{width: 18, height: 18, background: C.accent}} />
        <span style={{fontSize: 30, color: C.inkSoft, letterSpacing: 4}}>
          Agent 架构与范式
        </span>
      </div>

      {/* 标题区 */}
      <div style={{marginTop: 10, ...sH1}}>
        <h1
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: 3,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          System One 范式崛起
        </h1>
        <div style={{height: 10, marginTop: 14, background: C.accent, width: underlineW}} />
      </div>
      <div style={{marginTop: 16, fontSize: 30, color: C.inkSoft, ...sSub}}>
        Jeva：
        <span style={{color: C.ink, fontWeight: 700}}>
          System One Models from First Principles
        </span>
        {' · '}新加坡国立大学
        <span style={{display: 'inline-flex', gap: 14, marginLeft: 26}}>
          <span style={{...chipBase, ...sChip1}}>HuggingFace 266 票</span>
          <span
            style={{
              ...chipBase,
              border: `2px solid ${C.accent}`,
              background: C.panelOrange,
              color: C.accent,
              fontWeight: 700,
              ...sChip2,
            }}
          >
            今日 Top 1
          </span>
        </span>
      </div>

      {/* 中部对比 */}
      <div style={{display: 'flex', gap: 40, marginTop: 32, flex: 1}}>
        {/* 左：System 1 */}
        <div
          style={{
            flex: 1,
            background: C.panel,
            border: `3px solid ${C.line}`,
            borderRadius: 16,
            padding: '26px 34px',
            ...panelStyle(T.panelL),
          }}
        >
          <div style={{display: 'flex', alignItems: 'baseline', gap: 16, ...rise(f, T.ptL, 8)}}>
            <h2 style={{fontSize: 42, fontWeight: 700, margin: 0}}>快速直觉</h2>
            <span style={{fontFamily: F_MONO, fontSize: 28, color: C.inkSoft}}>
              System 1
            </span>
            <span style={{fontFamily: F_MONO, color: C.accent, fontSize: 46, fontWeight: 700}}>
              ?
            </span>
          </div>
          <div style={{fontSize: 24, color: C.inkSoft, marginTop: 4, opacity: fade(f, T.capL)}}>
            一眼看穿的即时推理
          </div>
          <svg
            style={{display: 'block', marginTop: 16, width: '100%'}}
            height={120}
            viewBox="0 0 880 150"
            preserveAspectRatio="xMinYMid meet"
          >
            <g style={{opacity: fade(f, T.sensL)}}>
              <rect x={20} y={45} width={180} height={60} rx={12} fill="#fff" stroke={C.line} strokeWidth={3} />
              <text x={110} y={84} fontSize={30} textAnchor="middle" fill={C.ink} fontFamily={F_ZH}>
                感知
              </text>
            </g>
            <line x1={210} y1={75} x2={lineLx2} y2={75} stroke={C.accent} strokeWidth={7} />
            <polygon points="600,75 570,58 570,92" fill={C.accent} style={{opacity: fade(f, T.arrowL)}} />
            <g
              style={{
                opacity: fade(f, T.ansL),
                transform: `scale(${pulseL})`,
                transformOrigin: '720px 75px',
              }}
            >
              <rect
                x={620}
                y={45}
                width={200}
                height={60}
                rx={12}
                fill={stateL ? C.panelOrange : '#fff'}
                stroke={stateL ? C.accent : C.line}
                strokeWidth={stateL ? 4 : 3}
              />
              <text
                x={720}
                y={84}
                fontSize={30}
                textAnchor="middle"
                fill={stateL ? C.accent : C.ink}
                fontWeight={stateL ? 700 : 400}
                fontFamily={F_ZH}
              >
                答案
              </text>
            </g>
            <circle cx={dotLx} cy={75} r={10} fill={C.accent} style={{opacity: dotLOp}} />
          </svg>
          <span
            style={{
              display: 'inline-block',
              marginTop: 12,
              background: C.accent,
              color: '#fff',
              fontSize: 22,
              fontWeight: 700,
              padding: '5px 18px',
              borderRadius: 10,
              letterSpacing: 2,
              ...rise(f, T.jeva, 6),
            }}
          >
            JEVA
          </span>
        </div>

        {/* 右：System 2 */}
        <div
          style={{
            flex: 1,
            background: C.panelBlue,
            borderRadius: 16,
            padding: '26px 34px',
            ...panelStyle(T.panelR),
          }}
        >
          <div style={{display: 'flex', alignItems: 'baseline', gap: 16, ...rise(f, T.ptR, 8)}}>
            <h2 style={{fontSize: 42, fontWeight: 700, margin: 0}}>慢速反思</h2>
            <span style={{fontFamily: F_MONO, fontSize: 28, color: C.inkSoft}}>
              System 2
            </span>
            <span style={{fontFamily: F_MONO, color: C.accent, fontSize: 46, fontWeight: 700}}>
              ?
            </span>
          </div>
          <div
            style={{
              fontSize: 24,
              color: C.inkSoft,
              marginTop: 4,
              opacity: fade(f, [T.capL[0] + 8, T.capL[1] + 8] as const),
            }}
          >
            传统 CoT 慢思考路径
          </div>
          <svg
            style={{display: 'block', marginTop: 16, width: '100%'}}
            height={120}
            viewBox="0 0 880 150"
            preserveAspectRatio="xMinYMid meet"
          >
            <g style={{opacity: fade(f, T.sensR)}}>
              <rect x={20} y={45} width={150} height={60} rx={12} fill="#fff" stroke={C.line} strokeWidth={3} />
              <text x={95} y={84} fontSize={28} textAnchor="middle" fill={C.ink} fontFamily={F_ZH}>
                感知
              </text>
            </g>
            {/* 虚线路径按 x 方向渐进揭示（路径 x 单调不减） */}
            <clipPath id="revealR">
              <rect x={180} y={0} width={480 * pathT} height={150} />
            </clipPath>
            <g clipPath="url(#revealR)">
              <path d={PATH_R} fill="none" stroke={C.ink} strokeWidth={6} strokeDasharray="16 12" />
            </g>
            <polygon points="690,75 660,58 660,92" fill={C.ink} style={{opacity: fade(f, T.arrowR)}} />
            <g
              style={{
                opacity: fade(f, T.ansR),
                transform: `scale(${pulseR})`,
                transformOrigin: '780px 75px',
              }}
            >
              <rect
                x={700}
                y={45}
                width={160}
                height={60}
                rx={12}
                fill="#fff"
                stroke={contactRActive ? C.ink : C.line}
                strokeWidth={contactRActive && f < T.contactR[0] + 6 ? 5 : 3}
              />
              <text x={780} y={84} fontSize={28} textAnchor="middle" fill={C.ink} fontFamily={F_ZH}>
                答案
              </text>
            </g>
            <circle cx={dotRx} cy={dotRy} r={10} fill={C.ink} style={{opacity: dotROp}} />
          </svg>
          <div style={{fontSize: 24, color: C.inkSoft, marginTop: 10, ...rise(f, T.capR2, 8)}}>
            多步推导 · 更慢但更稳
          </div>
        </div>
      </div>

      {/* 底部数据 */}
      <div style={{display: 'flex', gap: 32, marginTop: 22}}>
        {(
          [
            {
              range: T.card0,
              k: 'NeurIPS 2026 收录论文',
              v: (
                <>
                  <em style={{fontStyle: 'normal', color: C.accent}}>
                    {cNum(9000).toLocaleString('en-US')}+
                  </em>{' '}
                  篇
                </>
              ),
              n: '历史新高',
            },
            {
              range: T.card1,
              k: 'arXiv cs.AI 新论文（10/14）',
              v: (
                <>
                  {cNum(852)} 篇
                </>
              ),
              n: '持续活跃',
            },
            {
              range: T.card2,
              k: 'HuggingFace 热门论文',
              v: (
                <>
                  Jeva <em style={{fontStyle: 'normal', color: C.accent}}>{cNum(266)}</em> 票
                </>
              ),
              n: '今日第一名',
            },
          ] as const
        ).map((c, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: C.panel,
              border: `3px solid ${C.line}`,
              borderRadius: 16,
              padding: '18px 28px',
              ...rise(f, c.range, 10),
            }}
          >
            <div style={{fontSize: 23, color: C.inkSoft}}>{c.k}</div>
            <div
              style={{
                fontFamily: F_MONO,
                fontSize: 46,
                fontWeight: 700,
                color: C.ink,
                marginTop: 2,
                lineHeight: 1.1,
              }}
            >
              {c.v}
            </div>
            <div style={{fontSize: 23, color: C.inkSoft, marginTop: 2}}>{c.n}</div>
          </div>
        ))}
      </div>

      {/* 页脚 */}
      <div style={{marginTop: 18}}>
        <div style={{height: 2, background: C.line, width: `${footW}%`}} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 12,
            fontSize: 23,
            color: C.inkSoft,
            opacity: footOp,
          }}
        >
          <span>AI 情报 · 第 01 期 — System One 范式崛起，Agent 架构迎来反思革命</span>
          <span>来源：arXiv · HuggingFace</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
