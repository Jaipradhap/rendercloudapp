import React , { useCallback , useState } from 'react';
// import Image from 'next/image';
import toast from "../components/Toast";
import styles from '../styles/Home.module.css';
import SimpleStorageContract from "../config/contracts/SimpleStorageV5.json";
import { TOKENNAME ,BASECOIN, CONTADDRESS ,TXNURL , RXSQTY} from '../config/constclient';
import Web3 from "web3";

export default function Basket(props) {
  const { cartItems, onAdd, onRemove, isConnected, web3, accounts } = props;
  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.price, 0);
  const totalPrice = itemsPrice;
  const [isLoading, setIsLoading] = useState(false);
  const [txnHash, setTxnHash] = useState(null);
  const ContractAddress = CONTADDRESS;
  const TxnTrackerurl = TXNURL;
  // env 


  const notify = useCallback((type, message , action) => {
    toast({ type, message, action });
  }, []);

   const callCont = async (totalPrize) => {
    try {
      // Get network provider and web3 instance.
      console.log('isConnected callCont--' ,isConnected);
      if(accounts) {
        console.log('accounts if callCont--' , accounts);
      let totalamt = totalPrize.toString();

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        ContractAddress
      );

        if(!instance) {
          notify("info","Please try again! To know about incentive tips ", "mmguide");
        }
        else {
      await instance.methods.BuyCart().send({ from: accounts , value: Web3.utils.toWei(totalamt, 'ether')}, 
      function(error, transactionHash){
        if (error) {
          // console.log('error --');
          // console.log(error);
          notify("warning","Please try again! To know the steps ", "mmguide");
        } else {
          // console.log('transactionHash -- ');
          // setTxnHash(transactionHash);
          notify("success", "Please find the receipt  " , TXNURL + transactionHash);
        // alert('Transaction Success! \nPlease find the Receipt in Cart Items Section');
        
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

  //logic begins 

  const callB = async () => {
    try {
      console.log('isConnected callCont--' ,isConnected);

      if(accounts) {
        console.log('accounts if callCont--' , accounts);
      // let totalamt = totalPrize.toString();
      // const networkId = await web3.eth.net.getId();
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        ContractAddress
      );

        if(!instance) {
          alert('Please try again!');
        }
        else {
          // logic starts


    await instance.methods.getBal(accounts).call(
    function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log("The accounts bal is: ",Web3.utils.fromWei(res,'ether'))
    }
  );

let bou =0;
  await instance.methods.getBought().call(
    function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      bou = res;
      console.log("The getBought is: ",res)

    }
  );
  
  for (let i=1; i<=bou;i++) {
    
  await instance.methods.getFunder(i).call(
    function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      console.log(i," Funder address is: ",res)
    }
  );
  }

  // Booked 
  let booked =0;
  await instance.methods.getBoo().call(
    function (err, res) {
      if (err) {
        console.log("An error occured", err)
        return
      }
      booked = res;
      console.log("The getBooked is: ",res)

    }
  );

  // if(booked < bou) {

  // await instance.methods.store(booked,bou).send({ from: accounts }, 
  //   function(error, transactionHash){
  //     if (error) {
  //       console.log('error --');
  //       console.log(error);
  //     } else {
  //       console.log('transactionHash -- ', transactionHash);
  //       // setTxnHash(transactionHash);
  //     alert('Transaction Success! \nPlease find the Receipt in Cart Items Section');
      
  //     }
  // });
  
// }
// else {

//   alert('Not Req' + booked + '--' +  bou);
// }

// let tokencount ='8';
//   await instance.methods.SetTokensPerMatic(Web3.utils.toWei(tokencount, 'ether')).send({ from: accounts }, 
//     function(error, transactionHash){
//       if (error) {
//         console.log('error --');
//         console.log(error);
//       } else {
//         console.log('transactionHash -- ', transactionHash);
//         // setTxnHash(transactionHash);
//       alert('Transaction Success! \nPlease find the Receipt in Cart Items Section');
      
//       }
//   });
  

  }
  } else
  {
    console.log('accounts else callCont--' , accounts);
  }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        'Please try after sometime!'
      );
      // console.error(error);
    }
  }; 
  // ends

  /* Mint */
  const buyTok = async (totalPrize) => {
    try {
    setIsLoading(true);
    console.log(totalPrize);
    
    await callCont(totalPrize);
    setIsLoading(false);
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 1000);
  } catch (err) {
    setIsLoading(false);
  }
  }


  return (
    <div className={styles.block}>
      <div>
      <div className={styles.lineqty}></div>
        {/* {cartItems.length === 0 && <div><center><h5 className={styles.headingColor}>Cart is empty</h5></center></div>} */}
        {cartItems.map((item) => (<span key={item.id}>
          <div className={styles.brow}>  <center>
            <div className={styles.bcolumn}>
            {/* <strong>{totalPrice.toFixed(3)} BNB</strong> <sup>BNB</sup> */}
            {totalPrice.toFixed(3)} 
            </div>
          {/* </div>
          <div key={item.id} className={styles.brow}> */}
            {/* <div className={styles.bcolumn}>{item.name}</div> */}
            <div className={styles.bcolumn}>
              <button onClick={() => onRemove(item)} className={styles.remove}>
                -
              </button>{' '} {item.qty} 
              <button onClick={() => onAdd(item)} className={styles.add}>
                +
              </button>
            </div> </center>
           </div>
             <div className={styles.infi}>You receive {RXSQTY * item.qty} {TOKENNAME}</div></span>
        ))}

        {cartItems.length !== 0 && (
          <>
              <div>
              
              {isConnected && (<button className={styles.paybutton} 
                onClick={(e) => {
                    e.preventDefault();
                    buyTok(totalPrice.toFixed(3));
                  }
                }
               disabled={isLoading}>
                 {isLoading && <span className={styles.loaderMint}></span>}
                Mint
              </button>)}

              </div>
               
              {/* <div className={styles.bcolumn}>
              
              {isConnected && (<button className={styles.paybutton} 
                onClick={(e) => {
                    e.preventDefault();
                    callB();
                  }
                }
               disabled={isLoading}>
                 {isLoading && <span className={styles.loaderMint}></span>}
                Store-Bal
              </button>)}

              </div> */}
            


          </>
        )}
      </div>
    </div>
  );
}
