import React from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function users() {
  return (
    <Layout>
      <div className="grid md:grid-cols-4 md:gap-2">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Pánel</Link>
            </li>
            <li>
              <Link href="/admin/orders">Órdenes</Link>
            </li>
            <li>
              <Link href="/admin/products">Productos</Link>
            </li>
            <li>
              <Link href="/admin/users" className="font-bold">
                Usuarios
              </Link>
            </li>
          </ul>
        </div>
        <h1 className="mb-4 text-xl">Administrar Usuarios</h1>
      </div>
    </Layout>
  );
}
