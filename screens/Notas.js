import React, { useState,useEffect } from 'react'
import { Text, StyleSheet, View,ScrollView ,TouchableOpacity,Button, SafeAreaViewBase} from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';



import appFireBase from '../credenciales'
import { getFirestore,collection,addDoc,getDocs,doc,deleteDoc,getDoc,setDoc } from 'firebase/firestore';
import { ListItem,Avatar } from '@rneui/themed';
import { ListItemChevron } from '@rneui/base/dist/ListItem/ListItem.Chevron';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import { ListItemTitle } from '@rneui/base/dist/ListItem/ListItem.Title';
import { ListItemSubtitle } from '@rneui/base/dist/ListItem/ListItem.Subtitle';
const db = getFirestore(appFireBase);



export default function Notas(props) {




    
  const [pdfUri, setPdfUri] = useState('');




  const createPDF = async () => {
    try {
      const htmlContent = generateHTMLContent(lista);
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      setPdfUri(uri);
      Alert.alert('PDF generado', `PDF guardado en: ${uri}`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      Alert.alert('Error', 'Hubo un problema al generar el PDF');
    }
  };

  const sharePDF = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUri);
      } else {
        Alert.alert('Error', 'Compartir no está disponible en esta plataforma');
      }
    } catch (error) {
      console.error('Error al compartir el PDF:', error);
      Alert.alert('Error', 'Hubo un problema al compartir el PDF');
    }
  };

  const generateHTMLContent = (lista) => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .red { color: red; }
          </style>
        </head>
        <body>
          <h1>Lista de Notas</h1>
          <table>
            <tr>
              <th>Título</th>
              <th>Detalle</th>
              <th>Fecha Límite</th>
            </tr>
            ${lista.map(note => `
              <tr>
                <td>${note.titulo}</td>
                <td>${note.detalle}</td>
                <td class="${esFechaPasada(note.fecha) ? 'red' : ''}">${note.fecha}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `;
  };











    const [lista,setLista] = useState([])


    const esFechaPasada = (fecha) => {
        const fechaActual = new Date();
        const [dia, mes, año] = fecha.split('/');
        const fechaIngresada = new Date(año, mes - 1, dia);

        return fechaIngresada < fechaActual;
    };


    //logica para llamar la lista de documentos

    useEffect(() => {
        const getLista = async(item)=>{
            try{
                const querySnapshot = await getDocs(collection(db,'notas'))
                const docs = []
                querySnapshot.forEach((doc) => {
                    const {titulo,detalle,fecha}  = doc.data()
                    docs.push({
                        id:doc.id,
                        titulo,
                        detalle,
                        fecha
                    })
                })
                setLista(docs);
            }catch(error){
                console.log(error);
            }
        }
        getLista()
    },[lista])


   

    return (
        <ScrollView>
            <View>
                <TouchableOpacity style={styles.boton} onPress={() =>props.navigation.navigate('Crear')}>
                    <Text style={styles.textoBoton}>Agregar nueva nota 📚</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contenedor}>
                {lista.map((not)=>(
                    <ListItem bottomDivider key={not.id} onPress={()=>{props.navigation.navigate('Detail',{
                        notaId: not.id
                    })}}>
                        <ListItemChevron/>

                        <ListItemContent>
                            <ListItemTitle style={styles.titulo}>{not.titulo}</ListItemTitle>
                            <ListItemSubtitle style={{ color: esFechaPasada(not.fecha) ? 'red' : 'black' }}>{not.fecha}</ListItemSubtitle>
                            
                            
                        </ListItemContent>
                        <Text style={styles.detalle} onPress={()=>{props.navigation.navigate('Detail',{
                        notaId: not.id
                    })}}>Detalle ➡️</Text>
                    </ListItem>
                ))}
            </View>





            <View style={styles.container}>
        <Text style={styles.title}>Generar PDF</Text>
        <Button title="Crear PDF" onPress={createPDF} />
        {pdfUri ? (
          <>
            
            <Button title="Compartir PDF" onPress={sharePDF} />
          </>
        ) : null}
      </View>
        </ScrollView>



        
    )
}


function rellenarInputs(item){}


const styles = StyleSheet.create({
    boton:{
        backgroundColor:'#881874',
        borderColor: 'black',
        borderWidth:3,
        borderRadius:20,
        marginLeft:20,
        marginRight:20,
        marginTop:20
    },
    textoBoton:{
        textAlign:'center',
        padding:10,
        color:'white',
        fontSize:16
    },
    contenedor:{
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
    titulo:{
        fontWeight:'bold'
    },
    botonActualizar:{
        color:'green'
    },
    detalle:{
        color:'#0D6EFD',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },


    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      },
      title: {
        fontSize: 24,
        marginBottom: 16,
      },
      pdfPath: {
        marginTop: 16,
        fontSize: 16,
        color: 'blue',
      },
})
