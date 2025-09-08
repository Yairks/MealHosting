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
import React from "react";
import Dropdown from 'react-native-input-select';
import NamesDropdown from "@/components/NamesDropdown";

export default function Meals() {
    const dbOperations = useDBOperations()
    const [names, setNames] = useState<string[]>([])
    const [listoNames, setlistoNames] = useState<string[]>([])
    const [date, setDate] = useState(new Date(Date.now()))
    const [meals, setMeals] = useState(dbOperations.getMealsFromDB())
    const [contacts, setContacts] = useState<Contacts.Contact[]>([])
    const [contactsList, setContactsList] = useState<{ label: React.ReactElement, value: string }[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("")

    log.debug("This is a Debug log");
    log.info("This is an Info log");
    log.warn("This is a Warning log");
    log.error("This is an Error log");

    useEffect(() => {
        setlistoNames(names)
    }, [names])

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                log.info("Contact access granted")
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
                });

                if (data.length > 0) {
                    const contact = await Contacts.getContactByIdAsync(data[10].id!, [Contacts.Fields.Name]);
                    log.info("contact" + JSON.stringify(data[49]))

                    data.sort((a, b) => {
                        const aStartsWithLetter = a.name.match("^[a-zA-Z]")
                        const bStartsWithLetter = b.name.match("^[a-zA-Z]")
                        if (aStartsWithLetter && bStartsWithLetter) {
                            return a.name.localeCompare(b.name)
                        }
                        if (aStartsWithLetter) {
                            return -1
                        }
                        if (bStartsWithLetter) {
                            return 1
                        }
                        return a.name.localeCompare(b.name)
                    })
                    setContacts(data)
                    setContactsList(data.map(contact => {
                        const name = <Text style={{ fontWeight: "bold" }}>{contact.name}</Text>
                        let label: React.ReactElement
                        if (contact.phoneNumbers !== undefined && contact.phoneNumbers.length > 0) {
                            label = <Text>{name}<Text style={{ fontWeight: "100" }}>{" " + contact.phoneNumbers!![0].number}</Text></Text>
                        } else {
                            label = name
                        }

                        return {
                            label: label,
                            value: contact.id!!,
                        }
                    }))
                }
            }
            // For now, assume the user gave permission to access contacts.
            // TODO handle case where they don't give permission.
        })();
    }, []);

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

    return (
        <SafeAreaProvider>
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
                                {/* < View style={{
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
                                </View> */}
                                <NamesDropdown
                                    contactsList={contactsList}
                                    setContactsList={setContactsList}
                                    names={names}
                                    setNames={setNames}
                                />
                                {/* List of names */}
                                {/* {
                                    (listoNames.length > 0) ? (
                                        <View style={{ marginTop: 8 }}>
                                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>People:</Text>
                                            <FlatList
                                                data={listoNames}
                                                renderItem={(name) =>
                                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                        <Text onPress={() => { deleteName(name.index) }} style={{ color: "red", fontWeight: "bold", fontSize: 24, paddingRight: 4 }}>X</Text>
                                                        <Text style={{ verticalAlign: "top", fontSize: 18, paddingLeft: 4 }}>{name.item}</Text>
                                                    </View>
                                                } />
                                        </View>
                                    ) : null
                                } */}
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