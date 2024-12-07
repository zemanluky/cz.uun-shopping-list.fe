import React from "react";
import {useAuth} from "../../contexts";
import {Heading} from "@ParkComponents/ui/Heading.tsx";
import {css} from "../../../styled-system/css";
import {Container, HStack} from "../../../styled-system/jsx";
import {Link} from "react-router-dom";
import {Menu} from "@Components/ui";
import {Door01Icon, UserIcon, UserListIcon} from "hugeicons-react";
import { IconButton } from "@ParkComponents/ui/icon-button";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {Text} from "@ParkComponents/ui";

const navbarStyles = css({
    py: '4',
    shadow: 'xl',
    position: "sticky",
    top: '[0px]',
    bg: 'bg.subtle',
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
                        <Text as="span" fontWeight="semibold">{`${user.name} ${user.surname}`}</Text>
                        <Menu
                            items={[
                                { type: 'item', id: 'edit', text: 'Upravit profil', icon: <UserListIcon/>, onClick: () => console.log('edit') },
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