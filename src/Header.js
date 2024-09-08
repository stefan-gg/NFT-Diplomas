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
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons'
import { ethers } from 'ethers';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import CreateModal from './modals/CreateModal';

const Header = ({
    user,
    isConnecting,
    isMinting,
    handleConnect,
    handleCreateDiploma
}) => {
    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose,
    } = useDisclosure();
    const formatBalance = ethers.formatEther(user.balance).substring(0, 6);
    const address = user.signer?.address;
    const formatAddress =
        address &&
        address.substring(0, 8) +
        '...' +
        address.substring(address.length - 6, address.length);

    const isDisabled = user.balance;

    const handleCreate = () => {
        onCreateOpen();
    };

    return (
        <Flex
            w={'100%'}
            h={'8%'}
            paddingX={10}
            position={'fixed'}
            backgroundColor={'gray.600'}
            zIndex={100}
            alignItems={'center'}
        >
            <HStack spacing={6}>
                { user.isUR && (
                    <Button
                        // colorScheme='cyan'
                        size={{ base: 'md', md: 'lg', lg: 'lg' }}
                        w={200}
                        m={2}
                        alignItems={'center'}
                        onClick={handleCreate}
                        isDisabled={isMinting}
                        isLoading={isMinting}
                        loadingText={'Minting...'}
                    >
                        Add new dipome
                    </Button>
                )}

                { user.isAdmin && (
                    <>
                        <Button
                            colorScheme='teal' 
                            variant='outline'
                            size={{ base: 'md', md: 'md', lg: 'md' }}
                            w={130}
                            alignItems={'center'}
                            // onClick={handleCreate}
                            isDisabled={isMinting}
                            isLoading={isMinting}
                            loadingText={'Minting...'}
                        >
                            Add new admin
                        </Button>

                        <Button
                            colorScheme='blue' 
                            variant='outline'
                            size={{ base: 'md', md: 'md', lg: 'md' }}
                            w={130}
                            alignItems={'center'}
                            // onClick={handleCreate}
                            isDisabled={isMinting}
                            isLoading={isMinting}
                            loadingText={'Minting...'}
                        >
                            Add new UR
                        </Button>
                    </>
                )}

                <Select w={170}>
                    {/* {viewOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))} */}
                    <option>Select University</option>
                </Select>
            </HStack>
            <HStack>
                <Input
                    ml={60}
                    type="text"
                    placeholder="Search for diplome ID"
                ></Input>
                <Button>
                    <Search2Icon mr={1} />
                </Button>
            </HStack>
            <Spacer />
            <VStack mr={5}>
                {user.signer && <Text>{formatAddress}</Text>}
                {user.signer && <Text>{formatBalance}</Text>}
            </VStack>
            {/* <ColorModeSwitcher></ColorModeSwitcher> */}
            <Button
                ml={3}
                isDisabled={isDisabled}
                onClick={handleConnect}
                isLoading={isConnecting}
            >
                {isDisabled ? 'Connected' : 'Connect'}
            </Button>
            <CreateModal
                isOpen={isCreateOpen}
                onClose={onCreateClose}
                onCreate={handleCreateDiploma}
            ></CreateModal>
        </Flex>
    );
};

export default Header;
