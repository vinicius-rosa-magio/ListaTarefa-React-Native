import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    FlatList,
    Keyboard,
} from 'react-native';

import Login from './src/components/Login';
import TaskList from './src/components/TaskList';
import firebase from './src/service/firebaseConnection';
import { MaterialIcons } from '@expo/vector-icons';


export default function App() {

    const [user, setUser] = useState(null);

    const [task, setTask] = useState([]);
    const inputRef = useRef(null);

    const [newTask, setNewTask] = useState('');
    const [key, setKey] = useState('');


    useEffect(() => {

        function getUser() {
            if (!user) {
                return;
            }

            firebase.database().ref('tarefas').child(user).once('value', (snapshot) => {
                setTask([]);

                snapshot?.forEach((childItem) => {
                    let data = {
                        key: childItem.key,
                        nome: childItem.val().nome
                    }
                    setTask(oldTasks => [...oldTasks, data])
                })
            })
        }

        getUser();

    }, [user])



    function handleAdd() {
        if (newTask === '') {
            return;
        }

        if (key !== '') {
            firebase.database().ref('tarefas').child(user).child(key).update({
                nome: newTask
            })
                .then(() => {
                    const taskIndex = task.findIndex(item => item.key === key)
                    let taskClone = task;
                    taskClone[taskIndex].nome = newTask

                    setTask([...taskClone])
                })

            Keyboard.dismiss();
            setNewTask('');
            setKey('');
            return;
        }

        let tarefas = firebase.database().ref('tarefas').child(user)
        let chave = tarefas.push().key;

        tarefas.child(chave).set({
            nome: newTask
        })
            .then(() => {
                const data = {
                    key: chave,
                    nome: newTask
                };

                setTask(oldTasks => [...oldTasks, data])
            })

        Keyboard.dismiss();
        setNewTask('');
    }

    function handleDelete(key) {
        firebase.database().ref('tarefas').child(user).child(key).remove()
            .then(() => {
                const findTask = task.filter(item => item.key !== key)
                setTask(findTask);
            })
    }

    function handleEdit(data) {
        setKey(data.key)
        setNewTask(data.nome)
        // subindo o teclado
        inputRef.current.focus();
    }

    function cancelEdit() {
        setKey('');
        setNewTask('');
        Keyboard.dismiss();
    }


    if (!user) {

        return <Login changeStatus={(user) => setUser(user)} />
    }

    return (
        <SafeAreaView style={styles.container}>

            {key.length > 0 && (
                <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 10 }}>
                    <TouchableOpacity onPress={cancelEdit}>
                        <MaterialIcons name='cancel' size={20} color='#ff0000' />
                    </TouchableOpacity>

                    <Text style={{ marginLeft: 5, color: '#ff0000' }}>
                        Você está editando uma tarefa!
                    </Text>
                </View>
            )}

            <View style={styles.containerTask}>
                <TextInput
                    style={styles.input}
                    placeholder='o que voce vai fazer hoje?'
                    value={newTask}
                    onChangeText={(text) => setNewTask(text)}
                    ref={inputRef}
                />

                <TouchableOpacity style={styles.buttpnAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>

            </View>

            <FlatList
                data={task}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                    <TaskList data={item} deleteItem={handleDelete} editItem={handleEdit} />
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        paddingHorizontal: 10,
        backgroundColor: '#f2f6fc'
    },
    containerTask: {
        flexDirection: 'row',
        marginTop: 20
    },
    input: {
        flex: 1,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#141414',
        height: 45
    },
    buttpnAdd: {
        backgroundColor: '#141414',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        paddingHorizontal: 14,
        borderRadius: 4
    },
    buttonText: {
        color: '#fff',
        fontSize: 22
    },
    btnSair:{
        flexDirection:'row',
        backgroundColor: '#ff0000',
        height: 40,
        alignItems:'center',
        justifyContent:'center',
        
    }

})
