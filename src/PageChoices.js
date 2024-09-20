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
    Link,
} from '@chakra-ui/react';

import { useState } from 'react';

const PageChoices = ({
    count
}) => {

    const [prev, setPrev] = useState(1);
    const [curr, setCurr] = useState(2);
    const [next, setNext] = useState(3);

    const previous = () => {
        setPrev(prev - 1);
        setCurr(curr - 1);
        setNext(next - 1);
    };

    const nextValue = () => {
        setPrev(prev + 1);
        setCurr(curr + 1);
        setNext(next + 1);
    };

    return (
        <VStack>
            <HStack>
                <Text>Choose page: </Text>
                <Button
                    colorScheme='blue'
                    isDisabled={prev <= 1}
                    onClick={() => previous()}
                >
                    Previous
                </Button>
                {count >= 1 && <Button><Link fontSize={'25px'} mr={4} ml={4}>{prev}</Link></Button>}
                {count >= 2 && <Button><Link fontSize={'25px'} mr={4} ml={4}>{curr}</Link></Button>}
                {count >= 3 && <Button><Link fontSize={'25px'} mr={4} ml={4}>{next}</Link></Button>}
                <Button
                    colorScheme='green'
                    isDisabled={next >= count}
                    onClick={() => nextValue()}
                >
                    Next
                </Button>
            </HStack>
            <HStack>
                <Text w={'140%'}>Or insert custom one...</Text>
                <Input type='number' step={1} min="0" max={count} />
            </HStack>
        </VStack>
    );
};

export default PageChoices;
