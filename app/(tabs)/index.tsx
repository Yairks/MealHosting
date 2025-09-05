import { useEffect, useRef, useState } from "react";
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { FontAwesome6 } from "@expo/vector-icons";
import MealsList from "@/components/MealsList";
import { useDBOperations } from "@/util/dbOperations";
import { getMonthName } from "@/util/helperFunctions";
import log from "@/util/logger";
import * as Contacts from 'expo-contacts';
import { AutocompleteDropdown, AutocompleteDropdownContextProvider, AutocompleteDropdownItem } from "react-native-autocomplete-dropdown";
import React from "react";

export default function Meals() {
    const dbOperations = useDBOperations()
    const [name, setName] = useState("")
    const [names, setNames] = useState<string[]>([])
    const addNameRef = useRef<TextInput>(null);
    const [date, setDate] = useState(new Date(Date.now()))
    const [meals, setMeals] = useState(dbOperations.getMealsFromDB())
    const [selectedItem, setSelectedItem] = useState<AutocompleteDropdownItem>();

    log.debug("This is a Debug log");
    log.info("This is an Info log");
    log.warn("This is a Warning log");
    log.error("This is an Error log");

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                log.info("Contact access granted")
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Name],
                });

                if (data.length > 0) {
                    // data.forEach(contact => log.info(contact));
                    const contact = await Contacts.getContactByIdAsync(data[10].id!, [Contacts.Fields.Name]);
                    log.info("contact" + JSON.stringify(contact))
                }
            }
            // For now, assume the user gave permission to access contacts.
            // TODO handle case where they don't give permission.
        })();
    }, []);

    const addName = () => {
        console.log("New name: " + name)
        log.info("New name: " + name)
        // No empty names
        if (name === "") {
            return;
        }

        setNames([...names, name]);
        setName("");
        if (addNameRef.current) {
            addNameRef.current.blur();
            addNameRef.current.clear();
        }
    }

    const deleteName = (removeIndex: number) => {
        setNames(names.filter((name, i) => i != removeIndex))
    }

    const onChange = (_: any, selectedDate: Date | undefined) => {
        if (selectedDate !== undefined) {
            const currentDate = selectedDate;
            setDate(currentDate);
        }
    }

    const showMode = (currentMode: 'date' | 'time') => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: false
        });
    };

    const saveMeal = () => {
        dbOperations.saveMeal(date, names);
        setNames([]);
        setMeals(dbOperations.getMealsFromDB())
    }

    const data = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
        { label: 'Item 4', value: '4' },
        { label: 'Item 5', value: '5' },
        { label: 'Item 6', value: '6' },
        { label: 'Item 7', value: '7' },
        { label: 'Item 8', value: '8' },
    ];

    return (
        <SafeAreaProvider>
            <AutocompleteDropdownContextProvider>
                <SafeAreaView style={{
                    flex: 8,
                    marginTop: 50,
                    marginLeft: 20,
                    marginRight: 20
                }}>
                    <View>
                        {/* <AutocompleteDropdown
                            clearOnFocus={false}
                            closeOnBlur={true}
                            closeOnSubmit={false}
                            initialValue={{ id: '2' }} // or just '2'
                            onSelectItem={item => item ? setSelectedItem(item) : null}
                            dataSet={[
                                { id: '1', title: 'Alpha' },
                                { id: '2', title: 'Beta' },
                                { id: '3', title: 'Gamma' },
                            ]}
                        />; */}
                    </View>
                    <FlatList
                        data={[{}]}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        keyboardShouldPersistTaps="always"
                        renderItem={() => {
                            return (
                                <View>
                                    {/* Title */}
                                    < View >
                                        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Create a new meal</Text>
                                    </View >
                                    {/* Date picker */}
                                    < Pressable onPress={() => showMode("date")
                                    } style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 4, justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <FontAwesome6 name="calendar" iconStyle="brand" style={{ fontSize: 18, marginRight: 18, marginLeft: 10 }} />
                                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{getMonthName(date.getMonth())} {date.getDate()}, {date.getFullYear()}</Text>
                                        </View>
                                        <FontAwesome6 name="angle-down" iconStyle="brand" style={{ fontSize: 18, marginRight: 10 }} />
                                    </Pressable >
                                    {/* Add new name */}
                                    < View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between"
                                    }}>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={setName}
                                            onSubmitEditing={() => addName()}
                                            placeholder="Name"
                                            ref={addNameRef} />
                                        <Pressable
                                            style={{
                                                height: 40,
                                                marginTop: 12,
                                                borderWidth: 1,
                                                padding: 10,
                                                justifyContent: "center",
                                                alignContent: "center",
                                            }}
                                            onPress={addName}>
                                            <Text>Add</Text>
                                        </Pressable>
                                    </View>
                                    {/* List of names */}
                                    {
                                        (names.length > 0) ? (
                                            <View style={{ marginTop: 8 }}>
                                                <Text style={{ fontSize: 18, fontWeight: "bold" }}>People:</Text>
                                                <FlatList
                                                    data={names}
                                                    renderItem={(name) =>
                                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                            <Text onPress={() => { deleteName(name.index) }} style={{ color: "red", fontWeight: "bold", fontSize: 24, paddingRight: 4 }}>X</Text>
                                                            <Text style={{ verticalAlign: "top", fontSize: 18, paddingLeft: 4 }}>{name.item}</Text>
                                                        </View>
                                                    } />
                                            </View>
                                        ) : null
                                    }
                                    {/* Save Meal */}
                                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 12, }}>
                                        <Pressable onPress={saveMeal}>
                                            <Text style={{
                                                height: 40,
                                                borderWidth: 1,
                                                padding: 10,
                                                flex: 0
                                            }}>Save Meal</Text>
                                        </Pressable>
                                    </View>
                                    {/* Show the meals */}
                                    <MealsList meals={meals} />
                                </View>
                            )
                        }}>
                    </FlatList>
                </SafeAreaView >
            </AutocompleteDropdownContextProvider>
        </SafeAreaProvider >
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        marginTop: 12,
        marginRight: 20,
        borderWidth: 1,
        padding: 10,
        flex: 1,
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});