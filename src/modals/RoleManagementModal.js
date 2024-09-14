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
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

const RoleManagementModal = ({
    isOpen,
    onClose,
    managingAdmin,
    managingUR, // add/remove university representative modal
    handleAddAdmin,
    handleRemoveAdmin,
    handleAddUR,
    handleRemoveUR
}) => {

    const [address, setAddress] = useState(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    title="Role management"
                >
                    Role management
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
                                            placeholder='0xFFFF...' 
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </HStack>
                                    <Button 
                                        mr={55} 
                                        colorScheme={'green'}
                                        onClick={
                                            () => {
                                                handleAddAdmin(address);
                                                setAddress("");
                                                onClose();
                                            }
                                        }
                                    >
                                        Add role
                                    </Button>
                                </>
                            )}
                            {managingUR && (
                                <>
                                    <HStack>
                                        <FormLabel>
                                            Add new University representative: 
                                        </FormLabel>
                                        <Input 
                                            placeholder='0xFFFF...' 
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </HStack>
                                    <Button 
                                        ml={18} 
                                        colorScheme={'green'}
                                        onClick={
                                            () => {
                                                handleAddUR(address);
                                                setAddress("");
                                                onClose();
                                            }
                                        }
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
                                            placeholder='0xFFFF...' 
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </HStack>
                                    <Button 
                                        mr={25} 
                                        colorScheme={'red'}
                                        onClick={
                                            () => {
                                                handleRemoveAdmin(address);
                                                setAddress("");
                                                onClose();
                                            }
                                        }
                                    >
                                        Remove role
                                    </Button>
                                </>
                            )}
                            {managingUR && (
                                <>
                                    <HStack>
                                        <FormLabel>
                                            Remove University representative: 
                                        </FormLabel>
                                        <Input 
                                            placeholder='0xFFFF...' 
                                            onChange={(e) => setAddress(e.target.value)}
                                        />
                                    </HStack>
                                    <Button 
                                        ml={45} 
                                        colorScheme={'red'}
                                        onClick={
                                            () => {
                                                handleRemoveUR(address);
                                                setAddress("");
                                                onClose();
                                            }
                                        }
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
