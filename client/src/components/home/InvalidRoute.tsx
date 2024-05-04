import { Box, Heading, SlideFade, Text } from "@chakra-ui/react";

export default function InvalidRoute(){

    return (<main>
        <Box>
            <SlideFade in={true}>
                <Heading size={'lg'} mt={3}>not found</Heading>
                <Text mt={3}>nothing to see here 👀</Text>
            </SlideFade>
        </Box>
    </main>)
}