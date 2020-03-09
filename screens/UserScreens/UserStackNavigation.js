import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import UserHomeScreen from "./UserHomeScreen";
import UserTabNavigation from "./UserTabNavigation";

const Stack = createStackNavigator();

// TODO: Figure out how to add hamburger menu to home page header
export default function UserStackNavigation() {
  return (
    <Stack.Navigator initialRouteName="UserHome">
      <Stack.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="UserTab"
        component={UserTabNavigation}
        options={{ title: "User Current Walk" }}
      />
    </Stack.Navigator>
  );
}
