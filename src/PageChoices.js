import { InfoIcon } from '@chakra-ui/icons';
import {
    Button,
    HStack,
    VStack,
    Text,
    Input,
    Link,
    FormLabel,
    FormControl,
} from '@chakra-ui/react';

import { useState } from 'react';

const PageChoices = ({
    count,
    changePage
}) => {

    const [prev, setPrev] = useState(1);
    const [curr, setCurr] = useState(2);
    const [next, setNext] = useState(3);
    const [page, setPage] = useState(1);

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
                <Text title='Each page will display 6 diplomas'>
                    <InfoIcon mb={1} /> Choose page:
                </Text>
                <Button
                    colorScheme='blue'
                    isDisabled={prev <= 1}
                    onClick={() => previous()}
                >
                    Previous
                </Button>
                {count >= 1 &&
                    <Button onClick={() => changePage(prev)} >
                        <Link fontSize={'25px'} mr={4} ml={4}>{prev}</Link>
                    </Button>
                }
                {count >= 2 &&
                    <Button onClick={() => changePage(curr)}>
                        <Link fontSize={'25px'} mr={4} ml={4}>{curr}</Link>
                    </Button>
                }
                {count >= 3 &&
                    <Button onClick={() => changePage(next)}>
                        <Link fontSize={'25px'} mr={4} ml={4}>{next}</Link>
                    </Button>
                }
                <Button
                    colorScheme='green'
                    isDisabled={next >= count}
                    onClick={() => nextValue()}
                >
                    Next
                </Button>
            </HStack>
            <form>
                <FormControl>
                    <HStack>
                        <FormLabel w={'140%'}>Or insert custom one...</FormLabel>
                        <Input 
                            isRequired 
                            w={'50%'} 
                            type='number' 
                            step={1} 
                            min="1" 
                            max={count} 
                            onChange={(e) => setPage(e.target.value)}
                        />
                        <Button onClick={() => changePage(page)} w={'100%'} colorScheme='blue'>Show diplomas</Button>
                    </HStack>
                </FormControl>
            </form>
        </VStack>
    );
};

export default PageChoices;
