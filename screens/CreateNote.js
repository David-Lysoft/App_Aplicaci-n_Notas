import React, { useState,useEffect } from 'react'
import { Text, StyleSheet, View ,TextInput ,TouchableOpacity, Alert} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';


import appFireBase from '../credenciales'
import { getFirestore,collection,addDoc,getDocs,doc,deleteDoc,getDoc,setDoc } from 'firebase/firestore';
const db = getFirestore(appFireBase);




export default function CreateNote(props) {

    const initialState = {
        titulo:'',
        detalle:''
    }

    const [date,SetDate] = useState(new Date(1598051730000));
    const [mode,SetMode] = useState("date");
    const [show,SetShow] = useState(false);
    const [text,SetText] = useState("empty");
    const [fecha,SetFecha] = useState("");
    const [estado,SetEstado] = useState(initialState);


    const onChange = (event,selectedDate) =>{
        const currentDate = selectedDate || date;
        SetShow(Platform.OS === "ios");
        SetDate(currentDate);

        let tempDate = new  Date(currentDate);
        let fDate = 
        tempDate.getDate() +
        "/"+
        (tempDate.getMonth() + 1)+
        "/"+
        tempDate.getFullYear();
        SetFecha(fDate);
    };


    const showMode = (currentDate) =>{
        SetShow(true);
        SetMode(currentDate);
    };


    const handleChangeText = (value,name) =>{
        SetEstado({...estado,[name]:value})
    }


    const saveNote = async () =>{

        try{
            if(estado.titulo === '' || estado.detalle === ''){
                Alert.alert('mensaje importante','campos obligatorios')
            }
            else{
                const nota ={
                    titulo: estado.titulo,
                    detalle: estado.detalle,
                    fecha:fecha
                }
                await addDoc(collection(db,'notas'),{
                    ...nota
                })
                Alert.alert('Exito','datos registrados correctamente')
                props.navigation.navigate('Notas')
            }
        }catch(error){
            console.log(error)
        }
        const nota ={
            titulo: estado.titulo,
            detalle: estado.detalle,
            fecha:fecha
        }
        //console.log(nota)
    }





    return (
      <View style={styles.contenedorPadre}>
                <View>
                    <TouchableOpacity>
                        <Text style={styles.title}>
                            Agrega una nueva nota 📝
                        </Text>
                    </TouchableOpacity>
                </View>
        <View style={styles.tarjeta}>
            <View style={styles.contenedor}>
                <TextInput placeholder="ingresa el titulo" style={styles.textoInput} value={estado.titulo} onChangeText={(value) => handleChangeText(value,'titulo')}/>
                <TextInput placeholder='Ingresa el detalle' multiline={true} numberOfLines={4} style={styles.textoInput} value={estado.detalle} onChangeText={(value) => handleChangeText(value,'detalle')}/>

                <View style={styles.inputDate}>
                    <TextInput placeholder='fecha limite' style={styles.textoDate} value={fecha}/>
                    <TouchableOpacity style={styles.botonDate} onPress={() =>showMode("date")}>
                        <Text style={styles.subtitle}>Date</Text>
                    </TouchableOpacity>
                </View>

                {show &&(
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChange}
                        minimumDate={new Date("2024-5-20")}
                    />
                )}

                
            </View>
            <View>
                    <TouchableOpacity 
                    style={styles.botonEnviar}  onPress={saveNote}
                    >
                        <Text style={styles.textBtnEnviar}>
                            Agregar
                        </Text>
                    </TouchableOpacity>
                </View>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    contenedorPadre:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    tarjeta:{
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
        elevation:5
    },
    contenedor:{
        padding:20
    },
    textoInput:{
        borderColor:'slategray',
        borderWidth:1,
        padding:2,
        marginTop:10,
        borderRadius:8,
    },
    botonDate:{
        backgroundColor:'orange',
        borderRadius:5,
        padding:10,
        width:'38%',
        height:'90%',
        marginTop:10,
        marginLeft:10,
    },
    textoDate:{
        borderColor:'slategray',
        borderWidth:1,
        padding:10,
        marginTop:10,
        borderRadius:8,
    },
    subtitle:{
        color:'white',
        fontSize:18,
    },
    inputDate:{
        width:'100%',
        flexWrap:'wrap',
        flexDirection:'row',
    },
    botonEnviar:{
        backgroundColor: 'green',
        borderColor: '#fff',
        borderWidth:3,
        borderRadius:20,
        marginLeft:20,
        marginRight:20,
        marginTop:20
    },
    textBtnEnviar:{
        textAlign: 'center',
        padding:10,
        color:'white',
        fontSize:16
    },
    title:{
        fontSize:25
    }
})