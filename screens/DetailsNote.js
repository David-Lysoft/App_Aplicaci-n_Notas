import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Button,Text,Alert} from 'react-native';

import { doc, getDoc, setDoc, deleteDoc,getFirestore,appFireBase } from 'firebase/firestore';// Asegúrate de que la ruta sea correcta
const db = getFirestore(appFireBase);

export default function DetallesNota(props) {
    const [nota, setNota] = useState({
        id: "",
        titulo: "",
        detalle: "",
        fecha: "",
    });

    const obtenerNota = async (id) => {
        try {
            console.log(`Obteniendo nota con id: ${id}`);
            const dbRef = doc(db, 'notas', id);
            const docSnap = await getDoc(dbRef);
            if (docSnap.exists()) {
                const datosNota = docSnap.data();
                setNota({
                    ...datosNota,
                    id: docSnap.id,
                });
                console.log('Nota obtenida:', datosNota);
            } else {
                Alert.alert("Error", "La nota no existe");
            }
        } catch (error) {
            console.error("Error al obtener la nota:", error);
            Alert.alert("Error", "Hubo un problema al obtener la nota");
        }
    };

    useEffect(() => {
        if (props.route.params.notaId) {
            obtenerNota(props.route.params.notaId);
        }
    }, [props.route.params.notaId]);

    const manejarCambioTexto = (nombre, valor) => {
        setNota({ ...nota, [nombre]: valor });
    };

    const actualizarNota = async () => {
        if (nota.id) {
            const dbRef = doc(db, 'notas', nota.id);
            try {
                await setDoc(dbRef, {
                    titulo: nota.titulo,
                    detalle: nota.detalle,
                    fecha: nota.fecha,
                });
                Alert.alert("Éxito", "Nota actualizada correctamente");
                props.navigation.navigate('Notas')
            } catch (error) {
                console.error("Error al actualizar la nota:", error);
                Alert.alert("Error", "Hubo un problema al actualizar la nota");
            }
        }
    };

    const eliminarNota = async () => {
        if (nota.id) {
            const dbRef = doc(db, 'notas', nota.id);
            try {
                await deleteDoc(dbRef);
                Alert.alert("Éxito", "Nota eliminada correctamente");
                props.navigation.navigate('Notas'); // Navega a la lista de notas
            } catch (error) {
                console.error("Error al eliminar la nota:", error);
                Alert.alert("Error", "Hubo un problema al eliminar la nota");
            }
        }
    };

    return (
        <ScrollView >
            <View style={styles.container}>
            <View style={styles.inputGroup}>
                <Text style={styles.center}>TITULO 📜</Text>
                <TextInput 
                    marginBottom='30px'
                    fontSize='20'
                    textAlign='center'
                    placeholder="Título"
                    value={nota.titulo}
                    onChangeText={(valor) => manejarCambioTexto("titulo", valor)}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.center}>DETALLE 📋</Text>
                <TextInput 
                    fontSize='20'
                    textAlign='center'
                    placeholder="Detalle"
                    value={nota.detalle}
                    onChangeText={(valor) => manejarCambioTexto("detalle", valor)}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.center}>FECHA 📅</Text>
                <TextInput
                    fontSize='20'
                    textAlign='center' 
                    placeholder="Fecha"
                    value={nota.fecha}
                    
                    onChangeText={(valor) => manejarCambioTexto("fecha", valor)}
                />
            </View>
            </View>
            <View style={styles.botonActualizar}>
                <Button color="green" title="Actualizar" onPress={actualizarNota}/>
            </View>
            <View style={styles.botonEliminar}>
                <Button color="#E37399" title="Eliminar" onPress={eliminarNota}/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        margin:20,
        backgroundColor:'white',
        borderRadius:20,
        width:'90%',
        padding:20,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
        shadowRadius:4,
        elevation:5,
        fontSize:30
    },
    inputGroup: {
        textAlign:'center',
        flex: 1,
        padding: 0,
        marginBottom: 15,
        
    },
    botonEliminar: {
        borderColor: '#FC4F00',
        borderWidth: 3,
        borderRadius: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        color: '#fff',
        shadowColor:'red',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
    },
    botonActualizar: {
        borderColor: 'green',
        borderWidth: 3,
        borderRadius: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        color: '#fff',
        shadowColor:'green',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.25,
    },
    center:{
        textAlign:'center',
        fontWeight:'bold',
        marginTop:5
    }
    
});
