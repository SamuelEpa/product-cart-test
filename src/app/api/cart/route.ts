import { NextResponse } from 'next/server';
import { products } from "@/data/products"


let cartId: number[] = [];

export async function GET() {
  try {
    const cartItems = [];

    for (const id of cartId) {
      const product = products.find(p => p.id === id);
      if (product) {
        cartItems.push(product);
      }
    }

    return NextResponse.json({ cart: cartItems }, { status: 200 });

  } catch (error) {
    console.log('Error al procesar la solicitud:', error)
    
    return NextResponse.json(
      { error: 'Error al procesar la solicitud, vea la consola para saber mas' },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    const exists = products.some(p => p.id === id);
    if (!exists) {
      return NextResponse.json(
        { error: `Producto con id ${id} no encontrado` },
        { status: 404 }
      );
    }

    cartId.push(id);

    return NextResponse.json({ message: 'Producto agregado al carrito' }, { status: 201 });
  } catch (error) {
    console.log('Error al procesar la solicitud:', error)

    return NextResponse.json(
      { error: 'Error al procesar la solicitud, vea la consola para saber mas' },
      { status: 500 }
    );
  }
}



export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const index = cartId.indexOf(id);
    if (index === -1) {
      return NextResponse.json({ error: 'No existe en el carrito' }, { status: 404 });
    }
    cartId.splice(index, 1);

    return NextResponse.json({ message: 'Eliminado' }, { status: 200 });
  } catch (error) {
    console.log('Error al eliminar producto del carrito:', error)

    return NextResponse.json(
      { error: 'Error al eliminar producto del carrito, vea la consola para saber mas' },
      { status: 500 }
    );
  }
}