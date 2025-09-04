import {Page, Locator, expect} from '@playwright/test';

export class PaginaModalCrearTransaccionDinero {
    readonly page: Page;
    readonly títuloDialogoEnviarTransferencia: Locator;
    readonly textboxEmailDestino: Locator;
    readonly cuentaOrigenUsuario: Locator;
    readonly cuentaOrigenDialogoEnvioDineroUsuario: Locator;
    readonly inputDineroEnvioTransferencia: Locator;
    readonly botonCancelarEnvioDinero: Locator;
    readonly botonEnviarDinero: Locator;
    readonly mensajeTransferenciaEnviada: Locator;

     constructor(page: Page) {
        this.page = page;
        this.títuloDialogoEnviarTransferencia = page.getByRole('heading', { name: 'Enviar transferencia' })
        this.textboxEmailDestino = page.getByRole('textbox', { name: 'Email del destinatario *' })
        this.cuentaOrigenUsuario = page.getByRole('combobox', { name: 'Cuenta origen *' })
        this.cuentaOrigenDialogoEnvioDineroUsuario = page.getByRole('option', { name: '••••' })
        this.inputDineroEnvioTransferencia = page.getByRole('spinbutton', { name: 'Monto a enviar *' })
        this.botonCancelarEnvioDinero = page.getByRole('button', { name: 'Cancelar' })
        this.botonEnviarDinero = page.getByRole('button', { name: 'Enviar' })
        this.mensajeTransferenciaEnviada = page.getByText('Transferencia enviada a ')
    }

    async esperarElementoCrearTransferencia() {
        await expect(this.títuloDialogoEnviarTransferencia).toBeVisible();
    }

    async rellenarInputEmailDestino() {
        await this.textboxEmailDestino.click();
        await this.textboxEmailDestino.fill('usuarioRecibe@recibe.com');
    }
    async seleccionarCuentaOrigenUsuario() {
        await this.cuentaOrigenUsuario.click();
        await this.cuentaOrigenDialogoEnvioDineroUsuario.click();
    
    }
    async rellenarInputDineroEnvioTransferencia() {
        await this.inputDineroEnvioTransferencia.click();
        await this.inputDineroEnvioTransferencia.fill('50');
    }
    async pulsarElementoCancelarEnvioDinero() {
        await this.botonCancelarEnvioDinero.click(); 
    }   
    async pulsarElementoEnviarDinero() {
        await this.botonEnviarDinero.click(); 
    }
    async esperarMensajeTransferenciaEnviadaExitosa() {
        await expect(this.mensajeTransferenciaEnviada).toBeVisible();
    }

    async completarFormularioEnvioTransferencia(){
        await this.rellenarInputEmailDestino()
        await this.seleccionarCuentaOrigenUsuario()
        await this.rellenarInputDineroEnvioTransferencia()
        await this.pulsarElementoEnviarDinero()
    }
}