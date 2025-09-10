import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import React from "react";

export default function RootLayout() {
    async function initDB(db: SQLiteDatabase) {
        db.execSync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS meals (id TEXT NOT NULL PRIMARY KEY, date TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS guests (meal_id TEXT NOT NULL, guest_id TEXT NOT NULL, name TEXT NOT NULL, status TEXT NOT NULL, FOREIGN KEY(meal_id) REFERENCES meals(id), PRIMARY KEY(guest_id, meal_id));
        `);
    }

    return (
        <SQLiteProvider databaseName="meals.db" onInit={initDB}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </SQLiteProvider>
    );
}
