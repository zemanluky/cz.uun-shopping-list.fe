import * as React from "react";
import {AuthenticatedRoute} from "@Components/guard";
import {PageHeader} from "@Components/layout";
import {Container, Grid} from "../../../styled-system/jsx";
import {RouterTabs} from "@Components/ui/RouterTabs.tsx";
import {Outlet} from "react-router-dom";
import {useMemo} from "react";
import {useTranslation} from "react-i18next";

export const ProfilePage: React.FC = () => {
    const {t} = useTranslation();

    const tabs = useMemo(() => ([
        { label: 'Tvoje profilové informace', link: 'info' },
        { label: t('settings.app.title'), link: 'app-settings' },
    ]), []);

    return <AuthenticatedRoute>
        <PageHeader
            title={t('settings.pageTitle')}
            previousLink={true}
        />
        <Container maxW='6xl' mt='8'>
            <Grid gridTemplateColumns={{base: "1fr", md: "2fr 5fr"}} gap="6">
                <RouterTabs
                    display={{ base: "flex", md: "none" }}
                    orientation="horizontal"
                    routes={tabs}/>
                <RouterTabs
                    height="fit-content"
                    display={{ base: 'none', md: 'flex' }}
                    orientation="vertical"
                    routes={tabs}
                />
                <Outlet/>
            </Grid>
        </Container>
    </AuthenticatedRoute>;
}