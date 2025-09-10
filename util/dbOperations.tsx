import { useSQLiteContext } from "expo-sqlite"
import * as Crypto from 'expo-crypto';
import { Guest } from "@/app/(tabs)";

export type MealDBEntry = {
    id: string,
    date: string,
}

export type GuestDBEntry = {
    meal_id: string,
    name: string,
    status: string
}

export type Meals = {
    id: string,
    date: Date,
    guests: {
        name: string,
        status: string
    }[]
}

export const useDBOperations = () => {
    const db = useSQLiteContext();

    const getMealsFromDB = (): Meals[] => {
        const meals: MealDBEntry[] = db.getAllSync("select * from meals ORDER BY date(date) desc;")
        const mealsWithGuests = meals.map(meal => {
            const getGuestsForMealStatement = db.prepareSync(
                'SELECT name, status FROM guests where meal_id=$mealId'
            );
            const guests = getGuestsForMealStatement.executeSync({
                $mealId: meal.id
            }).getAllSync() as GuestDBEntry[];

            return {
                id: meal.id,
                date: new Date(meal.date),
                guests: guests
            }
        })

        return mealsWithGuests;
    }

    const saveMeal = (date: Date, guests: Guest[]) => {
        const byteArray = new Uint8Array(4);
        Crypto.getRandomValues(byteArray);
        const mealStatement = db.prepareSync(
            'INSERT INTO meals VALUES ($mealId, $date)'
        );
        const guestStatement = db.prepareSync(
            'INSERT INTO guests VALUES ($mealId, $guest_id, $name, $status)'
        );
        try {
            const mealId = "M" + Crypto.randomUUID().substring(0, 5)

            // Create new meal
            mealStatement.executeSync({
                $mealId: mealId, $date: date.toISOString()
            });

            // Add guests
            guests.map((guest) => {
                guestStatement.executeSync({
                    $mealId: mealId, $guest_id: guest.id, $name: guest.name, $status: 'invited'
                });
            })

        } finally {
            mealStatement.finalizeSync();
            guestStatement.finalizeSync();
        }
    }

    const deleteMeal = (mealId: string) => {
        const deleteMealStatement = db.prepareSync(
            'DELETE FROM meals WHERE id = $mealId;'
        );

        try {
            // Delete the meal
            deleteMealStatement.executeSync({
                $mealId: mealId
            });

        } finally {
            deleteMealStatement.finalizeSync();
        }
    }

    return { getMealsFromDB, saveMeal, deleteMeal }
}