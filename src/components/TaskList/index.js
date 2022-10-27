import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


export default function TaskList({ data, deleteItem, editItem }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => deleteItem(data.key)}>
                <AntDesign name='delete' size={20} color='#fff' />
            </TouchableOpacity>

            <View style={{ paddingRight: 10 }}>
                <TouchableWithoutFeedback onPress={() => editItem(data)}>
                    <Text style={{ color: '#fff', paddingRight: 10 }}>{data.nome}</Text>
                </TouchableWithoutFeedback>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#121212',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderRadius: 4,
        
    }
})

