import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { StyleSheet, Text, View, Image } from "react-native";
import { Item, Input, Icon, Button, Content } from "native-base";
import { withTranslation } from "react-i18next";
import { Formik } from "formik";
import { baseStylesheet } from "../styles/baseStylesheet";
import { colors } from "../styles/colors";
import Validation from "../validation";
import WelcomeHeader from "../components/welcomeHeader";
import Background from "../components/background";
import Copyright from "../components/copyright";
import schema from "../validation/passwordSchema";
import { login, token } from "../redux/ducks/authentication";

class LoginScreen extends Component {
  onSubmit = (values) => {
    this.props.login(values);
  };

  componentDidUpdate(prevProps) {
    const { token, navigation } = this.props;

    if (token) {
      navigation.navigate("Home");
    }
  }

  render() {
    const { t } = this.props;

    return (
      <Background>
        <Content>
          <WelcomeHeader />
          <Formik
            initialValues={{
              password: "",
              email: this.props.email,
            }}
            validationSchema={schema}
            onSubmit={this.onSubmit}
          >
            {(props) => {
              return (
                <View style={styles.formContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.logo}
                      source={require("../../assets/logo.png")}
                    />
                  </View>
                  <Text style={baseStylesheet.mainContentText}>
                    {t("passwordScreen.formContext")}
                  </Text>
                  <Validation name="password" showMessage={true}>
                    <Item rounded style={baseStylesheet.inlineButtonInputItem}>
                      <Icon
                        style={baseStylesheet.icon}
                        name="lock"
                        type="Feather"
                      />
                      <Input
                        style={baseStylesheet.inputField}
                        placeholder={t("registrationScreen.password")}
                        placeholderTextColor={colors.lightText}
                        value={props.values.password}
                        onChangeText={props.handleChange("password")}
                        secureTextEntry={true}
                      />
                      <View>
                        <Button
                          onPress={props.handleSubmit}
                          style={baseStylesheet.inlineButton}
                        >
                          <Icon
                            style={styles.icon}
                            name="arrow-right"
                            type="Feather"
                          />
                        </Button>
                      </View>
                    </Item>
                  </Validation>
                </View>
              );
            }}
          </Formik>
        </Content>
        <Copyright />
      </Background>
    );
  }
}

const mapStateToProps = (state, props) => {
  const email = state.authentication.email;
  const token = state.authentication.token || "";
  return {
    email,
    token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (data) => dispatch(login(data)),
  };
};

export default compose(
  withTranslation("translations"),
  connect(mapStateToProps, mapDispatchToProps)
)(LoginScreen);

const styles = StyleSheet.create({
  formContainer: {
    padding: 15,
    alignItems: "center",
    width: "100%",
    marginBottom: 50,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 103,
  },
  submitButton: {
    width: "100%",
  },
  icon: { color: "white", fontSize: 20 },
});
