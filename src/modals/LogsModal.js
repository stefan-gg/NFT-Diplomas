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
    VStack,
} from '@chakra-ui/react';

const LogsModal = ({
    isOpen,
    onClose,
    logs
}) => {

    return (
        <Modal  isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Address logs
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody>
                    {logs.map(log => (

                        // event AdminRoleAdministration(address indexed admin, address targetAddress, bool isRoleAdded);
                        // event URRoleAdministration(address indexed admin, address targetAddress, bool isRoleAdded);

                        <HStack mt={5}>

                            {log.eventName === "DiplomaCreation" && (
                                <Box border={"2px solid green"}>
                                    <Box ml={1}>
                                        Diploma created by: {log.args[0]}
                                    </Box>
                                    <Box ml={1}>
                                        Diploma ID: {log.args[1].toString()}
                                    </Box>
                                </ Box>
                            )}

                            {log.eventName === "DiplomaVerification" && (
                                <Box border={log.args[2]? "2px solid blue" : "2px solid red"}>
                                    <Box ml={1}>
                                        Diploma with ID: {log.args[1].toString()}
                                    </Box>
                                    <Box ml={1}>
                                        Was {log.args[2] ? "accepted" : "rejected"} by {log.args[0]}
                                    </Box>
                                </ Box>
                            )}

                            {log.eventName === "AdminRoleAdministration" && (
                                <Box border={log.args[2] ? "2px solid blue" : "2px solid red"}>
                                    <Box ml={1}>
                                        Admin with address {log.args[0]} {log.args[2] ? " added admin role" : " removed admin role from"}  {log.args[1]}
                                    </Box>
                                    {console.log(log.args[2])}
                                </ Box>
                            )}

                            {log.eventName === "URRoleAdministration" && (
                                <Box border={log.args[2] ? "2px solid blue" : "2px solid red"}>
                                    <Box ml={1}>
                                        Admin with address {log.args[0]} {log.args[2]? " added UR role to" : " removed UR role from"}  {log.args[1]}
                                    </Box>
                                    {console.log(log.args[2])}
                                </ Box>
                            )}

                        </HStack>
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
