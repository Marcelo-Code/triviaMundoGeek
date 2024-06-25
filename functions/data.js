// /functions/data.js

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.jsonbin.io/v3/b/6679cb32e41b4d34e4086f97';
const API_KEY = '$2a$10$YQ1I8uMkOaOLz1VISWNW6.2RSfved5/2yvWqY0TQFtV0CuLEFJV4O'; // Tu clave X-MASTER-KEY aquí

const dataFilePath = path.resolve(__dirname, '../data.json');

// Función para leer los datos desde JSONBin
exports.handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      const response = await fetch(API_URL, {
        headers: {
          'X-Master-Key': API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } else if (event.httpMethod === 'POST') {
      const newData = JSON.parse(event.body);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify(newData)
      });
      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data successfully updated.' }),
      };
    } else {
      return {
        statusCode: 405,
        body: 'Method Not Allowed',
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
