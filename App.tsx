import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { initDatabase } from './src/database/db';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import ListaScreen from './src/Screen/ListaScreen';
import FormularioScreen from './src/Screen/FormularioScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
const Stack = createNativeStackNavigator();

export default function App() {

  const [dbInicializada, setDbInicializada] = useState(false);

  useEffect(() => {
    const preparaBD = async () => {
      await initDatabase();
      setDbInicializada(true)
    }
    preparaBD();
  }, []);

  if (!dbInicializada) {
    return (
      <SafeAreaView>
        <ActivityIndicator size={'large'} color={'blue'}/>
          <Text>Cargando datos de la base de datos..</Text>
      </SafeAreaView>
    )
  }

  return (
    <SQLiteProvider databaseName='cazador.db'>

      <NavigationContainer>
        <Stack.Navigator initialRouteName='ListaScreen'>
          <Stack.Screen
            name='ListaScreen'
            component={ListaScreen}
            options={{ title: 'Lista ' }}
          />
          <Stack.Screen
            name='FormularioScreen'
            component={FormularioScreen}
            options={{ title: 'Formulario nuevo o editar ' }}
          />
        </Stack.Navigator>
      </NavigationContainer>

    </SQLiteProvider>
  );
}
