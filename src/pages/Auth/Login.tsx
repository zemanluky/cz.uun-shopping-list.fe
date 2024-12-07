import React from "react";
import {Box, VStack} from "../../../styled-system/jsx";
import {Heading, Text} from "@ParkComponents/ui";
import {LoginForm} from "@Components/features/Auth/LoginForm.tsx";
import {PublicOnlyRoute} from "@Components/guard";

export const Login: React.FC = () => {
    return <PublicOnlyRoute>
        <Box bg="bg.default" p="8" borderRadius="2xl" shadow="md" maxW="xl" w="xl">
            <VStack mb="4" alignItems="flex-start" gap="2">
                <Heading as="h2" size="3xl">Přihlaste se, prosím</Heading>
                <Text>Vítejte zpět v aplikaci. Přihlaste se, prosím, abyste si mohli zobrazit své seznamy.</Text>
            </VStack>
            <LoginForm/>
        </Box>
    </PublicOnlyRoute>
};