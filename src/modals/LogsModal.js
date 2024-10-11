import {
    Box,
    Button,
    HStack,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';

const LogsModal = ({
    isOpen,
    onClose,
    logs
}) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Address logs
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody>
                    {logs.map(log => (
                        <Box>{log.eventName}</Box>
                    ))}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close detail view</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LogsModal;
