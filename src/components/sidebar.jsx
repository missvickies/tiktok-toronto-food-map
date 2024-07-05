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
    width:100vw;
    top:60px;
    padding:20px;
    
`