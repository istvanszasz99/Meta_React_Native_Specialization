import React, { useState, useContext } from "react";
import { View, Image, StyleSheet, Text, TextInput, Pressable } from "react-native";
import { validateEmail, validateName } from "../utils/utils";
import Constants from "expo-constants";
import { AuthContext } from "../utils/utils";

const Onboarding = () => {
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [email, onChangeEmail] = useState("");

  const isFirstNameValid = validateName(firstName);
  const isLastNameValid = validateName(lastName);
  const isEmailValid = validateEmail(email);

  const { onboard } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.logo} source={require("../assets/header-img.png")} />
      </View>
      <Text style={styles.welcomeText}>Let us get to know you</Text>
      <View style={styles.formContainer} scrollEnabled={true}>
        <View style={styles.form}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              value={firstName}
              onChangeText={onChangeFirstName}
              placeholder={"First Name"}
            />
            <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              value={lastName}
              onChangeText={onChangeLastName}
              placeholder={"Last Name"}
            />
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={email}
              onChangeText={onChangeEmail}
              placeholder={"Email"}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.buttons}>
            <Pressable
              style={[styles.btnSubmit, isEmailValid && isFirstNameValid && isLastNameValid ? "" : styles.btnDisabled]}
              onPress={() => onboard({ firstName, lastName, email })}
              disabled={!(isEmailValid && isFirstNameValid && isLastNameValid)}
            >
              <Text style={styles.btnSubmitText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    padding: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center',
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  formContainer: {
    flex: 1,
    flexDirection: "column",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  welcomeText: {
    fontSize: 32,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: "#495E57",
    color: 'white',
    textAlign: "center",
  },
  text: {
    fontSize: 24,
    color: "#495E57",
    margin: 18,
  },
  inputBox: {
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
    alignSelf: "stretch",
    height: 50,
    margin: 18,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 8,
  },
  btnDisabled: {
    backgroundColor: "#f1f4f7",
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 18,
    marginBottom: 60,
  },
  btnSubmit: {
    flex: 1,
    borderColor: "#f4ce14",
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
  },
  btnSubmitText: {
    fontSize: 22,
    color: "#333",
    alignSelf: "center",
  },
});

export default Onboarding;