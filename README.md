# Project: Academic Program Planning Tool
_This README is available in English and Spanish. Scroll down for the Spanish version._ 
_Este README está disponible en inglés y en español. Desplázate hacia abajo para la versión en español._

**Contributors:** Jacob Gomez, Uliana Topilina, Lidi Cala

---

## What does this project do?

This project connects to a MySQL database to pull academic program data, processes it with a Java application, and exports well-structured JSON files. These JSON files include:

* Course information
* General program prerequisites
* Program plans by academic quarter
* Course chains based on prerequisites

It supports two academic programs and sends the generated data to a visual interface built with JavaScript.

The HTML used is minimal — just a shell — and is populated dynamically with JavaScript using the JSON data. This makes the frontend lightweight and easier to update without touching the HTML itself.

---

## Technologies Used

* Java (data processing and JSON generation)
* MySQL (relational database)
* JavaScript (frontend logic and rendering)
* HTML/CSS (basic structure and layout)

---

## How it works

1. Java reads data from the MySQL database.
2. It structures the data and writes it into JSON files.
3. The frontend (JavaScript + HTML) loads those JSON files and builds the page dynamically, displaying:

   * All courses per quarter
   * Prerequisite connections
   * Visual guidance for planning the academic path

---

# Planificador de Programas Académicos

_Este README está disponible en inglés y en español. Esta es la versión en español._  
_This README is available in English and Spanish. Scroll up for the English version._


**Colaboradores:** Jacob Gomez, Uliana Topilina, Lidi Cala

---

## ¿Qué hace este proyecto?

Este proyecto se conecta a una base de datos MySQL para obtener información sobre programas académicos. Luego, un programa en Java procesa esos datos y genera archivos JSON bien organizados. Estos archivos contienen:

* Información de los cursos
* Prerrequisitos generales del programa
* Planes por trimestre
* Encadenamiento de cursos según sus prerrequisitos

Está preparado para manejar dos programas académicos distintos y usa los archivos JSON para alimentar una interfaz visual hecha con JavaScript.

El HTML que usamos es muy básico, casi sin contenido. Toda la información se agrega dinámicamente desde JavaScript, lo que hace que el frontend sea ligero y fácil de mantener sin tener que editar el HTML directamente.

---

## Tecnologías Utilizadas

* Java (procesamiento de datos y generación de JSON)
* MySQL (base de datos relacional)
* JavaScript (lógica del frontend y renderizado)
* HTML/CSS (estructura básica y diseño)

---

## Cómo funciona

1. Java lee los datos desde la base de datos MySQL.
2. Estructura la información y la guarda en archivos JSON.
3. El frontend (JavaScript + HTML) carga esos JSON y construye la página dinámicamente, mostrando:

   * Todos los cursos por trimestre
   * Las conexiones entre prerrequisitos
   * Una guía visual para planear la ruta académica

---

