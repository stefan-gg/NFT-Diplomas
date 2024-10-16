import {
    Button,
    HStack,
    Text,
    useDisclosure,
    SimpleGrid,
    Box,
    Badge,
    Image,
    Center,
    useToast,
    Tooltip,
    Input,
} from '@chakra-ui/react';
import {
    CheckCircleIcon,
    CheckIcon,
    CloseIcon,
    InfoIcon,
    QuestionIcon,
} from '@chakra-ui/icons';

import ViewDetailsModal from './modals/ViewDetailsModal';
import LogsModal from './modals/LogsModal';
import PageChoices from './PageChoices';
import { useState } from 'react';
import { ethers } from 'ethers';

const DiplomasDisplay = ({
    list,
    singleDiploma,
    user,
    handleRejectDiploma,
    handleAcceptDiploma,
    count,
    showAllDiplomasAgain,
    changePage,
    logSearch
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isLogsOpen,
        onOpen: onLogsOpen,
        onClose: onLogsClose } = useDisclosure();

    const [selectedDiploma, setSelectedDiploma] = useState(null);
    const [isAcceptModal, setIsAcceptModal] = useState(null);
    const [isRejectModal, setIsRejectModal] = useState(null);
    const [address, setAddress] = useState(null);
    const [logs, setLogs] = useState([]);

    const toast = useToast({
        position: 'top',
        isClosable: true,
        duration: 3000,
    });

    const openMoreDetails = diploma => {
        setSelectedDiploma(diploma);
        onOpen();
    };

    const openLogs = addressLogs => {
        setLogs(addressLogs);
        onLogsOpen();
    }

    const openAcceptModal = diploma => {
        setSelectedDiploma(diploma);
        setIsAcceptModal(true);
        onOpen();
    };

    const openRejectModal = diploma => {
        setSelectedDiploma(diploma);
        setIsRejectModal(true);
        onOpen();
    };

    if (singleDiploma) {
        list = singleDiploma;
    }

    return (
        <>
            <div
                style={{
                    paddingTop: '100px',
                }}
            ></div>
            <PageChoices
                count={count}
                changePage={changePage}
            />
            {singleDiploma && (
                <Center>
                    <Button colorScheme="red" onClick={() => showAllDiplomasAgain()}>
                        Go back to all diplomas
                    </Button>
                </Center>
            )}

            {(user.isAdmin || user.isUR) && <HStack mt={4}>
                <Input
                    ml={5}
                    w={'26%'}
                    maxLength={42}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Button
                    colorScheme='blue'
                    variant={'outline'}
                    onClick={
                        () => {
                            if (!ethers.isAddress(address)) {
                                toast({
                                    status: 'error',
                                    description: 'Invalid address format!',
                                    duration: 4000,
                                });
                            } else {

                                toast({
                                    title: 'We are searching for certain address in the logs.',
                                    status: 'loading',
                                    duration: 3000,
                                });

                                logSearch(address)
                                    .then(result => {
                                        if (result.length > 0)
                                            openLogs(result);
                                        else toast({
                                            description: 'There are no logs for inserted address.',
                                            status: 'error',
                                            duration: 3000,
                                            position: 'top',
                                            isClosable: true,
                                        });
                                    })
                            }
                        }
                    }
                >
                    Check log history for this address
                </Button>
            </HStack>}

            <SimpleGrid columns={singleDiploma ? 1 : 3} spacing={5} mt={7} ml={5} mb={5}>
                {list.map(diplomaNFT => (

                    <Box
                        key={diplomaNFT[0]}
                        maxW="sm"
                        ml={singleDiploma ? '36%' : 0}
                        borderColor={
                            diplomaNFT[1] ? 'green' : diplomaNFT[2] ? 'red' : 'yellow'
                        }
                        borderWidth="2px"
                        borderRadius="lg"
                        overflow="hidden"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            transform: 'scale(1.03)',
                            boxShadow: 'md',
                        }}
                    >
                        <Center>
                            <Image
                                // maxHeight={'300px'}
                                // maxWidth={'300px'}
                                src={
                                    'https://ipfs.filebase.io/ipfs/' +
                                    diplomaNFT.universityLogo[0]
                                }
                                alt={diplomaNFT.universityName}
                            />
                        </Center>

                        <Box p="6">
                            <Box display="flex" alignItems="baseline">
                                <Badge borderRadius="full" px="2" colorScheme="teal">
                                    Diploma ID: {diplomaNFT[0].toString()}
                                </Badge>
                                <Box
                                    color="gray.500"
                                    fontWeight="semibold"
                                    letterSpacing="wide"
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    ml="2"
                                    title="Date when diplome was issued as an NFT"
                                >
                                    Added on: {diplomaNFT.addedOn} <InfoIcon mb={1 / 2} />
                                </Box>
                            </Box>

                            <Box
                                mt="1"
                                fontWeight="semibold"
                                as="h4"
                                lineHeight="tight"
                                isTruncated
                            >
                                {!diplomaNFT[1] && !diplomaNFT[2] && (
                                    <Text title="Validation is pending.">
                                        Pending <QuestionIcon color={'yellow'} ml={2} mb={1} />
                                    </Text>
                                )}
                                {diplomaNFT[1] && (
                                    <Text title="Diploma is accepted!">
                                        Accepted <CheckCircleIcon color={'green'} ml={2} mb={1} />
                                    </Text>
                                )}
                                {diplomaNFT[2] && (
                                    <HStack>
                                        <Text title="Diploma is suspended. You can see the reason by clicking on the info icon!">
                                            Suspended <CloseIcon color={'red'} ml={1} mb={1} />
                                        </Text>

                                        {diplomaNFT[5] && (
                                            <Tooltip
                                                placement="top"
                                                label={diplomaNFT[5]}
                                                closeOnClick={false}
                                                hasArrow
                                                arrowSize={15}
                                            // bg={'#A0AEC0'}
                                            >
                                                <Button size={'sm'}>
                                                    <InfoIcon boxSize={'17px'} />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </HStack>
                                )}
                            </Box>

                            <Box>
                                {diplomaNFT.universityName + ' '}
                                <Box as="span" color="gray.600" fontSize="sm">
                                    / {diplomaNFT.studentMajor}
                                </Box>
                            </Box>

                            <Box>GPA: {diplomaNFT.studentGPA}</Box>

                            <HStack>
                                <Button
                                    _hover={{
                                        transform: 'scale(1.05)',
                                        boxShadow: 'md',
                                    }}
                                    onClick={() => openMoreDetails(diplomaNFT)}
                                    mt={2}
                                    colorScheme="blue"
                                >
                                    More details
                                </Button>

                                {user.isAdmin && diplomaNFT[1] && (
                                    <Button
                                        _hover={{
                                            transform: 'scale(1.05)',
                                            boxShadow: 'md',
                                        }}
                                        onClick={() => {
                                            openRejectModal(diplomaNFT);
                                            toast({
                                                description:
                                                    'Please scroll to the end of the diploma in order to suspend it.',
                                                status: 'error',
                                                duration: 8000,
                                                position: 'top',
                                                isClosable: true,
                                            });
                                        }}
                                        mt={2}
                                        ml={9}
                                        colorScheme="red"
                                    >
                                        Suspend diploma
                                    </Button>
                                )}

                                {user.isAdmin && !diplomaNFT[1] && !diplomaNFT[2] && (
                                    <HStack title="Accept or reject diploma actions" ml={15}>
                                        <InfoIcon />
                                        <Text>Actions:</Text>
                                        <Button
                                            _hover={{
                                                transform: 'scale(1.05)',
                                                boxShadow: 'md',
                                            }}
                                            onClick={() => {
                                                openAcceptModal(diplomaNFT);
                                                toast({
                                                    description:
                                                        'Please scroll to the end of the diploma in order to accept it.',
                                                    status: 'info',
                                                    duration: 8000,
                                                    position: 'top',
                                                    isClosable: true,
                                                });
                                            }}
                                            title="Accept diplome"
                                            mt={2}
                                            colorScheme="green"
                                        >
                                            <CheckIcon />
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                openRejectModal(diplomaNFT);
                                                toast({
                                                    description:
                                                        'Please scroll to the end of the diploma in order to reject it.',
                                                    status: 'error',
                                                    duration: 8000,
                                                    position: 'top',
                                                    isClosable: true,
                                                });
                                            }}
                                            _hover={{
                                                transform: 'scale(1.05)',
                                                boxShadow: 'md',
                                            }}
                                            title="Reject diplome"
                                            mt={2}
                                            colorScheme="red"
                                        >
                                            <CloseIcon />
                                        </Button>
                                    </HStack>
                                )}
                            </HStack>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>

            {selectedDiploma && (
                <ViewDetailsModal
                    isOpen={isOpen}
                    onClose={() => {
                        setSelectedDiploma(null);
                        setIsAcceptModal(false);
                        setIsRejectModal(false);
                        toast.closeAll();
                        onClose();
                    }}
                    diplomaNFT={selectedDiploma}
                    isAcceptModal={isAcceptModal}
                    isRejectModal={isRejectModal}
                    handleRejectDiploma={handleRejectDiploma}
                    handleAcceptDiploma={handleAcceptDiploma}
                ></ViewDetailsModal>
            )}

            <LogsModal
                isOpen={isLogsOpen}
                onClose={onLogsClose}
                logs={logs}
            >
            </LogsModal>
        </>
    );
};

export default DiplomasDisplay;
