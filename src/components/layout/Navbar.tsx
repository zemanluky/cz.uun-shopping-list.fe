import React, {useMemo} from "react";
import {useAuth} from "../../contexts";
import {Heading} from "@ParkComponents/ui/Heading.tsx";
import {Text} from "@ParkComponents/ui/Text.tsx";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {css} from "../../../styled-system/css";
import {Container, HStack} from "../../../styled-system/jsx";
import {Menu, TMenuItem} from "@Components/ui/Menu.tsx";
import {users} from "../../data/users.ts";
import {Link} from "react-router-dom";

const navbarStyles = css({
    py: '4',
    shadow: 'xl',
    position: "sticky",
    top: '[0px]',
    bg: 'bg.subtle',
    zIndex: 100
});

export const Navbar: React.FC = () => {
    const {isAuthenticated, user, login, logout} = useAuth();

    const userOptions = useMemo<Array<TMenuItem>>(
        () => users.map(user => ({
            type: 'item',
            id: `user_${user.id}`,
            text: user.name,
            onClick: () => login(user)
        })), []
    );

    return (
        <div className={navbarStyles}>
            <Container display='flex' justifyContent='space-between' alignItems='center' maxW='6xl'>
                <Link to={'/'}>
                    <Heading size='2xl' fontWeight={"bold"}>Nákupák</Heading>
                </Link>
                {isAuthenticated && user
                    ? <HStack gap='4'>
                        <Text as={"span"}>Ahoj, {user.name}!</Text>
                        <Button variant='subtle' onClick={() => logout()}>Odhlásit se</Button>
                    </HStack>
                    : <Menu
                        items={userOptions}
                        trigger={<Button>Přihlásit se</Button>}
                        placement={'bottom-end'}
                    />
                }
            </Container>
        </div>
    );
}