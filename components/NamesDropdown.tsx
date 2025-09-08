import React, { useRef, useState } from "react"
import { Pressable, View, Text } from "react-native";
import Dropdown from 'react-native-input-select';
import { DropdownSelectHandle } from "react-native-input-select/lib/typescript/src/types/index.types";
import log from "@/util/logger";

type ContactName = {
    label: React.ReactElement
    value: string
}

type NamesDropdownProps = {
    contactsList: ContactName[]
    setContactsList: React.Dispatch<React.SetStateAction<ContactName[]>>
    names: string[]
    setNames: (names: string[]) => void
}

export default function NamesDropdown({ contactsList, setContactsList, names, setNames }: NamesDropdownProps) {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const dropdownRef = useRef<DropdownSelectHandle | null>(null);

    return (
        <Dropdown
            label="Select a person to invite"
            dropdownContainerStyle={{ borderWidth: 0, borderColor: "blue", margin: 0, paddingTop: 30 }}
            dropdownIconStyle={{ borderWidth: 0, borderColor: "blue", margin: 0, paddingTop: 30 }}
            placeholder=""
            isSearchable
            isMultiple
            options={contactsList}
            selectedValue={names}
            onValueChange={
                (value) => {
                    value = value as string[]
                    log.info("names are" + value)
                    setNames(value as string[])
                }
            }
            multipleSelectedItemStyle={{ display: 'none' }}
            listHeaderComponent={
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 10,
                    }}
                >
                    <Pressable
                        onPress={() => {
                            setContactsList([
                                ...contactsList,
                                { label: <Text>searchTerm</Text>, value: searchTerm }
                            ])
                            setNames([...names, searchTerm])
                        }}
                        style={{
                            backgroundColor: 'blue',
                            borderRadius: 5,
                            padding: 10,
                        }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center' }}>
                            Add New Person
                        </Text>
                    </Pressable>
                </View>
            }
            searchControls={{ searchCallback: value => setSearchTerm(value) }}
            listControls={{ keyboardShouldPersistTaps: "always" }}
            ref={dropdownRef}
        />
    )
}