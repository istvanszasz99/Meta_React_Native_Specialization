import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useMemo, useReducer } from "react";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import Home from "./screens/Home";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./utils/utils";

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "onboard":
          return {
            ...prevState,
            isLoading: false,
            isOnboardingCompleted: action.isOnboardingCompleted,
          };
      }
    },
    {
      isLoading: true,
      isOnboardingCompleted: false,
    }
  );

  useEffect(() => {
    (async () => {
      let profile = [];
      try {
        const getProfile = await AsyncStorage.getItem("profile");
        if (getProfile !== null) {
          profile = getProfile;
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (Object.keys(profile).length != 0) {
          dispatch({ type: "onboard", isOnboardingCompleted: true });
        } else {
          dispatch({ type: "onboard", isOnboardingCompleted: false });
        }
      }
    })();
  }, []);

  const authContext = useMemo(
    () => ({
      onboard: async data => {
        try {
          const json = JSON.stringify(data);
          await AsyncStorage.setItem("profile", json);
        } catch (error) {
          console.error(error);
        }

        dispatch({ type: "onboard", isOnboardingCompleted: true });
      },
      update: async data => {
        try {
          const json = JSON.stringify(data);
          await AsyncStorage.setItem("profile", json);
        } catch (error) {
          console.error(error);
        }
      },
      logout: async () => {
        try {
          await AsyncStorage.clear();
        } catch (error) {
          console.error(error);
        }

        dispatch({ type: "onboard", isOnboardingCompleted: false });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator>
          {state.isOnboardingCompleted ? (
            <>
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
            </>
          ) : (
            <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
