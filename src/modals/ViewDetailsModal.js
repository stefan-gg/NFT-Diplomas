import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Image,
    Input,
    Kbd,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
    InfoIcon,
} from '@chakra-ui/icons';

const ViewDetailsModal = ({ isOpen, onClose, diplomaNFT }) => {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader title="Fill the form with the student data">
                    Student ID#{diplomaNFT.studentId}
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <HStack>
                            <Text>Student name and surname:</Text>
                            <Text><Kbd fontSize={"medium"}>{diplomaNFT.name} {diplomaNFT.surname}</Kbd></Text>
                        </HStack>
                        <Text>Studied from <Kbd>{new Date(diplomaNFT.dateOfEnrollment).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</Kbd> to <Kbd>{new Date(diplomaNFT.dateOfGraduation).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</Kbd></Text>
                        <Text>University: <Kbd>{diplomaNFT.universityName}</Kbd></Text>
                        <Text>Country: <Kbd>{diplomaNFT.country}</Kbd></Text>
                        <Text>City: <Kbd>{diplomaNFT.city}</Kbd></Text>
                        <Text>Level of studies: <Kbd>{diplomaNFT.studyLevel}</Kbd></Text>
                        <Text>Student major: <Kbd>{diplomaNFT.studentMajor}</Kbd></Text>
                        <Text>Study duration: <Kbd>{diplomaNFT.studyDuration}</Kbd></Text>
                        <Text>Grades:</Text>
                        {/* {console.log(diplomaNFT.studentGrades)} */}
                        {Object.keys(diplomaNFT.studentGrades).map( id => (
                            <div key={id}>
                                <HStack mt={4} mb={2}>
                                    <Input
                                        title={diplomaNFT.studentGrades[id].subject}
                                        value={diplomaNFT.studentGrades[id].subject}
                                        readOnly
                                    />
                                    <Text>{"=>"}</Text>
                                    <Input
                                        width={'40%'}
                                        placeholder="Grade"
                                        value={diplomaNFT.studentGrades[id].grade}
                                        readOnly
                                    />
                                </HStack>
                            </div>
                        ))}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close detail view</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );


};

export default ViewDetailsModal;
