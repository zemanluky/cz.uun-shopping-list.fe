import * as React from "react";
import {Box, Container, HStack} from "../../../styled-system/jsx";
import {Heading} from "@ParkComponents/ui/Heading.tsx";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {Link} from "react-router-dom";
import {ArrowLeft02Icon} from "hugeicons-react";
import {css} from "../../../styled-system/css";
import {Skeleton} from "@ParkComponents/ui/skeleton.tsx";
import {Spinner} from "@ParkComponents/ui";

type PageHeaderProps = {
    title: string;
    previousLink?: string|boolean;
    actions?: React.ReactNode;
    loading?: boolean;
    validating?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({title, previousLink, actions, loading, validating}) => {
    return <Box py='16' bg='accent.3'>
        <Container display='flex' justifyContent='space-between' alignItems='center' maxW='6xl'>
            <HStack alignItems='center' gap='4'>
                {(previousLink === true || typeof previousLink === "string")
                    && <Button variant='subtle' size='xl' css={{ aspectRatio: '1/1', borderRadius: '[50%]', p: 0 }} asChild>
                        <Link to={typeof previousLink === "string" ? previousLink : -1 as any}>
                            <ArrowLeft02Icon size={24} strokeWidth={3} className={css({ color: 'accent.12' })}/>
                        </Link>
                    </Button>
                }
                <Skeleton isLoaded={!loading} minW="200px">
                    <Heading as='h1' size='5xl' fontWeight='extrabold' lineHeight={1} color='accent.12'>{title}</Heading>
                </Skeleton>
                {validating && <Spinner size="lg" borderWidth="3px"/>}
            </HStack>
            <HStack alignItems='center' gap='2'>
                {actions || <></>}
            </HStack>
        </Container>
    </Box>
}