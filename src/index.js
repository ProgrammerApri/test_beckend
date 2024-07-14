// src/index.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { loadMockData } = require('./data');
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library System API',
            version: '1.0.0',
            description: 'Library System API Documentation'
        }
    },
    apis: ['./src/routes.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: true }).then(() => {
    loadMockData().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
});
