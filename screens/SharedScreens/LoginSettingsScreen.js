import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Avatar } from "react-native-elements";
import { TextInput } from "react-native-paper";
import { useForm } from "react-hook-form";

// Constants
import url from "./../../constants/api";
import colors from "./../../constants/colors";

// Contexts
import { AuthContext } from "./../../contexts/AuthProvider";

export default function LoginSettingsScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { userToken, email, userType } = useContext(AuthContext);

  // forms input handling
  const { register, setValue, handleSubmit, errors, watch } = useForm();

  // password input upon change
  useEffect(() => {
    register("currentPassword");
    register("password");
    register("confirmPassword");
  }, [register]);

  // when component is mounted
  useEffect(() => {
    const response = getProfileInfo();
  }, []);

  const getProfileInfo = async () => {
    let user = true;
    let endpoint = "/api/Users/";
    if (userType === "safewalker") {
      endpoint = "/api/Safewalkers/";
      user = false;
    }

    // get info from the database
    const response = await fetch(url + endpoint + email, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        email: email,
        token: userToken,
        isUser: user,
      },
    }).then((response) => {
      if (!(response.status === 200)) {
        console.log("captured " + response.status + "! Try again.");
      } else {
        return response.json();
      }
    });

    // set states to proper values based on backend response
    setFirstName(response.firstName);
    setLastName(response.lastName);
  };

  // upon clicking update password button
  const saveProfileInfo = async (data) => {
    // first check old password
    let endpoint = "/api/Login/";
    //setOldPassword("fail");
    let oldPass = 0;

    // checking old password with database
    const response1 = await fetch(url + endpoint + email, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        password: data.currentPassword,
      },
    }).then((response1) => {
      if (!(response1.status === 200)) {
        //setOldPassword("fail");
        oldPass = 0;
        // console.log("Current " + data.currentPassword + " ");
        console.log("captured " + response1.status + "! Try again.");
      } else {
        oldPass = 1;
        // return response1.json();
      }
    });

    //await setPassword(data.confirmPassword);
    endpoint = "/api/Users/";
    if (userType == "safewalker") {
      endpoint = "/api/Safewalkers/";
    }

    if (oldPass == 1) {
      // send new info to the database
      const response = await fetch(url + endpoint + email, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: userToken,
        },
        body: JSON.stringify({
          Password: data.confirmPassword,
        }),
      })
        .then((response) => {
          if (!(response.status === 200)) {
            console.log("captured " + response.status + "! Try again.");
          } else {
            console.log("updated password" + data.confirmPassword);
            alert("Updated Password!");
          }
        })
        .catch((error) => {
          console.log(error.message);
          console.log("Error in updating password. Please try again.");
        });
    } else {
      alert("Incorrect Password");
    }
  };

  // upon pressing the update password button
  const onSubmit = (data) => {
    const response = saveProfileInfo(data);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <Avatar
            rounded
            size={200}
            title={firstName + " " + lastName}
            overlayContainerStyle={{ backgroundColor: colors.orange }}
            titleStyle={{ fontSize: 20 }}
          />
        </View>

        {/* Middle View */}
        <KeyboardAvoidingView style={styles.innerContainer}>
          {errors.currentPassword && (
            <Text style={styles.textError}>Current password is required.</Text>
          )}
          <TextInput
            label="Current Password"
            placeholder="Current Password"
            ref={register({ name: "currentPassword" }, { required: true })}
            onChangeText={(text) => setValue("currentPassword", text, true)}
            mode="outlined"
            secureTextEntry
            theme={{ colors: { primary: "orange" } }}
            style={styles.textInput}
          />

          {errors.password && (
            <Text style={styles.textError}>Password is required.</Text>
          )}
          <TextInput
            label="New Password"
            placeholder="New Password"
            ref={register({ name: "password" }, { required: true })}
            onChangeText={(text) => setValue("password", text, true)}
            mode="outlined"
            secureTextEntry
            theme={{ colors: { primary: "orange" } }}
            style={styles.textInput}
          />

          {errors.confirmPassword && (
            <Text style={styles.textError}>The passwords do not match.</Text>
          )}
          <TextInput
            label="Confirm password"
            ref={register(
              { name: "confirmPassword" },
              {
                required: true,
                validate: (value) =>
                  value === watch("password") || "The passwords do not match.",
              }
            )}
            onChangeText={(text) => setValue("confirmPassword", text, true)}
            mode="outlined"
            secureTextEntry
            theme={{ colors: { primary: colors.orange } }}
            style={styles.textInput}
          />
        </KeyboardAvoidingView>

        {/* Bottom */}
        <View style={styles.containerBottom}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.buttonNext}
          >
            <Text style={styles.buttonNextText}> Update Password </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  containerTop: {
    flex: 0.8,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 100,
  },
  containerBottom: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  innerContainer: {
    flex: 1,
    marginHorizontal: 50,
    justifyContent: "center",
  },
  textError: {
    color: colors.red,
  },
  textInput: {
    marginBottom: 20,
  },
  buttonNext: {
    backgroundColor: colors.orange,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 50,
  },
  buttonNextText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    padding: 12,
    textAlign: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
