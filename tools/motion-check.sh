#!/usr/bin/env bash
# 动态自检：把一段渲染结果变成少量可看的证据。
# 输出：一张总览拼图、连续静止区间统计、可选的密集帧条带。
# 只定位可疑区间供人工/Agent 查看，永不作为通过与否的判定。
#
# 用法示例：
#   bash tools/motion-check.sh --video 'renders/D01_sample.mp4' \
#     --outdir '_work/motion-check/D01_v01' --range 2.5-4.2 --range 6.5-7.5
#
# 依赖：PATH 中的 ffmpeg 与 ffprobe；awk、head、tr 等 POSIX 常用工具。
# 输出：-outdir 内的 overview.png、strip_NN_<起>-<止>.png、summary.txt、summary.json 与 _filters/。
# 同名输出会被覆盖，不删除任何已有文件；每个版本建议使用新的输出目录。
set -euo pipefail
export LC_ALL=C

# ---------- 参数 ----------
VIDEO=''
OUTDIR=''
ranges=()
CELLS=48
STILLMIN='0.75'
NOISE='-55dB'
FLAG='2.0'
STRIP_FPS=10
STRIP_MAX_CELLS=50

usage() {
  cat <<'EOF'
用法: motion-check.sh --video <视频> --outdir <输出目录> [选项]

必填:
  -V, --video <路径>      待检查的视频文件
  -O, --outdir <目录>     输出目录（不存在则创建）

可选:
  -R, --range <起-止>     密集帧条带区间，可重复，例如 2.5-4.2
  -c, --cells <整数>      总览格数，默认 48
      --still-min <秒>    静止判定最小时长，默认 0.75
      --noise <阈值>      freezedetect 噪点阈值，默认 -55dB
      --flag-seconds <秒> 标记静止区间的最小秒数，默认 2.0
      --strip-fps <帧率>  条带采样帧率上限，默认 10
      --strip-max-cells   条带最大格数，默认 50
      --font <路径>       时间码字体（也可用环境变量 MOTION_CHECK_FONT）
  -h, --help              显示本帮助
EOF
}

die() { echo "错误: $*" >&2; exit 1; }
warn() { echo "警告: $*" >&2; }

while [ $# -gt 0 ]; do
  case "$1" in
    -V|--video)            [ $# -ge 2 ] || die "$1 缺少参数"; VIDEO="$2"; shift 2 ;;
    -O|--outdir)           [ $# -ge 2 ] || die "$1 缺少参数"; OUTDIR="$2"; shift 2 ;;
    -R|--range)            [ $# -ge 2 ] || die "$1 缺少参数"; ranges+=("$2"); shift 2 ;;
    -c|--cells)            [ $# -ge 2 ] || die "$1 缺少参数"; CELLS="$2"; shift 2 ;;
    --still-min)           [ $# -ge 2 ] || die "$1 缺少参数"; STILLMIN="$2"; shift 2 ;;
    --noise)               [ $# -ge 2 ] || die "$1 缺少参数"; NOISE="$2"; shift 2 ;;
    --flag-seconds)        [ $# -ge 2 ] || die "$1 缺少参数"; FLAG="$2"; shift 2 ;;
    --strip-fps)           [ $# -ge 2 ] || die "$1 缺少参数"; STRIP_FPS="$2"; shift 2 ;;
    --strip-max-cells)     [ $# -ge 2 ] || die "$1 缺少参数"; STRIP_MAX_CELLS="$2"; shift 2 ;;
    --font)                [ $# -ge 2 ] || die "$1 缺少参数"; FONT="$2"; shift 2 ;;
    -h|--help)             usage; exit 0 ;;
    *) die "未知参数: $1（-h 查看帮助）" ;;
  esac
done

[ -n "$VIDEO" ]  || die "缺少 --video"
[ -n "$OUTDIR" ] || die "缺少 --outdir"

# ---------- 前置检查 ----------
for tool in ffmpeg ffprobe awk; do
  command -v "$tool" >/dev/null 2>&1 || die "PATH 中找不到 $tool"
done
[ -f "$VIDEO" ] || die "找不到视频: $VIDEO"

mkdir -p -- "$OUTDIR"
OUTDIR="$(cd -- "$OUTDIR" && pwd)"
FILTER_DIR="$OUTDIR/_filters"
mkdir -p -- "$FILTER_DIR"

# 临时工作区（只清理自己创建的文件）
TMP="$(mktemp -d)"
trap 'rm -rf -- "$TMP"' EXIT

# 读取时长（秒）
dur_text="$(ffprobe -v error -show_entries format=duration -of csv=p=0 -- "$VIDEO" | head -n 1 | tr -d '[:space:]')"
awk -v d="$dur_text" 'BEGIN{ if (d+0 <= 0) exit 1 }' 2>/dev/null \
  || die "无法读取时长: $VIDEO"
