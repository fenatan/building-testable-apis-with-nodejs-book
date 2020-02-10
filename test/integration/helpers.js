/* 
    Esse arquivo é responsável por inicializar todas as configurações
    de testes para não ter que re-configurar para cada cenário de
    testes.
*/

import supertest from 'supertest'; //Emulador para fazer requisições na API
import chai from 'chai'; //Utilizado para fazer asserções
import app from '../../src/app';

/*
    As GLOBAIS fazem parte do MOCHA e podem ser acessadas de qualquer teste
    sem necessidade de ser importado.
*/

global.app = app;
global.request = supertest(app);
global.expect = chai.expect;