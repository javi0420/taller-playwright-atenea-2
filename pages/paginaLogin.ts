import {Page, Locator, expect} from '@playwright/test';

export class PaginaLogin {
    readonly page: Page;
    readonly formularioLogin: Locator;
    readonly emailInput: Locator;
    readonly passwordInput : Locator;
    readonly botonIniciarSesion: Locator;
    readonly botonRegistrarse: Locator;
    readonly mensajeLoginExitoso: string;
    readonly mensajeErrorCredencialesInvalidas: string;
    readonly urlDashboard: string;
    readonly formularioDashboard: Locator;
    readonly urlLogin:string;
    readonly mensajeSesiónCerrada: string;

     constructor(page: Page) {
        this.page = page;
        this.formularioLogin = page.getByTestId('formulario-login');
        this.emailInput = page.getByRole('textbox', { name: 'Correo electrónico' })
        this.passwordInput  = page.getByRole('textbox', { name: 'Contraseña' })
        this.botonIniciarSesion = page.getByTestId('boton-login');
        this.botonRegistrarse = page.getByTestId('link-registrarse-login');
        this.mensajeLoginExitoso = "Inicio de sesión exitoso";
        this.mensajeErrorCredencialesInvalidas = "Invalid credentials";
        this.mensajeSesiónCerrada = "Sesión cerrada correctamente"; 

        this.urlDashboard='http://localhost:3000/dashboard';
        
    }

    async visitarPaginaLogin() {
        await this.page.goto('http://localhost:3000/login');
    }
    async verificarFormularioLoginVisible() {
        await expect(this.formularioLogin).toBeVisible();
    }

    async completarLoginExitoso(email: string, contraseña) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(contraseña);
        await this.botonIniciarSesion.click();
    }

    async completarFormularioLogin(usuario: {email: string, contraseña: string}) {
        await this.emailInput.fill(usuario.email);
        await this.passwordInput.fill(usuario.contraseña);
    }

    async hacerClickBotonLogin() {
        await this.botonIniciarSesion.click();
    }   

    async realizarLoginCorrecto(usuario: any){
        await this.completarFormularioLogin(usuario);
        await this.hacerClickBotonLogin();
    }

    async esperarUrlDashboard(urlDashboard: string) {
        await this.page.waitForURL(urlDashboard);
    }

     async comprobarUrlDashboard(urlDashboard: string) {
        await expect(this.page).toHaveURL('http://localhost:3000/dashboard');
    }

    async comprobarUrlLogin() {
        await expect(this.page).toHaveURL('http://localhost:3000/login');
    }

    async hacerClickBotonRegistrarse() {
        await this.botonRegistrarse.click();
    }

    async completarYHacerClickBotonLogin(usuario: {email: string, contraseña: string}) {
        await this.completarFormularioLogin(usuario);
        await this.hacerClickBotonLogin();
    }
}