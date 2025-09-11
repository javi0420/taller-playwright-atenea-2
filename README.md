# Taller Playwright Atenea 2

## 🎯 Descripción

Este proyecto forma parte del curso que realicé para obtener la **certificación en Playwright con TypeScript**.  
Aquí encontrarás ejemplos prácticos, ejercicios y buenas prácticas que desarrollé durante el taller, con el objetivo de consolidar conocimientos en **automatización de pruebas end-to-end (E2E)** y **pruebas de APIs**.

El proyecto integra ambos enfoques:
- **Pruebas E2E en la web**: validando flujos de usuario con Page Objects.  
- **Pruebas de APIs**: interactuando directamente con endpoints para preparar datos o validar respuestas.  
- **Combinación de E2E + API**: por ejemplo, la **creación de usuarios mediante API** para luego validar su correcto funcionamiento en la interfaz web.  

---

## 📁 Estructura del proyecto
| Carpeta / Archivo             | Descripción                                                                 |
|------------------------------|------------------------------------------------------------------------------|
| `data/`                      | Datos de prueba / fixtures que se usan en varios tests.                    |
| `pages/`                     | Objetos de página (Page Objects): abstracciones para interactuar con UI.    |
| `utils/`                     | Funciones utilitarias / helpers que se reutilizan en tests.                |
| `tests/`                     | Suites y casos de prueba automatizados.                                     |
| `playwright/`                | Configuraciones específicas de Playwright, hooks, etc.                     |
| `playwright.config.ts`       | Archivo de configuración de Playwright (timeout, navegadores, reporter, etc.)|
| `package.json` / `package-lock.json` | Dependencias, scripts, versiones.                                  |
| `.gitignore`                 | Archivos o carpetas que no se versionan.  

---

## 🛠️ Tecnologías utilizadas

- **Playwright** – Framework de automatización de pruebas de Microsoft  
- **TypeScript** – Tipado estático para mayor robustez y mantenibilidad  
- **Node.js / npm** – Gestión de dependencias y scripts  

---

## 🚀 Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/javi0420/taller-playwright-atenea-2.git
   cd taller-playwright-atenea-2

2. Instalar dependencias:
    ```bash
    npm install


3. Instalar navegadores de Playwright:
    ```bash
    npx playwright install


4. Ejecutar pruebas:
    ```bash
    npx playwright test

5. Opciones útiles:
    ```bash
    npx playwright test --headed → Ver ejecución en navegador
    npx playwright test --ui → Ejecutar con la interfaz de Playwright Test

## 📌 Aprendizajes clave del curso

- Diseño y desarrollo de pruebas **E2E con Playwright + TypeScript.**
- Implementación de **Page Object Model (POM)** para mejorar mantenibilidad.
- Ejecución de **pruebas de APIs**: validación de endpoints y flujos backend.
- Integración entre **pruebas de API y E2E** (ejemplo: creación de usuarios vía API → login y validación en la web).
- Uso de **fixtures y datos externos** para parametrizar pruebas.
- Generación de reportes, trazas y capturas para análisis de fallos.
- Buenas prácticas en organización de proyectos de automatización.

## 🎓 Certificación

Este proyecto fue desarrollado como parte del **curso de certificación en Playwright con TypeScript**, donde adquirí conocimientos avanzados en automatización de pruebas web y de APIs para aplicaciones modernas.

## 📣 Nota personal

Este repositorio refleja mi evolución en el área de **QA Automation** y mi compromiso con el aprendizaje continuo.
Muestra cómo combino **pruebas de APIs y E2E para validar aplicaciones de forma completa y robusta**, un enfoque muy demandado en **entornos ágiles y CI/CD.**