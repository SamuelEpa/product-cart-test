import { NextResponse } from 'next/server';
import { products } from "@/data/products"


export async function GET() {
  try {
    const res = products

    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    console.log('Error al procesar la solicitud:', error)

    return NextResponse.json(
      { error: 'Error al procesar la solicitud, vea la consola para saber mas' },
      { status: 500 }
    );
  }
}