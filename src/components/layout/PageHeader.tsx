import * as React from "react";
import {Box, Container, Flex, HStack} from "../../../styled-system/jsx";
import {Heading} from "@ParkComponents/ui/Heading.tsx";
import {Link} from "react-router-dom";
import {ArrowLeft02Icon} from "hugeicons-react";
import {css} from "../../../styled-system/css";
import {Skeleton} from "@ParkComponents/ui/skeleton.tsx";
import {IconButton} from "@ParkComponents/ui/icon-button.tsx";

type PageHeaderProps = {
    title: string;
    previousLink?: string|boolean;
    actions?: React.ReactNode;
    loading?: boolean;
    validating?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({title, previousLink, actions, loading}) => {
    return <Box py={{base: '12', md: '16'}} bg='accent.3'>
        <Container display='flex' justifyContent='space-between' gap={6} alignItems={{ md: 'center' }}
                   flexDir={{base: 'column', md: 'row'}} maxW='6xl'
        >
            <Flex alignItems='center' gap='4' flexDir='row'>
                {(previousLink === true || typeof previousLink === "string")
                    && <IconButton variant='subtle' size='xl' borderRadius="50%" display={{ base: 'none', md: 'flex' }} asChild>
                        <Link to={typeof previousLink === "string" ? previousLink : -1 as any}>
                            <ArrowLeft02Icon size={24} strokeWidth={3} className={css({ color: 'accent.12' })}/>
                        </Link>
                    </IconButton>
                }
                <Skeleton isLoaded={!loading} minW="200px">
                    <Heading as='h1' size='5xl' fontWeight='extrabold' lineHeight={1.1} color='accent.12'>{title}</Heading>
                </Skeleton>
            </Flex>
            <HStack alignItems='center' gap='2'>
                {actions || <></>}
            </HStack>
        </Container>
    </Box>
}