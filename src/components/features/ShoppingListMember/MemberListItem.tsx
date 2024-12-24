import React, {useMemo} from "react";
import {Box, Circle, HStack, HstackProps} from "../../../../styled-system/jsx";
import {Text} from "@ParkComponents/ui";
import {TShoppingListMember} from "../../../types/shopping-list-member.ts";
import {fullName as getFullName, getInitials} from "@Utils/user.helper.ts";
import {Delete02Icon, PencilEdit01Icon} from "hugeicons-react";
import {IconButton} from "@ParkComponents/ui/icon-button.tsx";
import {useTranslation} from "react-i18next";

interface MemberListItemProps extends HstackProps {
    member: TShoppingListMember,
    readOnly?: boolean,
    onEdit: (member: TShoppingListMember) => void,
    onDelete: (member: TShoppingListMember) => void
}

export const MemberListItem: React.FC<MemberListItemProps> = ({member, readOnly, onEdit, onDelete, ...hStackProps}) => {
    const {t} = useTranslation('shopping-list');

    const initials = useMemo<string>(() => getInitials(member.user), [member]);
    const fullName = useMemo<string>(() => getFullName(member.user), [member]);

    return <HStack
        p={4} bg={"bg.subtle"} shadow={"md"} borderRadius={'2xl'} w={'100%'} justifyContent={'space-between'}
        {...hStackProps}
    >
        <HStack gap={2}>
            <Circle
                p='2' fontWeight='bold' fontSize={'md'} bg='accent.3' color={'accent.12'} aspectRatio={'1/1'}
                height={'40px'}
            >
                {initials}
            </Circle>
            <Box>
                <Text fontWeight='semibold' lineHeight={1.1}>{fullName}</Text>
                <Text size='sm' color='fg.subtle' lineHeight={1.1}>
                    {t(`detail.members.permission.${member.permission!}`)}
                </Text>
            </Box>
        </HStack>
        {!readOnly
            ? <HStack gap={2}>
                <IconButton variant='subtle' onClick={() => onEdit(member)}>
                    <PencilEdit01Icon strokeWidth={2} />
                </IconButton>
                <IconButton variant='subtle' onClick={() => onDelete(member)} colorPalette={'red'}>
                    <Delete02Icon strokeWidth={2} />
                </IconButton>
            </HStack>
            : undefined
        }
    </HStack>
}