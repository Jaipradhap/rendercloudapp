import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useCallback , useState } from "react";
import toast from "../components/Toast";
import Web3 from 'web3';
import Main from '../components/Main';
import Basket from '../components/Basket';
import data from '../components/data';
import { CONTADDRESS } from '../config/constclient';
import SimpleStorageContract from '../config/contracts/SimpleStorageV5.json';

export default function Home() {
 
  const [pizzadice, setPizzadice] = useState(false);
  const [pizzaflappy, setPizzaflappy] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [isLoadingConn, setIsLoadingConn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [rbal, setRbal] = useState(0.0);
  
 
  const notify = useCallback((type, message , action) => {
    toast({ type, message, action });
  }, []);

  /* Cart */
  const { products } = data;
  const [cartItems, setCartItems] = useState([]);
  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      if(exist.qty === 200){
        alert('Maximum Quantity achieved')
        return;
      }
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty + 1 } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
        )
      );
    }
  };
  /* Pass */



 
  /* chain switch */
  const networks = {
    polygon: {
      chainId: `0x${Number(137).toString(16)}`,
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
      },
      rpcUrls: ["https://polygon-rpc.com/"],
      blockExplorerUrls: ["https://polygonscan.com/"]
    },
    gan: {
      chainId: `0x${Number(1337).toString(16)}`,
      nativeCurrency: {
        name: "Local Native Token",
        symbol: "ETH",
        decimals: 18
      },
      rpcUrls: ["HTTP://127.0.0.1:7545"],
      blockExplorerUrls: ["https://bscscan.com"]
    },
    bsctest: {
      chainId: `0x${Number(97).toString(16)}`,
      chainName: "BSC Testnet",
      nativeCurrency: {
        name: "Binance Chain Native Token",
        symbol: "BNB",
        decimals: 18
      },
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
      blockExplorerUrls: ["https://explorer.binance.org/smart-testnet"]
    },
    bsc: {
      chainId: `0x${Number(56).toString(16)}`,
      chainName: "Binance Smart Chain Mainnet",
      nativeCurrency: {
        name: "Binance Chain Native Token",
        symbol: "BNB",
        decimals: 18
      },
      rpcUrls: [
        "https://bsc-dataseed1.binance.org",
        "https://bsc-dataseed2.binance.org",
        "https://bsc-dataseed3.binance.org",
        "https://bsc-dataseed4.binance.org",
        "https://bsc-dataseed1.defibit.io",
        "https://bsc-dataseed2.defibit.io",
        "https://bsc-dataseed3.defibit.io",
        "https://bsc-dataseed4.defibit.io",
        "https://bsc-dataseed1.ninicoin.io",
        "https://bsc-dataseed2.ninicoin.io",
        "https://bsc-dataseed3.ninicoin.io",
        "https://bsc-dataseed4.ninicoin.io",
        "wss://bsc-ws-node.nariox.org"
      ],
      blockExplorerUrls: ["https://bscscan.com"]
    }
  };
 

  /* MM Connect - begins */
  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      notify("info", "Please install MetaMask! Check the guide " , "mmguide")
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      setIsLoadingConn(true);
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          alert(
            'Please install MetaMask!'
          );
          setIsLoadingConn(false);
          return;
        }

        try {
          // if (!window.ethereum) throw new Error("No crypto wallet found");
          await currentProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                ...networks['bsctest']
              }
            ]
          });
        } catch (err) {

          // begins 
          try {
            await ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{  chainId: `0x${Number(97).toString(16)}` }],
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      ...networks['bsctest']
                    },
                  ],
                });
              } catch (addError) {
                // handle "add" error
                notify("info","Please reload and try connect wallet!", "mmguide");
                setIsLoadingConn(false);
              }
            }
            // handle other "switch" errors
          }
          // ends
          setIsLoadingConn(false);
        }

        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        console.log('bnb -- ',ethBalance);
        if (userAccount.length === 0) {
          alert('Please connect to meta mask');
          setIsLoadingConn(false);
        } else {
          setWeb3(web3);
          setAccounts(account);
          setIsLoadingConn(false);
          saveUserInfo(ethBalance, account, chainId);
        }
        setIsLoadingConn(false);
      }
        setIsLoadingConn(false);
    } catch (err) {
      notify("info","Please reload and try connect wallet!", "mmguide");
      setIsLoadingConn(false);
    }
  };

  const onDisconnect = () => {
    setUserInfo({});
    setRbal(0.0);
    setAccounts(null);
    setIsConnected(false);
    notify("info","Disconnected! To know more about incentive tips ", "tricks");
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      address: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    const userData = JSON.parse(JSON.stringify(userAccount));
    setUserInfo(userData);
    setIsConnected(true);
  };
  /*  MM Connect - ends */

   /* call ct */
   const setRbalance = async (accounts) => {
    try {

      console.log('setRbal -- ',accounts);
      if (accounts) {
        // setIsLoading(true);
        // console.log(accounts);

        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          CONTADDRESS
        );

        if (!instance) {
          // alert('Please try again!');
        }
        else {
          // logic starts

          
         await instance.methods.getBal(accounts).call(
            function (err, res) {
              if (err) {
                setIsLoading(false);
                // console.log("An error occured", err)
                // return
              }else {
                // setIsLoading(false);
              console.log(" accounts ct bal is: ", Web3.utils.fromWei(res, 'ether'))
              setRbal(Web3.utils.fromWei(res, 'ether'));
              
              }
            }
          );

        }
      }
      // setIsLoading(false);

    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(error);
      // setIsLoading(false);
      notify("info", "Please try after sometime! ", "tricks");
    }
  }
  /* call ct */

  return (
    <div className={styles.pageCol}>
      <Head>
        <title>Rabbit Eggs Cryto</title>
        <meta name="description" content="Rabbit Eggs Token RXGS based on Binance Smart Chain" /> 
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <main className={styles.main}>
        <Image src="/rxscoin.png" alt="rabbit eggs defi" width={20} height={20} />
        Bsc Testnet
        { !pizzadice && (<h3>Data-Driven Cryto Platform</h3>)}
 
        {/* : // productss */}
        {/* : // Dashboard */}
        
        {/* view cart jai */}
        {(!pizzaflappy) && (
          <div className={styles.blockOut}>

            <Main products={products} onAdd={onAdd}
            isConnected={isConnected}
            web3={web3}
            accounts={accounts}
            rbal={rbal}
            setRbalance={setRbalance}
            ></Main>

            {cartItems.length != 0 && (
              <span>
                {/* <p> &nbsp; </p> */}
                <Basket
                  cartItems={cartItems}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  isConnected={isConnected}
                  web3={web3}
                  accounts={accounts}
                ></Basket>
              </span>
            )}
            {/* </div> */}

            <div className={styles.blockC}><center>
              {!isConnected && (<button className={styles.stbutton} onClick={onConnect} disabled={isLoadingConn}
              >{isLoadingConn && <span className={styles.loaderMint}></span>}Connect Wallet</button>)}
              {isConnected && (<button className={styles.stbutton} onClick={onDisconnect}>{userInfo.address.substr(0, 5)}...{userInfo.address.substr(userInfo.address.length - 4, userInfo.address.length - 1)}</button>)}
            </center>
            </div>

          </div>)}

      </main>

      <footer className={styles.footer}>
        {/* <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        > */}

          Powered by Rabbit Eggs DeFi &nbsp;
          {/* <span className={styles.logo}> */}
            <Image src="/rxscoin.png" alt="rabbit eggs defi" width={20} height={20} />
          {/* </span> */}
        {/* </a> */}
      </footer>
    </div>
  )
}
