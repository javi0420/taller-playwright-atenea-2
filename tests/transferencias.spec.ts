import { test, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/paginaLogin';
import { PaginaMenuSuperior } from '../pages/paginaMenuSuperior';
import { PaginaDashboard } from '../pages/paginaDashboard';
import { PaginaModalCrearCuenta } from '../pages/paginaModalCrearCuenta';
import { PaginaModalCrearTransaccionDinero } from '../pages/paginaModalCrearTransaccionDinero';
import TestData from '../data/testData.json';
import fs from 'fs/promises';

let paginaLogin: PaginaLogin;
let paginaMenuSuperior: PaginaMenuSuperior;
let paginaDashboard: PaginaDashboard;
let paginaModalCrearCuenta: PaginaModalCrearCuenta;
let paginaModalCrearTransaccionDinero: PaginaModalCrearTransaccionDinero;

const testUsuarioEnvia = test.extend({
    storageState: require.resolve('../playwright/.auth/usuarioEnvia.json')
})

const testUsuarioRecibe = test.extend({
    storageState: require.resolve('../playwright/.auth/usuarioRecibe.json')
})

// Configuración inicial antes de cada test
test.beforeEach(async ({ page }) => {
    paginaLogin = new PaginaLogin(page);
    paginaMenuSuperior = new PaginaMenuSuperior(page);
    paginaDashboard = new PaginaDashboard(page);
    paginaModalCrearCuenta = new PaginaModalCrearCuenta(page);
    paginaModalCrearTransaccionDinero = new PaginaModalCrearTransaccionDinero(page);
    // Navegar a la página de login antes de cada test
    //await paginaDashboard.visitarPaginaDashboard();
    await paginaDashboard.visitarPaginaDashboard();
});

/* test('TC 1.1: Verificar usuario puede enviar dinero', async ({ page }) => {
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
    // Pulsar en el botón Enviar
    await paginaDashboard.pulsarElementoEnviar();
    // Verificar que el modal de crear transferencia esté visible
    await paginaModalCrearTransaccionDinero.esperarElementoCrearTransferencia();
    // Rellenar el input email destino
    await paginaModalCrearTransaccionDinero.rellenarInputEmailDestino();
    // Seleccionar la cuenta origen del usuario
    await paginaModalCrearTransaccionDinero.seleccionarCuentaOrigenUsuario();
    // Rellenar el input dinero a enviar en la transferencia
    await paginaModalCrearTransaccionDinero.rellenarInputDineroEnvioTransferencia();
    // Pulsar en el botón Enviar del modal de enviar transferencia
    await paginaModalCrearTransaccionDinero.pulsarElementoEnviarDinero();
    await page.waitForTimeout(2000); // Esperar un segundo para que el diálogo aparezca
    
}); */

testUsuarioEnvia('TC 1.2: Verificar que el usuario puede enviar dinero a otro usuario', async ({ page }) => {
    //Verificar que aparece el elemento de dashboard
    await paginaDashboard.esperarElementoDashboard();
    //Pulsar en el botón Enviar
    await paginaDashboard.pulsarElementoEnviar();
    //Verificar que aparece el modal de crear transferencia
    await paginaModalCrearTransaccionDinero.esperarElementoCrearTransferencia();
    //Rellenar el input email destino
    await paginaModalCrearTransaccionDinero.completarFormularioEnvioTransferencia();
    //Verificar que aparece el diálogo de transferencia realizada
    await paginaModalCrearTransaccionDinero.esperarMensajeTransferenciaEnviadaExitosa() + TestData.usuarioRecibeDineroTransferencia.email;
    //await paginaModalCrearTransaccionDinero.esperarElementoTransferenciaRealizada();
});

testUsuarioRecibe('TC 1.3: Verificar que el usuario recibe dinero', async ({ page }) => {
    //Verificar que aparece el elemento de dashboard
    await paginaDashboard.esperarElementoDashboard();
    await expect(page.getByText('Transferencia de ').first()).toBeVisible();


});

//Test unificado que envia dinero por API y verifica por UI.
testUsuarioRecibe('TC 1.4: Verificar transferencia recibida (Enviada por API)', async ({ page, request }) => {
    //1. Prepararacion para lectura de TOKEN y datos del remitente.

    //leemos los datos del usuario que envia dinero
    const usuarioEnviaData = require.resolve('../playwright/.data/usuarioEnvia.data.json');
    const usuarioEnviaContenidoData = await fs.readFile(usuarioEnviaData, 'utf-8');
    const datosUsuarioEnvia = JSON.parse(usuarioEnviaContenidoData);
    const emailUsuarioEnvia = datosUsuarioEnvia.email;
    expect(emailUsuarioEnvia, 'El email que envia no se leyo correctamente desde el archivo').toBeDefined(); //verificamos que el email no es nulo

    //leemos el token de autenticacion del usuario que envia dinero

    const usuarioEnviaAuth = require.resolve('../playwright/.auth/usuarioEnvia.json');
    const usuarioEnviaContenidoAuth = await fs.readFile(usuarioEnviaAuth, 'utf-8');
    const datosUsuarioEnviaAuth = JSON.parse(usuarioEnviaContenidoAuth);

    const jwtDeUsuarioEnvia = datosUsuarioEnviaAuth.origins[0]?.localStorage.find(item => item.name === 'jwt');
    expect(jwtDeUsuarioEnvia, 'El token que envia no se leyo correctamente desde el archivo').toBeDefined(); //verificamos que el token no es nulo
    const jwt = jwtDeUsuarioEnvia.value;
    //2. Obtener cuenta y enviar transferencia via API

    //Primero, obtenemos la cuenta del remitente para saver el ID de origen.
    const respuestaDeCuentas = await request.get('http://localhost:6007/api/accounts', {
        headers: {
            'Authorization': `Bearer ${jwt}`,
        }
    });
    //expect(respuestaDeCuentas.status(), "La respuesta de lectura de cuentas no fue 200:"  + respuestaDeCuentas.status()).toBe(200);
    expect(respuestaDeCuentas.ok(), `La respuesta de lectura de cuentas no fue OK + ${respuestaDeCuentas.status()}`).toBeTruthy();//otra opcion de verificar que la respuesta fue correcta   

    await page.reload(); //recargamos la pagina para que se actualicen los datos.
    await page.waitForLoadState('networkidle') //Espera a que se hagan todas las llamadas del backend
    await paginaDashboard.esperarElementoDashboard();
    const cuentas = await respuestaDeCuentas.json();
    //cuenta si tenemos alguna cuenta que sea >0 es decir mas de una cuenta. 
    expect(cuentas.length, 'No se leyeron cuentas del usuario que envia').toBeGreaterThan(0);
    const idDeCuentaOrigen = cuentas[0]._id; //tomamos el valor de ID de la primera cuenta de la lista.
    expect(idDeCuentaOrigen, 'No se encontro el ID de la cuenta origen').toBeDefined();

    //Generar un monto aleatorio para la transferencia
    const montoAleatorioTransferencia = Math.floor(Math.random() * 100) + 1; // Monto aleatorio entre 1 y 100
    //Ahora con todos los datos, podemos enviar la transferencia de dinero de 1 cuenta a la otra

    const respuestaDeTransferencia = await request.post('http://localhost:6007/api/transactions/transfer', {
        headers: {
            'Authorization': `Bearer ${jwt}`
        },
        data: {
            fromAccountId: idDeCuentaOrigen,
            toEmail: TestData.usuarioValido.email, // Destinatario Fijo.
            amount: montoAleatorioTransferencia
        }
    });
    expect(respuestaDeTransferencia.ok(), `La API para transferir dinero falló: ${respuestaDeTransferencia.status()}`).toBeTruthy();
    
    //3. Comprobar que el monto llego al destinatario por UI.
    await page.reload(); //recargamos la pagina para que se actualicen los datos.
    await page.waitForLoadState('networkidle') //Espera a que se hagan todas las llamadas del backend
    await paginaDashboard.esperarElementoDashboard();

    // Verificamos que se muestre el mail del remitente en la fila, en el primer lugar.
    await expect(paginaDashboard.elementosListaTransferencia.first()).toContainText(emailUsuarioEnvia);
    // Verificamos que se muestre el importe correcto transferido.
    // Usamos una expresión regular para buscar el numero. (ej. 5.00)
    const montoRegex = new RegExp(String(montoAleatorioTransferencia.toFixed(2)));
    await expect(paginaDashboard.elementosListaImporteTransferencia.first()).toContainText(montoRegex);



})