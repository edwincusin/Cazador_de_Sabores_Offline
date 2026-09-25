import *as SQLite from "expo-sqlite";

//FUNCION PARA INICIALIZAR LA BASE DE DATOS CREAR O INICIAR
export const initDatabase = async () => {

    //ABRE LA BDD O CONECTA Y SI NO EXISTE LA CREA
    const db = await SQLite.openDatabaseAsync('cazador.bd');

    //CREAR LA TABLA EJECUTANDO LAS SETENCIAS INTERNAS 
    await db.execAsync(
        `
        PRAGMA journal_mode =WAL;
        CREATE TABLE IF NOT EXISTS registros(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            calificacion INTEGER NOT NULL,
            comentarios TEXT NOT NULL,
            fotoBase64 TEXT NOT NULL,
            fecha TEXT NOT NULL
        );
        `
    );
    console.log("Base de datos inicializada con exito!!")
}