DUR="$dur_text"

# ---------- 时间码字体（跨平台探测） ----------
FONT="${FONT:-${MOTION_CHECK_FONT:-}}"
if [ -z "$FONT" ]; then
  for f in \
    /usr/share/fonts/truetype/dejavu/DejaVuSans.ttf \
    /usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf \
    /usr/share/fonts/truetype/freefont/FreeSans.ttf \
    /System/Library/Fonts/Supplemental/Arial.ttf \
    "C:/Windows/Fonts/arial.ttf"; do
    if [ -f "$f" ]; then FONT="$f"; break; fi
  done
fi
LABEL=''
if [ -n "$FONT" ]; then
  # drawtext 滤镜中对冒号与反斜杠转义
  esc="${FONT//\\/\\\\}"
  esc="${esc//:/\\:}"
  LABEL=",drawtext=fontfile='${esc}':text='%{pts\:hms}':x=6:y=6:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.7"
else
  warn "未找到可用字体，省略时间码"
fi

# 生成一张拼图：filter 文本存入 _filters/ 便于复现
make_sheet() { # $1=滤镜串  $2=输出 png
  local base out
  base="$(basename -- "$2")"; base="${base%.png}"
  printf '%s' "$1" > "$FILTER_DIR/$base.txt"
  if ! ffmpeg -hide_banner -loglevel error -y -i "$VIDEO" \
      -filter_script:v "$FILTER_DIR/$base.txt" -frames:v 1 -- "$2" 2>"$TMP/ffmpeg.err"; then
    die "ffmpeg 生成 $2 失败: $(head -n 3 "$TMP/ffmpeg.err" | tr '\n' ' ')"
  fi
  [ -f "$2" ] || die "未能写出 $2"
}

# ---------- 1) 总览：约 CELLS 格均布帧，6 列 ----------
COLS=6
ROWS="$(awk -v c="$CELLS" 'BEGIN{printf "%d", int((c+5)/6)}')"
OVFPS="$(awk -v c="$CELLS" -v d="$DUR" 'BEGIN{v=(c-1)/d; if (v>10) v=10; printf "%.6f", v}')"
OVERVIEW="$OUTDIR/overview.png"
make_sheet "fps=$OVFPS,scale=480:270${LABEL},tile=${COLS}x${ROWS}:padding=4:color=black" "$OVERVIEW"

# ---------- 2) 静止区间：降采样流上跑 freezedetect ----------
SMIN3="$(awk -v x="$STILLMIN" 'BEGIN{printf "%.3f", x}')"
ffmpeg -hide_banner -nostats -i "$VIDEO" \
  -vf "scale=480:-2,freezedetect=n=$NOISE:d=$SMIN3" -map 0:v -f null - \
  >"$TMP/freezelog.txt" 2>&1 || warn "freezedetect 执行异常，静止统计可能不完整"

awk -v dur="$DUR" '
  # 不同 ffmpeg 版本日志前缀不同（freeze_start: 或 lavfi.freezedetect.freeze_start:），按后缀匹配
  {
    for (i = 1; i <= NF; i++) {
      if ($i ~ /freeze_start:$/) { start = $(i+1) + 0; ins = 1 }
      else if ($i ~ /freeze_end:$/ && ins) { printf "%.3f %.3f\n", start, $(i+1) + 0; ins = 0 }
    }
  }
  END { if (ins) printf "%.3f %.3f\n", start, dur }
' "$TMP/freezelog.txt" > "$TMP/intervals.txt"

