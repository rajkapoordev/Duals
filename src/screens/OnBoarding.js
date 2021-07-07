import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import {IS_IOS, normalize, wp} from '../helper/responsiveScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import AppButton from '../components/AppButton';
import {COLOR} from '../constants/colorConstants';

const data = [
  {
    key: '1',
    title: 'Learn\n' + 'by Speaking ',
    image: require('../assets/group-2.png'),
    subTitle:
      'Easily learn new languages by speaking regularly. Practice daily with our amazingly fluent language tutors.',
  },
  {
    key: '2',
    title: 'Find the\n' + 'Best Tutor for You!',
    image: require('../assets/3.png'),
    subTitle:
      'There are many different tutors to choose from, making it easier for you to choose your favorite tutor. Tap call and speak at affordable rates.',
  },
  {
    key: '3',
    image: require('../assets/group.png'),
    title: '…or Become a Language Tutor too!',
    subTitle:
      'Anybody can become a language tutor of their native language. Just talk with someone about the daily topic in your own language and easily earn money!',
  },
];

let flagForAndroid = true;

const RenderTextContainer = ({item, index, top}) => {
  const {titleStyle, subTitleStyle, renderMainView} = styles;
  return (
    <View
      style={[
        renderMainView,
        {
          paddingTop: IS_IOS ? top + normalize(32) : top + normalize(40),
          backgroundColor:
            index === 0
              ? COLOR.orange
              : index === 1
              ? COLOR.darkBlue
              : COLOR.lightBlue,
        },
      ]}>
      <Text style={titleStyle}>{item.title}</Text>
      <Text style={subTitleStyle}>{item.subTitle}</Text>
      <Image source={item.image} style={styles.imageStyle} />
    </View>
  );
};

function OnBoarding() {
  const {
    mainView,
    paginationContainerView,
    buttonView,
    paginationView,
    innerPaginationView,
    overPaginationView,
  } = styles;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef();
  const previousIndex = useRef(0);
  const currentAnimation = useRef(null);
  const {top, bottom} = useSafeAreaInsets();
  const animatedWidth1 = useRef(new Animated.Value(0)).current;
  const animatedWidth2 = useRef(new Animated.Value(0)).current;
  const animatedWidth3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    currentAnimation?.current?.stopAnimation(() => {
      currentAnimation.current =
        selectedIndex === 0
          ? animatedWidth1
          : selectedIndex === 1
          ? animatedWidth2
          : animatedWidth3;
      if (previousIndex.current >= selectedIndex) {
        setPreviousAnimation(0);
        Animated.timing(currentAnimation.current, {
          toValue: 0,
          duration: 350,
          useNativeDriver: false,
        }).start(result => {
          if (result.finished) {
            startProgressAnimation();
          }
        });
      } else {
        setPreviousAnimation(1);
        startProgressAnimation();
      }
    });
  }, [selectedIndex]);

  const onPressNext = () => {
    previousIndex.current = selectedIndex;
    if (selectedIndex === 0) {
      animatedWidth1.setValue(1);
      flatListRef.current.scrollToIndex({index: selectedIndex + 1});
      setSelectedIndex(selectedIndex + 1);
    } else if (selectedIndex === 1) {
      animatedWidth2.setValue(1);
      flatListRef.current.scrollToIndex({index: selectedIndex + 1});
      setSelectedIndex(selectedIndex + 1);
    } else if (selectedIndex === 2) {
    }
  };

  useEffect(() => {
    SplashScreen.hide();
    startProgressAnimation();
  }, []);

  const startProgressAnimation = () => {
    currentAnimation.current =
      selectedIndex === 0
        ? animatedWidth1
        : selectedIndex === 1
        ? animatedWidth2
        : animatedWidth3;
    Animated.timing(currentAnimation.current, {
      toValue: 1,
      duration: 7000,
      useNativeDriver: false,
    }).start(result => {
      if (result.finished) {
        if (selectedIndex <= 1) {
          previousIndex.current = selectedIndex;
          setSelectedIndex(selectedIndex + 1);
          flatListRef.current.scrollToIndex({index: selectedIndex + 1});
        }
      }
    });
  };

  const setPreviousAnimation = value => {
    const previousAnimation =
      previousIndex.current === 0
        ? animatedWidth1
        : previousIndex.current === 1
        ? animatedWidth2
        : animatedWidth3;
    previousAnimation.setValue(value);
  };

  const onScrollEnd = useCallback(
    e => {
      let contentOffset = e.nativeEvent.contentOffset;
      let viewSize = e.nativeEvent.layoutMeasurement;

      let pageNum = Math.floor(contentOffset.x / viewSize.width);
      if (IS_IOS) {
        previousIndex.current = selectedIndex;
        setSelectedIndex(pageNum);
      } else {
        if (flagForAndroid) {
          previousIndex.current = selectedIndex;
          setSelectedIndex(pageNum);
          flagForAndroid = false;
        }
        setTimeout(() => {
          flagForAndroid = true;
        }, 200);
      }
    },
    [selectedIndex],
  );

  const backgroundColor =
    selectedIndex === 0
      ? COLOR.orange
      : selectedIndex === 1
      ? COLOR.darkBlue
      : COLOR.lightBlue;

  const width1 = animatedWidth1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const width2 = animatedWidth2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const width3 = animatedWidth3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  return (
    <View style={[mainView, {backgroundColor}]}>
      <StatusBar barStyle={'light-content'} />
      <View style={[paginationContainerView, {top: top}]}>
        <View style={paginationView}>
          <View style={innerPaginationView}>
            <Animated.View style={[overPaginationView, {width: width1}]} />
          </View>
        </View>
        <View style={paginationView}>
          <View style={innerPaginationView}>
            <Animated.View style={[overPaginationView, {width: width2}]} />
          </View>
        </View>
        <View style={paginationView}>
          <View style={innerPaginationView}>
            <Animated.View style={[overPaginationView, {width: width3}]} />
          </View>
        </View>
      </View>
      <FlatList
        style={mainView}
        ref={flatListRef}
        data={data}
        horizontal={true}
        pagingEnabled={true}
        renderItem={({item, index}) => (
          <RenderTextContainer item={item} index={index} top={top} />
        )}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      />
      <View style={[buttonView, {bottom: 46 + bottom}]}>
        <AppButton
          onPress={onPressNext}
          title={selectedIndex === 2 ? "Let's Get Started!" : 'Next'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  paginationContainerView: {
    height: normalize(32),
    paddingHorizontal: normalize(30),
    width: wp(100),
    justifyContent: 'space-between',
    paddingTop: IS_IOS ? normalize(10) : normalize(20),
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 999,
  },
  paginationView: {
    flex: 1,
    height: 3,
    paddingHorizontal: 4,
  },
  innerPaginationView: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 1.5,
  },
  overPaginationView: {
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 777,
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },
  titleStyle: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: normalize(20),
  },
  subTitleStyle: {
    fontFamily: 'ProximaNova-Regular',
    fontSize: normalize(16),
    color: '#fff',
  },
  buttonView: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 11,
  },
  imageStyle: {
    marginTop: normalize(50),
    alignSelf: 'center',
  },
  renderMainView: {
    width: wp(100),
    paddingHorizontal: normalize(30),
  },
});

export default OnBoarding;
