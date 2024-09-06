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
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons'
import { ethers } from 'ethers';

const DiplomasDisplay = ({
    list
}) => {

    //

    return (
        <>
            <div
                style={{
                    paddingTop: '100px',
                }}
            ></div>
            <SimpleGrid columns={3} spacing={10} mt={7} ml={5}>
                {list.map(diplomaNFT => (
                    <Box key={diplomaNFT[0]} maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
                        {/* <Image src={property.imageUrl} alt={property.imageAlt} /> */}

                        <Box p='6'>
                            <Box display='flex' alignItems='baseline'>
                                <Badge borderRadius='full' px='2' colorScheme='teal'>
                                    Diplome ID: {diplomaNFT[0].toString()}
                                </Badge>
                                <Box
                                    color='gray.500'
                                    fontWeight='semibold'
                                    letterSpacing='wide'
                                    fontSize='xs'
                                    textTransform='uppercase'
                                    ml='2'
                                >
                                    Approved
                                </Box>
                            </Box>

                            <Box
                                mt='1'
                                fontWeight='semibold'
                                as='h4'
                                lineHeight='tight'
                                isTruncated
                            >
                                Ime
                            </Box>

                            <Box>
                                Aaaaa
                                <Box as='span' color='gray.600' fontSize='sm'>
                                    / wk
                                </Box>
                            </Box>

                        </Box>
                    </Box>
                ))}
            </SimpleGrid>
        </>
    );
};

export default DiplomasDisplay;