import {APIRequestContext, expect} from '@playwright/test';

export class BackendUtils {
    // Método para crear un usuario mediante la API
    // Recibe el contexto de la solicitud y los datos del usuario sin especificar el tipo de variable que sera el usuario (en nuestro caso un objeto)
    static async crearUsuarioPorAPI(request: APIRequestContext, usuario: any) {
        const email = (usuario.email.split('@')[0]) + Date.now().toString() + '@' + usuario.email.split('@')[1];
        const response = await request.post('http://localhost:6007/api/auth/signup', {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
             data: {
                firstName: usuario.nombre,
                lastName: usuario.apellido,
                email: email,
                password: usuario.contraseña,
            }
        });
        // Verificar que la respuesta tenga el código de estado 201 (creado)
        expect(response.status()).toBe(201);
        
        return { email: email, contraseña: usuario.contraseña }; // Retornar el usuario con el email generado
    }

    static async leerCuentasUsuarioEnvia (request: APIRequestContext, usuario: any) {
        const response = await request.get('http://localhost:6007/api/accounts', {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            }
        });
    }
}