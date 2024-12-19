import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { FontAwesome6 } from "@expo/vector-icons";
import MealsList from "@/components/MealsList";
import { useDBOperations } from "@/util/dbOperations";
import { getMonthName } from "@/util/helperFunctions";
import log from "@/util/logger";


export default function Meals() {
    const dbOperations = useDBOperations()
    const [name, setName] = useState("")
    const [names, setNames] = useState<string[]>([])
    const addNameRef = useRef<TextInput>(null);
    const [date, setDate] = useState(new Date(Date.now()))
    const [meals, setMeals] = useState(dbOperations.getMealsFromDB())

    log.debug("This is a Debug log");
    log.info("This is an Info log");
    log.warn("This is a Warning log");
    log.error("This is an Error log");

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
                                    (names.length > 0) && (
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
                                    )
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
    }
});