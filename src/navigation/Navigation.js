import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import VerifyAccount from '../pages/AccountVerification/VerifyAccount';
import CreateProfile from '../pages/HomePage/CreateProfile';
import Profile from '../pages/Profile';
import MatchedJobs from "../pages/Jobs";
import SelectedJobProfile from "../pages/Jobs/SelectedJobProfile";
import CreateJob from "../pages/Admin/CreateJob";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="StudentHomePage" component={StudentHomePage} />
        <Stack.Screen
          name="StudentAttendanceView"
          component={StudentAttendanceView}
        />
        <Stack.Screen
          name="StudentAttendanceProgressView"
          component={StudentAttendanceProgressView}
        />
        <Stack.Screen
          name="CourseCalenderView"
          component={CourseCalenderView}
        /> */}
        <Stack.Screen name="CreateProfile" component={CreateProfile} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Jobs" component={MatchedJobs} />
        <Stack.Screen name="SelectedJobProfile" component={SelectedJobProfile} />
        <Stack.Screen name="CreateJob" component={CreateJob} />
        <Stack.Screen name="LoginView" component={Login} />
        <Stack.Screen name="SignUpView" component={SignUp} />
        <Stack.Screen name="VerifyAccount" component={VerifyAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;