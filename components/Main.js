import React from 'react';
import Product from './Product';
import styles from '../styles/Home.module.css'

export default function Main(props) {
  const { products, onAdd, isConnected, web3, accounts, rbal, setRbalance } = props;
  return (
    <main className="block col-2">
      {/* <h2>Products</h2> */}
      <div className={styles.grid}>
        {products.map((product) => (
          <Product key={product.id} product={product} onAdd={onAdd}
          isConnected={isConnected}
            web3={web3}
            accounts={accounts}
            rbal={rbal}
            setRbalance={setRbalance}
            ></Product>
        ))}
      </div>
    </main>
  );
}
