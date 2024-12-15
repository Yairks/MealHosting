import { Meals } from "@/util/dbOperations";
import { getMonthName } from "@/util/helperFunctions";
import { View, Text, FlatList } from "react-native";

type MealsListProps = {
    meals: Meals[]
}

export default function MealsList({ meals }: MealsListProps) {
    return (
        <View>
            <View
                style={{
                    paddingBottom: 10,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 1,
                    marginBottom: 10
                }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>Meals</Text>
            <FlatList
                data={meals}
                renderItem={(meal) => {
                    return (
                        <View>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{getMonthName(meal.item.date.getMonth())} {meal.item.date.getDate()}, {meal.item.date.getFullYear()} </Text>
                            <View style={{ flexDirection: "row", width: "50%", justifyContent: "space-between" }}>
                                <FlatList
                                    data={meal.item.guests}
                                    renderItem={(guest) => {
                                        return (
                                            <Text>{guest.item.name}</Text>
                                        )
                                    }} />
                                <FlatList
                                    data={meal.item.guests}
                                    renderItem={(guest) => {
                                        return (
                                            <Text>{guest.item.status}</Text>
                                        )
                                    }} />
                            </View>
                        </View>
                    )
                }} />
        </View>
    )
}