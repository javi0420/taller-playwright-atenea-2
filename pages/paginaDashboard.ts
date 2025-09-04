import {Page, Locator, expect} from '@playwright/test';

export class PaginaDashboard {
    readonly page: Page;
    readonly elementoTituloDashboard: Locator;
    readonly elementoAgregarCuenta: Locator;
    readonly elementoEliminarCuenta: Locator;
    readonly elementoAgregarFondo: Locator;
    readonly elementoEnviar: Locator;
    readonly elementosListaTransferencia: Locator
    readonly elementosListaImporteTransferencia: Locator

     constructor(page: Page) {
        this.page = page;
        this.elementoTituloDashboard = page.getByTestId('titulo-dashboard');
        this.elementoAgregarCuenta = page.getByTestId('tarjeta-agregar-cuenta');
        this.elementoEliminarCuenta = page.getByTestId('boton-eliminar-cuenta');
        this.elementoAgregarFondo = page.getByTestId('boton-agregar-fondo');
        this.elementoEnviar = page.getByTestId('boton-enviar');
        this.elementosListaTransferencia = page.locator('[data-testid="descripcion-transaccion"]');
        this.elementosListaImporteTransferencia = page.locator('[data-testid="monto-transaccion"]');
    
    }

    async visitarPaginaDashboard() {
        await this.page.goto('http://localhost:3000/dashboard');
    }
    async esperarElementoDashboard(){
        await expect(this.elementoTituloDashboard).toBeVisible();
    }

    async pulsarElementoAgregarCuenta() {
        await this.elementoAgregarCuenta.click();
    }

    async pulsarElementoEliminarCuenta() {
        await this.elementoEliminarCuenta.click();
    }

    async pulsarElementoAgregarFondo() {
        await this.elementoAgregarFondo.click();
    }

    async pulsarElementoEnviar() {
        await this.elementoEnviar.click();
    }
}