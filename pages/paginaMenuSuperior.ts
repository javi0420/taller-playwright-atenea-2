import {Page, Locator} from '@playwright/test';

export class PaginaMenuSuperior {
    readonly page: Page;
    readonly logo: Locator;
    readonly botonIniciarSesion: Locator;
    readonly botonCrearCuenta: Locator;
    readonly botonCerrarSesion: Locator;

    constructor(page: Page) {
        this.page = page;
        this.botonIniciarSesion = page.getByTestId('boton-login-header-signup');
        this.botonCrearCuenta = page.getByTestId('boton-signup-header');
        this.logo = page.getByTestId('logo-header-login');
        this.botonCerrarSesion = page.getByTestId('boton-logout');
    }

    async hacerClickBotonCerrarSesion() {
        await this.botonCerrarSesion.click();
    }

    async hacerClickBotonCrearCuenta() {
        await this.botonCrearCuenta.click();
    }

    async hacerClickBotonIniciarSesion() {
        await this.botonIniciarSesion.click();
    }   
    
}
