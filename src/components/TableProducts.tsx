'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Badge,
  Drawer,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Cart from './Cart';
import { Product } from '@/types/productsType';
import useSWR, { mutate } from 'swr';
import findBestCombination from '@/utils/findBestCombination';


const TableProducts = () => {
  const [dataSource, setDataSource] = useState<Product[]>([]);
  const [budget, setBudget] = useState<number | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);


  const {
    data: products,
    error: prodError,
    isLoading: prodLoading,
  } = useSWR<Product[]>('/api/products', (url: string) => fetch(url).then(res => res.json()));
  const { data: cartData } = useSWR<{ cart: Product[] }>('/api/cart', (url: string) => fetch(url).then(res => res.json()));
  const cartCount = cartData?.cart.length ?? 0;


  useEffect(() => {
    if (products) setDataSource(products);
    if (prodError) {
      message.error("Error al cargar la lista de productos, vea la consola para saber mas ");
      console.error("Error al cargar la lista de productos:", prodError);
    }
  }, [products, prodError]);



  const onSearchBudget = (value: string) => {
    if (!value) return
    const num = Number(value);
    if (isNaN(num)) return message.error("Ingresa un presupuesto valido");
    setBudget(num);
    const combo = findBestCombination(products, num);
    setDataSource(combo);
  };

 
  const addToCart = async (id: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('No se pudo agregar al carrito');
  
      mutate('/api/cart');
      message.success('Producto agregado');
    } catch (err) {
      message.error('No se pudo agregar el producto al carrito, ve la consola parasaber mas');
      console.error('No se pudo agregar el producto al carrito:',err);
    }
  };


  const columns: ColumnsType<Product> = [
    {
      title: (
        <Typography.Title
          level={5}
        >{budget
          ? `Mejor combinacion ≤ $${budget}: ${dataSource?.length} items`
          : `Lista de productos (${products?.length})`}</Typography.Title>
      ),
      dataIndex: "reservationId",
      key: "reservationId",
      children: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 60
        },
        {
          title: 'Nombre',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Precio',
          dataIndex: 'price',
          key: 'price'
        },
        {
          title: '',
          key: 'action',
          width: 120,
          render: (_, record) => (
            <Button onClick={() => addToCart(record.id)}>
              + Carrito
            </Button>
          ),
        },
      ]
    }
  ]
    
    

  return (
    <>
      <Row gutter={12} style={{ marginBottom: 16 ,marginTop: 64}}>
        <Col xs={24} sm={16}>
          <Input.Search
            size="large"
            placeholder="Ingresa tu presupuesto"
            allowClear
            enterButton="Calcular"
            onSearch={onSearchBudget}
            onChange={e => {
              if (!e.target.value) {
                setBudget(undefined);
                setDataSource(products);
              }
            }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <div style={{ position: 'relative' }}>
            <Button
              block
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Carrito
            </Button>
            {cartCount > 0 && (
              <Badge
                count={cartCount}
                style={{
                  position: 'absolute',
                  bottom: 15,
                  left:-15
                }}
              />
            )}
          </div>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={prodLoading}
        pagination={false}
        bordered
        style={{marginTop:24,marginBottom:24}}
      />

      <Drawer
        title="Tu Carrito"
        placement="right"
        width={400}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Cart/>
      </Drawer>
    </>
  );
}


export default TableProducts;