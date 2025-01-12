"use strict";
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'ProjectSoft API',
            version: '1.0.0',
            description: 'API documentation for ProjectSoft',
            contact: {
                name: 'Oscar Aguirre',
                email: 'Private'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ]
    },
    apis: ['./routes/*.js'] // Ruta a tus archivos de rutas
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
