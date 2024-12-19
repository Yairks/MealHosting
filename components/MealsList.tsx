import { Meals } from "@/util/dbOperations";
import { getMonthName } from "@/util/helperFunctions";
import { View, Text, FlatList, SectionList } from "react-native";

type MealsListProps = {
    meals: Meals[]
}

export default function MealsList({ meals }: MealsListProps) {
    const sectionedMeals = meals.map(meal => {
        return {
            date: meal.date,
            data: meal.guests
        }
    })

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
            <SectionList
                sections={sectionedMeals}
                renderSectionHeader={(meal) => {
                    return (
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{getMonthName(meal.section.date.getMonth())} {meal.section.date.getDate()}, {meal.section.date.getFullYear()} </Text>
                            <Text onPress={() => { }} style={{ color: "red", fontWeight: "bold", fontSize: 12, paddingRight: 4, paddingLeft: 4 }}>delete</Text>
                        </View>
                    )
                }}
                renderItem={(meal) => {
                    return (
                        <View style={{ flexDirection: "row", width: "50%", justifyContent: "space-between" }}>
                            <Text>{meal.item.name}</Text>
                            <Text>{meal.item.status}</Text>
                        </View>
                    )
                }} />
        </View>
    )
}