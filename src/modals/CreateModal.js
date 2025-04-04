import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  AttachmentIcon,
  CalendarIcon,
  CloseIcon,
  InfoIcon,
  QuestionIcon,
  TriangleDownIcon,
} from '@chakra-ui/icons';

const CreateModal = ({ isOpen, onCreate, onClose }) => {
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dateOfEnrollment: '',
    dateOfGraduation: '',
    country: '',
    city: '',
    universityName: '',
    studentId: '',
    studentMajor: '',
    studentGPA: '',
    studyLevel: "Associate's Studies",
    studyDuration: 1,
    universityLogo: null,
    studentGrades: { 0: { subject: '', grade: '' } },
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
  };

  const addNewField = () => {
    const newId = Object.keys(formData.studentGrades).length + 1;
    setFormData(prevData => ({
      ...prevData,
      studentGrades: {
        ...prevData.studentGrades,
        [newId]: { subject: '', grade: '' },
      },
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onCustomClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader title="Fill the form with the student data">
          New diploma form <InfoIcon mr={1} />
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
                  placeholder="John"
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value });
                  }}
                />
                <Input
                  placeholder="Doe"
                  onChange={e => {
                    setFormData({ ...formData, surname: e.target.value });
                  }}
                />
              </HStack>

              <FormLabel>
                Date of enrollment <CalendarIcon />
              </FormLabel>
              <Input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                onChange={e => {
                  setFormData({
                    ...formData,
                    dateOfEnrollment: e.target.value,
                  });
                }}
              />

              <FormLabel>
                Date of graduation <CalendarIcon />
              </FormLabel>
              <Input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                onChange={e => {
                  setFormData({
                    ...formData,
                    dateOfGraduation: e.target.value,
                  });
                }}
              />

              <Flex justify={'center'} mt={3} ml={5}>
                <details>
                  <summary>University related information</summary>
                  <FormControl isRequired >
                    <FormLabel fontSize="md">Country</FormLabel>
                    <Input
                      onChange={e => {
                        setFormData({ ...formData, country: e.target.value });
                      }}
                      focusBorderColor="lime"
                      variant="flushed"
                      size="sm"
                      width={0.8}
                    />

                    <FormLabel fontSize="md">City</FormLabel>
                    <Input
                      onChange={e => {
                        setFormData({ ...formData, city: e.target.value });
                      }}
                      focusBorderColor="lime"
                      variant="flushed"
                      size="sm"
                      width={0.8}
                    />

                    <FormLabel fontSize="md">University name</FormLabel>
                    <Input
                      minLength={2}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          universityName: e.target.value,
                        });
                      }}
                      focusBorderColor="lime"
                      variant="flushed"
                      size="sm"
                      width={0.8}
                    />

                    <FormLabel fontSize="md" title="Number of student ID">
                      Student ID
                    </FormLabel>
                    <Input
                      onChange={e => {
                        setFormData({ ...formData, studentId: e.target.value });
                      }}
                      focusBorderColor="lime"
                      variant="flushed"
                      size="sm"
                      width={0.8}
                    />

                    <FormLabel fontSize="md" title="Number of student ID">
                      Student Major
                    </FormLabel>
                    <Input
                      focusBorderColor="lime"
                      variant="flushed"
                      size="sm"
                      width={0.8}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          studentMajor: e.target.value,
                        });
                      }}
                    />

                    <FormLabel fontSize="md">Study level</FormLabel>
                    <Select
                      onChange={e => {
                        setFormData({
                          ...formData,
                          studyLevel: e.target.value,
                        });
                      }}
                      icon={<TriangleDownIcon />}
                      size="sm"
                      width={0.8}
                    >
                      <option>Associate's Studies</option>
                      <option>Bachelor's Studies</option>
                      <option>Master's Studies</option>
                      <option>Doctoral Studies</option>
                      <option>Postdoctoral Studies</option>
                    </Select>

                    <FormLabel fontSize="md">Duration of the study program</FormLabel>
                    <Select
                      onChange={e => {
                        setFormData({
                          ...formData,
                          studyDuration: e.target.value,
                        });
                      }}
                      icon={<TriangleDownIcon />}
                      size="sm"
                      width={0.8}
                    >
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>3 years</option>
                      <option>4 years</option>
                      <option>5+ years</option>
                    </Select>

                    <FormLabel fontSize="md">
                      Select picture of your university logo
                      <AttachmentIcon ml={1} />
                    </FormLabel>
                    <Input
                      size="sm"
                      width={0.8}
                      type="file"
                      accept="image/png, image/jpeg"
                      multiple={false}
                      onChange={e => {
                        if (e.target.files[0].size > 3 * 1024 * 1024) {
                          alert(
                            'Maximum picture size must be 3MB! Please select different picture.'
                          );
                        } else {
                          setFormData({
                            ...formData,
                            universityLogo: [e.target.files[0]],
                          });

                          setImage(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />

                    {image && <FormLabel>University logo preview</FormLabel>}
                    {image && (
                      <Image
                        alt="preview image"
                        width="300px"
                        height="250px"
                        src={image}
                      />
                    )}
                  </FormControl>
                </details>
              </Flex>


              <HStack
                title="This site does not calculate student's GPA, you must insert GPA from student's diploma."
                mt={5}
              >
                <FormLabel>Student GPA:</FormLabel>
                <Input
                  placeholder='3.5/4.0'
                  w={'30%'}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      studentGPA: e.target.value,
                    });
                  }}
                />
                <QuestionIcon />
              </HStack>

              <FormLabel
                title="Type Subject name and Code in the template from placeholder"
                mt={5}
              >
                Student subjects and grades <InfoIcon />
              </FormLabel>
              {Object.keys(formData.studentGrades).map(id => (
                <div key={id}>
                  <HStack mt={4} mb={2}>
                    <Input
                      title="Subject code and name like in this example: CS101 - Basics of object-oriented programming"
                      placeholder="Subject code - Subject name"
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          studentGrades: {
                            ...prevData.studentGrades,
                            [id]: {
                              ...prevData.studentGrades[id],
                              subject: e.target.value,
                            },
                          },
                        }));
                      }}
                    />
                    <Input
                      width={'40%'}
                      placeholder="Grade"
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          studentGrades: {
                            ...prevData.studentGrades,
                            [id]: {
                              ...prevData.studentGrades[id],
                              grade: e.target.value,
                            },
                          },
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
                          studentGrades: updatedGrades,
                        });
                      }}
                    >
                      <CloseIcon />
                    </Button>
                  </HStack>
                </div>
              ))}

              <Button colorScheme="teal" onClick={addNewField}>
                Add new Subject field
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button type="submit">Create Diploma as an NFT</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
