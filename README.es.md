# Monolith

Monolith es una biblioteca para actualizar asíncronamente cualquier parte de la página con datos desde el servidor sin tener que escribir JavaScript a medida, solo decorando elementos en el HTML con atributos especiales. Estas actualizaciones pueden hacerse automáticamente justo después que la página carga o lanzarse interactivamente.

Para lograrlo, se espera que el servidor responda con una lista JSON con instrucciones. Cada instrucción es una lista con tres elementos: `["<operación>", "<id del elemento>", "<valor>"]`

Las operaciones disponibles son:

- **append**:
    Agregar el HTML *valor* al final de los hijos del elemento.

- **prepend**:
    Agregar el HTML *valor* al principio de los hijos del elemento.

- **replace**:
    Reemplazar el elemento por el HTML *valor*.

- **update**:
    Reemplazar el contenido del elememto por el HTML *valor*.

- **remove**:
    Borra el elemento.

- **addclass**:
    Agregar la clase *valor* al elemento.

- **rmclass**:
    Quitar la clase *valor* al elemento.

- **attr**:
    Espera un *valor* con la forma `atributo:valor` y actualiza el atributo del elemento.

## data-action-auto: Autocargar contenido después de la carga de la página

```html
<div data-action-auto="URL">
```

La idea es poder mostrar la página lo más rápido posible y luego usar esta función para cargar contenido secundario o que tome más tiempo en generarse. Además, de esta forma, cada sección puede ser cacheada de forma independiente.

Para usarlo, basta decorar uno o más elemento con el atributo `data-action-auto`, y se generará un GET asíncrono a esa URL inmediatamente después de cargar la página.

NOTA: Aunque técnicamente no es necesario agregar este atributo a la sección en la que cargarás el nuevo contenido (el donde insertarlo depende de lo que indique el servidor), hacerlo así es más intuitivo.


## data-action: Actualizaciones interactivas

```html
<form action="URL" method="POST" data-action>
```
```html
<a href="URL" data-action>
```

Este atributo trabajo solo agregado en elementos `<form>` o `<a>`. Funciona interceptando el envío del formulario o el click en el enlace. En vez del funcionamiento normal, el formulario genera un POST y el enlace un GET, ambos asíncronos, y en ambos casos se procesa la respuesta del servidor como instrucciones.

Algunos casos de uso:

- Decorar un botón de "Agregar al carrito de compras", y como respuesta, cargar un nuevo elemento en la lista de productos seleccionados, actualizar el precio total, y mostrar un indicador en la cabecera.

- Mostrar un modal o barra lateral con contenido dinámico, según a que objeto de una lista se le haga click.

- Decorar un botón "Marcar todo como leído" para vaciar una lista de notificaciones en la cabecera.


## data-toggle: Un simple mostrar/ocultar

```html
<a data-toggle="ID">
```

Pone o quita la clase "hide" de los elementos seleccionados al hacerle click.

Puede usarse para mostrar un popup (modal, dropdown, etc.) estático, o uno que se llene con un data-action.

Si se usa junto a un `data-action`, la acción solo se dispara cuando el elemento se muestra, no cuando se oculta.


## data-popup: Ocultar en el siguiente click


```html
<div data-popup>
```

Si un elemento con este atributo se muestra en la página, por un data-toggle o porque una acción lo insertó, cualquier click fuera de el le agregará la clase "hide" para ocultarlo.

