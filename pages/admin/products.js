import React from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function products() {
  return (
    <Layout>
      <div className="grid md:grid-cols-4 md:gap-2">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products" className="font-bold">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <h1 className="mb-4 text-xl">Admin Products</h1>
      </div>
    </Layout>
  );
}
