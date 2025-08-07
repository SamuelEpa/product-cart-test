  ## Tecnologias que use

- Next.js
- Typescript 
- Ant Design (para crear la UI rapido)
- SWR (para manejar la data)
  
  
  
  ## Instalacion

1. Clonar el repositorio:

```bash
git clone https://github.com/SamuelEpa/product-cart-test.git
cd product-cart-test
```

2.Instalar las dependencias:

```bash
    npm install
```

3.Iniciar el Servidor :

```bash
    npm run dev
```

  ## Explicacion

![Vista de la app](/captura.png)

1. En src/app/api/cart/route.ts se encuentran los endpoints correspondientes a /cart

2. En src/app/api/products/route.ts se encuentran los endpoints correspondientes a /products


3. Como se muestra en la imagen arriba, en el buscador escribes tu presupuesto , haga click en 'Calcular' o presione Enter, en la Tabla se mostrara la mejor combinacion posible, por detras lo que sucede es que llamamos a la funcion findBestCombination la cual esta en : src/utils/findBestCombination.ts