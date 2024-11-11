const from  = rxjs.from
const takeUntil = rxjs.takeUntil
const Web3Modal = window.Web3Modal.default;
let isAuth=0;
var WalletConnectProvider=WalletConnectProvider.default;
const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        bridge: "https://bridge.walletconnect.org",
        rpc: {
            56: "https://bsc-dataseed1.binance.org",
        },
        chainId: 56,
        network: "binance",
  
    }
    }
  }

const anyProviderObserver =
     async() => {
        try {
        provider=new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/');
        const providerWrapper = new ethers.providers.Web3Provider(provider)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, providerWrapper)
        setGlobalStatisticsEvents(contract)
    }
    catch(Exception){
        console.log(Exception)
    }
    onNoWalletsConnected()        
    }

const walletChoosingObserver =  async() => {
        try {
                web3Modal = new Web3Modal({
                network: "binance", // replace mainnet to binance
                providerOptions, // required
            });
        provider = await web3Modal.connect();
        console.log(provider)
        const providerWrapper = new ethers.providers.Web3Provider(provider)
        const signer = providerWrapper.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer)
        const accountsChangeObservable = accountsChangeObservableFactory(provider)
        accountsChangeObservable.subscribe(accounts => setPersonalStatisticsEvents(providerWrapper, contract, accounts[0]))
        const requestAccountObservable = from(requestAccounts(provider)).pipe(takeUntil(accountsChangeObservable)) 
        requestAccountObservable.subscribe(accounts => setPersonalStatisticsEvents(providerWrapper, contract, accounts[0]))
        setGlobalStatisticsEvents(contract)

            }
            catch(Exception){
                console.log(Exception)
            }
        
    }
