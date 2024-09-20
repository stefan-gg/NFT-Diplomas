import { BrowserProvider } from 'ethers';
import { useState, useEffect, useCallback } from 'react';
import { HStack, Spinner, useToast, Text } from '@chakra-ui/react';

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
  const [singleDiploma, setSignleDiploma] = useState(null);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [universityName, setUniversityName] = useState("");
  const [universities, setUniversities] = useState([]);
  const [user, setUser] = useState({
    signer: null,
    balance: 0,
    isAdmin: false,
    isUR: false, //is the user University Representative -> meaning he can add new diplomas
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
      _collectionService.getDiplomasWithPagination(currentPage, universityName).then(_list => {
        setList(_list);
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
          setUniversities(_list[2]);
          setCount(10);
          // setCount(Math.floor(_list[2] / 6));
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

  const handleAcceptDiploma = async (diplomaID) => {
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
    }
  };

  const handleAddAdmin = async (address) => {
    toast({
      title: 'New admin is being added.',
      status: 'info',
    });

    try {
      if (signerService) {

        await signerService.addAdmin(address).then(tx => {
          provider.once(tx.hash, () => {
            toast({
              title: 'New admin is added.',
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
    }
  };

  const handleRemoveAdmin = async (address) => {
    toast({
      title: 'Admin is being removed.',
      status: 'error',
    });

    try {
      if (signerService) {

        await signerService.removeAdmin(address).then(tx => {
          provider.once(tx.hash, () => {
            toast({
              title: 'Admin is removed.',
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
    }
  };

  const handleAddUR = async (address) => {
    toast({
      title: 'New university representative is being added.',
      status: 'info',
    });

    try {
      if (signerService) {

        await signerService.addUniversityRepresentative(address).then(tx => {
          provider.once(tx.hash, () => {
            toast({
              title: 'New university representative is added.',
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
    }
  };

  const handleRemoveUR = async (address) => {
    toast({
      title: 'University representative is being removed.',
      status: 'info',
    });

    try {
      if (signerService) {

        await signerService.removeUniversityRepresentative(address).then(tx => {
          provider.once(tx.hash, () => {
            toast({
              title: 'University representative is removed.',
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
    }
  };

  const getDiplomaByID = async (diplomaID) => {
    toast({
      title: 'Searching for diploma with ID:' + diplomaID,
      status: 'loading',
      duration: 2000,
    });

    try {
      if (collectionService) {

        await collectionService.getDiplomaByID(diplomaID).then(_diploma => {

            if(_diploma[0].universityName === ''){

              toast.closeAll();

              toast({
                title: 'Diploma with ID:' + diplomaID + " does not exist.",
                status: 'error',
              });
            } else {
              toast({
                title: 'Diploma with ID:' + diplomaID + " is found.",
                status: 'success',
              });

              setSignleDiploma(_diploma);

            }

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

  const showAllDiplomasAgain = async () => {
    setSignleDiploma(null);
  }

  return (
    <>
      <Header
        user={user}
        isConnecting={isConnecting}
        isMinting={isMinting}
        handleConnect={handleConnectWallet}
        handleCreateDiploma={handleCreateDiploma}
        handleAddAdmin={handleAddAdmin}
        handleRemoveAdmin={handleRemoveAdmin}
        handleAddUR={handleAddUR}
        handleRemoveUR={handleRemoveUR}
        getDiplomaByID={getDiplomaByID}
        universities={universities}
      />

      {list.length > 0 && 
      <DiplomasDisplay
        list={list}
        singleDiploma={singleDiploma}
        user={user}
        handleRejectDiploma={handleRejectDiploma}
        handleAcceptDiploma={handleAcceptDiploma} 
        count={count}
        showAllDiplomasAgain={showAllDiplomasAgain}
      />}
      
      {list.length == 0 && (
        <HStack
          style={{
            paddingTop: '100px',
          }}
        >
          <Text fontSize={'20px'} ml={7}>
            Loading
          </Text>
          <Spinner />
        </HStack>
      )}
    </>
  );
}

export default App;
