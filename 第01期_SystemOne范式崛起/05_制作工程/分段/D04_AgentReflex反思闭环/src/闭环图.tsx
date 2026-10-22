// D04 闭环流程图：6 节点环形（感知→规划→行动→观察结果→反思模块→策略更新）＋回环线（策略更新→规划）
// 几何＝已确认设计图 03_视觉设计/D04_AgentReflex反思闭环/设计图_design.html，SVG viewBox 0 0 1744 620
//   与 viewBox 内坐标／盒尺寸／字号逐值照抄（_work/measure.json 实测：节点 190x64、回环线 bbox 352,187–1317,364）。
// R2：节点顺序、回环方向、反思模块位置严格照定稿原稿架构图 §2.1，不增删节点。
// 运动＝动态测试01 已确认语言：节点淡入＋10px 上浮 16f；链路沿线生长 22f（reveal）；
//   圆点 travel（inOut quad）；接触脉冲 1.05（12f，与到达同帧）；回环线生长 30f（process，inOut cubic）
//   ＋闭合脉冲同帧。纪律：路径先于对象出发完成；任一时刻 tertiary 焦点唯一（入场期＝正在生长的链路／圆点）。
import React from 'react';
import {C, FONT_MONO, FONT_ZH, GRAPHIC, OUTLINE, ROUNDED} from '../../../remotion-main/src/lib/tokens';
import {EASE, contactPulse, drawPath, enter, prog, travel} from '../../../remotion-main/src/lib/motion';
import {EV} from './秒点';

// 淡入（线性，同测试01 fade）
const fade = (f: number, start: number, dur: number) => prog(f, start, dur, EASE.linear);

type Pt = [number, number];
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

// 正向链路端点（＝设计图 <line> 逐值）
const LINES: {p1: Pt; p2: Pt; arrow: string; start: number}[] = [
  {p1: [447, 140], p2: [1277, 140], arrow: '1277,140 1247,123 1247,157', start: EV.L1}, // 感知→规划
  {p1: [1392, 172], p2: [1392, 273], arrow: '1392,273 1375,243 1409,243', start: EV.L2}, // 规划→行动
  {p1: [1392, 357], p2: [1392, 458], arrow: '1392,458 1375,428 1409,428', start: EV.L3}, // 行动→观察结果
  {p1: [1297, 510], p2: [467, 510], arrow: '467,510 497,493 497,527', start: EV.L4}, // 观察结果→反思模块
  {p1: [352, 478], p2: [352, 377], arrow: '352,377 335,407 369,407', start: EV.L5}, // 反思模块→策略更新
];

// 回环线（策略更新→规划）：设计图 #loopArc 的三次贝塞尔；长度按曲线采样实测（供 strokeDashoffset 生长）
const ARC_C: Pt[] = [
  [352, 293],
  [700, 420],
  [1150, 370],
  [1316.5, 186.8],
];
const ARC_D = `M ${ARC_C[0][0]},${ARC_C[0][1]} C ${ARC_C[1][0]},${ARC_C[1][1]} ${ARC_C[2][0]},${ARC_C[2][1]} ${ARC_C[3][0]},${ARC_C[3][1]}`;
const cubicAt = (t: number): Pt => {
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [
    ARC_C.reduce((s, p, i) => s + p[0] * w[i], 0),
    ARC_C.reduce((s, p, i) => s + p[1] * w[i], 0),
  ];
};
const ARC_LEN = (() => {
  let len = 0;
  let prev = cubicAt(0);
  for (let i = 1; i <= 400; i++) {
    const p = cubicAt(i / 400);
    len += dist(prev, p);
    prev = p;
  }
  return len;
})();

// 圆点路线（＝L3＋L4 的连线，绕过观察结果盒）：行动底边 → 观察结果 → 反思模块右边缘
const DOT_PTS: Pt[] = [
  [1392, 357],
  [1392, 510],
  [447, 510],
];
const DOT_TOTAL = DOT_PTS.slice(1).reduce((s, p, i) => s + dist(DOT_PTS[i], p), 0); // 1098 SVG 单位
const dotPoint = (t: number): Pt => {
  let d = t * DOT_TOTAL;
  for (let i = 1; i < DOT_PTS.length; i++) {
    const l = dist(DOT_PTS[i - 1], DOT_PTS[i]);
    if (d <= l) {
      const r = l === 0 ? 0 : d / l;
      return [
        DOT_PTS[i - 1][0] + (DOT_PTS[i][0] - DOT_PTS[i - 1][0]) * r,
        DOT_PTS[i - 1][1] + (DOT_PTS[i][1] - DOT_PTS[i - 1][1]) * r,
      ];
    }
    d -= l;
  }
  return DOT_PTS[DOT_PTS.length - 1];
};
// 圆点：起 4f 淡入、接触后 6f 淡出（测试01 dotL／dotR）
const dotOpacity = (f: number) => {
  if (f < EV.dot) return 0;
  if (f < EV.dot + 4) return (f - EV.dot) / 4;
  if (f <= EV.contact) return 1;
  if (f < EV.contact + 6) return 1 - (f - EV.contact) / 6;
  return 0;
};

