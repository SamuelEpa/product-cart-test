'use client';
import React, { useEffect } from 'react';
import { List, Button, Typography, Divider, message } from 'antd';
import { Product } from '@/types/productsType';
import useSWR, { mutate } from 'swr';

const { Title } = Typography;

const Cart = () => {
  const { data: cartData, error, isValidating } = useSWR<{ cart: Product[] }>('/api/cart', (url: string) => fetch(url).then(res => res.json()));


  useEffect(() => {
    if (error) {
      message.error('Error al cargar el carrito, vea la consola parasaber mas');
      console.error('Error al cargar el carrito:', error);
    }
  }, [error]);


  const removeFromCart = async (id: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('No se pudo eliminar');
      mutate('/api/cart');
      message.success('Eliminado');
    } catch (err) {
      message.error('No se pudo eliminar el producto del carrito, ve la consola parasaber mas');
      console.error('No se pudo eliminar el producto del carrito:',err);
    }
  };


  const cartItems = cartData?.cart ?? [];
  const total = cartItems.reduce((sum, p) => sum + p.price, 0);

  return (
    <>
      <List
        loading={isValidating}
        dataSource={cartItems}
        renderItem={item => (
          <List.Item
            actions={[
              <Button danger size="small" onClick={() => removeFromCart(item.id)}>Eliminar</Button>
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`Precio: $${item.price}`}
            />
          </List.Item>
        )}
      />
      <Divider />
      <Title level={5}>Total: ${total}</Title>
    </>
  );
}


export default Cart;