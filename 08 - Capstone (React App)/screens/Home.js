import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Text, View, StyleSheet, FlatList, Alert, Image, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories } from "../database";
import Filters from "../components/Filters";
import { useUpdateEffect, API_URL, sections } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const Item = ({ name, description, price, image }) => (
  <View style={styles.item}>
    <View style={styles.itemBody}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <Image
      style={styles.itemImage}
      source={{
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/750564eb6b2b7fece9b84b81d46d23045151422d/images/${image}?raw=true`,
      }}
    />
  </View>
);

const Home = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
    image: "",
  });
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");
  const [filterSelections, setFilterSelections] = useState(sections.map(() => false));

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      return json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        image: item.image,
        category: item.category,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      let menuItems = [];
      try {
        await createTable();
        menuItems = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        setData(menuItems);
        const profileData = await AsyncStorage.getItem("profile");
        setProfile(JSON.parse(profileData));
      } catch (error) {
        Alert.alert(error.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((_, i) => filterSelections.every(item => !item) || filterSelections[i]);
      try {
        const menuItems = await filterByQueryAndCategories(query, activeCategories);
        setData(menuItems);
      } catch (error) {
        Alert.alert(error.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback(q => setQuery(q), []);
  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = text => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = index => {
    const updatedFilters = [...filterSelections];
    updatedFilters[index] = !updatedFilters[index];
    setFilterSelections(updatedFilters);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../assets/header-img.png")}
          accessible
          accessibilityLabel="Little Lemon Logo"
        />
        <Pressable style={styles.avatar} onPress={() => navigation.navigate("Profile")}>
          {profile.image ? (
            <Image source={{ uri: profile.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
              {profile.firstName && Array.from(profile.firstName)[0]}
              {profile.lastName && Array.from(profile.lastName)[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.heroSection}>
        <Text style={styles.heroHeader}>Little Lemon</Text>
        <Text style={styles.heroHeader2}>Chicago</Text>
        <View style={styles.heroBody}>
          <View style={styles.heroContent}>
            <Text style={styles.heroText}>
              We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../assets/hero-img.png")}
            accessible
            accessibilityLabel="Little Lemon Food"
          />
        </View>
        <Searchbar
          placeholder="Search"
          value={searchBarText}
          onChangeText={handleSearchChange}
          style={styles.searchBar}
        />
      </View>
      <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>
      <Filters sections={sections} selections={filterSelections} onChange={handleFiltersChange} />
      <FlatList
        style={styles.sectionList}
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <Item {...item} />}
      />
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
    flexDirection: "row",
    justifyContent: "center",
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  sectionList: {
    paddingHorizontal: 25,
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: "#e4e4e4",
    borderRadius: 24,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#495e57",
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 20,
    color: "#000000",
    paddingBottom: 5,
  },
  description: {
    color: "#495e57",
    paddingRight: 5,
  },
  price: {
    fontSize: 20,
    color: "#495e57",
    paddingTop: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  avatar: {
    flex: 1,
    position: "absolute",
    right: 10,
    top: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarEmpty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0b9a6a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  heroSection: {
    backgroundColor: "#495e57",
    padding: 25,
  },
  heroHeader: {
    color: "#f4ce14",
    fontSize: 54,
  },
  heroHeader2: {
    color: "#fff",
    fontSize: 30,
  },
  heroText: {
    color: "#fff",
    fontSize: 16,
    paddingRight: 10,
  },
  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroContent: {
    flex: 1,
  },
  heroImage: {
    width: 150,
    height: 160,
    borderRadius: 16,
  },
  delivery: {
    fontSize: 18,
    paddingTop: 25,
    paddingLeft: 25,
    paddingRight: 25,
  },
});

export default Home;
