import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Meals',
                    tabBarIcon: ({ color }) => <FontAwesome6 size={28} name="utensils" color={color} />,
                }}
            />
            <Tabs.Screen
                name="people"
                options={{
                    title: 'People',
                    tabBarIcon: ({ color }) => <MaterialIcons size={28} name="people" color={color} />,
                }}
            />
        </Tabs>
    );
}