import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';


type Registro = {
    id: number,
    titulo: string,
    calificacion: number,
    comentarios: string,
    fotoBase64: string,
    fecha: string
}


export default function ListaScreen({ navigation }: any) {

    const dataBase = useSQLiteContext();
    const [registros, setRegistros] = useState<Registro[]>([]);

    const cargarRegistros = async () => {
        try {
            const response = await dataBase.getAllAsync<Registro>('SELECT * FROM registros  ORDER by id DESC')
            setRegistros(response);
        } catch (error) {
            console.log("Error", "Error al cargar lista: " + error)
        }

    }

    //para que se recargue cada vez que la pantalla esta en foco
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            cargarRegistros();
        })
        return unsubscribe;//cancela el listener cuando el componente se desmonta
    }, [navigation])

    const eliminarRegistro = async (id: number) => {
        console.log("ID a eliminar:", id);
        try {
            await dataBase.runAsync('DELETE FROM registros WHERE id=?', [id])
            cargarRegistros();
        } catch (error) {
            console.log("Error", "Error al eliminar registro: " + error)
        }

    }

    return (
        <SafeAreaView>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate("FormularioScreen")}>
                    <Ionicons name='add' size={35} color={'blue'} />
                </TouchableOpacity>
            </View>
            <View>
                <Text>Total registros {registros.length}</Text>
            </View>
            <View>
                <FlatList
                    data={registros}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text>No existen registros..</Text>}
                    renderItem={({ item }) => {
                        return (
                            <View>
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
                                    style={{ width: 60, height: 60, borderRadius: 75, marginRight: 15 }}
                                />

                                <View>
                                    <Text>{item.titulo}</Text>
                                    <Text>{item.calificacion}</Text>
                                </View>
                                <TouchableOpacity onPress={()=>navigation.navigate('FormularioScreen',
                                    {   
                                        idActual:item.id,
                                        tituloActual:item.titulo,
                                        calificacionActual:item.calificacion,
                                        comentariosActuales:item.comentarios,
                                        fotoActual:item.fotoBase64

                                    }
                                    )}>
                                    <Ionicons name='pencil' color={'tomato'} size={25} />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Ionicons name='eye' color={'black'} size={25} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => eliminarRegistro(item.id)}>
                                    <Ionicons name='trash' color={'red'} size={25} />
                                </TouchableOpacity>

                            </View>
                        )
                    }}
                />
            </View>
        </SafeAreaView>
    );
}