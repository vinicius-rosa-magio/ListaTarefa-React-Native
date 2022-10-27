import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import firebase from "../../service/firebaseConnection";


export default function Login({ changeStatus }) {
    const [tipo, setTipo] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    function handleLogin() {

        if (tipo === 'login') {

            const user = firebase.auth().signInWithEmailAndPassword(email.trim(), password)
                .then((user) => {
                    changeStatus(user.user.uid)
                })
                .catch((error) => {
                    console.log(error);
                    alert('Ops parece que deu algum erro.');
                    return;
                })

        } else {

            const user = firebase.auth().createUserWithEmailAndPassword(email.trim(), password)
                .then((user) => {
                    changeStatus(user.user.uid)
                })
                .catch((error) => {
                    console.log(error);
                    alert('Ops parece que deu algum erro.');
                    return;
                })
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="Seu email"
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            <TextInput
                placeholder="**********"
                style={styles.input}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity
                style={[styles.handleLogin, { backgroundColor: tipo === 'login' ? '#3ea6f2' : '#141414' }]}
                onPress={handleLogin}


            >
                <Text style={styles.loginText}>

                    {tipo === 'login' ? 'Acessar' : 'Cadastrar'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTipo(tipo => tipo === 'login' ? 'cadastrar' : 'login')}>
                <Text style={{ textAlign: 'center' }}>

                    {tipo === 'login' ? 'Criar uma conta' : 'Já possuo uma conta'}

                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#f2f6fc',
        paddingHorizontal: 10,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
        height: 45,
        padding: 10,
        borderWidth: 1,
        borderColor: '#141414',
    },
    handleLogin: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        marginBottom: 10,
    },
    loginText: {
        color: '#fff',
        fontSize: 17
    }
})