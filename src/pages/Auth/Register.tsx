import React from "react";
import {PublicOnlyRoute} from "@Components/guard";
import {Box, VStack} from "../../../styled-system/jsx";
import {Heading, Text} from "@ParkComponents/ui";
import {RegistrationForm} from "@Components/features/Auth/RegistrationForm.tsx";

export const Register: React.FC = () => {
    return <PublicOnlyRoute>
        <Box bg="bg.default" p="8" borderRadius="2xl" shadow="md" maxW="xl" w="xl">
            <VStack mb="4" alignItems="flex-start" gap="2">
                <Heading as="h2" size="3xl">Vytvořte si účet</Heading>
                <Text>Začněte si zaznamenávat nákupní seznamy hned. Zaregistrujte se a můžeme začít!</Text>
            </VStack>
            <RegistrationForm/>
        </Box>
    </PublicOnlyRoute>
};