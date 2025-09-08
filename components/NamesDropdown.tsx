import React, { useRef, useState, useTransition } from "react";
import { Pressable, View, Text } from "react-native";
import Dropdown from "react-native-input-select";
import { DropdownSelectHandle } from "react-native-input-select/lib/typescript/src/types/index.types";
import log from "@/util/logger";

type ContactName = {
    label: React.ReactElement;
    value: string;
};

type NamesDropdownProps = {
    contactsList: ContactName[];
    setContactsList: React.Dispatch<React.SetStateAction<ContactName[]>>;
    nameIds: string[];
    setNames: (names: string[]) => void;
};

export default function NamesDropdown({
    contactsList,
    setContactsList,
    nameIds,
    setNames,
}: NamesDropdownProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dropdownRef = useRef<DropdownSelectHandle | null>(null);

    // React 18+ hook to defer updates safely
    const [isPending, startTransition] = useTransition();

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
            selectedValue={nameIds}
            onValueChange={(value) => {
                const arr = value as string[];
                log.info("names are " + arr);
                setTimeout(() => setNames(value as string[]), 0);
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
                            // safe: this runs onPress, not during render
                            setContactsList([
                                ...contactsList,
                                { label: <Text>{searchTerm}</Text>, value: searchTerm },
                            ]);
                            setNames([...nameIds, searchTerm]);
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
            listControls={{ keyboardShouldPersistTaps: "always" }}
            ref={dropdownRef}
        />
    );
}