type NodeSpec = {
  label: string;
  x: number;
  y: number;
  start: number;
  hot?: boolean; // 反思模块＝入场强调态（4px tertiary 边＋success 底），终态保留
};
// 节点顺序＝原稿架构图 ①–⑥（R2，不增删）
const NODES: NodeSpec[] = [
  {label: '感知', x: 257, y: 108, start: EV.nGanZhi},
  {label: '规划', x: 1297, y: 108, start: EV.nGuiHua},
  {label: '行动', x: 1297, y: 293, start: EV.nXingDong},
  {label: '观察结果', x: 1297, y: 478, start: EV.nGuanCha},
  {label: '反思模块', x: 257, y: 478, start: EV.nFanSi, hot: true},
  {label: '策略更新', x: 257, y: 293, start: EV.nCeLue},
];

export const 闭环图: React.FC<{f: number}> = ({f}) => {
  const arcP = prog(f, EV.arc, EV.arcDur, EASE.process);
  const [dotX, dotY] = dotPoint(travel(f, EV.dot, EV.dotDur, 0, 1));
  const dotA = dotOpacity(f);

  return (
    <svg width={1744} height={620} viewBox="0 0 1744 620" style={{display: 'block'}}>
      {/* 正向链路：沿线生长 22f（tertiary 7px＝GRAPHIC.pathFast）；箭头在路径完成前 6f 出现 */}
      <g stroke={GRAPHIC.pathFast.stroke} strokeWidth={GRAPHIC.pathFast.width} fill="none">
        {LINES.map((l, i) => {
          const len = dist(l.p1, l.p2);
          return (
            <line
              key={`L${i}`}
              x1={l.p1[0]}
              y1={l.p1[1]}
              x2={l.p2[0]}
              y2={l.p2[1]}
              strokeDasharray={len}
              strokeDashoffset={drawPath(f, l.start, 22, len, EASE.reveal)}
            />
          );
        })}
      </g>
      <g fill={C.tertiary}>
        {LINES.map((l, i) => (
          <polygon key={`A${i}`} points={l.arrow} style={{opacity: fade(f, l.start + 16, 8)}} />
        ))}
      </g>

      {/* 节点：白盒 3px line 边 rounded.small；反思模块入场即强调态并保留 */}
      {NODES.map((n) => {
        const e = enter(f, n.start, {dur: 16, rise: 10});
        const pulse = n.label === '规划' ? contactPulse(f, EV.close, 1.05) : n.label === '反思模块' ? contactPulse(f, EV.contact, 1.05) : 1;
        const cx = n.x + 95;
        const cy = n.y + 32;
        return (
          <g
            key={n.label}
            style={{
              ...e,
              transform: `${e.transform} scale(${pulse})`,
              transformOrigin: `${cx}px ${cy}px`,
            }}
          >
            <rect
              x={n.x}
              y={n.y}
              width={190}
              height={64}
              rx={ROUNDED.small}
              fill={n.hot ? C.success : C.surface}
              stroke={n.hot ? C.tertiary : C.line}
              strokeWidth={n.hot ? 4 : OUTLINE}
            />
            <text
              x={cx}
              y={n.y + 42}
              fontSize={30}
              fontWeight={n.hot ? 700 : 400}
              textAnchor="middle"
              fill={n.hot ? C.tertiary : C.primary}
              fontFamily={FONT_ZH}
            >
              {n.label}
            </text>
          </g>
        );
      })}

      {/* 回环线：策略更新→规划（沿已有节点边的新路径实例；process 30f，完成帧＝闭合脉冲同帧）。
          绘制顺序照设计图：弧在节点之上（起点压过策略更新盒上缘），不另立层级。 */}
      <path
        d={ARC_D}
        fill="none"
        stroke={GRAPHIC.pathFast.stroke}
        strokeWidth={GRAPHIC.pathFast.width}
        strokeDasharray={ARC_LEN}
        strokeDashoffset={ARC_LEN * (1 - arcP)}
      />
      <polygon points="1316.5,186.8 1308.9,220.4 1283.7,197.6" fill={C.tertiary} style={{opacity: fade(f, EV.close - 6, 8)}} />

      {/* 环心：REFLEX＋闭环 4 词（原稿 Reflex 机制句原文） */}
      <g style={enter(f, EV.reflex, {dur: 16, rise: 10})} textAnchor="middle">
        <text
          x={872}
          y={430}
          fontFamily={FONT_MONO}
          fontSize={30}
          fontWeight={700}
          letterSpacing={4}
          fill={C.tertiary}
        >
          REFLEX
        </text>
      </g>
      <g style={enter(f, EV.reflex4, {dur: 16, rise: 10})} textAnchor="middle">
        <text x={872} y={480} fontSize={30} fill={C.primary} fontFamily={FONT_ZH}>
          行动 → 观察 → 反思 → 调整策略
        </text>
      </g>

      {/* 圆点（tertiary 10px）：沿 行动→观察结果→反思模块 推进；到达与脉冲同帧，之后 6f 淡出。最后绘制＝在最上层 */}
      <circle cx={dotX} cy={dotY} r={GRAPHIC.dot} fill={C.tertiary} style={{opacity: dotA}} />
    </svg>
  );
};

