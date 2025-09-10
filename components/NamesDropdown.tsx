import React, { useEffect, useRef, useState, useTransition } from "react";
import { Pressable, View, Text } from "react-native";
import Dropdown from "react-native-input-select";
import { DropdownSelectHandle } from "react-native-input-select/lib/typescript/src/types/index.types";
import log from "@/util/logger";
import { Guest } from "@/app/(tabs)";
import { Contact } from "expo-contacts";
import * as Crypto from 'expo-crypto';

type ContactName = {
    label: React.ReactElement;
    value: string;
};

type NamesDropdownProps = {
    contacts: Contact[];
    guests: Guest[];
    setGuests: (guests: Guest[]) => void;
};

export default function NamesDropdown({
    contacts,
    guests,
    setGuests,
}: NamesDropdownProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dropdownRef = useRef<DropdownSelectHandle | null>(null);
    const [contactsList, setContactsList] = useState<ContactName[]>([])
    const [guestIdList, setGuestIdList] = useState<string[]>([])
    const [guestNameList, setGuestNameList] = useState<string[]>([])

    useEffect(() => {
        setContactsList(contacts.map(contact => {
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
    }, [contacts])

    useEffect(() => {
        setGuestIdList(guests.map(guest => guest.id))
        setGuestNameList(guests.map(guest => guest.name))
    }, [guests])

    return (
        <Dropdown
            label="Select a person to invite"
            dropdownContainerStyle={{
                borderWidth: 0,
                borderColor: "blue",
                margin: 0,
                paddingTop: 30,
            }}
            dropdownIconStyle={{
                borderWidth: 0,
                borderColor: "blue",
                margin: 0,
                paddingTop: 30,
            }}
            placeholder=""
            isSearchable
            isMultiple
            options={contactsList}
            selectedValue={guestIdList}
            onValueChange={(value) => {
                // Update the guest list (there may be a new guest or one may have been removed)
                const arr = value as string[];
                log.info("names are " + arr);
                const newGuests: Guest[] = arr.map(newId => {
                    let id: string, name: string;
                    const guest = guests.filter(guest => guest.id === newId)
                    if (guest.length > 0) {
                        // The guest was found in the preexisting list of guests
                        id = guest[0].id
                        name = guest[0].name
                    } else {
                        // A new guest was added, so we need to pull them from contacts
                        const contact = contacts.filter(contact => contact.id === newId)[0]
                        id = contact.id!!
                        name = contact.name
                    }
                    return { id, name }
                })
                setTimeout(() => {
                    setGuests(newGuests)
                    setGuestIdList(newGuests.map(guest => guest.id))
                }, 0);
            }}
            multipleSelectedItemStyle={{ display: "none" }}
            listHeaderComponent={
                <View
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 10,
                    }}
                >
                    <Pressable
                        onPress={() => {
                            // New guest created. Add them to the contacts list and the guest list
                            const guestId = "G" + Crypto.randomUUID().substring(0, 5);

                            log.info("contacts list is " + searchTerm)
                            setContactsList([
                                { label: <Text style={{ fontWeight: 'bold' }}>{searchTerm}</Text>, value: guestId },
                                ...contactsList,
                            ]);
                            setGuests([...guests, { name: searchTerm, id: guestId }]);
                            setSearchTerm("")
                            dropdownRef.current?.close()
                        }}
                        style={{
                            backgroundColor: "blue",
                            borderRadius: 5,
                            padding: 10,
                        }}
                    >
                        <Text style={{ color: "white", textAlign: "center" }}>
                            Add New Person
                        </Text>
                    </Pressable>
                </View>
            }
            searchControls={{ searchCallback: value => setSearchTerm(value) }}
            listControls={{ keyboardShouldPersistTaps: "always", hideSelectAll: true }}
            ref={dropdownRef}
        />
    );
}
