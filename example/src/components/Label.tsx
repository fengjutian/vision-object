/**
 * Label 组件：在屏幕上展示由图像识别得到的标签文本。
 * 实现要点：
 * - 使用 Reanimated 的 Animated TextInput，以支持在 UI 线程高效更新。
 * - 通过 DerivedValue<string> 传入实时的文本值，避免不必要的 React 重渲染。
 * - useAnimatedProps 将 Worklet/SharedValue 的变化映射到原生属性（text/defaultValue）。
 */
import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import Animated, {
  DerivedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

// 将原生属性 `text` 加入白名单，允许通过 animatedProps 直接驱动原生 TextInput 的显示。
Animated.addWhitelistedNativeProps({text: true});
const AnimatedText = Animated.createAnimatedComponent(TextInput);

export const Label = ({text}: {text: DerivedValue<string>}) => {
  // animatedProps 在 UI 线程更新，确保文本跟随 SharedValue 的变化及时刷新。
  const animatedProps = useAnimatedProps(() => {
    return {
      // 使用 `text` 与 `defaultValue` 双管齐下，保持初始与动态文本一致。
      text: text.value,
      defaultValue: text.value,
    };
  });

  return (
    <AnimatedText
      style={styles.text}
      editable={false}
      multiline={true}
      // 通过 animatedProps 绑定到原生属性，避免 React setState 带来的额外重渲染。
      animatedProps={animatedProps}
    />
  );
};

const styles = StyleSheet.create({
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
