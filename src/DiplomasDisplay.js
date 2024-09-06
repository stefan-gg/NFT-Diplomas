import {
    Button,
    HStack,
    Select,
    Spacer,
    VStack,
    Text,
    useDisclosure,
    Flex,
    Input,
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
} from '@chakra-ui/react';
import {
    ChatIcon,
    CheckCircleIcon,
    CheckIcon,
    CloseIcon,
    InfoIcon,
    QuestionIcon,
    Search2Icon,
} from '@chakra-ui/icons';
import { ethers } from 'ethers';

const DiplomasDisplay = ({ list }) => {
    return (
        <>
            <div
                style={{
                    paddingTop: '50px',
                }}
            ></div>
            <SimpleGrid columns={3} spacing={10} mt={7} ml={5}>
                {list.map(diplomaNFT => (
                    <Box
                        key={diplomaNFT[0]}
                        maxW="sm"
                        borderColor={
                            diplomaNFT[2] ? 'green' : diplomaNFT[3] ? 'red' : 'yellow'
                        }
                        borderWidth="2px"
                        borderRadius="lg"
                        overflow="hidden"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            // bg: 'teal.500',
                            transform: 'scale(1.05)',
                            boxShadow: 'md',
                            borderWidth: '2px',
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
                                    Diplome ID: {diplomaNFT[0].toString()}
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
                                    <>
                                        Pending <QuestionIcon color={'yellow'} ml={2} />
                                    </>
                                )}
                                {diplomaNFT[2] && (
                                    <>
                                        Accepted <CheckCircleIcon color={'green'} ml={2} />
                                    </>
                                )}
                                {diplomaNFT[3] && (
                                    <HStack>
                                        <>Suspended <CloseIcon color={'red'} ml={2} /></>
                                        {diplomaNFT[6] && (
                                            <Box mb={2}>
                                                <Popover>
                                                    <PopoverTrigger>
                                                        <Button title='Press button to see the comment'
                                                            size={'sm'} mt={2}>
                                                            <InfoIcon />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <PopoverArrow />
                                                        <PopoverCloseButton />
                                                        <PopoverHeader>Diploma is invalid!</PopoverHeader>
                                                        <PopoverBody>
                                                            {diplomaNFT[6]}
                                                        </PopoverBody>
                                                    </PopoverContent>
                                                </Popover>
                                            </Box>
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

                            <Button mt={2} colorScheme="blue">
                                More details
                            </Button>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>
        </>
    );
};

export default DiplomasDisplay;
