/**
 * 示例 App：使用 react-native-vision-camera 与 vision-camera-image-labeler 实时识别图像标签。
 * 功能概览：
 * - 首次启动请求相机权限，选择后置摄像头作为输入设备。
 * - 在 frameProcessor（Worklet 环境）中运行原生图像标签识别。
 * - 通过 Worklets.createRunOnJS 将识别结果安全地传回 JS 线程，写入 SharedValue。
 * - 由 Label 组件订阅并展示当前识别到的标签文本。
 */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {useImageLabeler} from 'vision-camera-image-labeler';
import {Label} from './components/Label';
import {Worklets} from 'react-native-worklets-core';

export default function App() {
  // 相机权限状态（true 表示已授予）
  const [hasPermission, setHasPermission] = useState(false);
  // 共享值：用于在 Worklet 与 UI 之间同步当前识别到的标签文本
  const currentLabel = useSharedValue('');

  // 选择后置摄像头作为相机设备
  const device = useCameraDevice('back');

  useEffect(() => {
    (async () => {
      // 首次挂载时请求相机权限
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  /**
   * Setting the value directly in the frameProcessor would
   * would not seem to rerender
   *  https://github.com/mrousavy/react-native-vision-camera/issues/1767
   */

  // 将 Worklet 中的识别结果传回 JS 线程并写入 SharedValue。
  // 直接在 frameProcessor 中赋值通常不会触发 UI 重渲染，
  // 因此使用 runOnJS 包装成在 JS 线程执行的更新函数。
  const updateLabel = Worklets.createRunOnJS((text: string) => {
    currentLabel.value = text;
  });

  const imageLabeler = useImageLabeler();

  // VisionCamera 的帧处理器（运行在 Worklet 环境）。
  // 每帧调用原生图像标签器并将首个标签写入 SharedValue。
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const labels = imageLabeler.labelImage(frame);

    if (labels[0] && labels[0].label) {
      updateLabel(labels[0].label);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* 当已找到相机设备并且权限已授予时，渲染相机与标签组件 */}
      {device != null && hasPermission ? (
        <>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
          />
          <Label text={currentLabel} />
        </>
      ) : (
        <ActivityIndicator size="large" color="white" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  text: {
    position: 'absolute',
    top: 48,
    padding: 4,
    marginHorizontal: 20,
    backgroundColor: '#000000CC',
    fontSize: 26,
    color: 'white',
    textAlign: 'center',
  },
});
