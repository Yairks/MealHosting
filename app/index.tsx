import { useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { FontAwesome6 } from "@expo/vector-icons";
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

type mealDBEntry = {
  meal_id: string,
  date: string,
  name: string,
  status: string
}

export default function Index() {
  const db = SQLite.openDatabaseSync('meals');
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS meals (meal_id TEXT NOT NULL, date TEXT NOT NULL, name TEXT NOT NULL, status TEXT NOT NULL, PRIMARY KEY(name, meal_id));
  `);
  const [name, setName] = useState("")
  const [names, setNames] = useState<string[]>([])
  const addNameRef = useRef<TextInput>(null);
  const [date, setDate] = useState(new Date(Date.now()))
  const [entries, setEntries] = useState<string>()

  const addName = () => {
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

  const getMonthName = (month: number) => {
    switch (month) {
      case 0: return "Jan";
      case 1: return "Feb";
      case 2: return "Mar";
      case 3: return "Apr";
      case 4: return "May";
      case 5: return "Jun";
      case 6: return "Jul";
      case 7: return "Aug";
      case 8: return "Sep";
      case 9: return "Oct";
      case 10: return "Nov";
      case 11: return "Dec";
    }
  };

  const saveMeal = () => {
    const byteArray = new Uint8Array(4);
    Crypto.getRandomValues(byteArray);
    const statement = db.prepareSync(
      'INSERT INTO meals VALUES ($mealId, $date, $name, $status)'
    );
    try {
      const mealId = btoa(String.fromCharCode(...new Uint8Array(byteArray)));
      names.map((name) => {
        let result = statement.executeSync({
          $mealId: mealId, $date: date.toDateString(), $name: name, $status: 'invited'
        });
      })

    } finally {
      statement.finalizeSync();
    }

    setNames([])
    let meals: mealDBEntry[] = db.getAllSync("SELECT * FROM meals")

    setEntries(JSON.stringify(meals))
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        flex: 1,
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20
      }}>
        {/* Title */}
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Create a new meal</Text>
        </View>
        {/* Date picker */}
        <Pressable onPress={() => showMode("date")} style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, padding: 4, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome6 name="calendar" iconStyle="brand" style={{ fontSize: 18, marginRight: 18, marginLeft: 10 }} />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{getMonthName(date.getMonth())} {date.getDate()}, {date.getFullYear()}</Text>
          </View>
          <FontAwesome6 name="angle-down" iconStyle="brand" style={{ fontSize: 18, marginRight: 10 }} />
        </Pressable>
        {/* Add new name */}
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            onSubmitEditing={() => addName()}
            placeholder="Name"
            ref={addNameRef} />
          <Pressable style={{
            height: 40,
            marginTop: 12,
            borderWidth: 1,
            padding: 10,
            justifyContent: "center",
            alignContent: "center",
          }}>
            <Text onPress={addName}>Add</Text>
          </Pressable>
        </View>
        {/* List of names */}
        {(names.length > 0) && (
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
        )}
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
        <View>
          <Text>MEALS!</Text>
          <Text>{entries}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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