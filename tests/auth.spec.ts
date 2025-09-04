import { test, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/paginaLogin';
import TestData from '../data/testData.json';
import { PaginaRegistro } from '../pages/paginaRegistro';
import { PaginaMenuSuperior } from '../pages/paginaMenuSuperior';
import { PaginaDashboard } from '../pages/paginaDashboard';
import { BackendUtils } from '../utils/backendUtils';

let paginaLogin: PaginaLogin;
let paginaRegistro: PaginaRegistro;
let paginaMenuSuperior: PaginaMenuSuperior;
let paginaDashboard: PaginaDashboard;

test.beforeEach(async ({ page }) => {
    // Configurar el contexto de prueba antes de cada test
    paginaLogin = new PaginaLogin(page);
    paginaRegistro = new PaginaRegistro(page);
    paginaMenuSuperior = new PaginaMenuSuperior(page);
    paginaDashboard = new PaginaDashboard(page);
    // Navegar a la página de login antes de cada test
    await paginaLogin.visitarPaginaLogin();
    await paginaLogin.verificarFormularioLoginVisible();
});
/*
Test 1.1: Login Exitoso y Redirección al Dashboard
○ Descripción: Un usuario con credenciales válidas debe poder iniciar sesión y
ser redirigido a la página principal o "Dashboard".
○ Pasos a automatizar:
1. Navegar a la página de login (/login).
2. Ingresar el email de un usuario válido.
3. Ingresar la contraseña correcta.
4. Hacer clic en el botón "Iniciar Sesión".
○ Aserciones / Vericaciones:
■ Vericar que aparece un mensaje de éxito temporal, como "Inicio de
sesión exitoso".
■ Vericar que la URL del navegador cambia a /dashboard.
■ Vericar que en la página del dashboard se muestra un elemento clave,
como el título "Dashboard" o un saludo de bienvenida.
*/
test('TC 1.1: Login Exitoso y Redirección al Dashboard', async ({ page }) => {

    // Completar el formulario de login
    await paginaLogin.realizarLoginCorrecto(TestData.usuarioValido);
    // Verificar que el mensaje de éxito esté visible
    await expect(page.getByText(paginaLogin.mensajeLoginExitoso)).toBeVisible();
    // Verificar que la URL cambió a /dashboard
    await paginaLogin.esperarUrlDashboard(paginaLogin.urlDashboard);
    // Verificar que la URL del navegador es la correcta
    await paginaLogin.comprobarUrlDashboard(paginaLogin.urlDashboard);
    // Verificar que el elemento del formulario del dashboard esté visible
    await paginaDashboard.esperarElementoDashboard();

});

/*
Test 2.1: Intento de Login con Credenciales Inválidas
○ Descripción: Si el usuario introduce una contraseña incorrecta o un email no
registrado, el sistema debe mostrar un mensaje de error claro y no permitir el
acceso.
○ Pasos a automatizar:
1. Navegar a /login.
2. Ingresar un email válido pero una contraseña incorrecta (ej:
wrongpassword).
3. Hacer clic en "Iniciar Sesión".
○ Aserciones / Vericaciones:
■ Vericar que la URL no cambia y sigue siendo /login.
■ Vericar que aparece un mensaje de error visible, como "Credenciales
inválidas" o "Email o contraseña incorrectos".
*/
test('TC 2.1: Intento de Login con Credenciales Inválidas', async ({ page }) => {
    paginaLogin = new PaginaLogin(page);

    // Completar el formulario de login
    await paginaLogin.completarFormularioLogin(TestData.usuarioInvalido);
    await paginaLogin.hacerClickBotonLogin();
    // Verificar que el mensaje de error esté visible
    await expect(page.getByText(paginaLogin.mensajeErrorCredencialesInvalidas)).toBeVisible();
    // Verificar que la URL sigue siendo /login
    await paginaLogin.comprobarUrlLogin();
});
/*
Test 2.2: Intento de Login con Campos Vacíos 
○ Descripción: El formulario debe validar que ambos campos son requeridos 
antes de intentar enviar la información al servidor. 
○ Pasos a automatizar: 
1. Navegar a /login. 
2. Hacer clic en el botón "Iniciar Sesión" sin rellenar ningún campo. 
○ Aserciones / Verificaciones: 
■ Verificar que aparecen mensajes de error junto a cada campo (ej: "El email 
es requerido", "La contraseña es requerida"). 
■ Verificar que la URL sigue siendo /login. 
*/

/* 
Este caso de prueba tiene un poco de trampa ya que no se puede 
recoger o yo no he visto forma de hacerlo de coger el texto que muestra de campo requerido solo puedo verificar que esos campos son requeridos. 
*/
test('TC 2.2: Intento de Login con Campos Vacíos', async ({ page }) => {
    paginaLogin = new PaginaLogin(page);

    // Hacer clic en el botón de iniciar sesión sin completar los campos
    await paginaLogin.hacerClickBotonLogin();
    // Verificar que los campos de email y contraseña están vacíos
    await expect(paginaLogin.emailInput).toBeEmpty();
    await expect(paginaLogin.emailInput).toHaveJSProperty('validationMessage', 'Please fill out this field.');
    await expect(paginaLogin.passwordInput).toBeEmpty();
    await expect(paginaLogin.passwordInput).toHaveJSProperty('validationMessage', 'Please fill out this field.');

    // Verificar que la URL sigue siendo /login
    await paginaLogin.comprobarUrlLogin();
});

/*
● Test 2.3: Intento de Login con Email sin Contraseña 
○ Descripción: Probar la validación de un campo individual. 
○ Pasos a automatizar: 
1. Navegar a /login. 
2. Ingresar un email válido. 
3. Dejar el campo de contraseña vacío. 
4. Hacer clic en "Iniciar Sesión". 
○ Aserciones / Verificaciones: 
■ Verificar que aparece un mensaje de error específico para el campo de la 
contraseña. 
*/
test('TC 2.3: Intento de Login con Email sin Contraseña', async ({ page }) => {
    paginaLogin = new PaginaLogin(page);

    // Completar el formulario de login con email válido y contraseña vacía
    await paginaLogin.emailInput.fill(TestData.usuarioValido.email);
    // Hacer clic en el botón de iniciar sesión
    await paginaLogin.passwordInput.fill('');
    await paginaLogin.hacerClickBotonLogin();
    await expect(paginaLogin.passwordInput).toBeEmpty();
    await expect(paginaLogin.passwordInput).toHaveJSProperty('validationMessage', 'Please fill out this field.');
    await paginaLogin.comprobarUrlLogin();

});

/*
● Test 2.4: Intento de Login con Formato de Email Incorrecto 
○ Descripción: El campo de email debe tener una validación de formato en el 
frontend. 
○ Pasos a automatizar: 
1. Navegar a /login. 
2. Ingresar un texto que no sea un email (ej: testinvalido). 
3. Ingresar cualquier contraseña. 
4. Hacer clic en "Iniciar Sesión". 
○ Aserciones / Verificaciones: 
■ Verificar que aparece un mensaje de error indicando "Formato de email 
inválido".
*/
test('TC 2.4: Intento de Login con Formato de Email Incorrecto', async ({ page }) => {
    paginaLogin = new PaginaLogin(page);

    // Completar el formulario de login con un email inválido
    await paginaLogin.emailInput.fill(TestData.usuarioFormatoEmailInvalido.email);
    await paginaLogin.passwordInput.fill(TestData.usuarioFormatoEmailInvalido.contraseña);
    // Hacer clic en el botón de iniciar sesión
    await paginaLogin.hacerClickBotonLogin();
    const mensajeEmail = await paginaLogin.emailInput.evaluate(el => (el as HTMLInputElement).validationMessage);
    expect(mensajeEmail).toContain("Please include an '@' in the email address.");
    // Verificar que la URL sigue siendo /login
    await paginaLogin.comprobarUrlLogin();
});

/*
● Test 3.1: Verificación del Enlace de Registro 
○ Descripción: El usuario debe poder navegar desde la página de login a la de 
registro. 
○ Pasos a automatizar: 
1. Navegar a /login. 
2. Localizar y hacer clic en el enlace que dice "¿No tienes una cuenta? 
Regístrate". 
○ Aserciones / Verificaciones: 
■ Verificar que la URL cambia a /signup (o la ruta que corresponda para el 
registro). 
*/
test('TC 3.1: Vericación del Enlace de Registro', async ({ page }) => {

    // Hacer clic en el botón de registrarse
    await paginaLogin.hacerClickBotonRegistrarse();
    // Verificar que la URL cambió a /signup
    await paginaRegistro.comprobarUrlRegistro();
    // Verificar que el formulario de registro esté visible
    await paginaRegistro.verificarFormularioRegistroVisible();
});


/*
● Test 3.2: Cierre de Sesión y Protección de Rutas 
○ Descripción: Un usuario que ha cerrado sesión no debe poder acceder a las 
rutas protegidas, como el Dashboard. 
○ Pasos a automatizar (Este test combina varias acciones): 
1. Primero, realizar un login exitoso (puedes reutilizar la lógica del Test 
1.1). 
2. Ya en el /dashboard, localizar y hacer clic en el botón "Cerrar Sesión". 
3. Aserción 1: Verificar que el usuario es redirigido a la página de /login. 
4. Segundo, intentar acceder a la ruta protegida: Después del logout, 
intentar navegar directamente a la URL /dashboard. 
5. Aserción 2: Verificar que Playwright fue redirigido de vuelta a /login, 
confirmando que la ruta está correctamente protegida. 
*/
test('TC 3.2: Cierre de Sesión y Protección de Rutas', async ({ page }) => {

    // Completar el formulario de login
    await paginaLogin.realizarLoginCorrecto(TestData.usuarioValido);
    // Verificar que el mensaje de éxito esté visible
    await expect(page.getByText(paginaLogin.mensajeLoginExitoso)).toBeVisible();
    // Verificar que la URL cambió a /dashboard
    await paginaLogin.esperarUrlDashboard(paginaLogin.urlDashboard);
    // Verificar que la URL del navegador es la correcta
    await paginaLogin.comprobarUrlDashboard(paginaLogin.urlDashboard);
    // Verificar que el elemento del formulario del dashboard esté visible
    await paginaDashboard.esperarElementoDashboard();
    // Hacer clic en el botón de cerrar sesión
    await paginaMenuSuperior.hacerClickBotonCerrarSesion();
    // Verificar que el mensaje de sesión cerrada esté visible
    await expect(page.getByText(paginaLogin.mensajeSesiónCerrada)).toBeVisible();
    // Verificar que la URL cambió a /login 
    await paginaLogin.comprobarUrlLogin();
    // Verificar que el formulario de login esté visible
    await paginaLogin.verificarFormularioLoginVisible();
    // Intentar acceder directamente a la URL /dashboard
    await page.goto(paginaLogin.urlDashboard);
    // Verificar que la URL cambió a /login
    await paginaLogin.comprobarUrlLogin();
    // Verificar que el formulario de login esté visible
    await paginaLogin.verificarFormularioLoginVisible();
});

test('TC 4.1: verificar que podemos loguear un usuario creado con la API', async ({ page, request }) => {
    const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido);

    const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login');
    await paginaLogin.completarYHacerClickBotonLogin(nuevoUsuario);

    const responseLogin = await responsePromiseLogin;
    const responseBodyLoginJson = await responseLogin.json();

    expect(responseLogin.status()).toBe(200);
    expect(responseBodyLoginJson).toHaveProperty('token');
    expect(typeof responseBodyLoginJson.token).toBe('string');
    expect(responseBodyLoginJson).toHaveProperty('user');
    expect(responseBodyLoginJson.user).toEqual(expect.objectContaining({
        id: expect.any(String),
        firstName: TestData.usuarioValido.nombre,
        lastName: TestData.usuarioValido.apellido,
        email: nuevoUsuario.email,
    }));


    await expect(page.getByText(paginaLogin.mensajeLoginExitoso)).toBeVisible();
    await paginaDashboard.esperarElementoDashboard();

});
