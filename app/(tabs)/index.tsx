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
import NamesDropdown from "@/components/NamesDropdown";

export type Guest = {
    name: string
    id: string
}

export default function Meals() {
    const dbOperations = useDBOperations()
    const [nameIds, setNameIds] = useState<string[]>([])
    const [guests, setGuests] = useState<Guest[]>([])
    const [date, setDate] = useState(new Date(Date.now()))
    const [meals, setMeals] = useState(dbOperations.getMealsFromDB())
    const [contacts, setContacts] = useState<Contacts.Contact[]>([])

    log.debug("Rendering index");

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
                }
            }
            // For now, assume the user gave permission to access contacts.
            // TODO handle case where they don't give permission.
        })();
    }, []);

    const deleteGuest = (guestToDelete: Guest) => {
        setGuests(guests.filter((guest) => guest.id !== guestToDelete.id))
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
        dbOperations.saveMeal(date, guests);
        setNameIds([]);
        setMeals(dbOperations.getMealsFromDB())
    }

    const deleteMeal = (mealId: string) => {
        dbOperations.deleteMeal(mealId)
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
                                <NamesDropdown
                                    contacts={contacts}
                                    guests={guests}
                                    setGuests={setGuests}
                                />
                                {/* List of names */}
                                {
                                    (guests.length > 0) ? (
                                        <View style={{ marginTop: 8 }}>
                                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>People:</Text>
                                            <FlatList
                                                data={guests}
                                                renderItem={(guest) =>
                                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                        <Text onPress={() => { deleteGuest(guest.item) }} style={{ color: "red", fontWeight: "bold", fontSize: 24, paddingRight: 4 }}>X</Text>
                                                        <Text style={{ verticalAlign: "top", fontSize: 18, paddingLeft: 4 }}>{guest.item.name}</Text>
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
                                <MealsList meals={meals} deleteMeal={deleteMeal} />
                            </View>
                        )
                    }}>
                </FlatList>
            </SafeAreaView >
        </SafeAreaProvider >
    );
}