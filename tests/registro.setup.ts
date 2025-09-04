import { expect, test as setup } from '@playwright/test';
import { PaginaLogin } from '../pages/paginaLogin';
import { PaginaDashboard } from '../pages/paginaDashboard';
import { PaginaModalCrearCuenta } from '../pages/paginaModalCrearCuenta';
import { BackendUtils } from '../utils/backendUtils';
import TestData from '../data/testData.json';
import fs from 'fs/promises';
import path from 'path';

let paginaLogin: PaginaLogin;
let paginaDashboard: PaginaDashboard;
let paginaModalCrearCuenta: PaginaModalCrearCuenta;

const usuarioEnviaAuthFile = 'playwright/.auth/usuarioEnvia.json'
const usuarioRecibeAuthFile = 'playwright/.auth/usuarioRecibe.json'
const usuarioEnviaDataFile = 'playwright/.data/usuarioEnvia.data.json'

// Configuración inicial antes de cada test

setup.beforeEach(async ({ page }) => {
    paginaLogin = new PaginaLogin(page);
    paginaDashboard = new PaginaDashboard(page);
    paginaModalCrearCuenta = new PaginaModalCrearCuenta(page);
    await paginaLogin.visitarPaginaLogin();
    await paginaLogin.verificarFormularioLoginVisible();

});

setup("Usuario que envia dinero se logea", async ({ page, request }) => {
    const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido);

    //Guardamos los datos del nuevo usuario para usarlos en los test de transacciones.
    await fs.writeFile(path.resolve(__dirname, '..', usuarioEnviaDataFile), JSON.stringify(nuevoUsuario, null, 2));

    var tipoCuenta = "Débito"; // Puedes cambiar esto a "Ahorros" si lo deseas
    await paginaLogin.completarYHacerClickBotonLogin(nuevoUsuario);
    await paginaDashboard.esperarElementoDashboard();
    await paginaDashboard.pulsarElementoAgregarCuenta();
    await paginaModalCrearCuenta.crearCuenta(tipoCuenta);
    await paginaDashboard.esperarElementoDashboard();//importante esperar a que el dashboard este visible para que se guarde el token de autenticacion y la sesión
    await page.context().storageState({ path: usuarioEnviaAuthFile });
});
setup("Usuario que recibe dinero se logea", async ({ page }) => {
    await paginaLogin.completarYHacerClickBotonLogin(TestData.usuarioValido);
    await paginaDashboard.esperarElementoDashboard();//importante esperar a que el dashboard este visible para que se guarde el token de autenticacion y la sesión
    await page.context().storageState({ path: usuarioRecibeAuthFile });
});