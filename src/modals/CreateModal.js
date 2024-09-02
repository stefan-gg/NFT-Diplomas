import { Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Textarea, Toast } from "@chakra-ui/react";
import { useState } from "react";
import { parseEther } from "ethers";
import { AttachmentIcon, CalendarIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import { Detective } from "aws-sdk";

const CreateModal = ({ isOpen, onCreate, onClose }) => {
    const [image, setImage] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        dateOfGraduation: "",
        country: "",
        city: "",
        universityName: "",
        studentId:"",
        studentGrades: {0: {subject:'', grade: ''}}
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        onCreate(formData);
        setImage(null);
        onClose();
    };

    const onCustomClose = () => {
        onClose();
        setImage(null);
    }

    const addNewField = () => {
        const newId = Object.keys(formData.studentGrades).length + 1;
        setFormData(prevData => ({
            ...prevData,
            studentGrades: {
                ...prevData.studentGrades,
                [newId]: {subject:'', grade: ''}
            }
        }));
    };

    return (
      <Modal isOpen={isOpen} onClose={onCustomClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader title="Fill the form with the student data">
            New diplome form <InfoIcon mr={1} />
          </ModalHeader>

          <ModalCloseButton />

          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired>
                <FormLabel title="Student Name and Surname">
                  Name and Surname
                </FormLabel>
                <HStack>
                  <Input
                    placeholder="Stefan"
                    // onChange={(e) => {
                    //     setFormData({ ...formData, name: e.target.value });
                    // }}
                  />
                  {/* <FormLabel>Type of property</FormLabel> */}
                  <Input
                    placeholder="Gogić"
                    // onChange={(e) => {
                    //     setFormData({ ...formData, surname: e.target.value });
                    // }}
                  />
                </HStack>

                <FormLabel>
                  Date of enrollment <CalendarIcon />
                </FormLabel>
                <Input type="date"></Input>

                <FormLabel>
                  Date of graduation <CalendarIcon />
                </FormLabel>
                <Input type="date"></Input>

                {/* <FormLabel>University information</FormLabel> */}

                <details>
                  <summary title="">University information</summary>
                  <FormLabel>Country</FormLabel>
                  <Input />

                  <FormLabel>City</FormLabel>
                  <Input />

                  <FormLabel>University name</FormLabel>
                  <Input />

                  <FormLabel>Student index</FormLabel>
                  <Input />
                </details>

                <FormLabel
                  title="Type Subject name and Code in the template from placeholder"
                  mt={5}
                >
                  Student subjects and grades <InfoIcon />
                </FormLabel>
                {/* <HStack>
                                <Input 
                                    placeholder="Subject name - Code"
                                />
                                <Input 
                                    placeholder="Grade"
                                />
                            </HStack> */}

                {Object.keys(formData.studentGrades).map(id => (
                  <div key={id}>
                    <HStack mt={4} mb={2}>
                      <Input 
                        title="Subject code and name like in this example: CS101 - Basics of object-oriented programming"
                        placeholder="Subject code - Subject name"
                        onChange={(e) => {
                            setFormData(prevData => ({
                                ...prevData,
                                studentGrades: {
                                    ...prevData.studentGrades,
                                    [id]:{
                                        ...prevData.studentGrades[id],
                                        subject: e.target.value
                                    }
                                }
                            }));
                        }}
                      />
                      <Input width={"40%"} placeholder="Grade"
                        onChange={(e) => {
                            setFormData(prevData => ({
                                ...prevData,
                                studentGrades: {
                                    ...prevData.studentGrades,
                                    [id]:{
                                        ...prevData.studentGrades[id],
                                        grade: e.target.value
                                    }
                                }
                            }));
                        }}
                      />
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          const updatedGrades = { ...formData.studentGrades };
                          delete updatedGrades[id];
                          setFormData({
                              ...formData,
                              studentGrades: updatedGrades
                          });
                        }}
                      >
                        <CloseIcon />
                      </Button>
                    </HStack>
                  </div>
                ))}

                <Button colorScheme="teal" onClick={addNewField}>Add new Subject field</Button>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit">Create Diplome as an NFT</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
};

export default CreateModal;