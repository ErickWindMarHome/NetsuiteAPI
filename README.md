![alt text](https://windmar-website-cms.s3.amazonaws.com/Components/Logo/Logo-PR.webp)

## Descripcion

Este proyecto se desarrolló en respuesta a la necesidad de Windmar de compartir información con Netsuite. Se propuso la creación de una API REST destinada exclusivamente al uso interno de la empresa.

Este proyecto fue creado con el framework NEST JS para facilitar el desarrollo y la documentación de la funcionalidad del sistema, se propone además la implementación de pruebas unitarias y end2end.

## Instalacion

Para la instalación del proyecto, utilizamos **pnpm** debido a su velocidad superior tanto en la descarga de dependencias como en la inicialización del proyecto. Esto permite un proceso más eficiente y rápido en comparación con otros gestores de paquetes.

```bash
$ pnpm install
```

## Compilar y Iniciar

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Format

Utilizamos ESLint y Prettier para mantener un estándar uniforme de código y reducir posibles conflictos entre los desarrolladores del proyecto.

Para formatear el codigo usa el comando:

```bash
$ pnpm format
```
