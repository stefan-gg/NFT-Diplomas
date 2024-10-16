import {
    Box,
    Button,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Tooltip,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { ethers } from 'ethers';
import { InfoIcon } from '@chakra-ui/icons';

const RoleManagementModal = ({
    isOpen,
    onClose,
    managingAdmin,
    managingUR, // add/remove university representative modal
    handleAddAdmin,
    handleRemoveAdmin,
    handleAddUR,
    handleRemoveUR,
}) => {
    const [address, setAddress] = useState(null);

    const toast = useToast({
        position: 'top',
        isClosable: true,
        duration: 3000,
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader title="Role management">
                    Role management
                    <Tooltip
                        placement="top"
                        label="Copy and paste desired address into the field."
                        closeOnClick={false}
                        hasArrow
                        arrowSize={15}
                    // bg={'#A0AEC0'}
                    >
                        <Button size={'sm'} ml={3}>
                            <InfoIcon boxSize={'17px'} />
                        </Button>
                    </Tooltip>
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <VStack bg={''}>
                            {managingAdmin && (
                                <>
                                    <HStack>
                                        <FormLabel>Add new admin: </FormLabel>
                                        <Input
                                            placeholder="0xFFFF..."
                                            onChange={e => setAddress(e.target.value)}
                                        />
                                    </HStack>
                                    <Button
                                        mr={55}
                                        colorScheme={'green'}
                                        onClick={() => {
                                            if (!ethers.isAddress(address)) {
                                                toast({
                                                    status: 'error',
                                                    description: 'Invalid address format!',
                                                    duration: 4000,
                                                });
                                            } else {
                                                handleAddAdmin(address);
                                                setAddress('');
                                                onClose();
                                            }
                                        }}
                                    >
                                        Add role
                                    </Button>
                                </>
                            )}
                            {managingUR && (
                                <>
                                    <HStack>
                                        <FormLabel>Add new university representative:</FormLabel>
                                        <Input
                                            placeholder="0xFFFF..."
                                            onChange={e => setAddress(e.target.value)}
                                        />
                                    </HStack>
                                    <Button
                                        ml={18}
                                        colorScheme={'green'}
                                        onClick={() => {
                                            if (!ethers.isAddress(address)) {
                                                toast({
                                                    status: 'error',
                                                    description: 'Invalid address format!',
                                                    duration: 4000,
                                                });
                                            } else {
                                                handleAddUR(address);
                                                setAddress('');
                                                onClose();
                                            }
                                        }}
                                    >
                                        Add role
                                    </Button>
                                </>
                            )}
                        </VStack>
                        <VStack mt={5} bg={''}>
                            {managingAdmin && (
                                <>
                                    <HStack>
                                        <FormLabel>Remove admin: </FormLabel>
                                        <Input
                                            placeholder="0xFFFF..."
                                            onChange={e => setAddress(e.target.value)}
                                        />
                                    </HStack>
                                    <Button
                                        mr={25}
                                        colorScheme={'red'}
                                        onClick={() => {
                                            if (!ethers.isAddress(address)) {
                                                toast({
                                                    status: 'error',
                                                    description: 'Invalid address format!',
                                                    duration: 4000,
                                                });
                                            } else {
                                                handleRemoveAdmin(address);
                                                setAddress('');
                                                onClose();
                                            }
                                        }}
                                    >
                                        Remove role
                                    </Button>
                                </>
                            )}
                            {managingUR && (
                                <>
                                    <HStack>
                                        <FormLabel>Remove university representative:</FormLabel>
                                        <Input
                                            placeholder="0xFFFF..."
                                            onChange={e => setAddress(e.target.value)}
                                        />
                                    </HStack>
                                    <Button
                                        ml={45}
                                        colorScheme={'red'}
                                        onClick={() => {
                                            if (!ethers.isAddress(address)) {
                                                toast({
                                                    status: 'error',
                                                    description: 'Invalid address format!',
                                                    duration: 4000,
                                                });
                                            } else {
                                                handleRemoveUR(address);
                                                setAddress('');
                                                onClose();
                                            }
                                        }}
                                    >
                                        Remove role
                                    </Button>
                                </>
                            )}
                        </VStack>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close detail view</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RoleManagementModal;