# ---------- 3) 密集帧条带：--range 指定的时段 ----------
: > "$TMP/strips.txt"
n=0
for r in ${ranges[@]+"${ranges[@]}"}; do
  t="${r#"${r%%[![:space:]]*}"}"; t="${t%"${t##*[![:space:]]}"}"   # 去掉首尾空白
  if [[ ! "$t" =~ ^([0-9]+([.][0-9]+)?)-([0-9]+([.][0-9]+)?)$ ]]; then
    warn "跳过非法区间: $r"; continue
  fi
  a="${BASH_REMATCH[1]}"; b="${BASH_REMATCH[3]}"
  if awk -v a="$a" -v b="$b" 'BEGIN{exit !(b<=a)}'; then
    warn "跳过空区间: $r"; continue
  fi
  n=$((n+1))
  fps="$(awk -v a="$a" -v b="$b" -v s="$STRIP_FPS" -v m="$STRIP_MAX_CELLS" \
    'BEGIN{v=(m-1)/(b-a); if (v>s) v=s; printf "%.6f", v}')"
  count="$(awk -v a="$a" -v b="$b" -v f="$fps" 'BEGIN{printf "%d", int((b-a)*f)+1}')"
  sr="$(awk -v c="$count" 'BEGIN{v=int((c+4)/5); if (v<1) v=1; printf "%d", v}')"
  a3="$(awk -v x="$a" 'BEGIN{printf "%.3f", x}')"; b3="$(awk -v x="$b" 'BEGIN{printf "%.3f", x}')"
  png="$OUTDIR/strip_$(printf '%02d' "$n")_${a3}-${b3}.png"
  make_sheet "trim=start=${a3}:end=${b3},fps=$fps,scale=640:360${LABEL},tile=5x${sr}:padding=4:color=black" "$png"
  printf '%s\t%.3f\t%s\n' "$t" "$fps" "$png" >> "$TMP/strips.txt"
done

# ---------- 4) 汇总 summary.txt 与 summary.json ----------
awk -v video="$VIDEO" -v dur="$DUR" -v ovpf="$OVFPS" -v stillmin="$STILLMIN" \
    -v noise="$NOISE" -v flag="$FLAG" -v overview="$OVERVIEW" \
    -v intfile="$TMP/intervals.txt" -v jsonout="$OUTDIR/summary.json" '
  function jstr(s) { gsub(/\\/, "\\\\", s); gsub(/"/, "\\\"", s); return "\"" s "\"" }
  FILENAME == intfile { n++; s[n] = $1 + 0; e[n] = $2 + 0; d[n] = $2 - $1; total += d[n]
              if (d[NR] > maxd) { maxd = d[NR]; maxi = NR } next }
  { split($0, p, "\t"); sc++; sr[sc] = p[1]; sf[sc] = p[2] + 0; sfile[sc] = p[3] }
  END {
    pct = (dur + 0 > 0) ? 100 * total / dur : 0

    print "video: " video
    printf "duration_s: %.3f   overview_fps: %.3f   still_rule: >= %.2fs at %s\n", dur, ovpf, stillmin, noise
    printf "still_total_s: %.2f   still_percent: %.1f%%   intervals: %d\n", total, pct, n
    if (n > 0) printf "longest_still: %.2fs at %.2f-%.2f\n", d[maxi], s[maxi], e[maxi]
    printf "flagged (>= %.1fs, confirm each has a reading or expressive purpose):\n", flag
    fc = 0
    for (i = 1; i <= n; i++) if (d[i] >= flag + 0) fc++
    if (fc == 0) print "  none"
    for (i = 1; i <= n; i++) if (d[i] >= flag + 0) printf "  %.2f-%.2f  (%.2fs)\n", s[i], e[i], d[i]
    print "all still intervals:"
    if (n == 0) print "  none"
    for (i = 1; i <= n; i++) printf "  %.2f-%.2f  (%.2fs)\n", s[i], e[i], d[i]
    print "overview: " overview
    for (i = 1; i <= sc; i++) printf "strip %s @%.3ffps: %s\n", sr[i], sf[i], sfile[i]
    print "note: locating aid only. Still spans can be valid reading time; motion share never proves quality."

    json = "{\n"
    json = json "  \"video\": " jstr(video) ",\n"
    json = json sprintf("  \"duration_s\": %.3f,\n", dur)
    json = json sprintf("  \"still_total_s\": %.3f,\n", total)
    json = json sprintf("  \"still_percent\": %.1f,\n", pct)
    if (n > 0)
      json = json sprintf("  \"longest_still\": {\"start\": %.3f, \"end\": %.3f, \"seconds\": %.3f},\n", s[maxi], e[maxi], d[maxi])
    else
      json = json "  \"longest_still\": null,\n"
    json = json "  \"flagged\": ["
    first = 1
    for (i = 1; i <= n; i++) if (d[i] >= flag + 0) {
      json = json (first ? "" : ", ") sprintf("{\"start\": %.3f, \"end\": %.3f, \"seconds\": %.3f}", s[i], e[i], d[i]); first = 0
    }
    json = json "],\n"
    json = json "  \"stills\": ["
    first = 1
    for (i = 1; i <= n; i++) {
      json = json (first ? "" : ", ") sprintf("{\"start\": %.3f, \"end\": %.3f, \"seconds\": %.3f}", s[i], e[i], d[i]); first = 0
    }
    json = json "],\n"
    json = json "  \"overview\": " jstr(overview) ",\n"
    json = json "  \"strips\": ["
    first = 1
    for (i = 1; i <= sc; i++) {
      json = json (first ? "" : ", ") sprintf("{\"range\": %s, \"fps\": %.3f, \"file\": %s}", jstr(sr[i]), sf[i], jstr(sfile[i])); first = 0
    }
    json = json "],\n"
    json = json sprintf("  \"still_rule\": {\"min_s\": %.3f, \"noise\": %s}\n}", stillmin, jstr(noise))
    printf "%s\n", json > jsonout
    close(jsonout)
  }
' "$TMP/intervals.txt" "$TMP/strips.txt" > "$OUTDIR/summary.txt"

cat -- "$OUTDIR/summary.txt"
