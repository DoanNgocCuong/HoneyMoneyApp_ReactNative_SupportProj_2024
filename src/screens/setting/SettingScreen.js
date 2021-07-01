// react
import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";

// firebase
import * as firebase from "firebase";

// redux
import { connect } from "react-redux";
import { signOut, editUserName } from "../../redux/actions";

// other packages
import { Icon } from "react-native-elements";

// components
import {
  String,
  ScreenView,
  NormalCard,
  SettingRow,
} from "../../components/Basic";

// constants
import { colors, sizeFactor } from "../../constants";

class SettingScreen extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
    };
  }

  componentDidMount() {
    this.props.editUserName(firebase.auth().currentUser.displayName);
  }

  signOut = () => {
    this.props.signOut();
    firebase
      .auth()
      .signOut()
      .then(() => {
        //console.log(firebase.auth().currentUser);
        console.log(this.props.isSignedIn);
      })
      .catch((error) => this.setState({ errorMessage: error.message }));
  };

  render() {
    return (
      <ScreenView disablePress={this.props.disablePress}>
        <View style={{ marginBottom: sizeFactor }}>
          <Image
            style={{
              alignSelf: "center",
              width: sizeFactor * 9,
              height: sizeFactor * 9,
              marginBottom: sizeFactor,
            }}
            source={require("../../assets/others/user.png")}
          />
          <Text
            style={{
              fontWeight: "bold",
              alignSelf: "center",
              fontSize: sizeFactor * 1.5,
              marginBottom: sizeFactor * 0.25,
            }}
          >
            {this.props.userName}
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: sizeFactor,
              color: colors.gray,
            }}
          >
            {firebase.auth().currentUser.email}
          </Text>
        </View>
        {/* {<Title style={{ marginBottom: sizeFactor / 4 }}>Cài đặt</Title>} */}
        <NormalCard style={{ paddingHorizontal: 0 }}>
          <SettingRow
            color={colors.yellow}
            iconName="account-circle"
            text="Thông tin người dùng"
            onPress={() =>
              this.props.navigation.navigate("SettingNavigator", {
                screen: "SettingNameScreen",
              })
            }
          />
          <SettingRow
            color={colors.yellow}
            iconName="key"
            text="Thay đổi mật khẩu"
            onPress={() =>
              this.props.navigation.navigate("SettingNavigator", {
                screen: "SettingPasswordScreen",
              })
            }
          />
          <SettingRow
            color={colors.green}
            iconName="currency-cny"
            text="Chuyển đổi ngoại tệ"
            onPress={() => {
              this.props.navigation.navigate("SettingNavigator", {
                screen: "ExchangeScreen",
              });
            }}
          />
          <SettingRow
            color={colors.green}
            iconName="currency-cny"
            text="Tính lãi suất nâng cao"
            onPress={() => {
              this.props.navigation.navigate("SettingNavigator", {
                screen: "InterestScreen",
              });
            }}
          />
          <SettingRow
            color={colors.green}
            iconName="package-variant"
            text="Quản lý danh mục"
            onPress={() => {
              this.props.navigation.navigate("SettingNavigator", {
                screen: "CategoryScreen",
              });
              console.log(firebase.auth().currentUser.uid);
            }}
          />
          <SettingRow
            color={colors.green}
            iconName="bank"
            text="Quản lí hạn mức"
            onPress={() =>
              this.props.navigation.navigate("SettingNavigator", {
                screen: "BudgetScreen",
              })
            }
          />
          <SettingRow
            color={colors.blue}
            iconName="bell-ring"
            text="Thông báo"
            onPress={() =>
              this.props.navigation.navigate("SettingNavigator", {
                screen: "SettingAlertScreen",
              })
            }
          />
          <View
            style={{
              marginBottom: sizeFactor / 4,
              paddingHorizontal: sizeFactor,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                marginBottom: sizeFactor * 0.75,
                alignSelf: "center",
              }}
            >
              <Icon
                style={{ marginRight: sizeFactor / 2 }}
                name="logout"
                size={sizeFactor * 1.5}
                type="material-community"
                color={colors.red}
              />
              <TouchableOpacity
                style={{
                  alignSelf: "center",
                  color: colors.red,
                  fontSize: sizeFactor,
                }}
                onPress={() => {
                  this.signOut();
                }}
              >
                <Text style={{ color: colors.red }}>Đăng xuất tài khoản</Text>
              </TouchableOpacity>
            </View>
          </View>
        </NormalCard>
        <View
          style={{
            alignItems: "center",
            marginTop: sizeFactor * 4,
            marginHorizontal: sizeFactor * 2,
          }}
        >
          <TouchableOpacity>
            <Image
              style={{
                width: sizeFactor * 8 * 1.50226244344,
                height: sizeFactor * 8,
                marginBottom: sizeFactor,
              }}
              source={require("../../assets/others/coloredlogo.png")}
            />
          </TouchableOpacity>
          <String
            style={{
              fontSize: sizeFactor * 0.8,
              color: colors.gray3,
            }}
          >
            Version 1.0
          </String>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              marginVertical: sizeFactor,
            }}
          >
            <String
              style={{
                color: colors.dark,
                marginBottom: 0,
              }}
            >
              Made with
            </String>
            <Image
              style={{
                width: sizeFactor,
                height: sizeFactor,
                marginHorizontal: sizeFactor / 3,
              }}
              source={require("../../assets/others/heart.png")}
            />
            <String
              style={{
                color: colors.dark,
                marginBottom: 0,
              }}
            >
              by:
            </String>
          </View>
          <String style={{ marginBottom: sizeFactor / 2, fontWeight: "bold" }}>
            Luong Ly Cong Thang
          </String>
          <String style={{ marginBottom: sizeFactor / 2, fontWeight: "bold" }}>
            Phan Huy Tien
          </String>
          <String style={{ marginBottom: sizeFactor / 2, fontWeight: "bold" }}>
            Ngo Cong Hau
          </String>
        </View>
      </ScreenView>
    );
  }
}

function mapStateToProps(state) {
  return {
    userName: state.userName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    editUserName: (name) => {
      dispatch(editUserName(name));
    },
    signOut: () => {
      dispatch(signOut());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
