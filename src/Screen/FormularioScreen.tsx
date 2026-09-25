import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
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
  const foto = route.params?.fotoActual || '';

  const [titulo, setTitulo] = useState(tituloEdicion);
  const [calificacion, setCalificacion] = useState(califEdicion);
  const [comentarios, setComentarios] = useState(comenEdicion);
  const [fotoPreview, setFotoPreview] = useState(foto);


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
      Alert.alert("Error", "Error al guardar registro" + error)
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
    if (!fotoPreview) {
      Alert.alert("Error", "Debes tomar una foto antes de guardar");
      return false;
    }
    return true;
  }


  const manejarGuardarEditar = () => {
    if (!validarCampos()) {
      return;
    }
    if (idEdicion) {
      updateRegistro();
    } else {
      insertRegistro();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.sectionLabel}>¿Qué plato probaste?</Text>
        <TextInput
          placeholder="Ej: Ceviche de camarón"
          placeholderTextColor="#6E677D"
          value={titulo}
          onChangeText={setTitulo}
          autoFocus
          style={styles.input}
        />

        <Text style={styles.sectionLabel}>Calificación (1 al 5)</Text>
        <TextInput
          placeholder="Ej: 5"
          placeholderTextColor="#6E677D"
          value={calificacion}
          onChangeText={setCalificacion}
          keyboardType="numeric"
          maxLength={1}
          style={styles.input}
        />

        <Text style={styles.sectionLabel}>Comentarios</Text>
        <TextInput
          placeholder="¿Qué te pareció? ¿Lo recomendarías?"
          placeholderTextColor="#6E677D"
          value={comentarios}
          onChangeText={setComentarios}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />

        {!idEdicion && (
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.cameraButton} onPress={tomarFoto}>
              <Ionicons name='camera' color={'#FFFFFF'} size={22} />
              <Text style={styles.cameraButtonText}>Tomar foto</Text>
            </TouchableOpacity>

            <View style={styles.previewBox}>
              {fotoPreview ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${fotoPreview}` }}
                  style={styles.previewImage}
                />
              ) : (
                <Text style={styles.previewPlaceholder}>No te olvides de tomar la foto</Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Ionicons name='close' color={'#D1004E'} size={22} />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={manejarGuardarEditar}>
            <Ionicons name='save' color={'#FFFFFF'} size={22} />
            <Text style={styles.saveButtonText}>{idEdicion ? 'Actualizar' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C24',
  },
  scrollContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9A93A8',
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#26232F',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3A2E42',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  photoSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FF6243',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 30,
    shadowColor: '#FF6243',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  previewBox: {
    marginTop: 18,
    width: 160,
    height: 160,
    borderRadius: 20,
    backgroundColor: '#26232F',
    borderWidth: 1,
    borderColor: '#3A2E42',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    color: '#6E677D',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#26232F',
    borderWidth: 1,
    borderColor: '#D1004E',
    borderRadius: 14,
    paddingVertical: 14,
  },
  cancelButtonText: {
    color: '#D1004E',
    fontWeight: '600',
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF6243',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#FF6243',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
});