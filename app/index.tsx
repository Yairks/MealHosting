import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { red } from "react-native-reanimated/lib/typescript/Colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function Index() {
  const [name, setName] = useState("")
  const [names, setNames] = useState<string[]>([])

  const addName = () => {
    setNames([...names, name]);
    setName("");
  }

  const deleteName = (removeIndex: number) => {
    setNames(names.filter((name, i) => i != removeIndex))
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{
        flex: 1,
        marginTop: 50,
        marginLeft: 20,
      }}>
        <View>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Create a new meal</Text>
        </View>
        <View style={{
          flexDirection: "row",
        }}>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            placeholder="Name" />
          <Pressable style={{
            height: 40,
            marginTop: 12,
            marginRight: 20,
            borderWidth: 1,
            padding: 10,
            justifyContent: "center",
            alignContent: "center",
          }}>
            <Text onPress={addName}>Add</Text>
          </Pressable>
        </View>
        {(names.length > 0) && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>People:</Text>
            <FlatList
              data={names}
              renderItem={(name) =>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text onPress={() => { deleteName(name.index) }} style={{ color: "red", fontWeight: "bold", fontSize: 24 }}>X</Text>
                  <Text style={{ verticalAlign: "top", fontSize: 18 }}>    {name.item}  </Text>
                </View>
              } />
          </View>
        )}
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