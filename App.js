/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import MainNavigator from './src/navigation/mainNavigation';

const App: () => Node = () => {
  return <MainNavigator />;
};

export default App;
