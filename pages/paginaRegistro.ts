import {Page, Locator, expect} from '@playwright/test';

export class PaginaRegistro {
    readonly page: Page;
    readonly formularioRegistro : Locator;
    readonly nombreInput: Locator;
    readonly apellidoInput: Locator;
    readonly correoInput: Locator;
    readonly contrasenaInput: Locator;
    readonly botonRegistrarse: Locator; 
    readonly alertaExito: string;
    readonly alertaEmailUtilizado: string;
    readonly urlLogin: string;
    readonly formularioLogin: Locator;

    constructor (page: Page) {
        this.page = page;
        this.formularioRegistro = page.getByTestId('formulario-registro');
        this.nombreInput = page.getByRole('textbox', { name: 'Nombre' });
        this.apellidoInput = page.locator('input[name="lastName"]');
        this.correoInput = page.getByRole('textbox', { name: 'Correo electrónico' });
        this.contrasenaInput = page.getByRole('textbox', { name: 'Contraseña'});
        this.botonRegistrarse = page.getByTestId('boton-registrarse');

        this.alertaExito = "Registro exitoso!"
        this.alertaEmailUtilizado = "Email already in use";

        this.urlLogin = 'http://localhost:3000/login';

        this.formularioLogin = page.getByTestId('formulario-login');
    }

    async visitarPaginaRegistro() {
        await this.page.goto('http://localhost:3000/signup');
    }

    async verificarFormularioRegistroVisible() {
        await expect(this.formularioRegistro).toBeVisible();   
    }

    async completarFormularioRegistroExitoso(nombre: string, apellido: string, correo: string, contrasena: string) {
        await this.nombreInput.fill(nombre);
        await this.apellidoInput.fill(apellido);
        await this.correoInput.fill(correo);
        await this.contrasenaInput.fill(contrasena);
    }

    async hacerClickBotonRegistrarse() {
        await this.botonRegistrarse.click();
    }   

    async registrarUsuario(nombre: string, apellido: string, correo: string, contrasena: string) {
        await this.completarFormularioRegistroExitoso(nombre, apellido, correo, contrasena);
        await this.hacerClickBotonRegistrarse();
    }

    async esperarUrlLogin(urlLogin: string) {
        await this.page.waitForURL(urlLogin);
    }

    async comprobarUrlRegistro() {
        await expect(this.page).toHaveURL('http://localhost:3000/signup');
    }
}