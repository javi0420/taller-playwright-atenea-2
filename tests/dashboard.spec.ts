import {test, expect} from '@playwright/test';
import { PaginaLogin } from '../pages/paginaLogin';
import { PaginaMenuSuperior } from '../pages/paginaMenuSuperior';
import { PaginaDashboard } from '../pages/paginaDashboard';
import { PaginaModalCrearCuenta } from '../pages/paginaModalCrearCuenta';
import TestData from '../data/testData.json';

let paginaLogin: PaginaLogin;
let paginaMenuSuperior: PaginaMenuSuperior;
let paginaDashboard: PaginaDashboard;
let paginaModalCrearCuenta: PaginaModalCrearCuenta;

// Configuración inicial antes de cada test
test.beforeEach(async ({ page }) => {
    paginaLogin = new PaginaLogin(page);
    paginaMenuSuperior = new PaginaMenuSuperior(page);
    paginaDashboard = new PaginaDashboard(page);
    paginaModalCrearCuenta = new PaginaModalCrearCuenta(page);
    // Navegar a la página de login antes de cada test
    await paginaLogin.visitarPaginaLogin();
    await paginaLogin.verificarFormularioLoginVisible();
});

test('TC 1.1: Agregar cuenta nueva', async ({ page }) => {
    // Completar el formulario de login
    await paginaLogin.realizarLoginCorrecto(TestData.usuarioValido);
    // Verificar que la URL cambia a la del dashboard
    await paginaLogin.esperarUrlDashboard(paginaLogin.urlDashboard);
    // Verificar que la URL del navegador es la correcta
    await paginaLogin.comprobarUrlDashboard(paginaLogin.urlDashboard);
    // Verificar que el elemento del formulario del dashboard esté visible
    await paginaDashboard.esperarElementoDashboard();
    // Pulsar en el botón Agregar cuenta
    await paginaDashboard.pulsarElementoAgregarCuenta();
    // crear cuenta añadiendo el tipo de cuenta y el monton
    await paginaModalCrearCuenta.crearCuenta();
});