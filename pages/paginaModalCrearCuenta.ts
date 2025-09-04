import {Page, Locator, expect} from '@playwright/test';

export class PaginaModalCrearCuenta {
    readonly page: Page;
    readonly títuloDialogoAgregarCuenta: Locator;
    readonly comboboxTipoCuenta: Locator;
    readonly optionTipoCuenta: Locator;
    readonly inputMontoCuenta: Locator;

    readonly buttonCrearCuentaDialogCreacionCuenta: Locator;
    readonly buttonCancelarDialogCreacionCuenta: Locator;
    

     constructor(page: Page) {
        this.page = page;
        this.títuloDialogoAgregarCuenta = page.getByTestId('titulo-modal-crear-cuenta')
        this.comboboxTipoCuenta = page.getByRole('combobox', { name: 'Tipo de cuenta *' })
        this.optionTipoCuenta = page.getByRole('option', { name: 'Débito' })
        this.inputMontoCuenta = page.getByRole('spinbutton', { name: 'Monto inicial *' })
        
        this.buttonCrearCuentaDialogCreacionCuenta = page.getByTestId('boton-crear-cuenta');
        this.buttonCancelarDialogCreacionCuenta = page.getByTestId('boton-cancelar-crear-cuenta');
    
    }

    async esperarElementoAgregarCuenta() {
        await expect(this.títuloDialogoAgregarCuenta).toBeVisible();
    }

    async pulsarComboBoxTipoCuenta() {
        await this.comboboxTipoCuenta.click();
    }

    async pulsarOptionTipoCuenta(optionTipoCuenta: string) {
        try {
            await this.page.getByRole('option', { name: optionTipoCuenta }).click();
        } catch (error) {
            console.log(`Opción no encontrada: ${optionTipoCuenta}. No existe esta opción en el combo box.`);
        }
    }

    async rellenarInputMontoCuenta() {
        await this.inputMontoCuenta.click();
        await this.inputMontoCuenta.fill('1000');
    }

    async pulsarElementoCrearCuenta() {
        await this.buttonCrearCuentaDialogCreacionCuenta.click(); 
    }

    async pulsarElementoCancelarCrearCuenta() {
        await this.buttonCancelarDialogCreacionCuenta.click();
    }
    
    async crearCuenta(tipoCuenta: string) {
        await this.esperarElementoAgregarCuenta()
        await this.pulsarComboBoxTipoCuenta()
        await this.pulsarOptionTipoCuenta(tipoCuenta)
        await this.rellenarInputMontoCuenta()
        await this.pulsarElementoCrearCuenta()
    }
}