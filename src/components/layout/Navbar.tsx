import React from "react";
import {useAuth} from "../../contexts";
import {Heading} from "@ParkComponents/ui/Heading.tsx";
import {css} from "../../../styled-system/css";
import {Container, HStack, VStack} from "../../../styled-system/jsx";
import {Link} from "react-router-dom";
import {Menu} from "@Components/ui";
import {Door01Icon, UserIcon, UserListIcon} from "hugeicons-react";
import { IconButton } from "@ParkComponents/ui/icon-button";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {Text} from "@ParkComponents/ui";

const navbarStyles = css({
    py: '4',
    shadow: {
        _light: 'xl',
        _dark: 'none'
    },
    backdropBlur: '5px',
    position: "sticky",
    backdropFilter: 'auto',
    top: '[0px]',
    bg: 'bg.subtle/50',
    zIndex: 100
});

export const Navbar: React.FC = () => {
    const {user, logout} = useAuth();

    return (
        <div className={navbarStyles}>
            <Container display='flex' justifyContent='space-between' alignItems='center' maxW='6xl'>
                <Link to={'/'}>
                    <Heading size='2xl' fontWeight={"bold"}>Nákupák</Heading>
                </Link>
                {user
                    ? <HStack gap='4'>
                        <VStack gap={1} alignItems="flex-end">
                            <Text as="span" fontWeight="semibold" lineHeight={1}>{`${user.name} ${user.surname}`}</Text>
                            <Text as="span" size="xs" lineHeight={1} color="fg.subtle">@{user.username}</Text>
                        </VStack>
                        <Menu
                            items={[
                                { type: 'item', id: 'edit', text: 'Upravit profil', icon: <UserListIcon/>, link: '/profile/info' },
                                { type: 'item', id: 'd', text: 'Odhlásit se', icon: <Door01Icon/>, onClick: () => logout() },
                            ]}
                            trigger={<IconButton size={'lg'} variant={'subtle'} borderRadius="50px">
                                <HugeIcon icon={<UserIcon/>}/>
                            </IconButton>}
                            placement={'bottom-end'}
                        />
                    </HStack>
                    : null
                }
            </Container>
        </div>
    );
}