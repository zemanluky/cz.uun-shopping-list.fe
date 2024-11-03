import * as React from "react";
import {Box, Container, HStack} from "../../../styled-system/jsx";
import {Heading} from "@ParkComponents/ui/Heading.tsx";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {Link} from "react-router-dom";
import {ArrowLeft02Icon} from "hugeicons-react";
import {css} from "../../../styled-system/css";

type PageHeaderProps = {
    title: string;
    previousLink?: string;
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({title, previousLink, actions}) => {
    return <Box py='16' bg='accent.3'>
        <Container display='flex' justifyContent='space-between' alignItems='center' maxW='6xl'>
            <HStack alignItems='center' gap='4'>
                {previousLink && <Button variant='subtle' size='xl' css={{ aspectRatio: '1/1', borderRadius: '[50%]', p: 0 }} asChild>
                    <Link to={previousLink}>
                        <ArrowLeft02Icon size={24} strokeWidth={3} className={css({ color: 'accent.12' })}/>
                    </Link>
                </Button>}
                <Heading as='h1' size='5xl' fontWeight='extrabold' lineHeight={1} color='accent.12'>{title}</Heading>
            </HStack>
            {actions || <></>}
        </Container>
    </Box>
}