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
    Popover,
    PopoverTrigger,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    PopoverContent,
    useToast,
    Textarea,
    Tooltip,
} from '@chakra-ui/react';
import {
    CheckCircleIcon,
    CheckIcon,
    CloseIcon,
    InfoIcon,
    QuestionIcon,
} from '@chakra-ui/icons';

import ViewDetailsModal from './modals/ViewDetailsModal';
import { useState } from 'react';

const DiplomasDisplay = ({ 
    list, 
    user, 
    handleRejectDiploma, 
    handleAcceptDiploma,
}) => {

    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();

    const [selectedDiploma, setSelectedDiploma] = useState(null);
    const [isAcceptModal, setIsAcceptModal] = useState(null);
    const [isRejectModal, setIsRejectModal] = useState(null);

    const toast = useToast();

    const customOpen = (diploma) => {
        setSelectedDiploma(diploma);
        onOpen();
    };

    const openAcceptModal = (diploma) => {
        setSelectedDiploma(diploma);
        setIsAcceptModal(true);
        onOpen();
    }

    const openRejectModal = (diploma) => {
        setSelectedDiploma(diploma);
        setIsRejectModal(true);
        onOpen();
    }

    return (
        <>
            <div
                style={{
                    paddingTop: '50px',
                }}
            ></div>
            <SimpleGrid columns={3} spacing={5} mt={7} ml={5} mb={5}>
                {list.map(diplomaNFT => (
                    <Box
                        key={diplomaNFT[0]}
                        maxW="sm"
                        // position="relative"
                        borderColor={
                            diplomaNFT[2] ? 'green' : diplomaNFT[3] ? 'red' : 'yellow'
                        }
                        borderWidth="2px"
                        borderRadius="lg"
                        overflow="hidden"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            transform: 'scale(1.03)',
                            // overflow: 'visible',
                            boxShadow: 'md',
                        }}
                    >
                        <Center>
                            <Image
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
                                    Added on: {diplomaNFT[1]} <InfoIcon mb={1 / 2} />
                                </Box>
                            </Box>

                            <Box
                                mt="1"
                                fontWeight="semibold"
                                as="h4"
                                lineHeight="tight"
                                isTruncated
                            >
                                {!diplomaNFT[2] && !diplomaNFT[3] && (
                                    <Text title='Validation is pending.'>
                                        Pending <QuestionIcon color={'yellow'} ml={2} mb={1} />
                                    </ Text>
                                )}
                                {diplomaNFT[2] && (
                                    <Text title='Diploma is accepted!'>
                                        Accepted <CheckCircleIcon color={'green'} ml={2} mb={1} />
                                    </ Text>
                                )}
                                {diplomaNFT[3] && (
                                    <HStack
                                    _hover={{
                                        // overflow: 'visible'
                                    }}

                                    >
                                        <Text title='Diploma is suspended. You can see the reason by clicking on the info icon!'>
                                            Suspended <CloseIcon color={'red'} ml={1} mb={1} />
                                        </Text>

                                        {diplomaNFT[6] && (
                                            // <Popover>
                                            //     <PopoverTrigger>
                                            //         <Button
                                            //             _hover={{
                                            //                 transform: 'scale(1.05)',
                                            //                 boxShadow: 'md',
                                            //             }}
                                            //             title='Press button to see the comment'
                                            //             size={'sm'}>
                                            //             <InfoIcon />
                                            //         </Button>
                                            //     </PopoverTrigger>
                                            //     <PopoverContent ml={20} >
                                            //         <PopoverArrow />
                                            //         <PopoverCloseButton />
                                            //         <PopoverHeader>Diploma is invalid!</PopoverHeader>
                                            //         <PopoverBody>
                                                        
                                                        <Tooltip 
                                                            placement='top' 
                                                            label={diplomaNFT[6]}
                                                            closeOnClick={false}
                                                            hasArrow 
                                                            arrowSize={15}
                                                            // bg={'#A0AEC0'}
                                                        >
                                                            {/* <Textarea
                                                                resize='none'
                                                                readOnly
                                                                value={diplomaNFT[6]}
                                                            /> */}
                                                            <Button size={'sm'}>
                                                                <InfoIcon boxSize={'17px'} />
                                                            </Button>
                                                        </Tooltip>
                                            //         </PopoverBody>
                                            //     </PopoverContent>
                                            // </Popover>
                                        )}
                                    </HStack>
                                )}
                            </Box>

                            <Box>
                                {diplomaNFT.universityName + ' '}
                                <Box as="span" color="gray.600" fontSize="sm">
                                    / Software engineering {/* / {diplomaNFT.studentMajor} */}
                                </Box>
                            </Box>

                            <Box>GPA: 4.0</Box>

                            <HStack>
                                <Button
                                    _hover={{
                                        transform: 'scale(1.05)',
                                        boxShadow: 'md',
                                    }}
                                    onClick={() => customOpen(diplomaNFT)}
                                    mt={2}
                                    colorScheme="blue"
                                >
                                    More details
                                </Button>

                                {user.isAdmin && diplomaNFT[2] &&
                                    <Button
                                        _hover={{
                                            transform: 'scale(1.05)',
                                            boxShadow: 'md',
                                        }}
                                        onClick={() => {
                                            openRejectModal(diplomaNFT);
                                            toast({
                                                description: "Please scroll to the end of the diploma in order to suspend it.",
                                                status: 'error',
                                                duration: 8000,
                                                position: 'top',
                                                isClosable: true,
                                            })
                                        }}
                                        mt={2}
                                        ml={9}
                                        colorScheme='red'
                                    >
                                        Suspend diploma
                                    </Button>
                                }

                                {user.isAdmin && !diplomaNFT[2] && !diplomaNFT[3] &&
                                    (
                                        <HStack title='Accept or reject diploma actions' ml={15} >
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
                                                        description: "Please scroll to the end of the diploma in order to accept it.",
                                                        status: 'info',
                                                        duration: 8000,
                                                        position: 'top',
                                                        isClosable: true,
                                                    })
                                                }}
                                                title='Accept diplome'
                                                mt={2} colorScheme='green'
                                            >
                                                <CheckIcon />
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    openRejectModal(diplomaNFT);
                                                    toast({
                                                        description: "Please scroll to the end of the diploma in order to reject it.",
                                                        status: 'error',
                                                        duration: 8000,
                                                        position: 'top',
                                                        isClosable: true,
                                                    })
                                                }}
                                                _hover={{
                                                    transform: 'scale(1.05)',
                                                    boxShadow: 'md',
                                                }}
                                                title='Reject diplome'
                                                mt={2}
                                                colorScheme='red'
                                            >
                                                <CloseIcon />
                                            </Button>
                                        </HStack>
                                    )
                                }
                            </HStack>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>

            {selectedDiploma &&
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
                >
                </ViewDetailsModal>
            }
        </>
    );
};

export default DiplomasDisplay;
