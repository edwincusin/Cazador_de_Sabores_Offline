import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';



export default function FormularioScreen({ navigation, route }: any) {

  const database = useSQLiteContext();

  const idEdicion = route.params?.idActual;
  const tituloEdicion = route.params?.tituloActual || '';
  const califEdicion = route.params?.calificacionActual?.toString() || '';
  const comenEdicion = route.params?.comentariosActuales || '';

  const [titulo, setTitulo] = useState(tituloEdicion);
  const [calificacion, setCalificacion] = useState(califEdicion);
  const [comentarios, setComentarios] = useState(comenEdicion);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);


  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();

    if (permiso.status !== 'granted') return Alert.alert("Error", "Permiso denegado")

    const resultado = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.3
    });

    if (!resultado.canceled && resultado.assets[0].base64) {
      setFotoPreview(resultado.assets[0].base64)
    }
  }

  const insertRegistro = async () => {
    const fechaActual = new Date().toLocaleDateString();
    const calificacionNumero = parseInt(calificacion);
    try {
      await database.runAsync(
        'INSERT INTO registros (titulo,calificacion,comentarios,fotoBase64,fecha)VALUES (?,?,?,?,?)', titulo, calificacionNumero, comentarios, fotoPreview, fechaActual
      )
      Alert.alert("Exito", "Guardado con Exito")
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Error al guardar registro"+error)
    }
  }

   const updateRegistro = async () => {
    const calificacionNumero = parseInt(calificacion);
    try {
      await database.runAsync(
        'UPDATE registros  set titulo=?,calificacion=?,comentarios=? WHERE id=?', [titulo, calificacionNumero, comentarios, idEdicion]
      )
      Alert.alert("Exito", "Actualizacion con Exitosa")
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Error al actualizar registro")
    }
  }


  const validarCampos = () => {
    if (!titulo || !calificacion || !comentarios) {
      Alert.alert("Error", "Campos obligatorios")
      return false
    }
    const calificacionNumero = parseInt(calificacion);
    if (isNaN(calificacionNumero)) {
      Alert.alert("Error", "Calificacion debe ser un numero")
      return false
    }
    if (calificacionNumero < 1 || calificacionNumero > 5) {
      Alert.alert("Error", "La calificación debe estar entre 1 y 5")
      setCalificacion("");
      return false
    }
    return true;
  }


  const manejarGuardarEditar=()=>{
    if(!validarCampos()){
      return;
    }
    if(idEdicion){
      updateRegistro();
    }else{
      insertRegistro();
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>¿Qué plato probaste?</Text>
          <TextInput
            placeholder="Ej: Ceviche de camarón"
            value={titulo}
            onChangeText={setTitulo}
            autoFocus
          />

          <Text>Calificación (1 al 5)</Text>
          <TextInput
            placeholder="Ej: 5"
            value={calificacion}
            onChangeText={setCalificacion}
            keyboardType="numeric"
            maxLength={1}
          />


          <Text>Comentarios</Text>
          <TextInput
            placeholder="¿Qué te pareció? ¿Lo recomendarías?"
            value={comentarios}
            onChangeText={setComentarios}
            multiline
            numberOfLines={4}
          />
        </View>

        {!idEdicion && (<View>
          <TouchableOpacity onPress={tomarFoto}>
            <Ionicons name='camera' color={'black'} size={30} />
            <Text>Tomar foto</Text>
          </TouchableOpacity>
          <View>
            {fotoPreview ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${fotoPreview}` }}
                style={{ width: 150, height: 150 }} />
            ) : (
              <Text>No te olvides de tomar la foto</Text>
            )}
          </View>

        </View>
        )}

        <View>
          <TouchableOpacity onPress={() => navigation.navigate("ListaScreen")}>
            <Ionicons name='close' color={'red'} size={30} />
            <Text>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={manejarGuardarEditar}>
            <Ionicons name='save' color={'green'} size={30} />
            <Text>{idEdicion ? 'Actualizar' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}