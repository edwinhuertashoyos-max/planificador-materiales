# Planificador de materiales · Edwin Huertas

## Autor y propósito
Edwin Noe Huertas Hoyos · curso ET505 · Semana 7 · trabajo individual.
Sistema "Planificador de materiales · Edwin Huertas": organiza un pedido ficticio de materiales para un **taller de lectura con 20 estudiantes**, calcula su costo y comprueba que no supere el presupuesto. Solo se usan datos ficticios; no hay compras ni envíos.

## Ejecutar
Conserve juntos index.html, styles.css, personalizacion.css, app.js y kardex.js (kardex.html es el fragmento ya integrado en index.html). Abra index.html en Chrome o Edge. Edite app.js, guarde (Ctrl+S) y recargue (Ctrl+R). No necesita instalar paquetes ni conexión a internet.

## Responsabilidades
- index.html: estructura y entradas.
- styles.css: apariencia (incluye los mensajes en rojo y verde de la plantilla).
- kardex.html: sección del kardex (ya pegada en index.html, antes del texto final). kardex.js: reglas del kardex (`kx*`, sin pantalla) y después la pantalla; guarda en localStorage (clave `et505_s9_kardex`). personalizacion.css: etiqueta y paleta. app.js no se modificó.
- app.js: objeto `limites`, `calcularTotal` y `validarPedido` (sin acceso a pantalla); después lectura de entradas y acciones de los botones.

## Objeto pedido
`{ material: texto, cantidad: número entero, precio: número en soles }`. Lo arma `leerPedido()` y lo reciben `calcularTotal(pedido)` (devuelve el total en céntimos enteros) y `validarPedido(pedido)` (devuelve un mensaje de error o cadena vacía).

## Tres cambios TODO
1. **TODO 1 · calcularTotal:** convierte el precio a céntimos con `Math.round(precio*100)` y lo multiplica por la cantidad. Devuelve un entero (ej.: 3 × S/0.10 = 30 céntimos).
2. **TODO 2 · validarPedido:** si el total supera `limites.presupuestoCentimos` devuelve un mensaje claro; si cumple devuelve `""`.
3. **TODO 3 · botón Comprobar:** `const error = validarPedido(pedido);`. Confirmar simulación usa la misma función, así que ambos botones comparten la validación.

## Mi personalización
- Nombre del sistema: "Planificador de materiales · Edwin Huertas" (pestaña y encabezado).
- Actividad: taller de lectura con 20 estudiantes. Material de ejemplo: libros de cuentos.
- Presupuesto: **S/ 80.00** (`limites.presupuestoCentimos: 8000`), igual al texto visible en pantalla. Justificación: 20 estudiantes × S/ 4.00 por estudiante = S/ 80.00. Es múltiplo de S/ 10, está entre S/ 50 y S/ 300 y es distinto de S/ 150.
- Se mantienen las reglas: cantidad entera de 1 a 30 y precio de S/ 0.01 a S/ 50 con hasta dos decimales.

## Pruebas
Límites: 10 unidades × S/ 8.00 = S/ 80.00 (igual al presupuesto); 10 unidades × S/ 8.01 = S/ 80.10 (supera por S/ 0.10). Cada caso se probó desde Comprobar y desde Confirmar.

| N.º | Entradas | Esperado | Obtenido |
|---|---|---|---|
| 1 | libros de cuentos, 5, S/ 6.50 | Válido; total S/ 32.50, saldo S/ 47.50 | Válido; total S/ 32.50, saldo S/ 47.50 |
| 2 | cantidad 2.5; material vacío | Error de cantidad entera; error de material (mín. 3 caracteres) | Ambos errores mostrados y ficha anterior conservada |
| 3 | 10 unidades, S/ 8.00 | Válido; total S/ 80.00, saldo S/ 0.00 | Válido; total S/ 80.00, saldo S/ 0.00 |
| 4 | 10 unidades, S/ 8.01 | Error; total S/ 80.10, exceso S/ 0.10 | Error con total S/ 80.10, presupuesto S/ 80.00 y exceso S/ 0.10 |
| 5 | Confirmar 5 × S/ 6.50; luego 10 × S/ 8.01; luego Limpiar | Se conserva la ficha de S/ 32.50; Limpiar la oculta | Ficha conservada tras el error; Limpiar muestra "Todavía no ha confirmado un pedido." |

## S9 · Kardex
Integración: index.html carga `styles.css` y después `personalizacion.css`; la sección del kardex (kardex.html) va dentro de `<main>`, y `kardex.js` se carga después de `app.js` (sólo usa nombres `kx*`, sin chocar con `$`, `limites` ni `soles`).
- Materiales ficticios con **id estable** (`m1`, `m2`…, contador que no reutiliza ids) y código `MAT-001`. Búsqueda por nombre o código; cambio de nombre y demás acciones por id, nunca por posición. Si la búsqueda no tiene coincidencias se olvida la selección.
- Existencia = entradas − salidas (unidades). No es el saldo en soles del planificador.
- Entradas/salidas: enteros positivos; se rechazan 0, negativos y decimales; una salida mayor a la existencia no registra nada.
- Inactivar conserva el historial; sólo se elimina un material sin movimientos, con confirmación cancelable.
- Datos en localStorage (sólo este navegador y origen; no hay base compartida). Exportar CSV (`kardex-movimientos.csv`, UTF-8 con BOM, separado por comas) es una copia, no una sincronización con Excel.
- Personalización: etiqueta «Kardex · ET505 S9 · Edwin Huertas» con `font-size:18px`; paleta azul rgb(30,64,175) con texto blanco.

## Pruebas S9 (repetir también las pruebas 1 a 5 del planificador)
| N.º | Entradas | Esperado | Obtenido | Corrección |
|---|---|---|---|---|
| 6 | MAT-001: entrada 10, salida 3 | Existencia 7 | [anote] | [anote] |
| 7 | Salida 8 con existencia 7 | Error; existencia 7; sin movimiento nuevo | [anote] | [anote] |
| 8 | Cantidad 0, -2 y 2.5 | Se rechazan; nada cambia | [anote] | [anote] |
| 9 | Búsqueda vacía; búsqueda «zzz» y luego pulsar acciones | Vacía muestra todo sin cambiar datos; «zzz» deja sin selección | [anote] | [anote] |
| 10 | Cambiar nombre de MAT-001 | Cambia sólo ese material | [anote] | [anote] |
| 11 | Eliminar MAT-003 y Cancelar | Se conserva | [anote] | [anote] |
| 12 | Inactivar MAT-001 | Sigue en la lista con su historial | [anote] | [anote] |
| 13 | Recargar (Ctrl+R) | Materiales y movimientos conservados | [anote] | [anote] |
| 14 | Exportar CSV y abrir en Excel | Filas con fecha, código, material, tipo y cantidad correctos | [anote] | [anote] |

## Mi aporte y ayuda recibida
- Aporte: completé los tres TODO, elegí el nombre, la actividad, el presupuesto de S/ 80 y el material de ejemplo, y actualicé título, encabezado y textos de pantalla.
- Ayuda recibida: [COMPLETE: describa con sus palabras qué ayuda recibió, por ejemplo de Claude como asistente de IA, de la guía del curso o de compañeros, y qué comprobó usted mismo].

## Repositorio individual y GitHub Pages
Repositorio: [enlace propio, opcional esta semana]
Sitio: [enlace que GitHub muestre, opcional esta semana]
