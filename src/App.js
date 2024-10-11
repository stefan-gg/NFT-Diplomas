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
        var numberOfDiplomas = Number(_list[0].numberOfDiplomas);

        setCount(numberOfDiplomas > 0 ? Math.ceil(numberOfDiplomas / 6) : 0);
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

          setUniversities([..._list[2]].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())));
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
                  'You will see your new Diploma NFT soon',
              });

              // Loading all the diplomas again 
              // and show new one it if there is space on the page
              collectionService.getDiplomasWithPagination(currentPage, universityName).then(_list => {
                var numberOfDiplomas = Number(_list[0].numberOfDiplomas);

                setCount(numberOfDiplomas > 0 ? Math.ceil(numberOfDiplomas / 6) : 0);
                setList(_list);
              });

              signerService.checkAddressRoles().then(_list => {
                setUniversities([..._list[2]].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())));
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
          description: 'Transaction rejected!',
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

            // Loading all the diplomas again 
            // to show changes
            collectionService.getDiplomasWithPagination(currentPage, universityName).then(_list => {
              setList(_list);
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
          description: 'Transaction rejected!',
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

            // Loading all the diplomas again 
            // to show changes
            collectionService.getDiplomasWithPagination(currentPage, universityName).then(_list => {
              setList(_list);
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
          description: 'Transaction rejected!',
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
          description: 'Transaction rejected!',
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
          description: 'Transaction rejected!',
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
          description: 'Transaction rejected!',
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
          description: 'Transaction rejected!',
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

          if (_diploma[0].universityName === '') {

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
          description: 'Transaction rejected!',
        });
      }
    }
  };

  const showAllDiplomasAgain = () => {
    setSignleDiploma(null);
  }

  const changeUniversityFilter = (universityName) => {
    setUniversityName(universityName);

    toast({
      title: 'Diploma filter applied',
      status: 'loading',
      description: 'Diplomas will be updated soon',
      duration: 4000,
    });

    collectionService.getDiplomasWithPagination(1, universityName).then(_list => {
      var numberOfDiplomas = Number(_list[0].numberOfDiplomas);

      setCount(numberOfDiplomas > 0 ? Math.ceil(numberOfDiplomas / 6) : 0);
      setList(_list);
    });
  }

  const changePage = (page) => {
    // setCurrentPage(page);

    toast({
      title: 'Diploma filter applied!',
      status: 'loading',
      description: 'Diplomas will be updated soon.',
      duration: 2000,
    });

    collectionService.getDiplomasWithPagination(page, universityName).then(_list => {
      if (_list.length >= 1) {
        setList(_list);
      } else {
        toast.closeAll();
        toast({
          status: 'error',
          description: 'There are no diplomas available for display on the selected page.',
          duration: 5000,
        });
      }
    });
  }

  const logSearch = async (address) => {
    if (signerService) {

      return await signerService.getLogs(address);
    }
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
        changeUniversityFilter={changeUniversityFilter}
        logSearch={logSearch}
      />

      {count > 0 && <DiplomasDisplay
        list={list}
        singleDiploma={singleDiploma}
        user={user}
        handleRejectDiploma={handleRejectDiploma}
        handleAcceptDiploma={handleAcceptDiploma}
        count={count}
        showAllDiplomasAgain={showAllDiplomasAgain}
        changePage={changePage}
        logSearch={logSearch}
      />}

      {count === 0 && (
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
