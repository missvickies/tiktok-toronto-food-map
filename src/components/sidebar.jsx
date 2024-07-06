import React from 'react';
import styled from 'styled-components';
import Stack from '@mui/material/Stack';


export default function Sidebar({ children }) {
    return (
        <FlexContainer>
            <Stack direction="row" spacing={1}>
                {children}
            </Stack>
        </FlexContainer>
    )
}

const FlexContainer = styled.div`
    position:fixed;
    overflow-x: scroll;
    left: 250px;
    padding: 10px 0px;
    margin: 0px 10px;

    //mobile
    @media (max-width: 390px) {
        left:0;
        top:60px;
        width:100vw;
    }
    //tablet
    @media (max-width: 768px) {
        width:${768-270}px;
    }
    //laptop
    @media (max-width: 1440px) {
        width:${1440-270}px
    }
`