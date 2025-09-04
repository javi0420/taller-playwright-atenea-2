import { test, expect, request } from '@playwright/test';
import { PaginaRegistro } from '../pages/paginaRegistro';
import { PaginaLogin } from '../pages/paginaLogin';
import TestData from '../data/testData.json';

let paginaRegistro: PaginaRegistro;
let paginaLogin: PaginaLogin;

test.beforeEach(async ({ page }) => {
  // Inicializar las páginas antes de cada prueba
  paginaRegistro = new PaginaRegistro(page);
  paginaLogin = new PaginaLogin(page);
  // Visitar la página de registro antes de cada prueba
  await paginaRegistro.visitarPaginaRegistro();
  // Verificar que el formulario de registro esté visible
  await paginaRegistro.verificarFormularioRegistroVisible();
});

test('TC1 - Registro exitoso', async ({ page }) => {

  const emailAleatorio = 'Francisco.Lindo' + Math.floor(Math.random() * 1000) + '@example.com';

  // Completar el formulario de registro
  await paginaRegistro.registrarUsuario(
    'Francisco',
    'Lindo',
    emailAleatorio,
    'Test1234.'
  );
  // Verificar que la alerta de éxito esté visible
  await expect(page.getByText(paginaRegistro.alertaExito)).toBeVisible();
});

test('TC2 - Registro fallido', async ({ page }) => {
  // Completar el formulario de registro
  await paginaRegistro.registrarUsuario(
    'Francisco',
    'Lindo',
    'Francisco.Lindo219@example.com',
    'Test1234.'
  );
  // Verificar que la alerta de email ya utilizado esté visible
  await page.waitForSelector(`text=${paginaRegistro.alertaEmailUtilizado}`, { timeout: 5000 });
  await expect(page.getByText(paginaRegistro.alertaEmailUtilizado)).toBeVisible();

});

test('TC3 - verificar redireccionamiento a login despues de crear usuario', async ({ page }) => {
  const emailAleatorio = 'Francisco.Lindo' + Math.floor(Math.random() * 1000) + '@example.com';

  // Completar el formulario de registro
  await paginaRegistro.registrarUsuario(
    'Francisco',
    'Lindo',
    emailAleatorio,
    'Test1234.'
  );
  // Verificar que la alerta de éxito esté visible
  await expect(page.getByText(paginaRegistro.alertaExito)).toBeVisible();
  // Verificar que el usuario haya sido redirigido al login
  await paginaRegistro.esperarUrlLogin(paginaRegistro.urlLogin);
  // Verificar que el formulario de login esté visible
  await paginaLogin.verificarFormularioLoginVisible();
});

test('TC4 - verificar que podemos crear un usuario con la API', async ({ request }) => {
  const email = TestData.usuarioValido.email.split('@')[0] + Math.floor(Math.random() * 1000) + '@' + TestData.usuarioValido.email.split('@')[1];
  const response = await request.post('http://localhost:6007/api/auth/signup', {
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      firstName: TestData.usuarioValido.nombre,
      lastName: TestData.usuarioValido.apellido,
      email: email,
      password: TestData.usuarioValido.contraseña
    }
  })
  const responseBody = await response.json();
  // Verificar que la respuesta tenga un status 201 (Created)
  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: 'Francisco',
    lastName: 'Lindo',
    email: email
  }))
})

test('TC5 - Verificar registro existoso con datos validos verificando respuesta de API.', async ({ page, request }) => {
  await test.step('Completar formulario de registro', async () => {
    const email = TestData.usuarioValido.email.split('@')[0] + Math.floor(Math.random() * 1000) + '@' + TestData.usuarioValido.email.split('@')[1];
    await paginaRegistro.completarFormularioRegistroExitoso(
      TestData.usuarioValido.nombre,
      TestData.usuarioValido.apellido,
      email,
      TestData.usuarioValido.contraseña
    );
    /*Esto sería una especia de trampa (escuchado) porque estamos verificando 
    la respuesta de la API en lugar de la UI y aquí esta esperando a que aparezca ese request*/
    const mensajeDeCreacionDeCuenta = page.waitForResponse('**/api/auth/signup');
    await paginaRegistro.hacerClickBotonRegistrarse();
    //El request es la respuesta de la API y aquí todavía no a
    const respuesta = await mensajeDeCreacionDeCuenta;
    const responseBody = await respuesta.json();
    // Verificar que la respuesta tenga un status 201 (Created)
    expect(respuesta.status()).toBe(201);
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody).toHaveProperty('user');
    expect(responseBody.user).toEqual(expect.objectContaining({
      id: expect.any(String),
      firstName: 'Francisco',
      lastName: 'Lindo',
      email: email,
    }))
    await expect(page.getByText(paginaRegistro.alertaExito)).toBeVisible();
  })
});

test('TC6 - Verificar comportamiento front con email ya utilizado', async ({ page }) => {
  const email = TestData.usuarioValido.email.split('@')[0] + Math.floor(Math.random() * 1000) + '@' + TestData.usuarioValido.email.split('@')[1];
  //Inteceptar la solicitud de registro para simular una respuesta de error 409 o un 500 por ejemplo
  /*Es una trampa que redirecciona la respuesta de la API a lo que nosotros queramos
  y así probar el comportamiento de la UI ante diferentes respuestas de la API*/
  //await page.route('**/api/auth/signup', async route => {
    //route.fulfill({
      //status: 409,
      //contentType: 'application/json',
      //body: JSON.stringify({ message: paginaRegistro.alertaEmailUtilizado }) // stringify: convierte cualquier dato de javascript dentro de un objeto json
    //})
  //})
  await page.route('**/api/auth/signup', async route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      // stringify: convierte cualquier dato de javascript dentro de un objeto json
      body: JSON.stringify({ message: "no funciona nada" })
    })
  })
  //llenar el formulario de registro
  await paginaRegistro.registrarUsuario(
    TestData.usuarioValido.nombre,
    TestData.usuarioValido.apellido,
    email,
    TestData.usuarioValido.contraseña
  );
  //verificar que se muesre el mensaje de error
  //para el error 409
  //await expect(page.getByText(paginaRegistro.alertaEmailUtilizado)).toBeVisible();
  //para el error 500
  await expect(page.getByText("no funciona nada")).toBeVisible();
});