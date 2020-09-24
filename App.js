import React from "react";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import store from "./src/redux/store";
import i18n from "./src/i18n";
import AppNavigator from "./AppNavigator";
import { useFonts } from "@use-expo/font";
import { AppLoading } from "expo";

export default function App() {
  const [isLoaded] = useFonts({
    "montserrat-bold": require("./assets/fonts/Montserrat-Bold.ttf"),
    "montserrat-extra-bold": require("./assets/fonts/Montserrat-ExtraBold.ttf"),
    "montserrat-light": require("./assets/fonts/Montserrat-Light.ttf"),
    "montserrat-regular": require("./assets/fonts/Montserrat-Regular.ttf"),
    "montserrat-semi-bold": require("./assets/fonts/Montserrat-SemiBold.ttf"),
    "montserrat-extra-light": require("./assets/fonts/Montserrat-ExtraLight.ttf"),
  });

  if (!isLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <AppNavigator />
        </I18nextProvider>
      </Provider>
    );
  }
}
