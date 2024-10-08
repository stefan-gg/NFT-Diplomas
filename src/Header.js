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

import CreateModal from './modals/CreateModal';
import RoleManagementModal from './modals/RoleManagementModal';
import { useState } from 'react';

const Header = ({
    user,
    isConnecting,
    isMinting,
    handleConnect,
    handleCreateDiploma,
    handleAddAdmin,
    handleRemoveAdmin,
    handleAddUR,
    handleRemoveUR,
    getDiplomaByID,
    universities,
    changeUniversityFilter
}) => {
    const {
        isOpen: isCreateOpen,
        onOpen: onCreateOpen,
        onClose: onCreateClose,
    } = useDisclosure();

    const {
        isOpen: isRoleModalOpen,
        onOpen: onRoleModalOpen,
        onClose: onRoleModalClose,
    } = useDisclosure();

    const [managingAdmin, setManagingAdmin] = useState(false);
    const [managingUR, setManagingUR] = useState(false);
    const [searchValue, setSearchValue] = useState(null);

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
            <HStack >
                {user.isUR && (
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
                        Add new diploma
                    </Button>
                )}

                {user.isAdmin && (
                    <HStack mr={15} ml={-5} >
                        <Button
                            colorScheme='teal'
                            variant='outline'
                            size={{ base: 'md', md: 'md', lg: 'md' }}
                            // w={145}
                            alignItems={'center'}
                            onClick={() => {
                                setManagingAdmin(true);
                                onRoleModalOpen();
                            }}
                            isDisabled={isMinting}
                            isLoading={isMinting}
                            loadingText={'Minting...'}
                        >
                            Add/Remove admin
                        </Button>

                        <Button
                            colorScheme='blue'
                            variant='outline'
                            size={{ base: 'md', md: 'md', lg: 'md' }}
                            // w={130}
                            alignItems={'center'}
                            onClick={() => {
                                setManagingUR(true);
                                onRoleModalOpen();
                            }}
                            isDisabled={isMinting}
                            isLoading={isMinting}
                            loadingText={'Minting...'}
                        >
                            Add/Remove UR
                        </Button>
                    </HStack>
                )}

                <Select
                    w={170}
                    onChange={(e) => changeUniversityFilter(e.target.value)}
                >
                    <option
                        key={''}
                        value={''}
                        title='This options displays all diplomas'>
                        {user.signer ? 'Select University'
                            : 'You must connect wallet in order to filter universities'}
                    </option>
                    {universities && universities.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </HStack>
            <HStack>
                <Input
                    borderRadius={"20px 0 0 20px"}
                    ml={user.isAdmin ? 43 : user.isUR ? 160 : 385}
                    mr={-2}
                    type="number"
                    placeholder="Search diploma by ID"
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                />
                <Button
                    borderRadius={"0 20px 20px 0"}
                    onClick={() => { getDiplomaByID(Number(searchValue)) }}
                >
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
            >
            </CreateModal>

            <RoleManagementModal
                isOpen={isRoleModalOpen}
                onClose={
                    () => {
                        setManagingUR(false);
                        setManagingAdmin(false);
                        onRoleModalClose();
                    }
                }
                managingAdmin={managingAdmin}
                managingUR={managingUR}
                handleCreateDiploma={handleCreateDiploma}
                handleAddAdmin={handleAddAdmin}
                handleRemoveAdmin={handleRemoveAdmin}
                handleAddUR={handleAddUR}
                handleRemoveUR={handleRemoveUR}
            >
            </RoleManagementModal>
        </Flex>
    );
};

export default Header;
