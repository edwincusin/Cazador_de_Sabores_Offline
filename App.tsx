import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { initDatabase } from './src/database/db';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense, useEffect, useState } from 'react';
import ListaScreen from './src/Screen/ListaScreen';
import FormularioScreen from './src/Screen/FormularioScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
const Stack = createNativeStackNavigator();

export default function App() {


  return (
    <Suspense fallback={
      <SafeAreaView style={stylesCarga.container}>
        <View style={stylesCarga.card}>
          <ActivityIndicator size={'large'} color={'#FF6243'} />
          <Text style={stylesCarga.title}>Cazador de Sabores</Text>
          <Text style={stylesCarga.subtitle}>Preparando tu base de datos...</Text>
        </View>
      </SafeAreaView>
    }>
      <SQLiteProvider databaseName='cazador.bd' onInit={initDatabase} useSuspense>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='ListaScreen'
            screenOptions={{
              headerStyle: { backgroundColor: '#ffffff' },
              headerTintColor: '#FF6243',
              headerTitleStyle: { fontWeight: '800', color: '#050505'}
            }}
          >
            <Stack.Screen
              name='ListaScreen'
              component={ListaScreen}
              options={{ title: 'Lista ' }}
            />
            <Stack.Screen
              name='FormularioScreen'
              component={FormularioScreen}
              options={({ route }: any) => ({
                title: route.params?.idActual ? 'Editar registro' : 'Nuevo registro'
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>

      </SQLiteProvider>
    </Suspense>
  );
}

const stylesCarga = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 28,
    backgroundColor: '#26232F',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3A2E42',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#9A93A8',
    textAlign: 'center',
  },
});