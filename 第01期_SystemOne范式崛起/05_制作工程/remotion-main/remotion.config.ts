import {Config} from '@remotion/cli/config';

// 输出与质量约定（本期 1920x1080@30fps；分段只做轻预览，重渲染由总控执行）
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
