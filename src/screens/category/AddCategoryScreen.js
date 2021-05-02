// react
import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";

// firebase
import { firebase, userRef } from "../../database";
import { useAuthState } from "react-firebase-hooks/auth";

// redux
import { useDispatch, useSelector } from "react-redux";
import {
  changeType,
  openDialog,
  openIconDialog,
  selectIcon,
  closeIconDialog,
  clearSearchText,
  workWithSubCategory,
} from "../../redux/actions";

// other packages
import { Avatar, Accessory, ListItem } from "react-native-elements";
import Swipeout from "react-native-swipeout";

// components
import {
  String,
  ScreenView,
  Space,
  Title,
  AddWalletKindSelect,
  RoundedView,
  Button1,
} from "../../components/Basic";

import IconImage, { findIcon } from "../../assets";
//import AddSubcategoryDialog from "../components/AddSubcategoryDialog";
//import ChooseIconDialog from '../components/ChooseIconDialog';

// constants
import { colors, sizeFactor, styles } from "../../constants";
import { Alert } from "react-native";

const SubCategoriesView = () => {
  const subCategories = useSelector((state) => state.subCategories);

  return (
    <View>
      {subCategories.map((item, i) => (
        <TouchableOpacity>
          <ListItem
            key={item.key}
            title={item.categoryName}
            leftAvatar={{
              source: findIcon(item.icon),
              width: sizeFactor * 2.5,
              height: sizeFactor * 2.5,
              rounded: false,
            }}
            chevron={
              // if button is used to add new sub category, don't show the right arrow (set false), else set size for it
              item.categoryName == "Thêm mới"
                ? false
                : { size: sizeFactor * 1.5 }
            }
            contentContainerStyle={{ marginHorizontal: 0 }}
            rightContentContainerStyle={{ marginHorizontal: 0 }}
            containerStyle={{ paddingHorizontal: 0 }}
            titleStyle={{ fontSize: sizeFactor }}
            pad={sizeFactor}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

// con xem lai addsubcate do chua co dialog
const AddCategoryScreen = ({ navigation }) => {
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState(null);

  const [user, loading, error] = useAuthState(firebase.auth());
  const userCategoryRef = userRef.child(user.uid).child("Category");

  // co the ko can categoryName, chosencategory vi state chi thay doi trong component nay, usestate thoi chac cung dc
  //const categoryName = useSelector((state) => state.categoryName);
  const selectedType = useSelector((state) => state.selectedType);
  const selectedIcon = useSelector((state) => state.selectedIcon);
  const addedSubCategories = useSelector((state) => state.addedSubCategories);
  const chosenCategory = useSelector((state) => state.chosenCategory);

  const dispatch = useDispatch();

  const swipeSettings = {
    autoClose: true,
    onClose: (secID, rowID, direction) => {},
    onOpen: (secID, rowID, direction) => {},
    right: [
      {
        onPress: () => {},
        text: "Xóa",
        type: "delete",
      },
    ],
  };

  const iconPath = IconImage[selectedIcon.addIndex].iconPath;

  // done
  // xem lai viec co can chosenCategory hay ko vi co ve khi goi ham chi can truyen category moi taoj vao la dc
  const addSubcategory = async () => {
    //const subCategories = addedSubCategories;
    //console.log(addedSubCategories);
    const userSubcategoryRef = userCategoryRef
      .child(parentCategory.key)
      .child("SubCategories/");
    //console.log("ref " + userSubcategoryRef);
    //let update = {};
    await addedSubCategories.map((item) => {
      userSubcategoryRef.push({
        CategoryName: item.categoryName,
        Icon: item.icon,
        TypeID: parentCategory.TypeID,
        IsDeleted: false,
      });
      //console.log("pid " + parentCategory.key);
    });
    //reloadAddedSubCategories();
  };

  // done
  const createCategory = async () => {
    const name = categoryName;
    const type = selectedType == 0 ? "001" : selectedType == 1 ? "002" : "003";
    const icon = IconImage[selectedIcon.addIndex].type;

    if (name === "") {
      Alert.alert("Thông báo", "Nhập tên danh mục để tạo.");
    } else {
      await userCategoryRef
        .push({
          CategoryName: name,
          Icon: icon,
          ParentID: "",
          TypeID: type,
          IsDeleted: false,
        })
        .then((item) => {
          item.once("value", (snapshot) => {
            console.log(snapshot);
            const category = {
              key: item.key,
              categoryName: snapshot.toJSON().CategoryName,
              icon: snapshot.toJSON().Icon,
              isDeleted: snapshot.toJSON().IsDeleted,
              parentID: snapshot.toJSON().ParentID,
              typeID: snapshot.toJSON().TypeID,
            };
            console.log("###");
            console.log(category);
            setParentCategory((prevState) => ({
              ...prevState,
              category,
            }));
          });

          console.log(parentCategory);
        });
      //console.log(category);
      addSubcategory();
      // if searching, don't find a category, user can add category immediately by pressing themdanhmuc,
      // after adding, clear search text to stop searchings
      dispatch(clearSearchText());
      navigation.goBack();
    }
  };

  const openIcon = () => {
    // reset selectedIndex whenever open icon dialog
    // b/c if choose icon and close dialog, without reseting, selectedIndex != addIndex (expect ==)
    selectIcon(selectedIcon.addIndex);
    dispatch(openIconDialog());
  };

  const openAddSubDialog = () => {
    dispatch(workWithSubCategory());
    // setState({
    //   deleteBtn_name: "",
    // });

    dispatch(openDialog());
  };

  return (
    <ScreenView>
      {/* <ChooseIconDialog /> */}
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <Space />
        <Space />
        <Space />
        <TouchableOpacity
          onPress={() => {
            openIcon();
          }}
        >
          <Avatar
            size={sizeFactor * 6}
            avatarStyle={{
              width: sizeFactor * 4.5,
              height: sizeFactor * 4.5,
              marginLeft: sizeFactor * 0.75,
              marginTop: sizeFactor * 0.75,
            }}
            source={iconPath}
          >
            <Accessory size={sizeFactor * 1.75} />
          </Avatar>
        </TouchableOpacity>
      </View>
      <Title style={{ marginLeft: sizeFactor * 1.5 }}>Chi tiết danh mục</Title>
      <RoundedView>
        <String style={{ fontWeight: "bold" }}>Tên danh mục</String>
        <TextInput
          style={styles.inputText}
          placeholder="Danh mục của tôi"
          onChangeText={(text) => setCategoryName(text)}
        />
        <Space />
        <String style={{ fontWeight: "bold" }}>Loại chi tiêu</String>
        <AddWalletKindSelect
          buttons={["Vay/Trả", "Chi tiêu", "Thu nhập"]}
          selectedIndex={selectedType}
          onPress={(index) => dispatch(changeType(index))}
        />
        <Space />
        <String style={{ fontWeight: "bold" }}>Danh mục con</String>

        <Swipeout style={{ marginBottom: sizeFactor / 2 }} {...swipeSettings}>
          <SubCategoriesView />
        </Swipeout>
        <TouchableOpacity onPress={() => openAddSubDialog()}>
          <View
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar
              size={sizeFactor * 3}
              avatarStyle={{
                width: sizeFactor * 2.5,
                height: sizeFactor * 2.5,
                marginTop: sizeFactor * 0.25,
                marginLeft: sizeFactor * 0.25,
              }}
              source={require("../../assets/categories/themdanhmuccon.png")}
            ></Avatar>
            <String
              style={{
                marginLeft: sizeFactor / 2,
                marginTop: sizeFactor * 0.75,
              }}
            >
              Thêm danh mục con
            </String>
          </View>
        </TouchableOpacity>
      </RoundedView>
      <Space />
      <Button1
        color="white"
        background={colors.blue}
        style={{ marginHorizontal: sizeFactor }}
        onPress={() => createCategory()}
      >
        Lưu thay đổi
      </Button1>
      {/* <AddSubcategoryDialog></AddSubcategoryDialog> */}
    </ScreenView>
  );
};

export default AddCategoryScreen;
