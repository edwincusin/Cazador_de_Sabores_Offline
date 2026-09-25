import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Cazador de Sabores</Text>
                    <Text style={styles.headerSubtitle}>Total registros: {registros.length}</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("FormularioScreen")}>
                    <Ionicons name='add' size={30} color={'#FFFFFF'} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={registros}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No existen registros..</Text>}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.card}>
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
                                style={styles.cardImage}
                            />

                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle} numberOfLines={1}>{item.titulo}</Text>
                                <View style={styles.badge}>
                                    <Ionicons name='star' size={12} color={'#FFC700'} />
                                    <Text style={styles.badgeText}>{item.calificacion}</Text>
                                </View>
                            </View>

                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('FormularioScreen',
                                    {
                                        idActual: item.id,
                                        tituloActual: item.titulo,
                                        calificacionActual: item.calificacion,
                                        comentariosActuales: item.comentarios,
                                        fotoActual: item.fotoBase64

                                    }
                                )}>
                                    <Ionicons name='pencil' color={'#FF6243'} size={20} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Ionicons name='eye' color={'#D1004E'} size={20} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionButton} onPress={() => eliminarRegistro(item.id)}>
                                    <Ionicons name='trash' color={'#8C1152'} size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C24',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#9A93A8',
        marginTop: 2,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FF6243',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF6243',
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9A93A8',
        marginTop: 60,
        fontSize: 15,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#26232F',
        borderRadius: 18,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3A2E42',
    },
    cardImage: {
        width: 56,
        height: 56,
        borderRadius: 14,
        marginRight: 14,
        backgroundColor: '#3A2E42',
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#3A2E42',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
        gap: 4,
    },
    badgeText: {
        fontSize: 12,
        color: '#FFC700',
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 6,
    },
    actionButton: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1C1C24',
    },
});