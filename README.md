<div align="right">
<img align="right" src="https://github.com/mrousavy/react-native-vision-camera/blob/main/docs/static/img/frame-processors.gif?raw=true">
</div>

# vision-camera-image-labeler

一个用于 [VisionCamera](https://github.com/mrousavy/react-native-vision-camera) 的帧处理器插件，基于 [**MLKit Vision** 图像标签](https://developers.google.com/ml-kit/vision/image-labeling) 对图像进行识别与标注。

## 安装

```sh
npm install vision-camera-image-labeler
cd ios && pod install
```

在你的 `babel.config.js` 中加入插件：

```js
module.exports = {
  plugins: [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__labelImage'],
      },
    ],

    // ...
```

> 注意：修改 `babel.config.js` 后需要重启 Metro Bundler（开发服务器）才能生效。

## V2 与 V3

注意：当前插件仅支持 VisionCamera V2。作者尚未投入时间适配 V3。

## 使用

```js
import { labelImage } from "vision-camera-image-labeler";

// ...

const frameProcessor = useFrameProcessor((frame) => {
  'worklet';
  const labels = labelImage(frame);
}, []);
```

## 贡献

请阅读 [贡献指南](CONTRIBUTING.md) 了解如何参与本仓库的开发与工作流。

## 许可协议

MIT
