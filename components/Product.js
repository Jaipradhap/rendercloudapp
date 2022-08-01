import Image from 'next/image'
import React ,{ useCallback , useState } from 'react';
import styles from '../styles/Home.module.css';
import { TOKENADDRESS, BASECOIN , TOKENNAME, CONTADDRESS, TXNURL } from '../config/constclient';
import SimpleStorageContract from '../config/contracts/SimpleStorageV5.json';
import toast from "../components/Toast";
import Web3 from 'web3';

export default function Product(props) {
  const { product, onAdd, isConnected, web3, accounts,  rbal, setRbalance } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingr, setIsLoadingr] = useState(false);
  
  // const [tokenAdd, setTokenAdd] = useState('Token Address');

  // const copyToken = async () => {
  //   navigator.clipboard.writeText(TOKENADDRESS);
  //   setTokenAdd('Copied!');
  //  }


  const notify = useCallback((type, message , action) => {
    toast({ type, message, action });
  }, []);

  
  const callRedeemCT = async (accounts) => {
    try {
      // Get network provider and web3 instance.
      console.log('isConnected callCont--' ,isConnected);
      if(accounts) {
        console.log('accounts if callRedeemCT--' , accounts);
      // let totalamt = totalPrize.toString();

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        CONTADDRESS
      );

        if(!instance) {
          notify("info","Please try again! To know about incentive tips ", "mmguide");
        }
        else {
      await instance.methods.WithdrawToken().send({ from: accounts }, 
      function(error, transactionHash){
        if (error) {
          notify("warning","Please try again! To know the steps ", "mmguide");
        } else {
          notify("success", "Please find redeem receipt  " , TXNURL + transactionHash);
        }
    });
  }
  } else
  {
    console.log('accounts else callCont--' , accounts);
  }
    } catch (error) {
      // Catch any errors for any of the above operations.
      notify("info","Please try again! To know about incentive tips ", "mmguide");
      // console.error(error);
    }
  }; 


    /* callredeem */
    const callredeem = async (account) => {
      try {
      setIsLoadingr(true);
      await callRedeemCT(account);
      setIsLoadingr(false);
    } catch (err) {
      setIsLoadingr(false);
    }
    }

  return (
    <span  className={styles.card}>

    <label>Mint</label>
    <div>

        {true && (<button  title="Guide" className={styles.refreshbutton} 
                onClick={(e) => {
                  e.preventDefault();
                  // setIsLoading(true);
                  // setRbalance(accounts);
                  // setIsLoading(false);
                }}
                disabled={isLoading}>
                  {/* {isLoading && <span className={styles.loaderre}></span>} */}
                  <Image src="/guide.png" alt="Refresh" width={10} height={10} />
                </button>)}
                &nbsp;
        {true && (<button title="Token Link" className={styles.refreshbutton} 
                onClick={(e) => {
                  e.preventDefault();
                  // setIsLoading(true);
                  // setRbalance(accounts);
                  // setIsLoading(false);
                }}
                disabled={isLoading}>
                  {/* {isLoading && <span className={styles.loaderre}></span>} */}
                  <Image src="/settings.png" alt="Refresh" width={10} height={10} />
                </button>)}

                &nbsp;
        {isConnected && (<button title="Refresh Balance" className={styles.refreshbutton} 
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  setRbalance(accounts);
                  setIsLoading(false);
                }}
                disabled={isLoading}>
                  {isLoading && <span className={styles.loaderre}></span>}
                  {!isLoading && <Image src="/refresh.png" alt="Refresh" width={10} height={10} />}
                </button>)}
 
      </div>

      {!isConnected && (
      <>
      <div className={styles.h3}>
      BSC Testnet 
      </div>
      <div className={styles.h33}>
      Get Base Currency {BASECOIN} <Image src="/bnbicon.png"  width={20} height={20} /> as incentive
      </div>
      </>
      )}

      {isConnected && (
      <>
      <div className={styles.h3}>
        {Number.parseFloat(rbal).toFixed(3)}<sup className={styles.supf}>BNB</sup>
      </div>
      
      {rbal <= 0 && (<div> Your Redeem Balance  </div> )}
      {rbal > 0 && (<div> <button className={styles.betbutton}
       onClick={(e) => {
        e.preventDefault();
        callredeem(accounts);
      }
      }
    disabled={isLoadingr}>
     {isLoadingr && <span className={styles.loaderre}></span>}
      Redeem</button>   </div> )}
     
      </> )}

      <div className={styles.line}></div>
       {/* <h1>Mint Token</h1> */}
      <img className="small" src={product.image} alt={product.name} width={100} height={100} />
      <h3>{product.name}</h3>
      <div>{product.price} <sup>{BASECOIN}</sup></div>
      {/* <span className={styles.toklabel} onClick={(e) => {
              e.preventDefault();
              copyToken();
            }}>{tokenAdd}</span> */}
      <div>
        <button className={styles.betbutton} onClick={() => onAdd(product)}>Add To Cart</button>
      </div>
      </span>
  );
}
