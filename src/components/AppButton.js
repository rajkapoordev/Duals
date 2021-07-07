import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {normalize, wp} from '../helper/responsiveScreen';
import {COLOR} from '../constants/colorConstants';
import {withPreventDoubleClick} from './preventDoubleClick';
interface AppButtonProps {
  title: string;
  style?: Object;
  onPress: Function;
}

const AppButton = (props: AppButtonProps) => {
  const {onPress, style, title} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonStyle,
        style,
      ]}>
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonStyle: {
    width: wp(100) - normalize(60),
    height: normalize(48),
    borderRadius: 16,
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  textStyle: {
    fontFamily: 'ProximaNova-Bold',
    fontSize: normalize(16),
    color: COLOR.darkBlue,
  },
});

export default withPreventDoubleClick(AppButton);
