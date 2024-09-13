import { BrowserProvider } from 'ethers';
import { useState, useEffect, useCallback } from 'react';
import { HStack, Spinner, useToast } from '@chakra-ui/react';

import Header from './Header';
import DiplomasDisplay from './DiplomasDisplay';
import CollectionService from './collection/CollectionService';
import SignerService from './collection/SignerService';
import { getFileCid, uploadJSON } from './service/IPFSService';

function App() {
  const [provider, setProvider] = useState(null);
  const [collectionService, setCollectionService] = useState(null);
  const [signerService, setSignerService] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [list, setList] = useState([]);
  const [user, setUser] = useState({
    signer: null,
    balance: 0,
    isAdmin: false,
    isUR: false, //is the user University Representative meaning he can add new diplomas
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const toast = useToast({
    position: 'top',
    isClosable: true,
    duration: 3000,
  });

  useEffect(() => {
    const setupProvider = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);
      }
    };

    setupProvider();
  }, []);

  useEffect(() => {
    if (provider) {
      loadAccounts();

      const _collectionService = new CollectionService(provider);
      _collectionService.getDiplomas().then(_list => {
        setList(_list);
        console.log(_list);
      });
      setCollectionService(_collectionService);

      window.ethereum.on('accountsChanged', accounts => {
        updateAccounts(accounts);
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return () => {
        window.ethereum?.removeAllListeners();
      };
    }
  }, [provider]);

  const loadAccounts = async () => {
    const accounts = await provider.send('eth_accounts', []);
    updateAccounts(accounts);
  };

  const updateAccounts = async accounts => {
    if (provider) {
      if (accounts && accounts.length > 0) {
        var isAdmin = false;
        var isUR = false;

        const _signerService = new SignerService(
          await provider.getSigner()
        );

        await _signerService.checkAddressRoles().then(_list => {
          isAdmin = _list[0];
          isUR = _list[1];
          // console.log(_list);
        });

        setSignerService(_signerService);

        setUser({
          signer: await provider.getSigner(),
          balance: await provider.getBalance(accounts[0]),
          isAdmin: isAdmin,
          isUR: isUR,
        });

      } else {
        setUser({ signer: null, balance: 0 });
      }
    }
  };

  const handleConnectWallet = async () => {
    setIsMinting(true);
    setIsConnecting(true);

    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      toast({ title: 'Wallet connected', status: 'success' });
      updateAccounts(accounts);
    } catch (error) {
      toast({
        title: 'Wallet connection failed',
        status: 'error',
        description: error.code,
      });
    }

    setIsConnecting(false);
    setIsMinting(false);
  };

  const handleCreateDiploma = async (data) => {
    setIsMinting(true);

    toast({
      title: 'Diploma creation process has started!',
      status: 'info',
    });

    // console.log(data);

    // console.log(data.universityLogo);

    const logoCID = await getFileCid(data.universityLogo);

    data.universityLogo = logoCID;

    const date = new Date();

    const dateStr = date.toLocaleDateString();

    try {
      await uploadJSON(Date.now().toString(), data, cid => {
        if (signerService) {

          signerService.addDiploma(dateStr, cid, data.universityName).then(tx => {
            setIsMinting(false);

            provider.once(tx.hash, () => {
              toast({
                title: 'Your Diploma NFT is created!',
                status: 'success',
                description:
                  'You can now refresh the market too see your new Diploma NFT',
              });
            });
          });
        }
      });
    } catch (error) {
      if (error.code === 4001) {
        toast({
          title: 'Wallet connection failed',
          status: 'error',
          description: 'Transaction rejected by user.',
        });
      } else {
        toast({
          title: 'Wallet connection failed',
          status: 'error',
          description: 'Transaction rejected !',
        });
      }
    } finally {
      setIsMinting(false);
    }
  };

  const handleRejectDiploma = async (diplomaID, comment) => {
    toast({
      title: 'The diploma rejection or suspension process has begun.',
      status: 'info',
    });

    try {
      if (signerService) {

        await signerService.suspendDiploma(diplomaID, comment).then(tx => {
          provider.once(tx.hash, () => {
            toast({
              title: 'Diploma with ID: ' + diplomaID.toString() + ' is rejected/suspended.',
              status: 'error',
            });
          });
        });
      }
    } catch (error) {
      if (error.code === 4001) {
        toast({
          title: 'Wallet connection failed',
          status: 'error',
          description: 'Transaction rejected by user.',
        });
      } else {
        toast({
          title: 'Wallet connection failed',
          status: 'error',
          description: 'Transaction rejected !',
        });
      }
    }
  };

  const handleAcceptDiploma = async (diplomaID, comment) => {
    toast({
      title: 'The diploma acceptance process has begun.',
      status: 'info',
    });

    try {
      if (signerService) {

        await signerService.acceptDiploma(diplomaID).then(tx => {
          provider.once(tx.hash, () => {
            toast({
              title: 'Diploma with ID: ' + diplomaID.toString() + ' is accepted.',
              status: 'success',
            });
          });
        });
      }
    } catch (error) {
      if (error.code === 4001) {
        toast({
          title: 'Wallet connection failed',
          status: 'error',
          description: 'Transaction rejected by user.',
        });
      } else {
        toast({
          title: 'Wallet connection failed',
          status: 'error',
          description: 'Transaction rejected !',
        });
      }
    }finally {
      console.log("placem");
    }
  };

  return (
    <>
      <Header
        user={user}
        isConnecting={isConnecting}
        isMinting={isMinting}
        handleConnect={handleConnectWallet}
        handleCreateDiploma={handleCreateDiploma}
      />

      {list.length > 0 && 
      <DiplomasDisplay
        list={list}
        user={user}
        handleRejectDiploma={handleRejectDiploma}
        handleAcceptDiploma={handleAcceptDiploma}
      />}
      {list.length == 0 && (
        <HStack
          style={{
            paddingTop: '100px',
          }}
        >
          <p>
            Loading
          </p>
          <Spinner />
        </HStack>
      )}
    </>
  );
}

export default App;
