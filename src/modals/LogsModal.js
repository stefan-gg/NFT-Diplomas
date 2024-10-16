import { CopyIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Center,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
} from '@chakra-ui/react';

const LogsModal = ({
    isOpen,
    onClose,
    logs
}) => {

    const toast = useToast({
        position: 'top',
        isClosable: true,
        duration: 3000,
    });

    const formatTime = (timestamp) => {
        const date = new Date(Number(timestamp) * 1000);
        const formattedDate = date.toLocaleDateString();

        return formattedDate;
    };

    const copyAddress = (address) => {
        return async () => {
            try {
                if (address !== '0x0000000000000000000000000000000000000000') {
                    toast({
                        title: 'Copied to clipboard!',
                        status: 'success',
                        duration: 2000,
                    });
                    await navigator.clipboard.writeText(address);
                } else {
                    toast({
                        title: 'Cannot copy address to clipboard.',
                        status: 'error',
                        duration: 2000,
                    });
                }
            } catch (error) {
                toast({
                    title: 'Failed to copy to clipboard.',
                    status: 'error',
                    duration: 2000,
                });
            }
        };
    }

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

                        <Center>
                            <HStack mt={5}>

                                {log.eventName === "DiplomaCreation" && (
                                    <Box p={2} backgroundColor={"rgba(0, 255, 0, 0.3)"}>
                                        <Box>
                                            Created diploma with ID: {log.args[1].toString()}
                                        </Box>
                                        <Box>Timestamp: {formatTime(log.args[2])}</Box>
                                    </ Box>
                                )}

                                {log.eventName === "DiplomaVerification" && (
                                    <Box p={2}
                                        backgroundColor={log.args[2] ? "rgba(0, 255, 0, 0.3)" : "rgba(255, 0, 0, 0.3)"}
                                    >
                                        <Box>
                                            {log.args[2] ? "Accepted" : "Rejected"} diploma with ID: {log.args[1].toString()}
                                        </Box>
                                        <Box>
                                            Timestamp: {formatTime(log.args[3])}
                                        </Box>
                                    </ Box>
                                )}

                                {log.eventName === "AdminRoleAdministration" && (
                                    <Box p={2}
                                        backgroundColor={log.args[2] ? "rgba(0, 0, 255, 0.3)" : "rgba(255, 0, 0, 0.3)"}
                                    >
                                        <Box>
                                            <Button
                                                title='Copy address'
                                                size={"sm"}
                                                onClick={copyAddress(log.args[1])}
                                            >
                                                <CopyIcon />
                                            </Button>
                                            {log.args[2] ? "Added admin role to: " : "Removed admin role from: "}  {log.args[1]}
                                        </Box>
                                        <Box>
                                            Timestamp: {formatTime(log.args[3])}
                                        </Box>
                                    </ Box>
                                )}

                                {log.eventName === "URRoleAdministration" && (
                                    <Box p={2}
                                        backgroundColor={log.args[0] ? "rgba(0, 0, 255, 0.3)" : "rgba(255, 0, 0, 0.3)"}
                                    >
                                        <Box>
                                            <Button
                                                title='Copy address'
                                                size={"sm"}
                                                onClick={copyAddress(log.args[1])}
                                            >
                                                <CopyIcon />
                                            </Button>
                                            {log.args[2] ? "Added University Representative role to: " : "Removed University Representative role from: "}  {log.args[1]}
                                        </Box>
                                        <Box>
                                            Timestamp: {formatTime(log.args[3])}
                                        </Box>
                                    </ Box>
                                )}
                            </HStack>
                        </Center>
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
