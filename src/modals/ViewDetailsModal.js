import {
    Box,
    Button,
    Checkbox,
    FormLabel,
    HStack,
    Input,
    Kbd,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const ViewDetailsModal = ({
    isOpen,
    onClose,
    diplomaNFT,
    isAcceptModal,
    isRejectModal,
    handleRejectDiploma,
    handleAcceptDiploma,
}) => {
    const [check, setCheck] = useState(false);
    const [comment, setComment] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader
                    textDecoration={diplomaNFT[3] ? 'line-through' : 'none'}
                    title="Student data"
                >
                    Student ID#{diplomaNFT.studentId}
                </ModalHeader>

                <ModalCloseButton />
                <ModalBody>
                    <Box textDecoration={diplomaNFT[3] ? 'line-through' : 'none'}>
                        <Link
                            isExternal
                            color="teal.500"
                            href={diplomaNFT[5]}
                            title={diplomaNFT[5]}
                        >
                            Official IPFS link <ExternalLinkIcon mx="2px" />
                        </Link>

                        <HStack>
                            <Text>Student name and surname:</Text>
                            <Text>
                                <Kbd fontSize={'medium'}>
                                    {diplomaNFT.name} {diplomaNFT.surname}
                                </Kbd>
                            </Text>
                        </HStack>
                        <Text>
                            Studied from{' '}
                            <Kbd>
                                {new Date(diplomaNFT.dateOfEnrollment).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }
                                )}
                            </Kbd>{' '}
                            to{' '}
                            <Kbd>
                                {new Date(diplomaNFT.dateOfGraduation).toLocaleDateString(
                                    'en-US',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }
                                )}
                            </Kbd>
                        </Text>
                        <Text>
                            University:{' '}
                            <Kbd title={diplomaNFT.universityName} fontSize={'medium'}>
                                {diplomaNFT.universityName}
                            </Kbd>
                        </Text>
                        <Text>
                            Country: <Kbd fontSize={'medium'}>{diplomaNFT.country}</Kbd>
                        </Text>
                        <Text>
                            City: <Kbd fontSize={'medium'}>{diplomaNFT.city}</Kbd>
                        </Text>
                        <Text>
                            Level of studies:{' '}
                            <Kbd fontSize={'medium'}>{diplomaNFT.studyLevel}</Kbd>
                        </Text>
                        <Text>
                            Student major:{' '}
                            <Kbd fontSize={'medium'}>{diplomaNFT.studentMajor}</Kbd>
                        </Text>
                        <Text>
                            Study duration:{' '}
                            <Kbd fontSize={'medium'}>{diplomaNFT.studyDuration}</Kbd>
                        </Text>
                        <Text>Grades:</Text>
                        {Object.keys(diplomaNFT.studentGrades).map(id => (
                            <div key={id}>
                                <HStack mt={4} mb={2}>
                                    <Input
                                        title={diplomaNFT.studentGrades[id].subject}
                                        value={diplomaNFT.studentGrades[id].subject}
                                        readOnly
                                    />
                                    <Text>{'=>'}</Text>
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
                    {(isAcceptModal || isRejectModal) && (
                        <>
                            <Checkbox colorScheme="green" onChange={() => setCheck(!check)}>
                                I have reviewed all the information related to this diploma, and
                                I affirm that it is {isAcceptModal ? 'valid' : 'invalid'}.
                            </Checkbox>

                            {check && isRejectModal && (
                                <>
                                    <FormLabel>Comment for diploma rejection: </FormLabel>
                                    <Textarea
                                        resize='none'
                                        maxLength={150}
                                        placeholder="Reason why is the diploma invalid"
                                        onChange={e => setComment(e.target.value)}
                                    />
                                </>
                            )}

                            <Button
                                mt={2}
                                colorScheme={isAcceptModal ? 'green' : 'red'}
                                isDisabled={!check}
                                onClick={
                                    isAcceptModal
                                        ? () => {
                                            handleAcceptDiploma(diplomaNFT[0]);
                                            onClose();
                                        }
                                        : () => {
                                            handleRejectDiploma(diplomaNFT[0], comment);
                                            onClose();
                                        }
                                }
                            >
                                {isAcceptModal
                                    ? 'Accept diploma'
                                    : diplomaNFT[2]
                                        ? 'Suspend diploma'
                                        : 'Reject diploma'}
                            </Button>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>Close detail view</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ViewDetailsModal;
